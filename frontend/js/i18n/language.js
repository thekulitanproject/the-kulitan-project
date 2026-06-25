// kulitan_full_project/frontend/js/i18n/language.js
// this is language.js


/* ===============================
 LANGUAGE MODULE
================================ */
import { storage, KEYS } from "../utils/storage.js";

function getCurrentLanguage() {
  return storage.get(KEYS.LANG, "en");
}

function setLang(lang) {
  storage.set(KEYS.LANG, lang);
}

/* ===============================
 LOAD TRANSLATIONS
================================ */
async function loadTranslations(lang) {
  try {
    const res = await fetch(`/i18n/${lang}.json`);
    return await res.json();
  } catch (err) {
    console.error("Failed to load language file:", err);
    return {};
  }
}

/* ===============================
 APPLY TRANSLATIONS TO PAGE
================================ */
function applyTranslations(translations) {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (translations[key]) {
      el.textContent = translations[key];
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (translations[key]) {
      el.placeholder = translations[key];
    }
  });
}

/* ===============================
 APPLY TRANSLATIONS TO PAGE
================================ */
export async function changeLanguage(lang) {
  const translations = await loadTranslations(lang);

  applyTranslations(translations);
  setLang(lang);

  updateToggleUI(lang);

  return lang;
}

/* ===============================
 APPLY TRANSLATIONS TO PAGE
================================ */
function updateToggleUI(lang) {
  const toggleBtn = document.getElementById("langToggle");
  if (!toggleBtn) return;

  const [first, second] = toggleBtn.textContent.split("/").map(s => s.trim());

  toggleBtn.innerHTML =
    lang === "en"
      ? `<span class="active">${first}</span> / <span class="inactive">${second}</span>`
      : `<span class="inactive">${first}</span> / <span class="active">${second}</span>`;
}

/* ===============================
 INIT FUNCTION (CALL THIS ON ANY PAGE)
================================ */
export async function initLanguage() {
  const lang = getCurrentLanguage();
  const translations = await loadTranslations(lang);

  applyTranslations(translations);
  updateToggleUI(lang);

  const toggleBtn = document.getElementById("langToggle");

  toggleBtn?.addEventListener("click", () => {
    const newLang = getCurrentLanguage() === "en" ? "kp" : "en";
    changeLanguage(newLang);
  });
}


