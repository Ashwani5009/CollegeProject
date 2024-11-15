const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
   user: { type: String, required: true },
   problem: { type: mongoose.Schema.Types.ObjectId, ref: "Problem", required: true },
   code: { type: String, required: true },
   language: { type: String, required: true },
   status: { type: String, default: "Pending" },
   output: { type: String, default: "" },
   createdAt: { type: Date, default: Date.now },
});

const Submission = mongoose.model("Submission", submissionSchema);

module.exports = Submission;
