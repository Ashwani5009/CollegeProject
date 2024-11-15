const express = require("express");
const axios = require("axios");
const Submission = require("../models/Submission");
const authMiddleware = require("../middlewares/authMiddleware")

const router = express.Router();

// Submit a new solution
router.post("/", async (req, res) => {
   const { user, problem, code, language } = req.body;

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
      newSubmission.status = submissionResult.status.description; // Update status based on the result

      // Handle result: output or error
      newSubmission.output = submissionResult.stdout || submissionResult.stderr;
      await newSubmission.save();

      // Respond with the submission result
      res.status(201).json(newSubmission);
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
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
