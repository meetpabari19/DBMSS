const mongoose = require("mongoose");
const connectDB = require("./db");
const SpeedLimit = require("./models/SpeedLimit");

const seedData = [
  { vehicleClass: "M1 (<=8 seats)", expressway: 120, fourLane: 100, municipal: 70, otherRoads: 70 },
  { vehicleClass: "M2/M3 (>=9 seats)", expressway: 100, fourLane: 90, municipal: 60, otherRoads: 60 },
  { vehicleClass: "N (Goods vehicles)", expressway: 80, fourLane: 80, municipal: 60, otherRoads: 60 },
  { vehicleClass: "Motorcycles", expressway: 80, fourLane: 80, municipal: 60, otherRoads: 60 },
  { vehicleClass: "Quadricycle", expressway: null, fourLane: 60, municipal: 50, otherRoads: 50 },
  { vehicleClass: "Three-wheeled vehicles", expressway: null, fourLane: 50, municipal: 50, otherRoads: 50 },
];

const seed = async () => {
  await connectDB();
  await SpeedLimit.deleteMany();
  await SpeedLimit.insertMany(seedData);
  console.log("Seeded speed limits");
  mongoose.connection.close();
};

seed();