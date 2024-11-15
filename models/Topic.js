const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema({
    name: { type: String, required: true },  // Topic name, e.g., "Stacks", "Queues"
});

const Topic = mongoose.model("Topic", topicSchema);
module.exports = Topic;
