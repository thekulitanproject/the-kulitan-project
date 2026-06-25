// kulitan_full_project/frontend/js/ui/renderExamples.js
// this is renderExamples.js

export function renderExamples(examples, container) {
  if (!container) return;

  const list = Array.isArray(examples) ? examples : [];

  if (!list.length) {
    container.innerHTML = `
      <div class="example-item example-placeholder">
        <p class="example-kp">Kapampángan examples are being written.*</p>
        <p class="example-en">English translations will follow shortly after.*</p>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map((ex, i) => `
    <div class="example-item example-${i + 1}">
      <p class="example-kp">${ex?.example_kp ?? ""}</p>
      <p class="example-en">${ex?.example_en ?? ""}</p>
    </div>
  `).join("");
}


