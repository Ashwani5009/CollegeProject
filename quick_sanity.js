// quick_sanity.js
require("dotenv").config();
const mongoose = require("mongoose");
const Problem = require("./models/Problem");

const MONGO_URI = process.env.MONGO_URI;

async function run() {
  await mongoose.connect(MONGO_URI);
  const docs = await Problem.find(
    { difficulty: 1 },
    { title: 1, cppCode: 1, javaCode: 1, pythonCode: 1 }
  )
    .limit(5)
    .lean();

  console.log("Sample:");
  docs.forEach(d => {
    console.log("—", d.title);
    console.log("  cpp:", d.cppCode ? "✓" : "✗", "| java:", d.javaCode ? "✓" : "✗", "| py:", d.pythonCode ? "✓" : "✗");
  });

  const counts = await Promise.all([
    Problem.countDocuments({ difficulty: 1, cppCode: { $exists: true, $ne: "" } }),
    Problem.countDocuments({ difficulty: 1, javaCode: { $exists: true, $ne: "" } }),
    Problem.countDocuments({ difficulty: 1, pythonCode: { $exists: true, $ne: "" } }),
  ]);

  console.log(`\nCounts (difficulty=1):`);
  console.log(`cppCode: ${counts[0]} | javaCode: ${counts[1]} | pythonCode: ${counts[2]}`);

  process.exit(0);
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});

