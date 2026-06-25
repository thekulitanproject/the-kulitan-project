// kulitan_full_project/frontend/js/api/fetchWord.js
// this is fetchWord.js

import { apiGet, withLang } from "./client.js";

/* ===============================
   FETCH SINGLE WORD
================================ */
export async function fetchWord(id) {
  return apiGet(withLang(`/api/words/${id}`));
}


