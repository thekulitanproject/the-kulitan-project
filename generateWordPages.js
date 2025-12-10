import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// =====================================================
// Setup paths
// =====================================================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const wordsPath = path.join(__dirname, "frontend", "words.json");
const outputDir = path.join(__dirname, "frontend", "words");

// Ensure output directory exists
fs.mkdirSync(outputDir, { recursive: true });

// Load words
const words = JSON.parse(fs.readFileSync(wordsPath, "utf8"));

// =====================================================
// Utilities
// =====================================================

// Persistent Base64-like ID
function randomBase64(length = 13) {
  return Buffer.from(
    Array.from({ length }, () => Math.floor(Math.random() * 256))
  )
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "A")
    .replace(/\//g, "B")
    .slice(0, length);
}

// Safe rootword slug
function generateSlug(romanized) {
  let clean = romanized
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return clean || "word"; // fallback if slug is empty

  
}

// Kulitan SVG with robust relative path
function generateSVG(kulitanPath) {
  const absoluteSVG = path.join(__dirname, "frontend", kulitanPath);
  // relative to frontend root, not outputDir
  const relativePath = path.relative(path.join(__dirname, "frontend"), absoluteSVG).replace(/\\/g, "/");
  return `<img src="/frontend/${relativePath}" alt="Kulitan" class="kulitan-vector">`;
}


// =====================================================
// HTML Template
// =====================================================
function generateHTML(word) {
  const { kulitan, romanized, meaning } = word;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${romanized} | Kulitan Digital Dictionary</title>
<link rel="stylesheet" href="/css/style.css">
</head>
<body>

<header>
  <div>
    <div class="home-title" data-i18n="home-title"></div>
    <div class="home-sub" data-i18n="home-sub"></div>
  </div>

  <nav>
    <a href="/index.html" data-i18n="nav-home"></a>
    <a href="/dictionary.html" data-i18n="nav-dictionary"></a>
    <a href="/about.html" data-i18n="nav-about"></a>
    <a href="/contact.html" data-i18n="nav-contact"></a>
  </nav>

  <div class="enkp">
    <button id="langToggle" data-i18n="langToggle"></button>
  </div>
</header>

<main>
<section class="word-page">
  <div class="card-content">
    <div class="word-kulitan">
      <img src="${kulitan}" alt="Kulitan" class="kulitan-vector">
    </div>
    <div class="word-text">
      <h1><strong>Romanized:</strong> ${romanized}</h1>
      <p><strong>Meaning:</strong> ${meaning}</p>
    </div>
  </div>
</section>
</main>

<div class="controls">
  <button id="nightBtn" class="night-btn" data-i18n="nightBtn"></button>
</div>

<footer>
  <p data-i18n="footercreator"></p>
  <p data-i18n="footernote"></p>
</footer>

<script src="/js/script.js"></script>
</body>
</html>`;
}


// =====================================================
// Generate pages with STABLE IDs
// =====================================================
const seenSlugs = new Set();
let modified = false;

words.forEach(word => {
  // Ensure UID exists
  if (!word.uid) {
    word.uid = randomBase64(13);
    modified = true;
  }

  // Generate clean slug
  let slug = generateSlug(word.romanized);

  // Handle duplicate slugs in the same run
  const originalSlug = slug;
  let counter = 1;
  while (seenSlugs.has(slug)) {
    slug = `${originalSlug}-${counter}`;
    counter++;
  }
  seenSlugs.add(slug);

  // Build filename and page URL
  const fileName = `${slug}-${word.uid}.html`;
  const filePath = path.join(outputDir, fileName);
  word.page = `/words/${fileName}`;

  // Generate HTML and write file
  fs.writeFileSync(filePath, generateHTML(word), "utf8");
  console.log(`${word.romanized} → ${slug} | Generated: ${fileName}`);
});

// Save updated words.json if any modifications occurred
if (modified) {
  fs.writeFileSync(wordsPath, JSON.stringify(words, null, 2), "utf8");
  console.log("✅ IDs saved back to words.json");
}

console.log("✅ All word pages generated successfully");
