const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    input: { type: String, required: true },
    output: { type: String, required: true },
    constraints: { type: String, required: false },
    examples: [{ input: String, output: String }],
    topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
});

const Problem = mongoose.model('Problem', problemSchema);
module.exports = Problem;
