const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const SpeedLimit = require("../models/SpeedLimit");
const router = express.Router();
const SECRET = process.env.JWT_SECRET || "replace_this_secret";

function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "Missing token" });
  const token = header.split(" ")[1];
  try {
    const data = jwt.verify(token, SECRET);
    req.user = data;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// Simple mapping of OSM highway tag to friendly name
function mapHighway(tag) {
  const m = {
    motorway: "Expressway / National Highway",
    trunk: "National Highway (Trunk)",
    primary: "State Highway / Primary",
    secondary: "Major District Road (Secondary)",
    tertiary: "Other District Road (Tertiary)",
    residential: "Residential Street",
    service: "Service Road",
    unclassified: "Unclassified Road",
  };
  return m[tag] || `Other: ${tag}`;
}

function decideColumnIndex(tag, tags) {
  const t = (tag || "").toLowerCase();
  if (t.includes("motorway") || t.includes("expressway")) return 0;
  if (t.includes("trunk") || t.includes("primary")) return 1;
  if (tags && (tags.city || tags.town || tags.place)) return 2;
  return 3;
}

// Route to get road info by coords (auth required)
router.get("/road-info", async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon)
    return res.status(400).json({ error: "lat & lon required" });
  const overpass = "https://overpass-api.de/api/interpreter";
  const q = `
    [out:json];
    way(around:50,${lat},${lon})[highway];
    out tags;
  `;
  try {
    const resp = await axios.post(overpass, q, {
      headers: { "Content-Type": "text/plain" },
      timeout: 15000,
    });
    const elems = resp.data.elements || [];
    if (!elems.length)
      return res.json({ found: false, message: "No highway nearby" });
    const tags = elems[0].tags || {};
    const highway = tags.highway || "unknown";
    const roadType = mapHighway(highway);
    const col = decideColumnIndex(highway, tags);
    const limits = await SpeedLimit.find();
    const speeds = limits.map((item) => {
      const vals = [
        item.expressway,
        item.fourLane,
        item.municipal,
        item.otherRoads,
      ];
      return { vehicleClass: item.vehicleClass, maxSpeed: vals[col] };
    });
    res.json({
      found: true,
      highwayTag: highway,
      roadType,
      columnIndex: col,
      speeds,
      rawTags: tags,
    });
  } catch (err) {
    console.error("Overpass error:", err.message || err);
    res.status(500).json({ error: "Overpass error", details: err.message });
  }
});

// Route to check speeds (given vehicleClass, currentSpeed, roadType)
router.post("/checkSpeed", async (req, res) => {
  try {
    const { vehicleClass, roadType, currentSpeed } = req.body;
    if (!vehicleClass || !roadType || currentSpeed == null)
      return res
        .status(400)
        .json({ error: "vehicleClass, roadType, currentSpeed required" });
    const limits = await SpeedLimit.findOne({ vehicleClass });
    if (!limits)
      return res
        .status(404)
        .json({ error: "No speed limit configured for this vehicle class" });
    // decide column
    let col = "otherRoads";
    const t = (roadType + "").toLowerCase();
    if (t.includes("expressway") || t.includes("motorway")) col = "expressway";
    else if (
      t.includes("state highway") ||
      t.includes("national") ||
      t.includes("4 lane")
    )
      col = "fourLane";
    else if (
      t.includes("municipal") ||
      t.includes("city") ||
      t.includes("town")
    )
      col = "municipal";
    const limit = limits[col];
    if (limit == null)
      return res.json({
        status: "NoLimit",
        message: "No limit set for this vehicle on this road type",
      });
    if (Number(currentSpeed) <= Number(limit))
      return res.json({
        status: "OK",
        message: `Within limit (${limit} km/h)`,
      });
    return res.json({
      status: "Overspeed",
      message: `Limit ${limit} km/h, driven ${currentSpeed} km/h`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

module.exports = router;

