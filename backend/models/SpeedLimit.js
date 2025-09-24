const mongoose = require("mongoose");

const SpeedLimitSchema = new mongoose.Schema({
  vehicleClass: String,
  expressway: Number,
  fourLane: Number,
  municipal: Number,
  otherRoads: Number
});

module.exports = mongoose.model("SpeedLimit", SpeedLimitSchema);