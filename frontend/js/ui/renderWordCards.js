// kulitan_full_project/frontend/js/ui/renderWordCards.js
// this is renderWordCards.js

import { getKulitanSrc } from "../utils/kulitan.js";

function escapeHTML(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function renderWordCards(words) {
  if (!Array.isArray(words)) {
    console.warn("renderWordCards expected array");
    return "";
  }

  return words.map(word => {

    const kulitanText = word?.kulitan?.kulitan_default;

    const src = kulitanText
      ? getKulitanSrc(kulitanText)
      : null;

    const rawMeaning =
      word.meanings?.map(m => m.definition).filter(Boolean).join(" | ");

    const meaningText = rawMeaning
      ? escapeHTML(rawMeaning)
      : "Definition pending";

    return `
      <a href="${word.id ? `word.html?id=${encodeURIComponent(word.id)}` : '#'}" class="card dict-item">
        <div class="card-content">
          <div class="word-text">

            <div class="word-title-wrap">
              <h1 class="word-card">
                ${escapeHTML(word.romanized ?? "No Romanized text")}
              </h1>
            </div>

            <p>${escapeHTML(word.part_of_speech ?? "")}</p>
            <p>${escapeHTML(meaningText || "Definition pending")}</p>

          </div>

          <div class="word-kulitan">
            ${src
              ? `<img src="${src}" class="kulitan-vector" alt="Kulitan script">`
              : `<img src="/SVG/placeholder.svg" class="kulitan-vector">`}
          </div>

        </div>
      </a>
    `;
  }).join("");
}


