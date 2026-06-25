import pool from "./backend/db.js";

const seedWords = [
  { kulitan: "Ábâ", romanized: "Ábâ", meaning: "Delay, prolongation of time." },
  { kulitan: "Ábad", romanized: "Ábad", meaning: "Unceasing." },
  { kulitan: "Ábad", romanized: "Ábad", meaning: "a little bleeding, or a slight wound." },
  { kulitan: "Abágat", romanized: "Abágat", meaning: "Violent wind coming from the sea." },
  { kulitan: "Ábak", romanized: "Ábak", meaning: "The time of the day, from dawn till noon." },
  { kulitan: "Abaka", romanized: "Abaka", meaning: "Hemp." },
  { kulitan: "Abal", romanized: "Abal", meaning: "Woven.." }
];

const createTableAndSeed = async () => {
  try {
    // Create table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS words (
        id SERIAL PRIMARY KEY,
        kulitan VARCHAR(255) NOT NULL,
        romanized VARCHAR(255) NOT NULL,
        meaning TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Table 'words' created or already exists.");

    // Insert initial words
    for (const word of seedWords) {
      await pool.query(
        `INSERT INTO words (kulitan, romanized, meaning)
         VALUES ($1, $2, $3)
         ON CONFLICT DO NOTHING;`,
        [word.kulitan, word.romanized, word.meaning]
      );
    }
    console.log("Sample words inserted successfully.");
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    pool.end();
  }
};

createTableAndSeed();
