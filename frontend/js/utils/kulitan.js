// kulitan_full_project/frontend/js/utils/kulitan.js
// this is kulitan.js

export function getKulitanSrc(path) {
  if (!path) return null;

  const clean = path.replace(/^\/+/, "");

  if (clean.startsWith("SVG/")) {
    return `/${clean}`;
  }

  return `/SVG/${clean}`;
}



