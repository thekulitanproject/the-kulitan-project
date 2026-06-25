// backend/routes/words.js only handles routing

import express from "express";
import {
  getWords,
  searchWords,
  getWordById,
  getRandomWords
} from "../controllers/wordsController.js";

const router = express.Router();

// static routes FIRST
router.get("/random", getRandomWords);
router.get("/", getWords);
router.get("/search", searchWords);

// dynamic LAST
router.get("/:id", getWordById);

export default router;