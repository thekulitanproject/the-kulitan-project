// kulitan_full_project/frontend/js/dictionary/dictionaryFilters.js
// this is dictionaryFilters.js

import { dictionaryState } from "./dictionaryState.js";

export function normalizeText(text) {
  return (text || "").toLowerCase().trim();
}

export function isSearching(query) {
  return normalizeText(query).length > 0;
}

export function getSearchQuery(inputEl) {
  return normalizeText(inputEl?.value || "");
}

export function applySearch(query) {
  const q = normalizeText(query);

  dictionaryState.query = q;
  dictionaryState.page = 1;
  dictionaryState.letter = null;

  return q;
}

export function clearFilters() {
  dictionaryState.page = 1;
  dictionaryState.letter = null;
  dictionaryState.query = "";
}


