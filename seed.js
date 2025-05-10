const mongoose = require('mongoose');
const Topic = require('./models/Topic');
const Problem = require('./models/Problem');

const MONGO_URI = 'mongodb+srv://ashwani:22001015009%40db@cluster0.se9jy.mongodb.net/study-assistant?retryWrites=true&w=majority';

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("MongoDB connected.");

    // Clear existing data (optional)
    await Topic.deleteMany({});
    await Problem.deleteMany({});

    // Create topics
    const topics = await Topic.insertMany([
      { name: "Arrays" },
      { name: "Stacks" },
      { name: "Queues" }
    ]);

    // Find the topic IDs
    const arraysTopic = topics.find(t => t.name === "Arrays");
    const stacksTopic = topics.find(t => t.name === "Stacks");

    // Create problems
    await Problem.insertMany([
      {
        title: "Find Maximum in Array",
        description: "Given an array, find the maximum element.",
        input: "An integer N followed by N integers",
        output: "Maximum integer",
        constraints: "1 <= N <= 1000",
        topic: arraysTopic._id,
        testCases: [
          { input: "5\n1 2 3 4 5", output: "5" },
          { input: "4\n-1 -22 3 0", output: "3" },
        ]
      },
      {
        title: "Valid Parentheses",
        description: "Check if the given string has valid parentheses.",
        input: "A string containing only '(', ')', '{', '}', '[' and ']'",
        output: "'true' or 'false'",
        constraints: "1 <= length <= 1000",
        topic: stacksTopic._id,
        testCases: [
          { input: "()[]{}", output: "true" },
          { input: "(]", output: "false" },
        ]
      }
    ]);

    console.log("Seeding completed.");
    mongoose.disconnect();
  } catch (err) {
    console.error("Error seeding:", err);
  }
};

seedData();
