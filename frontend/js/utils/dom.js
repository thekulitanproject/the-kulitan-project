// kulitan_full_project/frontend/js/utils/dom.js
// this is dom.js

export function qs(selector) {
  return document.querySelector(selector);
}

export function qsa(selector) {
  return document.querySelectorAll(selector);
}

export function setHTML(el, html) {
  if (el) el.innerHTML = html;
}


