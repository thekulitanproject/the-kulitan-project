// testDB.js
import pool from "./backend/db.js";

const testConnection = async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("Database connected successfully:", res.rows[0]);
  } catch (err) {
    console.error("Database connection failed:", err);
  } finally {
    pool.end(); // Close the connection
  }
};

testConnection();
