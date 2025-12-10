// ===============================
// Language System
// ===============================
let currentLang = localStorage.getItem("lang") || "en";

async function loadLanguage(lang) {
  try {
    const response = await fetch(`/i18n/${lang}.json`);
    const translations = await response.json();

    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.dataset.i18n;
      if (translations[key]) el.textContent = translations[key];
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(input => {
      const key = input.dataset.i18nPlaceholder;
      if (translations[key]) input.placeholder = translations[key];
    });

    localStorage.setItem("lang", lang);
    currentLang = lang;

    const toggleBtn = document.getElementById("langToggle");
    if (!toggleBtn) return;

    const [first, second] = toggleBtn.textContent.split("/").map(s => s.trim());
    toggleBtn.innerHTML =
      currentLang === "en"
        ? `<span class="active">${first}</span> / <span class="inactive">${second}</span>`
        : `<span class="inactive">${first}</span> / <span class="active">${second}</span>`;

  } catch (err) {
    console.error("Language load error:", err);
  }
}

loadLanguage(currentLang);

document.getElementById("langToggle")?.addEventListener("click", () => {
  loadLanguage(currentLang === "en" ? "kp" : "en");
});

// ===============================
// Night Mode
// ===============================
document.getElementById("nightBtn")?.addEventListener("click", e => {
  document.body.classList.toggle("night");
  e.target.classList.toggle("active");
});

// ===============================
// Word Card Renderer
// ===============================
function renderWordCards(container, words) {
  container.innerHTML = words.map(word => {
    if (!word.page) return "";

    const kulitanSrc =
      word.kulitan.startsWith("/")
        ? word.kulitan
        : `/${word.kulitan}`;

    return `
      <a href="${word.page}"
         class="card dict-item"
         data-word="${word.romanized} ${word.meaning}">
        <div class="card-content">
          <div class="word-text">
            <strong>${word.romanized}</strong>
          </div>
          <div class="word-kulitan">
            <img src="${kulitanSrc}" alt="Kulitan glyph" class="kulitan-vector">
          </div>
        </div>
      </a>
    `;
  }).join("");
}

// ===============================
// Load Words (API + Fallback)
// ===============================
async function fetchWords() {
  try {
    const res = await fetch("http://localhost:5000/api/words");
    if (res.ok) return await res.json();
  } catch {}

  try {
    const local = await fetch("/words.json");
    return await local.json();
  } catch {
    return [];
  }
}

// ===============================
// Dictionary Page
// ===============================
async function loadDictionaryWords() {
  const container = document.getElementById("dictionaryContainer");
  if (!container) return;

  const words = await fetchWords();
  if (!words.length) {
    container.innerHTML = "<p>No words available.</p>";
    return;
  }

  renderWordCards(container, words);
}

loadDictionaryWords();

// ===============================
// Search Filter
// ===============================
document.getElementById("searchInput")?.addEventListener("input", e => {
  const query = e.target.value.toLowerCase();
  document
    .querySelectorAll("#dictionaryContainer .card")
    .forEach(card => {
      const text = card.dataset.word.toLowerCase();
      card.style.display = text.includes(query) ? "block" : "none";
    });
});

// ===============================
// Featured Words (Home)
// ===============================
async function loadFeaturedWords() {
  const container = document.getElementById("featuredWordsContainer");
  if (!container) return;

  const words = await fetchWords();
  const featured = words.sort(() => 0.5 - Math.random()).slice(0, 6);

  renderWordCards(container, featured);
}

loadFeaturedWords();
