require("dotenv").config();
const mongoose = require("mongoose");
const Problem = require("./models/Problem");

const MONGO_URI = process.env.MONGO_URI;

const titles = [
"Two Sum","Kadane Maximum Subarray Sum","Move Zeroes","Sort Colors",
"Majority Element","Search Insert Position","Find Minimum in Rotated Sorted Array",
"Kth Missing Positive Number","Peak Index in Mountain Array","Allocate Books",
"Valid Parenthesis String","Is Subsequence","Longest Palindromic Substring",
"Remove Adjacent Duplicates","Longest Repeating Character Replacement",
"Add Two Numbers Linked List","Remove Duplicates Unsorted Linked List",
"Intersection of Two Linked Lists","Odd Even Linked List","Copy List with Random Pointer",
"N Queens","Sudoku Solver","Subset Sum","Permutations","Word Search",
"Next Greater Element Circular","Stock Span Problem","Simplify Path","Remove K Digits",
"Largest Rectangle in Histogram","Fruit Into Baskets","Longest Subarray Sum K",
"Subarrays with K Distinct","Max Consecutive Ones III","Longest Substring with K Distinct Characters",
"Lowest Common Ancestor","Diameter of Binary Tree","Balanced Binary Tree","Path Sum II",
"Zigzag Level Order Traversal","Number of Islands","Course Schedule","Dijkstra Shortest Path",
"Shortest Path in Matrix","Clone Graph","Coin Change 1","House Robber",
"Longest Increasing Subsequence","Partition Equal Subset Sum","Edit Distance"
];

async function run() {
  await mongoose.connect(MONGO_URI);

  const problems = await Problem.find({ title: { $in: titles } });

  for (let p of problems) {
    p.difficulty = 1;
    await p.save();
    console.log(`✅ set difficulty=1 → ${p.title}`);
  }
    
  console.log("🎉 Completed setting difficulty for all new problems");
  process.exit();
}

run();

