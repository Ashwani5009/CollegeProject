const express = require("express");
const axios = require('axios');
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("./models/User");
const submissionRoutes = require("./routes/submissionRoutes");
const problemRoutes = require("./routes/problemRoutes");
const topicRoutes = require("./routes/topicRoutes");
const path = require("path");
const bcrypt = require("bcrypt");

// Load environment variables
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "6cad35a0117a8205b2ca78772f6a20637f93343849a386e9bcd22ba3efcdcaeec16cd768fb00298d32f80158b83db44d356fd3d266a647628cf2f149d73ca418";
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://ashwani:22001015009%40db@cluster0.se9jy.mongodb.net/study-assistant?retryWrites=true&w=majority";
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY;
const JUDGE0_API_URL = "https://judge0-ce.p.rapidapi.com"

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// Register Route
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  // Basic validation
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
    }
    // Create a new user
    const newUser = new User({ username, password });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }
    // Validate password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });

    res.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post('/submit-code', async (req, res) => {
    const { source_code, language_id, stdin } = req.body;

    try {
        // Prepare the payload for Judge0 API
        const payload = {
            source_code,        // Source code to run
            language_id,        // The language id of the code
            stdin: stdin || '', // Input for the code (optional)
        };

        // Send the POST request to Judge0 API
        const response = await axios.post(
            `${JUDGE0_API_URL}/submissions?base64_encoded=false&wait=true`,
            payload,
            {
                headers: {
                    'x-rapidapi-key': JUDGE0_API_KEY, // Your API key
                    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com', // API host
                    'Content-Type': 'application/json', // Content type should be application/json
                },
            }
        );

        // Send the response from Judge0 back to the client
        res.json(response.data);
    } catch (error) {
        console.error('Error submitting code:', error);
        res.status(500).json({ error: 'Failed to evaluate code.' });
    }
});


// API Routes
app.use("/api/submissions", submissionRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/topics", topicRoutes);

// Serve the index.html file for the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
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
