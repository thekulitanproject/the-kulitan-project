// kulitan_full_project/frontend/js/dictionary/dictionaryPagination.js
// this is dictionaryPagination.js

import { dictionaryState } from "./dictionaryState.js";

export function nextPage() {
  dictionaryState.page += 1;
  return dictionaryState.page;
}

export function prevPage() {
  dictionaryState.page = Math.max(1, dictionaryState.page - 1);
  return dictionaryState.page;
}

export function goToPage(page) {
  dictionaryState.page = Math.max(1, page);
  return dictionaryState.page;
}

export function setPageLimit(limit) {
  dictionaryState.limit = limit;
  return dictionaryState.limit;
}


