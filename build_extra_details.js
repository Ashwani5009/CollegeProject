require("dotenv").config();
const mongoose = require("mongoose");
const Problem = require("./models/Problem");

const MONGO_URI = process.env.MONGO_URI;
const DRY = (process.env.DRY_RUN || process.env.DRY || "false").toLowerCase() === "true";

/** Escape HTML in code/text blocks */
function esc(s = "") {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Build the Examples block from testCases OR examples[] if available */
function buildExamplesBlock(p) {
  // Prefer testCases if present
  const tcs = Array.isArray(p.testCases) ? p.testCases.slice(0, 2) : [];
  if (tcs.length > 0) {
    return tcs
      .map((tc, i) => {
        const inp = esc(tc.input ?? "");
        const out = esc(tc.output ?? "");
        return `Example ${i + 1}:\nInput:\n${inp}\nOutput:\n${out}`;
      })
      .join("\n\n");
  }

  // Else use examples[] if present
  const exs = Array.isArray(p.examples) ? p.examples.slice(0, 2) : [];
  if (exs.length > 0) {
    return exs
      .map((e, i) => {
        const inp = esc(e.input ?? "");
        const out = esc(e.output ?? "");
        return `Example ${i + 1}:\nInput:\n${inp}\nOutput:\n${out}`;
      })
      .join("\n\n");
  }

  // Fallback
  return "Example:\nInput:\n<your input here>\nOutput:\n<your output here>";
}

/** Very small, generic ‘idea’ lines by topic-ish keywords (lightweight) */
function guessIdeaFromTitle(title = "") {
  const t = title.toLowerCase();
  if (t.includes("two sum")) return "Use a hash map (value → index) to find complements in one pass.";
  if (t.includes("kadane") || t.includes("maximum subarray")) return "Track current and best sums; reset current when it goes negative.";
  if (t.includes("move zero")) return "Two-pointer: compact non-zeros forward, then fill remaining with zeros.";
  if (t.includes("sort colors")) return "Dutch National Flag: three-way partition with low/mid/high pointers.";
  if (t.includes("majority element")) return "Boyer–Moore voting: track candidate and count.";
  if (t.includes("search insert") || t.includes("find minimum") || t.includes("kth missing") || t.includes("peak index"))
    return "Binary search on positions/answers with proper mid conditions.";
  if (t.includes("valid parenthesis") || t.includes("stock span") || t.includes("next greater") || t.includes("simplify path"))
    return "Use a stack to maintain monotonic structure or canonical path components.";
  if (t.includes("longest palindromic substring")) return "Expand around centers (O(n^2)) or Manacher (O(n)).";
  if (t.includes("remove adjacent duplicates")) return "Stack-like process: pop when current equals top.";
  if (t.includes("repeating character replacement")) return "Sliding window with frequency & max-frequency to keep window valid.";
  if (t.includes("subarray") || t.includes("substring")) return "Sliding window / prefix sums depending on constraints.";
  if (t.includes("linked list")) return "Careful pointer manipulation with dummy nodes where appropriate.";
  if (t.includes("n queens") || t.includes("sudoku") || t.includes("permutation") || t.includes("subset"))
    return "Backtracking with pruning and state tracking (rows/cols/boxes or used sets).";
  if (t.includes("tree")) return "DFS with returns carrying height/paths; consider post-order for path/depth checks.";
  if (t.includes("islands") || t.includes("course schedule") || t.includes("clone graph")) return "Graph traversal (DFS/BFS) or topological ordering using indegrees.";
  if (t.includes("dijkstra")) return "Min-heap (priority queue) with relaxation to compute shortest paths.";
  if (t.includes("coin change")) return "Classic DP: unbounded knapsack style on amount.";
  if (t.includes("house robber")) return "DP: choose current + dp[i-2] or skip to dp[i-1].";
  if (t.includes("lis")) return "Greedy + binary search on tails array.";
  if (t.includes("partition equal subset")) return "Subset-sum DP up to total/2.";
  if (t.includes("edit distance")) return "DP on prefixes with insert/delete/replace transitions.";
  return "Use the canonical data structure/technique for this pattern (hashing, two-pointers, stack, BFS/DFS, DP, or binary search).";
}

/** Very rough complexity guessers (safe defaults) */
function guessComplexity(title = "") {
  const t = title.toLowerCase();
  let time = "O(N)";
  let space = "O(1)";

  if (t.includes("two sum")) { time = "O(N)"; space = "O(N)"; }
  else if (t.includes("kadane") || t.includes("move zeroes") || t.includes("majority element")) { time = "O(N)"; space = "O(1)"; }
  else if (t.includes("sort colors")) { time = "O(N)"; space = "O(1)"; }
  else if (t.includes("search insert")) { time = "O(log N)"; space = "O(1)"; }
  else if (t.includes("find minimum in rotated") || t.includes("kth missing") || t.includes("peak index")) { time = "O(log N)"; space = "O(1)"; }
  else if (t.includes("valid parenthesis") || t.includes("stock span") || t.includes("next greater") || t.includes("simplify path"))
    { time = "O(N)"; space = "O(N)"; }
  else if (t.includes("remove k digits")) { time = "O(N)"; space = "O(N)"; }
  else if (t.includes("largest rectangle")) { time = "O(N)"; space = "O(N)"; }
  else if (t.includes("fruit into baskets") || t.includes("subarray") || t.includes("substring")) { time = "O(N)"; space = "O(K)"; }
  else if (t.includes("n queens") || t.includes("sudoku") || t.includes("permutation") || t.includes("subset"))
    { time = "Exponential (backtracking)"; space = "O(N)" }
  else if (t.includes("lowest common ancestor") || t.includes("diameter") || t.includes("balanced") || t.includes("path sum") || t.includes("zigzag"))
    { time = "O(N)"; space = "O(H)"; }
  else if (t.includes("islands")) { time = "O(R*C)"; space = "O(R*C) worst-case recursion/queue"; }
  else if (t.includes("course schedule")) { time = "O(N+E)"; space = "O(N+E)"; }
  else if (t.includes("dijkstra")) { time = "O((N+E) log N)"; space = "O(N)"; }
  else if (t.includes("shortest path in matrix")) { time = "O(N^2)"; space = "O(N^2)"; }
  else if (t.includes("clone graph")) { time = "O(N+E)"; space = "O(N)"; }
  else if (t.includes("coin change")) { time = "O(N*T)"; space = "O(T)"; }
  else if (t.includes("house robber")) { time = "O(N)"; space = "O(1)"; }
  else if (t.includes("longest increasing subsequence")) { time = "O(N log N)"; space = "O(N)"; }
  else if (t.includes("partition equal subset")) { time = "O(N*S)"; space = "O(S)"; }
  else if (t.includes("edit distance")) { time = "O(N*M)"; space = "O(N*M)"; }

  return { time, space };
}

/** Build final extraDetailsHtml for a single problem doc */
function buildHtml(p) {
  const desc = esc(p.description || "");
  const examples = buildExamplesBlock(p);
  const idea = guessIdeaFromTitle(p.title || "");
  const { time, space } = guessComplexity(p.title || "");

  const cpp = esc(p.cppCode || "// TODO: add C++ solution");
  const java = esc(p.javaCode || "// TODO: add Java solution");
  const py = esc(p.pythonCode || "# TODO: add Python solution");

  return `
<div style="max-width:900px;margin:auto;padding:20px;background:#fff;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.1);font-family:Segoe UI,Tahoma,sans-serif;color:#333">

  <h2 style="margin-bottom:10px;">Problem Statement</h2>
  <p>${desc}</p>

  <h3 style="margin-top:20px;">Examples</h3>
  <pre style="background:#f8f9fa;padding:14px;border-radius:8px;border:1px solid #ddd;font-size:14px;white-space:pre-wrap">${examples}</pre>

  <h3 style="margin-top:20px;">Solution Approach</h3>
  <p><strong>Idea:</strong> ${esc(idea)}</p>

  <h3>Solution Code</h3>

  <h4>C++</h4>
  <pre style="background:#f8f9fa;padding:14px;border-radius:8px;border:1px solid #ddd;overflow-x:auto"><code>${cpp}</code></pre>

  <h4>Java</h4>
  <pre style="background:#f8f9fa;padding:14px;border-radius:8px;border:1px solid #ddd;overflow-x:auto"><code>${java}</code></pre>

  <h4>Python</h4>
  <pre style="background:#f8f9fa;padding:14px;border-radius:8px;border:1px solid #ddd;overflow-x:auto"><code>${py}</code></pre>

  <h3>Complexity</h3>
  <p><strong>Time Complexity:</strong> ${esc(time)}</p>
  <p><strong>Space Complexity:</strong> ${esc(space)}</p>
</div>
`.trim();
}

async function run() {
  if (!MONGO_URI) {
    console.error("❌ Missing MONGO_URI in .env");
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI);
  const name = mongoose.connection.name;
  console.log("✅ Connected to DB:", name);
  console.log(DRY ? "🔎 DRY_RUN mode (no writes)" : "✍️  WRITE mode");

  // Only the new 50 we tagged
  const problems = await Problem.find({ difficulty: 1 }).lean();

  console.log(`Found ${problems.length} problems with difficulty=1`);
  if (problems.length === 0) {
    console.log("Nothing to do.");
    process.exit(0);
  }

  let updated = 0;

  for (const p of problems) {
    const html = buildHtml(p);

    if (DRY) {
      console.log(`--- [DRY] Would update: ${p.title} (${p._id}) ---`);
      console.log(html.slice(0, 300) + "...\n");
      continue;
    }

    const res = await Problem.updateOne(
      { _id: p._id },
      { $set: { extraDetailsHtml: html } }
    );

    const mod =
      res.modifiedCount ?? res.nModified ?? res.result?.nModified ?? 0;

    updated += mod;
    console.log(`✅ Updated ${p.title} (${mod})`);
  }

  console.log(DRY ? "🔎 DRY run complete." : `🎉 Done. Updated ${updated} documents.`);
  process.exit(0);
}

run().catch((e) => {
  console.error("Error:", e);
  process.exit(1);
});

