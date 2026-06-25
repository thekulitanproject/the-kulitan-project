// kulitan_full_project/frontend/js/word/wordLoading.js
// this is wordLoading.js

export function showLoading(elements) {
  elements.romanizedEl.textContent = "Loading entry...";
}

export function showError(elements, message) {
  elements.romanizedEl.textContent = "Entry unavailable";
}


