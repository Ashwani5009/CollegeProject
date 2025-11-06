const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    input: { type: String, required: true },
    output: { type: String, required: true },
    constraints: { type: String, required: false },
    extraDetailsHtml : { type: String, default: ""},
    cppCode: { type: String, default: "" },
    javaCode: { type: String, default: "" },
    pythonCode: { type: String, default: "" },
    examples: [{ input: String, output: String }],
    testCases: [{ input: String, output: String }],
    topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
    difficulty: { type: Number, default: 1},
});

const Problem = mongoose.model('Problem', problemSchema);
module.exports = Problem;
