// backend/server.js
import express from "express";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

import wordsRouter from "./routes/words.js";
import i18nRoutes from "./routes/i18n.js";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

// Serve audio files from backend/audio/
app.use("/audio", express.static(path.join(__dirname, "audio")));

// API routes
app.use("/api/words", wordsRouter);
app.use("/api/i18n", i18nRoutes);

app.use(
  "/kulitan_entries",
  express.static(path.join(__dirname, "../frontend/SVG/kulitan_entries"))
);

// Serve frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// SPA fallback
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/word.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});