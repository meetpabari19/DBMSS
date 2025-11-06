import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema({
  vehicle: String,
  location: String,
  coordinates: {
    lat: Number,
    lon: Number,
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
