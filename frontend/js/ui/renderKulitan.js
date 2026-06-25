// kulitan_full_project/frontend/js/ui/renderKulitan.js
// this is renderKulitan.js

export function renderKulitan(word, container) {
  console.log("WORD:", word);
  console.log("KULITAN RAW:", word?.kulitan);
  if (!container) return;

  const kulitanData = word?.kulitan;

  if (!kulitanData || Object.keys(kulitanData).length === 0) {
    container.innerHTML = `<div>Kulitan script not available.</div>`;
    return;
  }

  let currentMode =
    kulitanData?.kulitan_default
      ? "kulitan-default"
      : kulitanData?.kulitan_line
        ? "kulitan-line"
        : kulitanData?.kulitan_segment
          ? "kulitan-segment"
          : kulitanData?.kulitan_stroke
            ? "kulitan-stroke"
            : "kulitan-full-instruction";

  function toDbKey(mode) {
    return mode.replaceAll("-", "_");
  }

  container.innerHTML = `
    <div class="kulitan-wrapper">
      
      <div class="kulitan-mode-controls">
        <button class="kulitan-mode-btn" data-mode="kulitan-default">
          Default View
        </button>

        <button class="kulitan-mode-btn" data-mode="kulitan-line">
          Line View
        </button>

        <button class="kulitan-mode-btn" data-mode="kulitan-segment">
          Segment View
        </button>

        <button class="kulitan-mode-btn" data-mode="kulitan-stroke">
          Stroke View
        </button>

        <button class="kulitan-mode-btn" data-mode="kulitan-full-instruction">
          Full Instruction View
        </button>
      </div>

      <div class="kulitan-stage">
        <div class="kulitan-base"></div>
        <div class="kulitan-overlay" id="kulitanOverlay"></div>
      </div>

    </div>
  `;

  const base = container.querySelector(".kulitan-base");
  const buttons = container.querySelectorAll(".kulitan-mode-btn");

  const modeMap = {
    "kulitan-default": kulitanData?.kulitan_default,
    "kulitan-line": kulitanData?.kulitan_line,
    "kulitan-segment": kulitanData?.kulitan_segment,
    "kulitan-stroke": kulitanData?.kulitan_stroke,
    "kulitan-full-instruction": kulitanData?.kulitan_full_instruction
  };

  buttons.forEach((btn) => {
    const mode = btn.dataset.mode;
    if (!modeMap[mode]) {
      btn.style.display = "none";
    }
  });

  function renderMode() {
    const key = toDbKey(currentMode);
    const file = kulitanData?.[key];

    if (!file) return;

    base.innerHTML = `<img src="/SVG/${file}" />`;
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      currentMode = btn.dataset.mode;
      renderMode();
    });
  });

  renderMode();
}


