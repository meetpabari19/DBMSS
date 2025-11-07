// import express from "express";
// import Report from "../models/Report.js";

// const router = express.Router();

// // Get all reports
// router.get("/reports", async (req, res) => {
//   try {
//     const reports = await Report.find().sort({ createdAt: -1 });
//     res.json({ success: true, data: reports });
//   } catch (err) {
//     console.error("Error fetching reports:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// // Get dashboard statistics
// router.get("/stats", async (req, res) => {
//   try {
//     const totalReports = await Report.countDocuments();
//     const conditionCounts = await Report.aggregate([
//       { $group: { _id: "$roadCondition", count: { $sum: 1 } } },
//     ]);
//     const trafficCounts = await Report.aggregate([
//       { $group: { _id: "$traffic", count: { $sum: 1 } } },
//     ]);
//     res.json({
//       success: true,
//       totalReports,
//       conditionCounts,
//       trafficCounts,
//     });
//   } catch (err) {
//     console.error("Error fetching stats:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// export default router;


import express from "express";
import Report from "../models/Report.js";

const router = express.Router();

// Get all or filtered reports
router.get("/reports", async (req, res) => {
  try {
    const { search, condition, traffic } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { vehicle: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    if (condition) query.roadCondition = condition;
    if (traffic) query.traffic = traffic;

    const reports = await Report.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: reports });
  } catch (err) {
    console.error("Error fetching reports:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get dashboard statistics
router.get("/stats", async (req, res) => {
  try {
    const totalReports = await Report.countDocuments();
    const conditionCounts = await Report.aggregate([
      { $group: { _id: "$roadCondition", count: { $sum: 1 } } },
    ]);
    const trafficCounts = await Report.aggregate([
      { $group: { _id: "$traffic", count: { $sum: 1 } } },
    ]);
    res.json({
      success: true,
      totalReports,
      conditionCounts,
      trafficCounts,
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
