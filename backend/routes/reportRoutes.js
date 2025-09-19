const express = require("express");
const router = express.Router();
const Report = require("../models/report");

// ✅ Report save route
router.post("/", async (req, res) => {
  try {
    const { reportTitle, category, details } = req.body;

    if (!reportTitle || !category || !details) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newReport = new Report({ reportTitle, category, details });
    await newReport.save();

    res.status(201).json({ message: "Report submitted successfully!" });
  } catch (err) {
    console.error("❌ Error saving report:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
