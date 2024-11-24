const express = require("express");
const axios = require("axios");
const Submission = require("../models/Submission");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Middleware to verify authentication
router.use(authMiddleware);  // Ensure the user is authenticated for all routes in this file

// Submit a new solution
router.post("/", async (req, res) => {
   const { user, problem, code, language } = req.body;

   // Validate that all required fields are provided
   if (!user || !problem || !code || !language) {
      return res.status(400).json({ message: "All fields (user, problem, code, language) are required" });
   }

   const submission = new Submission({
      user,
      problem,
      code,
      language,
      status: "Pending", // Initial status set to "Pending"
   });

   try {
      const newSubmission = await submission.save();

      // Prepare data for Judge0 API request
      const judge0Request = {
         source_code: code,
         language_id: getLanguageId(language), // Map language to Judge0 language ID
      };

      // Send code to Judge0 API for execution
      const judge0Response = await axios.post(
         "https://ce.judge0.com/submissions?base64_encoded=false&wait=true",
         judge0Request,
         {
            headers: {
               "Content-Type": "application/json",
            },
         }
      );

      const submissionResult = judge0Response.data;

      // Handle possible missing data in response
      if (!submissionResult.status || !submissionResult.stdout) {
         throw new Error("Invalid response from Judge0");
      }

      newSubmission.status = submissionResult.status.description; // Update status based on the result
      newSubmission.output = submissionResult.stdout || submissionResult.stderr;
      
      // Save the result
      await newSubmission.save();

      // Respond with the submission result
      res.status(201).json(newSubmission);
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while processing the submission: " + error.message });
   }
});

// Mapping language to Judge0 API language ID
function getLanguageId(language) {
   const languageMap = {
      "JavaScript": 102,  // JavaScript language ID
      "Python": 100,      // Python language ID
      "C++": 54,         // C++ language ID
      // Add more languages as needed
   };

   return languageMap[language] || 63; // Default to JavaScript if unknown
}

module.exports = router;
