const mongoose = require("mongoose");
const Problem = require("./models/Problem");
const Topic = require("./models/Topic");

const seedProblems = async () => {
    await mongoose.connect("mongodb://localhost:27017/study-assistant");

    // Retrieve topics
    const stackTopic = await Topic.findOne({ name: "Stacks" });
    const queueTopic = await Topic.findOne({ name: "Queues" });

    const problems = [
        {
            title: "Implement Stack using Queue",
            description: "Implement a stack using one or more queues.",
            difficulty: "easy",
            topic: stackTopic._id,
            testCases: [{ input: "some input", output: "some output" }],
        },
        {
            title: "Priority Queue Implementation",
            description: "Implement a priority queue with enqueue and dequeue functions.",
            difficulty: "medium",
            topic: queueTopic._id,
            testCases: [{ input: "some input", output: "some output" }],
        },
        // Add more problems here
    ];

    await Problem.deleteMany({});
    await Problem.insertMany(problems);

    console.log("Problems seeded successfully");
    mongoose.connection.close();
};

seedProblems().catch(err => console.error(err));
