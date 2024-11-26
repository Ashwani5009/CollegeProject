const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const Submission = require("../models/Submission");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Middleware to verify authentication
router.use(authMiddleware);  // Ensure the user is authenticated for all routes in this file

// Submit a new solution
router.post('/', async (req, res) => {
  const { user, problem, code, language_id, stdin } = req.body;

  // If user and problem are passed as objects with $oid, extract the string value
  const userId = user && user.$oid ? user.$oid : user;  // Use $oid if available, else use the raw user value
  const problemId = problem && problem.$oid ? problem.$oid : problem;  // Same for problem

  try {
    // Convert user and problem to ObjectId correctly
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const problemObjectId = new mongoose.Types.ObjectId(problemId);

    // Create a new submission record
    const submission = new Submission({
      user: userObjectId,
      problem: problemObjectId,
      code,
      language_id,
      stdin,
    });

    // Save the submission to MongoDB
    await submission.save();

    // Send the code to Judge0 for evaluation
    const judge0Response = await axios.post(
      "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
      {
        source_code: code,
        language_id: language_id,
        stdin: stdin,
      },
      {
        headers: {
          "x-rapidapi-key": "65014f04aamsh4305f63fb121ea9p11504djsnd02b4e0fcc43",  // Replace with your actual RapidAPI key
          "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
          "Content-Type": "application/json",
        },
      }
    );

    // Ensure Judge0 response has necessary fields before updating the submission
    const { status, stdout, stderr, time, memory } = judge0Response.data;

    if (!status || !time || !memory) {
      throw new Error("Judge0 response is incomplete or malformed");
    }

    // Set submission status and results
    submission.status = status.description || "Unknown Status";
    submission.output = stderr || stdout || "No output";  // stderr takes priority if error exists
    submission.execution_time = time || "N/A";  // Default to "N/A" if time is missing
    submission.memory_usage = memory || "N/A";  // Default to "N/A" if memory is missing

    // Save the updated submission with execution results
    await submission.save();

    // Send the updated submission back to the frontend
    res.status(201).json({
      message: "Submission created and evaluated successfully",
      submission: {
        user: submission.user,
        problem: submission.problem,
        code: submission.code,
        language_id: submission.language_id,
        stdin: submission.stdin,
        status: submission.status,
        output: submission.output,
        execution_time: submission.execution_time,
        memory_usage: submission.memory_usage,
      },
    });
  } catch (error) {
    console.error('Error creating or evaluating submission:', error);
    res.status(500).json({ message: 'Error creating or evaluating submission', error: error.message });
  }
});

module.exports = router;
