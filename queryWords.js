import pool from "./backend/db.js";

const getAllWords = async () => {
  try {
    const res = await pool.query("SELECT * FROM words ORDER BY id ASC");
    console.log(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    pool.end(); // Close the database connection
  }
};

getAllWords();
