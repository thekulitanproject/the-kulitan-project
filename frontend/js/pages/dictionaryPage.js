// kulitan_full_project/frontend/js/pages/dictionaryPage.js
// this is dictionaryPage.js

import { initScrollPersistence } from "../utils/scroll.js";
import { initLanguage } from "../i18n/language.js";
import { initDictionaryLoader } from "../dictionary/dictionaryLoader.js";
import { loadFeaturedWords } from "../dictionary/dictionaryFeatured.js";
import { KEYS } from "../utils/storage.js";
import { initNightMode } from "../theme/nightMode.js";


export async function initDictionaryPage() {
  await initLanguage();

  initScrollPersistence(KEYS.DICT_SCROLL);
  initNightMode();
  initDictionaryLoader();
  loadFeaturedWords();
}



