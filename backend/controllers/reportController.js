import Report from "../models/Report.js";
import axios from "axios";

async function getLocationName(lat, lon) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
    const response = await axios.get(url, { headers: { "User-Agent": "RoadReportApp/1.0" } });

    const address = response.data?.address || {};

    const road = address.road || address.pedestrian || address.suburb || "";
    const area = address.neighbourhood || address.village || address.town || "";
    const city = address.city || address.district || "";
    const state = address.state || "";

    const formatted = [road, area, city, state].filter(Boolean).join(", ");

    return formatted || response.data?.display_name || "Unknown";
  } catch (error) {
    console.error("Reverse geocoding failed:", error.message);
    return "Unknown";
  }
}

export const createReport = async (req, res) => {
  try {
    const { vehicle, coordinates, roadCondition, traffic, weather, issues, feedback } = req.body;

    let location = "Unknown";
    if (coordinates?.lat && coordinates?.lon) {
      location = await getLocationName(coordinates.lat, coordinates.lon);
    }

    const newReport = new Report({
      vehicle,
      location,     
      coordinates,
      roadCondition,
      traffic,
      weather,
      issues,
      feedback,
      createdAt: new Date(),
    });

    await newReport.save();
    res.status(201).json({ success: true, message: "Report saved successfully", data: newReport });
  } catch (error) {
    console.error("Error saving report:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
