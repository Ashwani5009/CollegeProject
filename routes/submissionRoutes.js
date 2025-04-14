const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const Submission = require("../models/Submission");
const Problem = require("../models/Problem");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();
router.use(authMiddleware);

// Submit a new solution
router.post('/', async (req, res) => {
  console.log("New submission received", req.body);
  const { user, problem, code, language_id } = req.body;

  const userId = user?.$oid || user;
  const problemId = problem?.$oid || problem;

  try {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const problemObjectId = new mongoose.Types.ObjectId(problemId);

    const problemDoc = await Problem.findById(problemObjectId);
    if (!problemDoc) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const submission = new Submission({
      user: userObjectId,
      problem: problemObjectId,
      code,
      language_id,
      stdin: '',
    });

    const testResults = [];
    let allPassed = true;

    for (let index = 0; index < problemDoc.testCases.length; index++) {
      const testCase = problemDoc.testCases[index];
      console.log(`\n--- Test Case ${index + 1} ---`);
      console.log("Input:", testCase.input);
      console.log("Expected Output:", testCase.output);
      console.log("Code Submitted:\n", code);

      const judge0Response = await axios.post(
        "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
        {
          source_code: code,
          language_id: language_id,
          stdin: testCase.input,
        },
        {
          headers: {
            "x-rapidapi-key": "65014f04aamsh4305f63fb121ea9p11504djsnd02b4e0fcc43",
            "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
            "Content-Type": "application/json",
          },
        }
      );

      const { stdout, stderr, time, memory, status } = judge0Response.data;
      const actualOutput = (stdout || stderr || "").trim();
      const expectedOutput = (testCase.output || "").trim();
      const passed = actualOutput === expectedOutput;

      console.log("Actual Output:", actualOutput);
      console.log("Status Code:", status?.description);
      console.log("Test Passed:", passed);

      if (!passed) allPassed = false;

      testResults.push({
        input: testCase.input,
        expectedOutput,
        actualOutput,
        passed,
      });

      // Optional: break on first failure to save API usage
      // if (!passed) break;
    }

    submission.status = allPassed ? "Accepted" : "Wrong Answer";
    submission.output = JSON.stringify(testResults, null, 2);
    submission.execution_time = "N/A";
    submission.memory_usage = "N/A";
    submission.testResults = testResults;

    await submission.save();

    // Flattened response
    res.status(201).json({
      status: submission.status,
      output: submission.output,
      execution_time: submission.execution_time,
      memory_usage: submission.memory_usage,
      testResults: submission.testResults,
    });

  } catch (error) {
    console.error("Error creating or evaluating submission:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
