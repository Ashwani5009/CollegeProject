const express = require("express");
const axios = require('axios');
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("./models/User");
// const authRoutes = require("./routes/authRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const problemRoutes = require("./routes/problemRoutes");
const topicRoutes = require("./routes/topicRoutes");
const path = require("path");
const bcrypt = require("bcrypt");

// Load environment variables
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "6cad35a0117a8205b2ca78772f6a20637f93343849a386e9bcd22ba3efcdcaeec16cd768fb00298d32f80158b83db44d356fd3d266a647628cf2f149d73ca418";
const MONGO_URI = process.env.MONGO_URI;
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY;
const JUDGE0_API_URL = "https://judge0-ce.p.rapidapi.com"

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// API Routes
app.use("/api/submissions", submissionRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/topics", topicRoutes);
// app.use("/api/authRoutes", authRoutes);

// Serve the sign_up.html file for the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "sign_up.html"));
});

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

