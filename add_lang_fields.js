require("dotenv").config();
const mongoose = require("mongoose");
const Problem = require("./models/Problem");

const MONGO_URI = process.env.MONGO_URI;

async function run() {
  await mongoose.connect(MONGO_URI);

  const result = await Problem.updateMany(
    { difficulty: 1 },
    {
      $set: {
        cppCode: "// TODO: add C++ solution",
        javaCode: "// TODO: add Java solution",
        pythonCode: "# TODO: add Python solution",
      },
    }
  );

  // Compatibility across mongoose/mongodb versions
  const modified =
    result.modifiedCount ??
    result.nModified ??
    result.result?.nModified ??
    0;

  const matched =
    result.matchedCount ??
    result.n ??
    result.result?.n ??
    0;

  console.log(`✅ Matched ${matched} problems`);
  console.log(`✅ Updated ${modified} problems`);

  process.exit();
}

run();

