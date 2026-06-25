// kulitan_full_project/frontend/js/api/fetchWords.js
// this is fetchWords.js

import { apiGet, withLang } from "./client.js";

/* ===============================
   WORD LIST
================================ */
export async function fetchWords({
  limit = 20,
  page = 1,
  letter = ""
} = {}) {

  let url = `/api/words?limit=${limit}&page=${page}`;

  if (letter) {
    url = `/api/words/letter/${letter}?limit=${limit}&page=${page}`;
  }

  return apiGet(withLang(url));
}

/* ===============================
   RANDOM WORDS
================================ */
export async function getRandomWords(limit = 3) {
  return apiGet(
    withLang(`/api/words/random?limit=${limit}`)
  );
}

/* ===============================
   SEARCH
================================ */
export async function searchWords(query) {
  if (!query) return [];

  return apiGet(
    withLang(
      `/api/words/search?q=${encodeURIComponent(query)}`
    )
  );
}

/* ===============================
   ALIAS
================================ */
export async function getWords(
  limit = 20,
  page = 1
) {
  return fetchWords({ limit, page });
}


