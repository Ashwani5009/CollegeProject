const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const problemRoutes = require("./routes/problemRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const authRoutes = require('./routes/authRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/submissions', submissionRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI) 
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
