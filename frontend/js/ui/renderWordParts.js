// kulitan_full_project/frontend/js/ui/renderWordParts.js
// this is renderWordParts.js

export function renderWord(word, elements) {
  const { romanizedEl, speechEl, meaningEl } = elements;

  romanizedEl.textContent =
    word.romanized ?? "Romanized form is being finalized*";

  speechEl.textContent = word.part_of_speech
    ? `(${word.part_of_speech})`
    : "";

  meaningEl.textContent =
    word.meanings?.[0]?.definition ||
    "A clear definition is being prepared";
}


