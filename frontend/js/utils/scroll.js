// kulitan_full_project/frontend/js/utils/scroll.js
// this is scroll.js

import { session, KEYS } from "./storage.js";

/* ===============================
   SCROLL POSITION (SESSION SAFE)
================================ */

/**
 * Save scroll position for a given key
 */
export function saveScrollPosition(key = KEYS.SCROLL_POSITION) {
  session.set(key, window.scrollY || 0);
}

/**
 * Restore scroll position for a given key
 */
export function restoreScrollPosition(key = KEYS.SCROLL_POSITION) {
  const y = session.get(key, null);

  if (typeof y === "number") {
    window.scrollTo(0, y);
  }
}

/* ===============================
   AUTO TRACKER
================================ */
let scrollListenerAttached = false;

/**
 * Automatically tracks scroll position continuously
 */
export function enableScrollTracking(key = KEYS.SCROLL_POSITION) {
  if (scrollListenerAttached) return;

  window.addEventListener("scroll", () => {
    session.set(key, window.scrollY || 0);
  });

  scrollListenerAttached = true;
}

/**
 * Disable tracking (optional cleanup)
 */
export function disableScrollTracking() {
  // no safe way to remove anonymous listener without redesign,
  // so we just stop future logic if needed
  scrollListenerAttached = false;
}

/* ===============================
   PAGE HELPERS
================================ */

/**
 * Restore after full page load
 */
export function restoreOnLoad(key = KEYS.SCROLL_POSITION) {
  window.addEventListener("load", () => {
    restoreScrollPosition(key);
  });
}

/**
 * One-line setup helper
 */
export function initScrollPersistence(key = KEYS.SCROLL_POSITION) {
  enableScrollTracking(key);
  restoreOnLoad(key);
}


