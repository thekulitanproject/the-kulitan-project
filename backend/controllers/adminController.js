// Path: kulitan_full_project/backend/controllers/adminController.js
// this is adminController.js

import pool from "../db.js";

// ===============================
// Helpers
// ===============================
const clean = (v) => (typeof v === "string" ? v.trim() : null);

const normalizeRomanized = (text) => {
  if (!text) return null;
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};

const toInt = (v) =>
  Number.isFinite(Number(v)) ? parseInt(v, 10) : null;

// ===============================
// WORD VALIDATION
// ===============================
const validateWordInput = (body) => {
  const romanized = clean(body.romanized);

  return {
    romanized,
    romanized_norm: normalizeRomanized(romanized),
    text_pronunciation: clean(body.text_pronunciation),
    etymology: clean(body.etymology),
    usage_notes: clean(body.usage_notes),

    part_of_speech_id: toInt(body.part_of_speech_id),
    formality_level_id: toInt(body.formality_level_id),

    kulitan_layers: Array.isArray(body.kulitan_layers)
      ? body.kulitan_layers
          .map((l) => ({
            layer_type: clean(l.layer_type),
            svg: clean(l.svg),
            layer_order: toInt(l.layer_order) ?? 0
          }))
          .filter((l) => l.layer_type && l.svg)
          .sort((a, b) => a.layer_order - b.layer_order)
      : []
  };
};

// ===============================
// MEANINGS VALIDATION
// ===============================
const validateMeaningInput = (m) => {
  const definition = clean(m.definition);
  if (!definition) return null;

  return {
    definition,
    part_of_speech_id: toInt(m.part_of_speech_id),
    examples: Array.isArray(m.examples)
      ? m.examples
          .map((e) => ({
            example_en: clean(e.example_en),
            example_kp: clean(e.example_kp),
            example_order: toInt(e.example_order) ?? 1
          }))
          .filter((e) => e.example_en || e.example_kp)
      : []
  };
};

// ===============================
// ADD WORD (FULL PIPELINE)
// ===============================
export const addWord = async (req, res) => {
  const client = await pool.connect();

  try {
    const wordData = validateWordInput(req.body);

    const meanings = (req.body.meanings || [])
      .map(validateMeaningInput)
      .filter(Boolean);

    const dialects = req.body.dialects || [];
    const dialectRegions = req.body.dialect_regions || [];
    const tags = req.body.tags || [];
    const audio = req.body.audio || [];

    const relations = req.body.relations || [];
    const derivations = req.body.derivations || [];

    const systemCode = req.body.system_code || "kulitan";
    const variantCode = req.body.variant_code || null;

    if (!wordData.romanized) {
      return res.status(400).json({
        success: false,
        error: "Romanized is required"
      });
    }

    if (meanings.length === 0) {
      meanings.push({
        definition: "TBD",
        part_of_speech_id: wordData.part_of_speech_id,
        examples: []
      });
    }

    await client.query("BEGIN");

    // ===============================
    // 1. INSERT WORD
    // ===============================
    const wordResult = await client.query(
      `
      INSERT INTO dictionary.words (
        romanized,
        romanized_norm,
        text_pronunciation,
        etymology,
        usage_notes,
        part_of_speech_id,
        formality_level_id,
        search_vector,
        created_by
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,
        to_tsvector('simple',
          COALESCE($1,'') || ' ' ||
          COALESCE($3,'') || ' ' ||
          COALESCE($4,'') || ' ' ||
          COALESCE($5,'')
        ),
        $8
      )
      RETURNING *
      `,
      [
        wordData.romanized,
        wordData.romanized_norm,
        wordData.text_pronunciation,
        wordData.etymology,
        wordData.usage_notes,
        wordData.part_of_speech_id,
        wordData.formality_level_id,
        req.body.admin_id || null
      ]
    );

    const word = wordResult.rows[0];

    // ===============================
    // 2. WRITING SYSTEM ENTRY (MISSING BEFORE)
    // ===============================
    const writingEntry = await client.query(
      `
      INSERT INTO dictionary.writing_system_entries (
        word_id,
        system_code,
        variant_code
      )
      VALUES ($1,$2,$3)
      ON CONFLICT DO NOTHING
      RETURNING id
      `,
      [word.id, systemCode, variantCode]
    );

    let writingEntryId;

    if (writingEntry.rows.length > 0) {
      writingEntryId = writingEntry.rows[0].id;
    } else {
      const existing = await client.query(
        `SELECT id FROM dictionary.writing_system_entries
        WHERE word_id = $1 AND system_code = $2 AND variant_code IS NOT DISTINCT FROM $3`,
        [word.id, systemCode, variantCode]
      );

      writingEntryId = existing.rows[0]?.id;
    }

    // ===============================
    // 3. KULITAN ENTRY (BRIDGE TO RENDER PIPELINE)
    // ===============================
    const kulitanEntry = await client.query(
      `
      INSERT INTO dictionary.kulitan_entries (
        word_id,
        writing_entry_id,
        kulitan_text
      )
      VALUES ($1,$2,$3)
      ON CONFLICT (word_id) DO UPDATE
      SET kulitan_text = EXCLUDED.kulitan_text
      RETURNING id
      `,
      [word.id, writingEntryId, req.body.kulitan_text || null]
    );

    const kulitanEntryId = kulitanEntry.rows[0].id;

    // ===============================
    // 4. KULITAN LAYERS
    // ===============================
    for (const layer of wordData.kulitan_layers) {
      await client.query(
        `
        INSERT INTO dictionary.kulitan_entries (
          word_id,
          kulitan_text,
          writing_entry_id
        )
        VALUES ($1,$2,$3)
        `,
        [
          kulitanEntryId,
          layer.layer_type,
          layer.svg,
          layer.layer_order
        ]
      );
    }

    // ===============================
    // 5. MEANINGS + EXAMPLES
    // ===============================
    for (const meaning of meanings) {
      const meaningResult = await client.query(
        `
        INSERT INTO dictionary.word_meanings (
          word_id,
          definition,
          part_of_speech_id,
          meaning_order
        )
        VALUES (
          $1,$2,$3,
          COALESCE(
            (SELECT MAX(meaning_order) + 1
             FROM dictionary.word_meanings
             WHERE word_id = $1),
            1
          )
        )
        RETURNING id
        `,
        [
          word.id,
          meaning.definition,
          meaning.part_of_speech_id || wordData.part_of_speech_id
        ]
      );

      const meaningId = meaningResult.rows[0].id;

      for (const ex of meaning.examples) {
        await client.query(
          `
          INSERT INTO dictionary.word_examples (
            meaning_id,
            example_en,
            example_kp,
            example_order
          )
          VALUES ($1,$2,$3,$4)
          `,
          [meaningId, ex.example_en, ex.example_kp, ex.example_order]
        );
      }
    }

    // ===============================
    // 6. DIALECTS
    // ===============================
    for (const id of dialects) {
      await client.query(
        `
        INSERT INTO dictionary.word_dialects (word_id, dialect_id)
        VALUES ($1,$2)
        ON CONFLICT DO NOTHING
        `,
        [word.id, id]
      );
    }

    // ===============================
    // 7. DIALECT REGIONS
    // ===============================
    for (const id of dialectRegions) {
      await client.query(
        `
        INSERT INTO dictionary.word_dialect_regions (word_id, dialect_region_id)
        VALUES ($1,$2)
        ON CONFLICT DO NOTHING
        `,
        [word.id, id]
      );
    }

    // ===============================
    // 8. TAGS
    // ===============================
    for (const t of tags) {
      const tag = clean(t);
      if (!tag) continue;

      await client.query(
        `
        INSERT INTO dictionary.word_tags (word_id, tag)
        VALUES ($1,$2)
        ON CONFLICT DO NOTHING
        `,
        [word.id, tag]
      );
    }

    // ===============================
    // 9. AUDIO
    // ===============================
    for (const a of audio) {
      if (!clean(a.audio_url)) continue;

      await client.query(
        `
        INSERT INTO dictionary.word_audio (
          word_id,
          audio_url,
          dialect_id,
          speaker_label,
          is_primary
        )
        VALUES ($1,$2,$3,$4,$5)
        `,
        [
          word.id,
          clean(a.audio_url),
          a.dialect_id || null,
          clean(a.speaker_label),
          !!a.is_primary
        ]
      );
    }

    // ===============================
    // 10. WORD RELATIONS (MISSING BEFORE)
    // ===============================
    for (const r of relations) {
      await client.query(
        `
        INSERT INTO dictionary.word_relations (
          word_id,
          related_word_id,
          relation_type_id
        )
        VALUES ($1,$2,$3)
        ON CONFLICT DO NOTHING
        `,
        [
          word.id,
          toInt(r.related_word_id),
          toInt(r.relation_type_id)
        ]
      );
    }

    // ===============================
    // 11. DERIVATIONS (MISSING BEFORE)
    // ===============================
    for (const d of derivations) {
      await client.query(
        `
        INSERT INTO dictionary.word_derivations (
          base_word_id,
          derived_word_id,
          derivation_type
        )
        VALUES ($1,$2,$3)
        ON CONFLICT DO NOTHING
        `,
        [
          word.id,
          toInt(d.derived_word_id),
          clean(d.derivation_type)
        ]
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      data: word
    });

  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    console.error("addWord error:", err);

    res.status(500).json({
      success: false,
      error: err.message
    });
  } finally {
    client.release();
  }
};