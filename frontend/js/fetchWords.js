// frontend/js/fetchWords.js

// =====================================================================
// API WRAPPERS
// These functions talk to your backend and return JSON data only.
// They never touch the DOM.
// =====================================================================

export async function getWords(limit = 50, offset = 0) {
  const res = await fetch(`/api/words?limit=${limit}&offset=${offset}`);
  return await res.json();
}

export async function getAllWords(limit = 500, offset = 0) {
  const res = await fetch(`/api/words?limit=${limit}&offset=${offset}`);
  return await res.json();
}

export async function searchWords(query) {
  const res = await fetch(`/api/words/search?q=${encodeURIComponent(query)}`);
  return await res.json();
}

export async function getWord(id) {
  const res = await fetch(`/api/words/${id}`);
  return await res.json();
}

// =====================================================================
// PAGE RENDERING
// This function is used by dictionary.html to show all words.
// It uses the API functions above.
// =====================================================================

async function renderDictionaryPage() {
  try {
    const container = document.getElementById("dictionaryContainer");
    if (!container) return;

    const words = await getAllWords();

    container.innerHTML = "";

    words.forEach(word => {
      const card = document.createElement("div");
      card.className = "word-card";

      card.innerHTML = `
        <div class="kulitan">
          <img src="${word.kulitan}" alt="${word.romanized}">
        </div>
        <div class="romanized">${word.romanized}</div>
        <div class="meaning">${word.meaning}</div>
      `;

      container.appendChild(card);
    });

  } catch (err) {
    console.error("Dictionary render error:", err);
  }
}

// Load dictionary page automatically
window.addEventListener("DOMContentLoaded", renderDictionaryPage);
