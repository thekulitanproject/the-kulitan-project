//Path: kulitan_full_project/backend/controllers/wordsController.js
// this is wordsController.js


import pool from "../db.js";

/* ===============================
   HELPERS
================================ */
const safeTrim = (v) => (typeof v === "string" ? v.trim() : "");

const normalize = (t) =>
  (t || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

/* ===============================
   FIXED JSONB AGGREGATIONS
================================ */

const kulitanSQL = `
COALESCE(
  (
    SELECT jsonb_build_object(
      'kulitan_default', MAX(e.kulitan_text) FILTER (WHERE e.mode = 'kulitan-default'),
      'kulitan_line', MAX(e.kulitan_text) FILTER (WHERE e.mode = 'kulitan-line'),
      'kulitan_segment', MAX(e.kulitan_text) FILTER (WHERE e.mode = 'kulitan-segment'),
      'kulitan_stroke', MAX(e.kulitan_text) FILTER (WHERE e.mode = 'kulitan-stroke'),
      'kulitan_full_instruction', MAX(e.kulitan_text) FILTER (WHERE e.mode = 'kulitan-full-instruction')
    )
    FROM dictionary.kulitan_entries e
    WHERE e.word_id = w.id
  ),
  '{}'::jsonb
) AS kulitan
`;

const kulitanLayersSQL = `
COALESCE(
  (
    SELECT jsonb_agg(
      jsonb_build_object(
        'kulitan_text', e.kulitan_text,
        'mode', e.mode
      )
      ORDER BY e.id
    )
    FROM dictionary.kulitan_entries e
    WHERE e.word_id = w.id
  ),
  '[]'::jsonb
) AS kulitan_layers
`;

const meaningsSQL = `
COALESCE(
  (
    SELECT jsonb_agg(
      jsonb_build_object(
        'id', m.id,
        'definition', m.definition,
        'meaning_order', m.meaning_order,
        'examples',
        (
          SELECT COALESCE(
            jsonb_agg(
              jsonb_build_object(
                'example_en', ex.example_en,
                'example_kp', ex.example_kp,
                'order', ex.example_order
              )
              ORDER BY ex.example_order
            ),
            '[]'::jsonb
          )
          FROM dictionary.word_examples ex
          WHERE ex.meaning_id = m.id
        )
      )
      ORDER BY m.meaning_order
    )
    FROM dictionary.word_meanings m
    WHERE m.word_id = w.id
  ),
  '[]'::jsonb
) AS meanings
`;

const dialectsSQL = `
COALESCE(
  (
    SELECT jsonb_agg(jsonb_build_object('id', d.id, 'name', d.name))
    FROM dictionary.word_dialects wd
    JOIN dictionary.dialects d ON d.id = wd.dialect_id
    WHERE wd.word_id = w.id
  ),
  '[]'::jsonb
) AS dialects
`;

const dialectRegionsSQL = `
COALESCE(
  (
    SELECT jsonb_agg(jsonb_build_object('id', dr.id, 'name', dr.name))
    FROM dictionary.word_dialect_regions wdr
    JOIN dictionary.dialect_regions dr ON dr.id = wdr.dialect_region_id
    WHERE wdr.word_id = w.id
  ),
  '[]'::jsonb
) AS dialect_regions
`;

/* 🔧 FIXED: tags must JOIN word_tags → tags */
const tagsSQL = `
COALESCE(
  (
    SELECT jsonb_agg(
      jsonb_build_object(
        'id', tg.id,
        'name', tg.name,
        'slug', tg.slug,
        'description', tg.description
      )
    )
    FROM dictionary.word_tags wt
    JOIN dictionary.tags tg ON tg.id = wt.tag_id
    WHERE wt.word_id = w.id
  ),
  '[]'::jsonb
) AS tags
`;

const audioSQL = `
COALESCE(
  (
    SELECT jsonb_agg(
      jsonb_build_object(
        'audio_url', a.audio_url,
        'speaker_label', a.speaker_label,
        'is_primary', a.is_primary
      )
    )
    FROM dictionary.word_audio a
    WHERE a.word_id = w.id
  ),
  '[]'::jsonb
) AS audio
`;

const fields = [
  "w.id",
  "w.romanized",
  "w.text_pronunciation",
  "w.etymology",
  "w.usage_notes",
  "w.created_at",
  "w.updated_at",
  "w.romanized_norm",

  "p.name AS part_of_speech",
  "fl.name AS formality_level",

  tagsSQL,
  meaningsSQL,
  kulitanSQL,
  kulitanLayersSQL,
  audioSQL
];

/* ===============================
   GET WORDS (LIST)
================================ */
export const getWords = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Number(req.query.limit) || 20);
    const offset = (page - 1) * limit;

    const count = await pool.query(
      `SELECT COUNT(*)::int AS total
       FROM dictionary.words
       WHERE deleted_at IS NULL`
    );
    const total = count.rows[0].total;

    // ✅ Using subquery-based helpers (no GROUP BY needed → cleaner & faster)
    const result = await pool.query(`
      SELECT
        ${fields.join(",\n")}
      FROM dictionary.words w
      LEFT JOIN dictionary.parts_of_speech p ON p.id = w.part_of_speech_id
      LEFT JOIN dictionary.formality_levels fl ON fl.id = w.formality_level_id
      WHERE w.deleted_at IS NULL
      ORDER BY w.romanized_norm ASC
      LIMIT $1 OFFSET $2
    `, [limit, offset]);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (err) {
    console.error("getWords error:", err);
    res.status(500).json({ success: false });
  }
};

/* ===============================
   SEARCH
================================ */
export const searchWords = async (req, res) => {
  const q = safeTrim(req.query.q);
  if (!q) return res.json({ success: true, data: [] });

  const norm = normalize(q);

  try {
    const result = await pool.query(
      `
      SELECT
        w.id,
        w.romanized,
        w.text_pronunciation,

        p.name  AS part_of_speech,
        fl.name AS formality_level,

        ${meaningsSQL},
        ${kulitanSQL}

      FROM dictionary.words w
      LEFT JOIN dictionary.parts_of_speech p   ON p.id  = w.part_of_speech_id
      LEFT JOIN dictionary.formality_levels fl ON fl.id = w.formality_level_id

      WHERE w.deleted_at IS NULL
        AND (
          w.search_vector @@ plainto_tsquery('simple', $1)
          OR w.romanized_norm % $2
        )
      ORDER BY w.id DESC
      LIMIT 50
      `,
      [q, norm]
    );

    res.json({ success: true, data: result.rows });

  } catch (err) {
    console.error("searchWords error:", err);
    res.status(500).json({ success: false });
  }
};

/* ===============================
   GET BY ID (FULL)
================================ */
export const getWordById = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ success: false });
  }

  try {
    const result = await pool.query(
      `
      SELECT
        w.*,
        p.name  AS part_of_speech,
        fl.name AS formality_level,

        ${meaningsSQL},
        ${kulitanSQL},
        ${dialectsSQL},
        ${dialectRegionsSQL},
        ${tagsSQL},
        ${audioSQL}

      FROM dictionary.words w
      LEFT JOIN dictionary.parts_of_speech p   ON p.id  = w.part_of_speech_id
      LEFT JOIN dictionary.formality_levels fl ON fl.id = w.formality_level_id
      WHERE w.id = $1 AND w.deleted_at IS NULL
      `,
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ success: false });
    }

    res.json({ success: true, data: result.rows[0] });

  } catch (err) {
    console.error("getWordById error:", err);
    res.status(500).json({ success: false });
  }
};

/* ===============================
   RANDOM WORDS
================================ */
export const getRandomWords = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 10, 50);

    const result = await pool.query(
      `
      SELECT
        w.id,
        w.romanized,
        w.text_pronunciation,

        p.name  AS part_of_speech,
        fl.name AS formality_level,

        ${meaningsSQL},
        ${kulitanSQL}

      FROM dictionary.words w
      LEFT JOIN dictionary.parts_of_speech p   ON p.id  = w.part_of_speech_id
      LEFT JOIN dictionary.formality_levels fl ON fl.id = w.formality_level_id
      WHERE w.deleted_at IS NULL
      ORDER BY RANDOM()
      LIMIT $1
      `,
      [limit]
    );

    res.json({ success: true, data: result.rows });

  } catch (err) {
    console.error("getRandomWords error:", err);
    res.status(500).json({ success: false });
  }
};