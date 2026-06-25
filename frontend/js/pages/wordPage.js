// kulitan_full_project/frontend/js/pages/wordPage.js
// this is wordPage.js

import { initGlobal } from "../app/initGlobal.js";
import { initWordPage } from "../word/wordInit.js";
import { initNightMode, toggleNightMode } from "../theme/nightMode.js";


function initCollapsible() {
  const toggles = document.querySelectorAll(".collapsible-toggle");

  toggles.forEach(toggle => {
    toggle.addEventListener("click", () => {
      const parent = toggle.closest(".collapsible");
      if (parent) parent.classList.toggle("open");
    });
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await initGlobal();

  initNightMode();

  const btn = document.querySelector(".night-btn");
  if (btn) btn.addEventListener("click", toggleNightMode);

  await initWordPage();

  initCollapsible();
});


