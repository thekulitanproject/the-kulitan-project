// only handles database connection

import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  ssl: process.env.DB_SSL === "true"
    ? { rejectUnauthorized: false }
    : false
});

// one time connection test
pool
  .query("SELECT 1")
  .then(() => {
    console.log("Database connected");
  })
  .catch(err => {
    console.error("Database connection error:", err);
  });

// global error listener
pool.on("error", err => {
  console.error("Unexpected DB error", err);
});

export default pool;

export async function query(text, params) {
  try {
    return await pool.query(text, params);
  } catch (err) {
    console.error("Query error:", err);
    throw err;
  }
}