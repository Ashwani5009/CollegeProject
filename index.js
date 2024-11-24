const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const problemRoutes = require("./routes/problemRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const topicRoutes = require("./routes/topicRoutes");
const path = require('path');
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const authRoutes = require('./routes/authRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/topics', topicRoutes);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the solve page for problem-solving
app.get('/solve/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'solve.html')); // Adjust path if needed
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI) 
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
