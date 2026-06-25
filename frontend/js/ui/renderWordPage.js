// kulitan_full_project/frontend/js/ui/renderWordPage.js
// this is renderWordPage.js

import { renderWord } from "./renderWordParts.js";
import { renderKulitan } from "./renderKulitan.js";
import { renderExamples } from "./renderExamples.js";
import { renderDialects } from "./renderDialects.js";
import { renderWordMeta } from "./renderMeta.js";
import { setupAudio } from "../utils/audio.js";

export function renderWordPage(word, elements) {
  if (!word) return;

  console.log("EXAMPLES DEBUG:", word.examples);

  renderWord(word, elements);
  renderKulitan(word, elements.kulitanContainer);
  setupAudio(word, elements.playAudioBtn, elements.audioEl);
  const examples =
    word.meanings?.flatMap(m => m.examples || []) || [];

  renderExamples(examples, elements.examplesEl);

  renderDialects(
    word.dialects,
    word.dialect_regions,
    elements.dialectRegionEl
  );

  renderWordMeta(word);
}


