const express = require("express");
const { generateAcademicRecords } = require("../controller/Result/generateResults.js");

const router = express.Router();

// POST /generate-results
router.post("/generate-results", async (req, res) => {
  try {
    const { year } = req.body;
    if (!year) {
      return res.status(400).json({ error: "Missing year in request body" });
    }
    const result = await generateAcademicRecords(year);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
