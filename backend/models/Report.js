import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema({
  vehicle: { type: String, required: true },
  location: { type: String, default: "Unknown" },
  coordinates: {
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
  },
  roadCondition: String,
  traffic: String,
  weather: String,
  issues: String,
  feedback: String,
  createdAt: { type: Date, default: Date.now },
});

const Report = mongoose.model("Report", ReportSchema);
export default Report;
