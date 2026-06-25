// kulitan_full_project/frontend/js/api/initGlobal.js
// this is initGlobal.js

import { initLanguage } from "../i18n/language.js";


export async function initGlobal() {
  await initLanguage();
}

import { initNightMode } from "../theme/nightMode.js";

document.addEventListener("DOMContentLoaded", () => {
  initNightMode();
});


