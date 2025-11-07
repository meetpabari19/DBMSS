// const express = require("express");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const connectDB = require("./db");
// const authRoutes = require("./routes/auth");
// const apiRoutes = require("./routes/api");

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// // Connect DB to MongoDB
// connectDB();

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api", apiRoutes);

// const PORT = process.env.PORT || 4000;
// app.listen(PORT, "0.0.0.0", () =>
//   console.log("Server running on port: ", PORT),
// );


import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import connectDB from "./db.js";
import authRoutes from "./routes/auth.js";
import apiRoutes from "./routes/api.js";
import reportRoutes from "./routes/reportRoutes.js"; 
import adminRoutes from "./routes/adminRoutes.js";


const app = express();
app.use(cors());
app.use(bodyParser.json());


connectDB();

app.use("/api/auth", authRoutes);
app.use("/api", apiRoutes);
app.use("/api/report", reportRoutes); 
app.use("/api/admin", adminRoutes);


const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running on port ${PORT}`));