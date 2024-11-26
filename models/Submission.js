const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
   user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Updated to ObjectId
   problem: { type: mongoose.Schema.Types.ObjectId, ref: "Problem", required: true },
   code: { type: String, required: true },
   language_id: { type: Number, required: true }, // Updated to use language_id
   status: { type: String, default: "Pending" },
   output: { type: String, default: "" },
   execution_time: { type: String, default: "" },  // To store execution time
  memory_usage: { type: String, default: "" },execution_time: { type: String, default: "" },
  memory_usage: { type: String, default: "" },
   createdAt: { type: Date, default: Date.now },
});

const Submission = mongoose.model("Submission", submissionSchema);

module.exports = Submission;
