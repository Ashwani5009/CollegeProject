// populate_lang_fields_from_map.js

const OVERWRITE = true;
require("dotenv").config();
const mongoose = require("mongoose");
const Problem = require("./models/Problem");
const CODE_MAP = require("./code_map_50.js");

const MONGO_URI = process.env.MONGO_URI;
const DRY = (process.env.DRY_RUN || "false").toLowerCase() === "true";

function normalizeTitle(s = "") {
  return s.trim().replace(/\s+/g, " ").toLowerCase();
}

async function run() {
  if (!MONGO_URI) {
    console.error("❌ Missing MONGO_URI in .env");
    process.exit(1);
  }

  // Build normalized lookup
  const mapByNorm = {};
  for (const [title, obj] of Object.entries(CODE_MAP)) {
    const norm = normalizeTitle(title);
    mapByNorm[norm] = {
      cpp: obj.cpp || "",
      java: obj.java || "",
      py: obj.py || "",
    };
  }

  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected:", mongoose.connection.name);
  console.log(DRY ? "🔎 DRY RUN" : "✍️ WRITE mode");

  // Fetch only new 50
  const problems = await Problem.find({ difficulty: 1 }).lean();
  console.log(`Found ${problems.length} problems with difficulty=1`);

  let matched = 0, updated = 0;
  const missingTitles = [];

  for (const p of problems) {
    const norm = normalizeTitle(p.title);
    const entry = mapByNorm[norm];

    if (!entry) {
      missingTitles.push(p.title);
      continue;
    }

    matched++;

    // Fetch existing doc for overwrite logic
    const doc = await Problem.findById(p._id).lean();

    const setFields = {};
    if (OVERWRITE || !doc.cppCode) setFields.cppCode = entry.cpp;
    if (OVERWRITE || !doc.javaCode) setFields.javaCode = entry.java;
    if (OVERWRITE || !doc.pythonCode) setFields.pythonCode = entry.py;

    if (Object.keys(setFields).length === 0) {
      console.log(`⚠️ ${p.title} — skipped (already filled)`); 
      continue;
    }

    if (DRY) {
      console.log(`🔎 [DRY] Would update: ${p.title}`);
      console.log(setFields);
      continue;
    }

    const result = await Problem.updateOne(
      { _id: p._id },
      { $set: setFields }
    );

    const mod = result.modifiedCount ?? result.nModified ?? 0;
    updated += mod;

    console.log(`✅ ${p.title} — updated: ${mod}`);
  }

  console.log(`\n📊 Summary`);
  console.log(`Matched: ${matched}/${problems.length}`);
  console.log(`Updated docs: ${updated}`);

  if (missingTitles.length) {
    console.log("\n⚠️ Missing in CODE_MAP:");
    missingTitles.forEach(t => console.log(" - " + t));
  }

  process.exit(0);
}

run().catch(err => {
  console.error("❌ Error:", err);
  process.exit(1);
});

