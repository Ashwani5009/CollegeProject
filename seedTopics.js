const mongoose = require("mongoose");
const Topic = require("./models/Topic");

const seedTopics = async () => {
    await mongoose.connect("mongodb://localhost:27017/study-assistant");
    console.log("Connected to MongoDB");

    const topics = [
        { name: "Stacks" },
        { name: "Queues" },
        { name: "Linked Lists" }
    ];

    await Topic.deleteMany({});
    await Topic.insertMany(topics);

    console.log("Topics seeded successfully");
    mongoose.connection.close();
};

seedTopics().catch(err => console.error(err));
