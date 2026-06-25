// backend/app.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/svg", express.static(path.join(__dirname, "svg")));

export default app;