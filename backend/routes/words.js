import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Correctly define the path
const wordsFile = path.join(__dirname, "../../frontend/words.json");

router.get("/", (req, res) => {
  try {
    const data = fs.readFileSync(wordsFile, "utf-8");
    const words = JSON.parse(data);
    res.json(words);
  } catch (err) {
    console.error("Error reading words.json:", err);
    res.status(500).json({ error: "Failed to load words" });
  }
});

export default router;
