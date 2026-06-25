// kulitan_full_project/frontend/js/ui/renderDialects.js
// this is renderDialects.js

export function renderDialects(dialects = [], regions = [], container) {
  if (!container) return;

  if (!dialects.length && !regions.length) {
    container.innerHTML = `
      <span class="meta-label">Dialect Region:</span>
      <span class="meta-value">Information pending</span>
    `;
    return;
  }

  const dialectTags = dialects
    .map(d => `
      <span class="dialect-tag">
        ${d.name}
      </span>
    `)
    .join("");

  const regionTags = regions
    .map(r => `
      <span class="dialect-tag dialect-region-tag">
        ${r.name}
      </span>
    `)
    .join("");

  container.innerHTML = `
    <span class="meta-label">Region:</span>
    <div class="dialect-tags">
      ${dialectTags}${regionTags}
    </div>
  `;
}


