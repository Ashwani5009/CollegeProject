// add_mermaid_diagrams_50.js
// Style D (combo), Format 3 (Mermaid), Examples: Yes
// Appends a "Visual Deep-Dive" section with 3 Mermaid diagrams per problem (difficulty=1)

require("dotenv").config();
const mongoose = require("mongoose");
const Problem = require("./models/Problem");

const MONGO_URI = process.env.MONGO_URI;
const DRY = (process.env.DRY_RUN || "false").toLowerCase() === "true";
const OVERWRITE_VISUALS = true; // true => replace visuals even if exist

// ---------- helpers ----------
function hasVisuals(html = "") {
  return /<section class="sa-visuals"/i.test(html);
}
function esc(s = "") {
  return String(s).replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// 🧹 new: make text Mermaid-safe
function safeMermaid(text = "") {
  // Preserve Mermaid structural syntax like A([Start])
  return String(text)
    // Escape HTML only (to avoid breaking browser)
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    // Remove problematic label characters only inside brackets or quotes
    .replace(/[\[\]\{\}]/g, (m) => ({ '[': '(', ']': ')', '{': '(', '}': ')' }[m]))
    .replace(/[,]/g, ' ')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\\/g, "/")
    .replace(/:/g, "‣");
}

function wrapBlock(title, mermaid) {
  return `
  <div class="sa-visual-block" style="margin:12px 0;">
    <h4 style="margin:0 0 6px 0;font-weight:600">${title}</h4>
    <div class="mermaid">
${safeMermaid(mermaid)}
    </div>
  </div>`;
}

function sectionWrap(content) {
  return `
<section class="sa-visuals" style="margin-top:16px">
  <details open>
    <summary style="cursor:pointer;font-weight:700">🧭 Visual Deep-Dive (Flow + State + Example)</summary>
    <div style="padding-top:10px">
      ${content}
    </div>
  </details>
</section>`;
}

// ---------- Example payloads ----------
const EX = {
  "Two Sum": { nums: [2, 7, 11, 15], target: 9 },
  "Kadane Maximum Subarray Sum": { nums: [-2, 1, -3, 4, -1, 2, 1, -5, 4] },
  "Move Zeroes": { nums: [0, 1, 0, 3, 12] },
  "Sort Colors": { nums: [2, 0, 2, 1, 1, 0] },
  "Majority Element": { nums: [2, 2, 1, 1, 1, 2, 2] },
  "Search Insert Position": { arr: [1, 3, 5, 6], target: 5 },
  "Find Minimum in Rotated Sorted Array": { arr: [4, 5, 6, 7, 0, 1, 2] },
  "Kth Missing Positive Number": { arr: [2, 3, 4, 7, 11], k: 5 },
  "Peak Index in Mountain Array": { arr: [0, 2, 3, 5, 3, 1] },
  "Allocate Books": { pages: [12, 34, 67, 90], students: 2 },
  "Add Two Numbers Linked List": { a: [2, 4, 3], b: [5, 6, 4] },
  "Lowest Common Ancestor": {
    nodes: ["3", "5", "1", "6", "2", "0", "8", "7", "4"],
    query: ["5", "1"],
  },
};

// ---------- Mermaid generators (examples only for clarity) ----------
function genArrayFlow(title) {
  if (title === "Two Sum") {
    return `flowchart TD
A([Start]) --> B[Loop i from 0..n-1]
B --> C{Is complement in map}
C -->|Yes| D[Return indices pos need i]
C -->|No| E[Store current number in map]
E --> B
D --> F([End])`;
  }
  if (title.includes("Kadane")) {
    return `flowchart TD
A([Start]) --> B[Initialize cur and best]
B --> C[Iterate through array]
C --> D{cur + x >= x}
D -->|Yes| E[cur = cur + x]
D -->|No| G[cur = x]
E --> H[best = max(best, cur)]
G --> H
H --> C
C --> Z([Return best])`;
  }
  return `flowchart TD
A([Start]) --> B[Generic loop or condition]
B --> C[Compute result]
C --> D([End])`;
}

function genArrayState(title, ex) {
  if (title === "Two Sum") {
    return `graph LR
subgraph Array
A0["[2,7,11,15]"]
end
subgraph Map
M0((empty))
end
A0 --> M1["Insert nums[0]=2"]
M1 --> M2["Check complement for 7"]
M2 --> M3["Found complement -> indices (0,1)"]`;
  }
  return `graph LR
A((State)) --> B((Update))`;
}

function genArrayExample(title) {
  if (title === "Two Sum") {
    return `flowchart LR
A["nums=[2,7,11,15], target=9"] --> B["Step 1: put 2→0"]
B --> C["Step 2: check 7, need=2 -> found"]
C --> D["Answer = (0,1)"]`;
  }
  return `flowchart LR
A[Example trace] --> B[Results]`;
}

function genBsearchFlow() {
  return `flowchart TD
A([Start]) --> B[l=0, r=n-1]
B --> C{l <= r}
C -->|No| Z([End])
C -->|Yes| D[m=(l+r)/2]
D --> E{Compare a[m] vs target}
E -->|lt| F[l=m+1]
E -->|gt| G[r=m-1]
E -->|eq| H[Found target]
F --> B
G --> B
H --> Z`;
}

function genTreeFlow() {
  return `flowchart TD
A([Start]) --> B{root==null || root==p||root==q}
B -->|Yes| C[Return root]
B -->|No| D[L=LCA(left)]
D --> E[R=LCA(right)]
E --> F{Both found?}
F -->|Yes| G[Return root]
F -->|No| H[Return non-null child]`;
}

// ---------- Category map ----------
const TYPE = {
  "Two Sum": "array",
  "Kadane Maximum Subarray Sum": "array",
  "Search Insert Position": "bsearch",
  "Lowest Common Ancestor": "tree",
};

// ---------- Builder ----------
function buildVisuals(title) {
  let flow = "", state = "", example = "";
  const ex = EX[title] || {};

  switch (TYPE[title]) {
    case "bsearch":
      flow = genBsearchFlow();
      state = "graph LR\nA((L))-->M((M))-->R((R))";
      example = "flowchart LR\nA[Example search]-->B[Found mid]";
      break;
    case "tree":
      flow = genTreeFlow();
      state = "graph TD\nroot-->left\nroot-->right";
      example = "flowchart LR\nA[DFS trace]-->B[Return LCA]";
      break;
    case "array":
    default:
      flow = genArrayFlow(title);
      state = genArrayState(title, ex);
      example = genArrayExample(title, ex);
  }

  // 🧼 sanitize for Mermaid v10
  const cleanedBlocks =
    wrapBlock("① Flowchart", flow) +
    wrapBlock("② State / Data Structure View", state) +
    wrapBlock("③ Example Walkthrough", example);

  const visualsSection = sectionWrap(cleanedBlocks);

  // 🧹 Remove any old <section class="sa-visuals"> blocks from HTML before re-adding
  return visualsSection;
}

// ---------- main ----------
async function run() {
  if (!MONGO_URI) {
    console.error("❌ Missing MONGO_URI in .env");
    process.exit(1);
  }
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected:", mongoose.connection.name);
  console.log(DRY ? "🔎 DRY RUN" : "✍️ WRITE mode");

  const problems = await Problem.find(
    { difficulty: 1 },
    { title: 1, extraDetailsHtml: 1 }
  ).lean();

  let updated = 0,
    skipped = 0;

  for (const p of problems) {
    const title = p.title || "";
    let html = p.extraDetailsHtml || "";
    if (hasVisuals(html) && !OVERWRITE_VISUALS) {
      skipped++;
      console.log(`⏭️ Skip (already has visuals): ${title}`);
      continue;
    }

    html = html.replace(/<section class="sa-visuals"[\s\S]*?<\/section>/gi, "");
    const visuals = buildVisuals(title);
    const newHtml = html + "\n\n" + visuals;

    if (DRY) {
      console.log(`🔎 Would update: ${title}`);
      continue;
    }

    const res = await Problem.updateOne(
      { _id: p._id },
      { $set: { extraDetailsHtml: newHtml } }
    );
    const mod = res.modifiedCount ?? res.nModified ?? 0;
    updated += mod;
    console.log(`✅ ${title} — visuals ${mod ? "added" : "unchanged"}`);
  }

  console.log(`\n📊 Summary`);
  console.log(`Updated visuals: ${updated}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Total processed: ${problems.length}`);
  process.exit(0);
}

run().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});

