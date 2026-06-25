// kulitan_full_project/frontend/js/dictionary/dictionaryLoader.js
// this is dictionaryLoader.js

import { dictionaryState } from "./dictionaryState.js";
import { fetchWords, searchWords } from "../api/fetchWords.js";
import { renderWordCards } from "../ui/renderWordCards.js";
import { getSearchQuery, isSearching } from "./dictionaryFilters.js";
import { nextPage, prevPage } from "./dictionaryPagination.js";

async function loadWords() {
  const container = document.getElementById("dictionaryContainer");
  const pageInfo = document.getElementById("pageInfo");

  if (!container) return;

  const query = getSearchQuery(document.getElementById("searchInput"));
  const searching = isSearching(query);

  let words = [];

  if (searching) {
    dictionaryState.page = 1;
    dictionaryState.letter = null;
    dictionaryState.query = query;

    words = await searchWords(query);
  } else {
    words = await fetchWords({
      limit: dictionaryState.limit,
      page: dictionaryState.page,
      letter: dictionaryState.letter
    });
  }

  if (!Array.isArray(words)) words = [];

  const KAPAMPANGAN_ORDER = {
    a: 1,
    á: 1,
    â: 1,
    i: 2,
    í: 2,
    î: 2,
    y: 3,
    u: 4,
    ú: 4,
    û: 4,
    w: 5,
    e: 6,
    o: 7,
    g: 8,
    k: 9,
    ng: 10,
    t: 11,
    d: 12,
    n: 13,
    l: 14,
    s: 15,
    m: 16,
    p: 17,
    b: 18
  };

  function tokenize(word) {
    const w = (word ?? "").toLowerCase();

    const tokens = [];
    let i = 0;

    while (i < w.length) {
      const two = w.slice(i, i + 2);

      // special digraph
      if (two === "ng") {
        tokens.push("ng");
        i += 2;
        continue;
      }

      tokens.push(w[i]);
      i++;
    }

    return tokens;
  }

  function toRankArray(word) {
    return tokenize(word).map(ch => KAPAMPANGAN_ORDER[ch] ?? 999);
  }

  words.sort((a, b) => {
    const aKey = (a.romanized ?? "").toLowerCase();
    const bKey = (b.romanized ?? "").toLowerCase();

    const aRanks = toRankArray(aKey);
    const bRanks = toRankArray(bKey);

    const len = Math.min(aRanks.length, bRanks.length);

    for (let i = 0; i < len; i++) {
      if (aRanks[i] !== bRanks[i]) {
        return aRanks[i] - bRanks[i];
      }
    }

    // if one word is prefix of another
    if (aRanks.length !== bRanks.length) {
      return aRanks.length - bRanks.length;
    }

    return aKey.localeCompare(bKey);
  });

  container.innerHTML = words.length
    ? renderWordCards(words)
    : "<p>No words available.</p>";

  if (pageInfo) {
    pageInfo.textContent = `Page ${dictionaryState.page}`;
  }
  
}

export function initDictionaryLoader() {
  loadWords();

  document.getElementById("searchInput")?.addEventListener("input", () => {
    dictionaryState.page = 1;
    loadWords();
  });

  document.getElementById("prevBtn")?.addEventListener("click", () => {
    if (dictionaryState.page > 1) {
      prevPage();
      loadWords();
    }
  });

  document.getElementById("nextBtn")?.addEventListener("click", () => {
    nextPage();
    loadWords();
  });
}


