// kulitan_full_project/frontend/js/utils/storage.js
// this is storage.js

/* ===============================
   LOCAL STORAGE WRAPPER
================================ */
export const storage = {
  get(key, fallback = null) {
    try {
      const value = localStorage.getItem(key);
      return value !== null ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  },

  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  remove(key) {
    localStorage.removeItem(key);
  }
};

/* ===============================
   SESSION STORAGE WRAPPER
================================ */
export const session = {
  get(key, fallback = null) {
    try {
      const value = sessionStorage.getItem(key);
      return value !== null ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  },

  set(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
  },

  remove(key) {
    sessionStorage.removeItem(key);
  }
};

/* ===============================
   CENTRALIZED KEYS
================================ */
export const KEYS = {
  LANG: "lang",
  NIGHT_MODE: "nightMode",
  SCROLL_POSITION: "scrollPosition",
  DICT_SCROLL: "dictScrollY"
};


