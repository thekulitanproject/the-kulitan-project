import express from "express";
import cors from "cors";
import pool from "./db.js";

// import route controllers
import wordsRouter from "./route/words.js";
import adminRouter from "./route/admin.js";

const app = express();

// global middleware
app.use(cors());
app.use(express.json());

// public routes
// everything related to searching, pagination, reading single words
app.use("/api/words", wordsRouter);

// admin routes
// everything that modifies the dictionary
app.use("/api/admin", adminRouter);

// server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
