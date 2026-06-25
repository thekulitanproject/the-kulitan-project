// kulitan_full_project/frontend/js/ui/renderMeta.js

function formatValue(value) {
  if (!value) return "";

  if (Array.isArray(value)) {
    return value
      .map(v => {
        if (typeof v === "string") return v;

        if (typeof v === "object" && v !== null) {
          return (
            v.name ||
            v.romanized ||
            v.definition ||
            v.tag ||
            ""
          );
        }

        return "";
      })
      .filter(Boolean)
      .join(", ");
  }

  if (typeof value === "object") {
    return (
      value.name ||
      value.romanized ||
      value.definition ||
      value.tag ||
      ""
    );
  }

  return String(value);
}

function setMeta(id, label, value) {
  const el = document.getElementById(id);
  if (!el) return;

  const formatted = formatValue(value);

  if (!formatted) {
    el.innerHTML = "";
    el.style.display = "none";
    return;
  }

  el.style.display = "";

  el.innerHTML = `
    <div class="meta-label">${label}</div>
    <div class="meta-value">${formatted}</div>
  `;
}

export function renderWordMeta(word) {
  if (!word) return;

  setMeta("textPronunciation", "Pronunciation", word.text_pronunciation);

  setMeta(
    "meaningList",
    "Meanings",
    word.meanings?.map(m => m.definition)
  );

  setMeta("rootWord", "Root Word", word.root_word);

  setMeta(
    "derivedForms",
    "Derived Forms",
    word.derived_forms || word.derivations
  );

  setMeta("synonyms", "Synonyms", word.synonyms);

  setMeta("antonyms", "Antonyms", word.antonyms);

  setMeta("aspectFocus", "Aspect / Focus", word.aspect_focus);

  setMeta(
    "dialectRegion",
    "Region",
    [
      ...(word.dialects || []),
      ...(word.dialect_regions || [])
    ]
  );

  setMeta("formalityLevel", "Formality", word.formality_level);

  setMeta("etymology", "Etymology", word.etymology);

  setMeta("usageNotes", "Usage Notes", word.usage_notes);
}


