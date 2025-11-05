const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const path = require("path");
const bcrypt = require("bcrypt");

// Load environment variables
dotenv.config();

// Import models and routes
const User = require("./models/User");
const authRoutes = require("./routes/authRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const problemRoutes = require("./routes/problemRoutes");
const topicRoutes = require("./routes/topicRoutes");
const aiInterviewRoutes = require("./routes/aiInterviewRoutes"); // ✅ Your new route

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Mount routes
app.use("/api/authRoutes", authRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/ai-interview", aiInterviewRoutes); // ✅ AI Interview route

// Serve main pages
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "sign_up.html"));
});

app.get("/ai-interview", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "ai-interview.html"));
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
