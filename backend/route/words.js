import express from "express";
import pool from "../db.js";

const router = express.Router();

// search
router.get("/search", async (req, res) => {
  const q = req.query.q || "";
  const result = await pool.query(
    `SELECT * FROM words
     WHERE romanized ILIKE $1
     OR kulitan ILIKE $1
     OR meaning ILIKE $1
     ORDER BY romanized ASC`,
    ["%" + q + "%"]
  );
  res.json(result.rows);
});

// pagination
router.get("/", async (req, res) => {
  const limit = Number(req.query.limit) || 50;
  const offset = Number(req.query.offset) || 0;

  const result = await pool.query(
    "SELECT * FROM words ORDER BY id LIMIT $1 OFFSET $2",
    [limit, offset]
  );

  res.json(result.rows);
});

// single word
router.get("/:id", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM words WHERE id = $1",
    [req.params.id]
  );

  res.json(result.rows[0]);
});

export default router;
