const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./db");
const authRoutes = require("./routes/auth");
const apiRoutes = require("./routes/api");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect DB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", apiRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("Server running on port", PORT));