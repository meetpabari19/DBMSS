const express = require("express");
const router = express.Router();
const Feedback = require("../models/feedback.model");

// POST: Submit feedback
router.post("/submit", async (req, res) => {
  try {
    const { roadType, condition } = req.body;

    const newFeedback = new Feedback({
      roadType,
      condition,
      createdAt: new Date(),
    });

    await newFeedback.save();
    res.status(200).json({ message: "Feedback submitted successfully!" });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
