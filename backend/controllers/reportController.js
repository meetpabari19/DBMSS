import Report from "../models/Report.js";

// POST /api/report
export const createReport = async (req, res) => {
  try {
    const { vehicle, location, coordinates, roadCondition, traffic, weather, issues, feedback } = req.body;

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
    console.error("❌ Error saving report:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
