import express from "express";
import pool from "../db.js";

const router = express.Router();

// add word
router.post("/", async (req, res) => {
  const { kulitan, romanized, meaning } = req.body;

  const result = await pool.query(
    `INSERT INTO words (kulitan, romanized, meaning)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [kulitan, romanized, meaning]
  );

  res.json(result.rows[0]);
});

// update word
router.put("/:id", async (req, res) => {
  const { kulitan, romanized, meaning } = req.body;

  const result = await pool.query(
    `UPDATE words
     SET kulitan=$1, romanized=$2, meaning=$3
     WHERE id=$4
     RETURNING *`,
    [kulitan, romanized, meaning, req.params.id]
  );

  res.json(result.rows[0]);
});

// delete word
router.delete("/:id", async (req, res) => {
  await pool.query("DELETE FROM words WHERE id=$1", [req.params.id]);
  res.json({ success: true });
});

export default router;
