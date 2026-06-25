// kulitan_full_project/frontend/js/word/wordInit.js
// this is wordInit.js

import { fetchWord } from "../api/fetchWord.js";
import { getElements } from "./wordElements.js";
import { renderWordPage } from "../ui/renderWordPage.js";
import { showLoading, showError } from "./wordLoading.js";

function getWordId() {
  return new URLSearchParams(window.location.search).get("id");
}

export async function initWordPage() {
  const elements = getElements(); // create HERE, not globally

  const id = Number(getWordId());

  if (!Number.isInteger(id)) {
    showError(elements, "Invalid word ID");
    return;
  }

  showLoading(elements);

  try {
    const word = await fetchWord(id);
    renderWordPage(word, elements);
  } catch (err) {
    showError(elements, err.message);
  }
}


