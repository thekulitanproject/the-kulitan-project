// kulitan_full_project/frontend/js/api/client.js
// this is client.js

import { storage, KEYS } from "../utils/storage.js";

/* ===============================
   LANGUAGE
================================ */
export function getLang() {
  return storage.get(KEYS.LANG, "en");
}

export function withLang(url) {
  const lang = getLang();
  return `${url}${url.includes("?") ? "&" : "?"}lang=${lang}`;
}

/* ===============================
   BASE FETCH WRAPPER
================================ */
export async function apiGet(url) {
  const res = await fetch(url);
  const json = await res.json();

  if (!res.ok || json.success === false) {
    throw new Error(json.error || `API request failed: ${url}`);
  }

  return json.data ?? json;
}


