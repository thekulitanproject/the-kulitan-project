// kulitan_full_project/frontend/js/theme/nightMode.js

import { storage, KEYS } from "../utils/storage.js";

const BODY_CLASS = "night";

/* =========================
   APPLY THEME (ALWAYS SAFE)
========================= */
export function applyTheme() {
  const enabled = storage.get(KEYS.NIGHT_MODE, false);

  document.documentElement.classList.toggle(BODY_CLASS, enabled);
  document.body.classList.toggle(BODY_CLASS, enabled);

  syncButton(enabled);
}

/* =========================
   TOGGLE THEME
========================= */
export function toggleNightMode() {
  const enabled = !storage.get(KEYS.NIGHT_MODE, false);

  storage.set(KEYS.NIGHT_MODE, enabled);
  applyTheme();
}

/* =========================
   BUTTON BINDING (SAFE RE-RUN)
========================= */
export function bindNightButton() {
  const btn = document.querySelector(".night-btn");
  if (!btn) return;

  if (btn.dataset.bound === "true") return;
  btn.dataset.bound = "true";

  btn.addEventListener("click", toggleNightMode);

  syncButton(storage.get(KEYS.NIGHT_MODE, false));
}

/* =========================
   BUTTON UI UPDATE
========================= */
function syncButton(state) {
  const btn = document.querySelector(".night-btn");
  if (!btn) return;

  btn.classList.toggle("active", state);
}

/* =========================
   INIT (CALL ON EVERY PAGE)
========================= */
export function initNightMode() {
  applyTheme();
  bindNightButton();

  // sync across tabs/pages
  window.addEventListener("storage", (e) => {
    if (e.key === KEYS.NIGHT_MODE) {
      applyTheme();
    }
  });
}


