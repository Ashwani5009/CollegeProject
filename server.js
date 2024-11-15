const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const submissionRoutes = require("./routes/submissionRoutes");
const problemRoutes = require("./routes/problemRoutes");
const topicRoutes = require("./routes/topicRoutes");
const path = require("path");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());  // If you have a front-end separate from the back-end

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api/submissions", submissionRoutes); // API route for submissions
app.use("/api/problems", problemRoutes);
app.use("/api/topics", topicRoutes);
// Serve the index.html file when the user hits the root route
app.get("/", (req, res) => {
   res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Connect to MongoDB (ensure MongoDB is running)
mongoose.connect("mongodb://localhost:27017/study-assistant")
.then(() => {
   console.log("Connected to MongoDB");
})
.catch((err) => {
   console.error("Error connecting to MongoDB", err);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});
