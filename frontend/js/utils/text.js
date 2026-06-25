// kulitan_full_project/frontend/js/utils/text.js
// this is text.js

export function normalizeMeaning(meanings) {
  if (!meanings) return "";

  if (Array.isArray(meanings)) {
    return meanings.map(m => m.definition ?? "").join(" ");
  }

  return meanings;
}


