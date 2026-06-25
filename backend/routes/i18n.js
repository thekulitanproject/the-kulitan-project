// backend/routes/i18n.js
import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

router.get("/:lang", (req, res) => {
  const lang = req.params.lang || "en";
  const filePath = path.join(process.cwd(), "frontend", "i18n", `${lang}.json`);

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(404).json({
        success: false,
        error: "Language not found"
      });
    }

    try {
      const parsed = JSON.parse(data);
      res.json(parsed);
    } catch (parseErr) {
      return res.status(500).json({
        success: false,
        error: "Invalid language file format"
      });
    }
  });
});

export default router;