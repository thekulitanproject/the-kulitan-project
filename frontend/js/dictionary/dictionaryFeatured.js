// kulitan_full_project/frontend/js/dictionary/dictionaryFeatured.js
// this is dictionaryFeatured.js

import { getRandomWords } from "../api/fetchWords.js";
import { renderWordCards } from "../ui/renderWordCards.js";

/* ===============================
   FEATURED WORDS LOADER
================================ */
export async function loadFeaturedWords({
  
  containerId = "featuredWordsContainer",
  limit = 3
} = {}) {

  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const words = await getRandomWords(limit);

    if (!Array.isArray(words) || !words.length) {
      container.innerHTML = `
        <p class="featured-empty">
          No featured words available.
        </p>
      `;
      return;
    }

    container.innerHTML = renderWordCards(words);

  } catch (err) {
    console.error("Failed to load featured words:", err);

    container.innerHTML = `
      <p class="featured-error">
        Failed to load featured words.
      </p>
    `;
  }
}


