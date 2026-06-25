// Path: kulitan_full_project/backend/routes/admin.js

import express from "express";
import { addWord, updateWord, deleteWord } from "../controllers/adminController.js";

const router = express.Router();

// Add a new word
router.post("/", addWord);

// Update an existing word by ID
router.put("/:id", updateWord);

// Soft delete a word by ID
router.delete("/:id", deleteWord);

export default router;