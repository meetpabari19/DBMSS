const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  username: { type: String, required: false },
  location: { type: String, required: false },
  roadType: { type: String, required: false },
  roadCondition: { type: String, required: false },
  trafficLevel: { type: String, required: false },
  weather: { type: String, required: false },
  rating: { type: Number, default: 3 },
  feedback: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Feedback", feedbackSchema);
