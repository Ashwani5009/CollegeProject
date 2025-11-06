// clean_visuals.js
require("dotenv").config();
const mongoose = require("mongoose");
const Problem = require("./models/Problem");

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ Missing MONGO_URI in .env file");
  process.exit(1);
}

async function run() {
  console.log("🔌 Connecting to MongoDB...");
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected:", mongoose.connection.name);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }

  const problems = await Problem.find(
    { extraDetailsHtml: { $regex: /<section class="sa-visuals"/i } },
    { title: 1, extraDetailsHtml: 1 }
  ).lean();

  console.log(`🧩 Found ${problems.length} problems with visuals to clean.`);

  if (problems.length === 0) {
    console.log("✅ Nothing to clean — database already clean!");
    process.exit(0);
  }

  let updated = 0;
  for (const p of problems) {
    const oldHtml = p.extraDetailsHtml || "";
    const newHtml = oldHtml.replace(/<section class="sa-visuals"[\s\S]*?<\/section>/gi, "").trim();

    if (newHtml !== oldHtml) {
      await Problem.updateOne({ _id: p._id }, { $set: { extraDetailsHtml: newHtml } });
      updated++;
      console.log(`🧼 Cleaned: ${p.title}`);
    }
  }

  console.log(`\n✨ Cleanup complete! Cleaned ${updated} problems.`);
  mongoose.connection.close();
  process.exit(0);
}

run();

