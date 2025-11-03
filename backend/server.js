// const express = require("express");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const connectDB = require("./db");
// const authRoutes = require("./routes/auth");
// const apiRoutes = require("./routes/api");

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// // Connect DB
// connectDB();

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api", apiRoutes);
// const feedbackRoutes = require("./routes/feedback.routes");
// app.use("/api/feedback", feedbackRoutes);


// const PORT = process.env.PORT || 4000;
// app.listen(PORT, "0.0.0.0", () =>
//   console.log("Server running on port: ", PORT),
// );
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./db");

// Import route files
const authRoutes = require("./routes/auth");
const apiRoutes = require("./routes/api");
const feedbackRoutes = require("./routes/feedback.routes");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ Connect MongoDB
connectDB();

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api", apiRoutes);
app.use("/api/feedback", feedbackRoutes); // feedback route for submitting + viewing feedbacks

// ✅ Default Route (for testing)
app.get("/", (req, res) => {
  res.send("🚀 Road Safety API running successfully");
});

// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ error: "Internal server error" });
});

// ✅ Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
