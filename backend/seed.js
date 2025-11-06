const mongoose = require("mongoose");
const connectDB = require("./db");
const SpeedLimit = require("./models/SpeedLimit");

const seedData = [
  {
    vehicleClass: "Car",
    expressway: 120,
    fourLane: 100,
    municipal: 70,
    otherRoads: 40,
  },
  {
    vehicleClass: "Bus",
    expressway: 100,
    fourLane: 90,
    municipal: 60,
    otherRoads: 30,
  },
  {
    vehicleClass: "Truck",
    expressway: 80,
    fourLane: 80,
    municipal: 60,
    otherRoads: 30,
  },
  {
    vehicleClass: "Motorcycles",
    expressway: 80,
    fourLane: 80,
    municipal: 60,
    otherRoads: 40,
  },
  {
    vehicleClass: "Quadricycle",
    expressway: null,
    fourLane: 60,
    municipal: 50,
    otherRoads: 30,
  },
  {
    vehicleClass: "Three-wheeled vehicles",
    expressway: null,
    fourLane: 50,
    municipal: 50,
    otherRoads: 30,
  },
];

const seed = async () => {
  try {
    await connectDB();
    await SpeedLimit.deleteMany();
    await SpeedLimit.insertMany(seedData);
    console.log("Seeded speed limits");
    mongoose.connection.close();
  } catch (err) {
    console.err("Error seeding data:" + err);
  }
};

seed();

