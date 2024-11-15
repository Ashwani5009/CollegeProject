const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Sign up route
router.post("/signup", async (req, res) => {
   const { username, password } = req.body;

   try {
      // Check if user already exists
      const userExists = await User.findOne({ username });
      if (userExists) {
         return res.status(400).json({ message: "User already exists" });
      }

      // Create a new user
      const user = new User({ username, password });
      await user.save();
      res.status(201).json({ message: "User created successfully" });
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
});

// Login route
router.post("/login", async (req, res) => {
   const { username, password } = req.body;

   try {
      const user = await User.findOne({ username });
      if (!user) {
         return res.status(400).json({ message: "Invalid username or password" });
      }

      // Compare password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
         return res.status(400).json({ message: "Invalid username or password" });
      }

      // Generate a JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
         expiresIn: "1h",
      });

      res.json({ message: "Login successful", token });
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
});

module.exports = router;

