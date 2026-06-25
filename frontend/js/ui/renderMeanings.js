// kulitan_full_project/frontend/js/ui/renderMeanings.js

export function renderMeanings(word, container) {
  if (!container) return;

  const meanings = word.meanings || [];

  if (!meanings.length) {
    container.innerHTML = `<div class="meta-item">No meanings available.</div>`;
    return;
  }

  container.innerHTML = meanings.map(m => `
    <div class="meaning-item">

      <div class="meaning-definition">
        ${m.definition}
      </div>

      ${
        m.examples?.length
          ? `
            <div class="meaning-examples">
              ${m.examples.map(ex => `
                <div class="example-item">
                  <div class="example-en">${ex.example_en || ""}</div>
                  <div class="example-kp">${ex.example_kp || ""}</div>
                </div>
              `).join("")}
            </div>
          `
          : ""
      }

    </div>
  `).join("");
}


