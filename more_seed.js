const mongoose = require("mongoose");
const Problem = require("./models/Problem");
const Topic = require("./models/Topic");

require("dotenv").config();
const MONGO_URI = process.env.MONGO_URI;

const moreProblems = [

/* -------------------- ARRAYS -------------------- */

{
  title: "Two Sum",
  description: "Find two numbers that add up to target.",
  input: "N followed by N integers and target.",
  output: "Indices or -1.",
  constraints: "1 <= N <= 1000",
  topicName: "Arrays",
  testCases: [
    { input: "4\n2 7 11 15\n9", output: "0 1" },
    { input: "3\n3 2 4\n6", output: "1 2" },
    { input: "3\n1 2 3\n7", output: "-1" }
  ]
},
{
  title: "Kadane Maximum Subarray Sum",
  description: "Find maximum subarray sum.",
  input: "N followed by N integers.",
  output: "Maximum sum.",
  constraints: "1 <= N <= 100000",
  topicName: "Arrays",
  testCases: [
    { input: "5\n-2 1 -3 4 -1", output: "4" },
    { input: "3\n1 2 3", output: "6" },
    { input: "4\n-1 -2 -3 -4", output: "-1" }
  ]
},
{
  title: "Move Zeroes",
  description: "Move all zeroes to end maintaining order.",
  input: "N followed by N integers.",
  output: "Modified array.",
  constraints: "1 <= N <= 1000",
  topicName: "Arrays",
  testCases: [
    { input: "5\n0 1 0 3 12", output: "1 3 12 0 0" },
    { input: "4\n1 2 3 4", output: "1 2 3 4" },
    { input: "3\n0 0 0", output: "0 0 0" }
  ]
},
{
  title: "Sort Colors",
  description: "Sort array of 0s, 1s, 2s.",
  input: "N followed by N integers.",
  output: "Sorted array.",
  constraints: "1 <= N <= 1000",
  topicName: "Arrays",
  testCases: [
    { input: "6\n2 0 2 1 1 0", output: "0 0 1 1 2 2" },
    { input: "3\n2 1 0", output: "0 1 2" },
    { input: "4\n1 1 1 1", output: "1 1 1 1" }
  ]
},
{
  title: "Majority Element",
  description: "Find element that appears more than N/2 times.",
  input: "N followed by N integers.",
  output: "Majority element.",
  constraints: "1 <= N <= 1000",
  topicName: "Arrays",
  testCases: [
    { input: "5\n3 2 3 3 2", output: "3" },
    { input: "3\n1 1 2", output: "1" },
    { input: "1\n5", output: "5" }
  ]
},

/* -------------------- BINARY SEARCH -------------------- */

{
  title: "Search Insert Position",
  description: "Return insert position of target in sorted array.",
  input: "N followed by sorted array and target.",
  output: "Index.",
  constraints: "1 <= N <= 1000",
  topicName: "Binary Search",
  testCases: [
    { input: "4\n1 3 5 6\n5", output: "2" },
    { input: "4\n1 3 5 6\n2", output: "1" },
    { input: "3\n1 2 3\n7", output: "3" }
  ]
},
{
  title: "Find Minimum in Rotated Sorted Array",
  description: "Find minimum element in rotated sorted array.",
  input: "N followed by array.",
  output: "Minimum element.",
  constraints: "1 <= N <= 1000",
  topicName: "Binary Search",
  testCases: [
    { input: "5\n3 4 5 1 2", output: "1" },
    { input: "5\n4 5 6 7 0", output: "0" },
    { input: "1\n10", output: "10" }
  ]
},
{
  title: "Kth Missing Positive Number",
  description: "Find Kth missing positive integer.",
  input: "N followed by N integers, then K.",
  output: "Kth missing positive integer.",
  constraints: "1 <= N <= 1000",
  topicName: "Binary Search",
  testCases: [
    { input: "5\n2 3 4 7 11\n5", output: "9" },
    { input: "3\n1 2 3\n1", output: "4" },
    { input: "4\n1 3 5 7\n2", output: "4" }
  ]
},
{
  title: "Peak Index in Mountain Array",
  description: "Find peak index in mountain array.",
  input: "N followed by array.",
  output: "Peak index.",
  constraints: "1 <= N <= 1000",
  topicName: "Binary Search",
  testCases: [
    { input: "4\n0 2 3 1", output: "2" },
    { input: "3\n0 10 5", output: "1" },
    { input: "5\n1 3 5 4 2", output: "2" }
  ]
},
{
  title: "Allocate Books",
  description: "Minimize max pages assigned to a student.",
  input: "N Students followed by N pages array and students count.",
  output: "Minimum pages.",
  constraints: "1 <= N <= 1000",
  topicName: "Binary Search",
  testCases: [
    { input: "4\n12 34 67 90\n2", output: "113" },
    { input: "3\n5 10 15\n2", output: "15" },
    { input: "1\n100\n1", output: "100" }
  ]
},

/* -------------------- STRINGS -------------------- */

{
  title: "Valid Parenthesis String",
  description: "Check if parentheses string is valid (* is wildcard).",
  input: "String.",
  output: "Yes or No.",
  constraints: "1 <= length <= 1000",
  topicName: "Strings",
  testCases: [
    { input: "()*", output: "Yes" },
    { input: "(*))", output: "Yes" },
    { input: ")*(", output: "No" }
  ]
},
{
  title: "Is Subsequence",
  description: "Check if first string is subsequence of second.",
  input: "Two strings.",
  output: "Yes or No.",
  constraints: "1 <= length <= 1000",
  topicName: "Strings",
  testCases: [
    { input: "abc\nahbgdc", output: "Yes" },
    { input: "axc\nahbgdc", output: "No" },
    { input: "a\na", output: "Yes" }
  ]
},
{
  title: "Longest Palindromic Substring",
  description: "Return longest palindrome substring.",
  input: "Single string.",
  output: "String.",
  constraints: "1 <= length <= 1000",
  topicName: "Strings",
  testCases: [
    { input: "babad", output: "bab" },
    { input: "cbbd", output: "bb" },
    { input: "a", output: "a" }
  ]
},
{
  title: "Remove Adjacent Duplicates",
  description: "Remove adjacent duplicate chars repeatedly.",
  input: "Single string.",
  output: "Result string.",
  constraints: "1 <= length <= 1000",
  topicName: "Strings",
  testCases: [
    { input: "abbaca", output: "ca" },
    { input: "azxxzy", output: "ay" },
    { input: "aaaa", output: "" }
  ]
},
{
  title: "Longest Repeating Character Replacement",
  description: "Find longest substring where at most K can be replaced.",
  input: "String and integer K.",
  output: "Length of longest substring.",
  constraints: "1 <= length <= 1000",
  topicName: "Strings",
  testCases: [
    { input: "AABABBA\n1", output: "4" },
    { input: "ABAB\n2", output: "4" },
    { input: "AAAA\n2", output: "4" }
  ]
},

/* -------------------- LINKED LIST -------------------- */

{
  title: "Add Two Numbers Linked List",
  description: "Add two numbers represented as linked lists.",
  input: "Two lists.",
  output: "Result list.",
  constraints: "1 <= N <= 1000",
  topicName: "Linked List",
  testCases: [
    { input: "3\n2 4 3\n3\n5 6 4", output: "7 0 8" },
    { input: "1\n0\n1\n0", output: "0" },
    { input: "2\n9 9\n1\n9", output: "8 0 1" }
  ]
},
{
  title: "Remove Duplicates Unsorted Linked List",
  description: "Remove duplicates from unsorted list.",
  input: "N followed by N integers.",
  output: "Updated list.",
  constraints: "1 <= N <= 1000",
  topicName: "Linked List",
  testCases: [
    { input: "6\n1 2 2 3 4 4", output: "1 2 3 4" },
    { input: "3\n1 1 1", output: "1" },
    { input: "4\n1 2 3 4", output: "1 2 3 4" }
  ]
},
{
  title: "Intersection of Two Linked Lists",
  description: "Find intersection node of two linked lists.",
  input: "Two linked lists.",
  output: "Value or -1.",
  constraints: "1 <= N <= 1000",
  topicName: "Linked List",
  testCases: [
    { input: "3\n4 1 8\n2\n9 8", output: "8" },
    { input: "2\n1 2\n2\n3 4", output: "-1" },
    { input: "1\n5\n1\n5", output: "5" }
  ]
},
{
  title: "Odd Even Linked List",
  description: "Group odd and even index nodes.",
  input: "N followed by N integers.",
  output: "Modified list.",
  constraints: "1 <= N <= 1000",
  topicName: "Linked List",
  testCases: [
    { input: "5\n1 2 3 4 5", output: "1 3 5 2 4" },
    { input: "4\n2 1 3 5", output: "2 3 1 5" },
    { input: "1\n7", output: "7" }
  ]
},
{
  title: "Copy List with Random Pointer",
  description: "Deep copy linked list with random pointer.",
  input: "Nodes with random references.",
  output: "Copied list.",
  constraints: "1 <= N <= 1000",
  topicName: "Linked List",
  testCases: [
    { input: "3\n7 13 11", output: "7 13 11" },
    { input: "1\n1", output: "1" },
    { input: "2\n1 2", output: "1 2" }
  ]
},

/* -------------------- RECURSION / BACKTRACKING -------------------- */

{
  title: "N Queens",
  description: "Solve N queens problem.",
  input: "Single integer N.",
  output: "Number of solutions.",
  constraints: "1 <= N <= 9",
  topicName: "Recursion",
  testCases: [
    { input: "4", output: "2" },
    { input: "1", output: "1" },
    { input: "5", output: "10" }
  ]
},
{
  title: "Sudoku Solver",
  description: "Solve Sudoku puzzle.",
  input: "9x9 grid.",
  output: "Solved grid.",
  constraints: "Fixed 9x9 input",
  topicName: "Recursion",
  testCases: [
    { input: "", output: "" },
    { input: "", output: "" },
    { input: "", output: "" }
  ]
},
{
  title: "Subset Sum",
  description: "Determine if subset with given sum exists.",
  input: "N followed by N integers and target.",
  output: "Yes or No.",
  constraints: "1 <= N <= 100",
  topicName: "Recursion",
  testCases: [
    { input: "4\n3 34 4 12\n9", output: "Yes" },
    { input: "4\n3 34 4 12\n30", output: "No" },
    { input: "3\n1 2 3\n4", output: "Yes" }
  ]
},
{
  title: "Permutations",
  description: "Return all permutations of array.",
  input: "N followed by N integers.",
  output: "Permutations.",
  constraints: "1 <= N <= 8",
  topicName: "Recursion",
  testCases: [
    { input: "3\n1 2 3", output: "6 permutations" },
    { input: "2\n1 2", output: "2 permutations" },
    { input: "1\n1", output: "1 permutation" }
  ]
},
{
  title: "Word Search",
  description: "Check if word exists in grid.",
  input: "Grid rows, cols and word.",
  output: "Yes or No.",
  constraints: "1 <= grid <= 6x6",
  topicName: "Recursion",
  testCases: [
    { input: "3 4\nA B C E\nS F C S\nA D E E\nABCCED", output: "Yes" },
    { input: "3 4\nA B C E\nS F C S\nA D E E\nSEE", output: "Yes" },
    { input: "3 4\nA B C E\nS F C S\nA D E E\nABCB", output: "No" }
  ]
},

/* -------------------- STACKS -------------------- */

{
  title: "Next Greater Element Circular",
  description: "For each element, find next greater in circular array.",
  input: "N followed by N integers.",
  output: "Next greater elements.",
  constraints: "1 <= N <= 1000",
  topicName: "Stacks",
  testCases: [
    { input: "3\n1 2 1", output: "2 -1 2" },
    { input: "4\n1 2 3 4", output: "2 3 4 -1" },
    { input: "3\n3 2 1", output: "-1 3 3" }
  ]
},
{
  title: "Stock Span Problem",
  description: "Find stock span for each day.",
  input: "N followed by N prices.",
  output: "Span values.",
  constraints: "1 <= N <= 1000",
  topicName: "Stacks",
  testCases: [
    { input: "7\n100 80 60 70 60 75 85", output: "1 1 1 2 1 4 6" },
    { input: "3\n30 20 10", output: "1 1 1" },
    { input: "3\n10 20 30", output: "1 2 3" }
  ]
},
{
  title: "Simplify Path",
  description: "Simplify given Unix path.",
  input: "String path.",
  output: "Simplified path.",
  constraints: "1 <= length <= 1000",
  topicName: "Stacks",
  testCases: [
    { input: "/home/", output: "/home" },
    { input: "/../", output: "/" },
    { input: "/a/./b/../../c/", output: "/c" }
  ]
},
{
  title: "Remove K Digits",
  description: "Remove K digits to get smallest number.",
  input: "Number string and K.",
  output: "Minimum number.",
  constraints: "1 <= digits <= 1000",
  topicName: "Stacks",
  testCases: [
    { input: "1432219\n3", output: "1219" },
    { input: "10200\n1", output: "200" },
    { input: "10\n2", output: "0" }
  ]
},
{
  title: "Largest Rectangle in Histogram",
  description: "Find largest rectangle in histogram.",
  input: "N followed by N heights.",
  output: "Max area.",
  constraints: "1 <= N <= 100000",
  topicName: "Stacks",
  testCases: [
    { input: "6\n2 1 5 6 2 3", output: "10" },
    { input: "3\n2 4 2", output: "4" },
    { input: "1\n5", output: "5" }
  ]
},

/* -------------------- SLIDING WINDOW -------------------- */

{
  title: "Fruit Into Baskets",
  description: "Max subarray with at most 2 distinct integers.",
  input: "N followed by N integers.",
  output: "Maximum fruits.",
  constraints: "1 <= N <= 100000",
  topicName: "Sliding Window",
  testCases: [
    { input: "5\n1 2 1 2 3", output: "4" },
    { input: "3\n1 2 3", output: "2" },
    { input: "4\n1 1 1 1", output: "4" }
  ]
},
{
  title: "Longest Subarray Sum K",
  description: "Find longest subarray with sum K (may have negatives).",
  input: "N K followed by N integers.",
  output: "Length.",
  constraints: "1 <= N <= 100000",
  topicName: "Sliding Window",
  testCases: [
    { input: "7 15\n10 5 2 7 1 9", output: "4" },
    { input: "3 3\n1 2 3", output: "2" },
    { input: "4 0\n1 -1 1 -1", output: "4" }
  ]
},
{
  title: "Subarrays with K Distinct",
  description: "Count subarrays with exactly K distinct integers.",
  input: "N K followed by N integers.",
  output: "Count.",
  constraints: "1 <= N <= 100000",
  topicName: "Sliding Window",
  testCases: [
    { input: "5 2\n1 2 1 2 3", output: "7" },
    { input: "5 1\n1 2 1 2 3", output: "5" },
    { input: "3 3\n1 2 3", output: "1" }
  ]
},
{
  title: "Max Consecutive Ones III",
  description: "Longest subarray of ones after flipping at most K zeroes.",
  input: "N K followed by N bits.",
  output: "Length.",
  constraints: "1 <= N <= 100000",
  topicName: "Sliding Window",
  testCases: [
    { input: "6 2\n1 0 1 1 0 1", output: "5" },
    { input: "5 1\n1 0 1 1 1", output: "5" },
    { input: "3 1\n0 0 0", output: "1" }
  ]
},
{
  title: "Longest Substring with K Distinct Characters",
  description: "Find length of longest substring with K distinct chars.",
  input: "String and K.",
  output: "Length.",
  constraints: "1 <= length <= 1000",
  topicName: "Sliding Window",
  testCases: [
    { input: "eceba\n2", output: "3" },
    { input: "aa\n1", output: "2" },
    { input: "aabbcc\n2", output: "4" }
  ]
},

/* -------------------- BINARY TREES -------------------- */

{
  title: "Lowest Common Ancestor",
  description: "Find LCA of two nodes.",
  input: "Tree and two values.",
  output: "LCA value.",
  constraints: "0 <= nodes <= 1000",
  topicName: "Binary Trees",
  testCases: [
    { input: "3\n2 3 1\n2 1", output: "2" },
    { input: "3\n1 2 3\n2 3", output: "1" },
    { input: "1\n1\n1 1", output: "1" }
  ]
},
{
  title: "Diameter of Binary Tree",
  description: "Find tree diameter.",
  input: "Array representation.",
  output: "Diameter.",
  constraints: "0 <= nodes <= 1000",
  topicName: "Binary Trees",
  testCases: [
    { input: "[1,2,3,4,5]", output: "3" },
    { input: "[1,2]", output: "1" },
    { input: "[]", output: "0" }
  ]
},
{
  title: "Balanced Binary Tree",
  description: "Check if binary tree height-balanced.",
  input: "Array representation.",
  output: "true or false.",
  constraints: "0 <= nodes <= 1000",
  topicName: "Binary Trees",
  testCases: [
    { input: "[3,9,20,null,null,15,7]", output: "true" },
    { input: "[1,2,2,3,3,null,null,4,4]", output: "false" },
    { input: "[]", output: "true" }
  ]
},
{
  title: "Path Sum II",
  description: "Find all root-to-leaf paths equal to sum.",
  input: "Tree and sum.",
  output: "Paths list.",
  constraints: "0 <= nodes <= 1000",
  topicName: "Binary Trees",
  testCases: [
    { input: "[5,4,8,11,null,13,4,7,2,null,null,5,1]\n22", output: "2 paths" },
    { input: "[1,2,3]\n5", output: "0 paths" },
    { input: "[]\n0", output: "0 paths" }
  ]
},
{
  title: "Zigzag Level Order Traversal",
  description: "Zigzag traversal of tree.",
  input: "Array tree.",
  output: "Traversal.",
  constraints: "0 <= nodes <= 1000",
  topicName: "Binary Trees",
  testCases: [
    { input: "[3,9,20,null,null,15,7]", output: "[[3],[20,9],[15,7]]" },
    { input: "[1]", output: "[[1]]" },
    { input: "[]", output: "[]" }
  ]
},

/* -------------------- GRAPH -------------------- */

{
  title: "Number of Islands",
  description: "Count number of islands in grid.",
  input: "Grid.",
  output: "Count.",
  constraints: "1 <= grid <= 50x50",
  topicName: "Graph",
  testCases: [
    { input: "4 5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1", output: "3" },
    { input: "1 1\n1", output: "1" },
    { input: "1 1\n0", output: "0" }
  ]
},
{
  title: "Course Schedule",
  description: "Detect cycle in directed graph.",
  input: "N edges list.",
  output: "true or false.",
  constraints: "0 <= nodes <= 1000",
  topicName: "Graph",
  testCases: [
    { input: "2\n0:1\n1:", output: "true" },
    { input: "2\n0:1\n1:0", output: "false" },
    { input: "1\n0:", output: "true" }
  ]
},
{
  title: "Dijkstra Shortest Path",
  description: "Find shortest path distances from source.",
  input: "Graph edges weights and source.",
  output: "Distance array.",
  constraints: "1 <= nodes <= 1000",
  topicName: "Graph",
  testCases: [
    { input: "5\n0:1,2 1:2,3 2:3,1 3:\n0", output: "0 2 5 6" },
    { input: "3\n0:1,1 1:2,1 2:\n0", output: "0 1 2" },
    { input: "1\n0:\n0", output: "0" }
  ]
},
{
  title: "Shortest Path in Matrix",
  description: "Shortest path in binary matrix.",
  input: "Grid.",
  output: "Length or -1.",
  constraints: "1 <= grid <= 50x50",
  topicName: "Graph",
  testCases: [
    { input: "3 3\n0 1 0\n0 0 0\n1 0 0", output: "4" },
    { input: "1 1\n1", output: "-1" },
    { input: "2 2\n0 0\n0 0", output: "2" }
  ]
},
{
  title: "Clone Graph",
  description: "Clone an undirected graph.",
  input: "Adj list.",
  output: "Cloned graph.",
  constraints: "1 <= nodes <= 1000",
  topicName: "Graph",
  testCases: [
    { input: "4\n1:2 2:1,3 3:2,4 4:3", output: "4 nodes cloned" },
    { input: "1\n1:", output: "1 node cloned" },
    { input: "0", output: "0" }
  ]
},

/* -------------------- DP -------------------- */

{
  title: "Coin Change 1",
  description: "Minimum coins to make amount.",
  input: "N coins, coin list and amount.",
  output: "Minimum coins or -1.",
  constraints: "1 <= N <= 100",
  topicName: "Dynamic Programming",
  testCases: [
    { input: "3\n1 2 5\n11", output: "3" },
    { input: "3\n2 3 4\n7", output: "-1" },
    { input: "1\n1\n0", output: "0" }
  ]
},
{
  title: "House Robber",
  description: "Max sum without robbing adjacent houses.",
  input: "N followed by N integers.",
  output: "Max money.",
  constraints: "1 <= N <= 1000",
  topicName: "Dynamic Programming",
  testCases: [
    { input: "4\n1 2 3 1", output: "4" },
    { input: "5\n2 7 9 3 1", output: "12" },
    { input: "1\n5", output: "5" }
  ]
},
{
  title: "Longest Increasing Subsequence",
  description: "Find LIS length.",
  input: "N followed by N integers.",
  output: "Length.",
  constraints: "1 <= N <= 1000",
  topicName: "Dynamic Programming",
  testCases: [
    { input: "6\n10 9 2 5 3 7 101 18", output: "4" },
    { input: "3\n1 2 3", output: "3" },
    { input: "4\n4 3 2 1", output: "1" }
  ]
},
{
  title: "Partition Equal Subset Sum",
  description: "Check if array can be split equal sum.",
  input: "N followed by N integers.",
  output: "Yes or No.",
  constraints: "1 <= N <= 200",
  topicName: "Dynamic Programming",
  testCases: [
    { input: "4\n1 5 11 5", output: "Yes" },
    { input: "3\n1 2 3", output: "Yes" },
    { input: "3\n1 2 5", output: "No" }
  ]
},
{
  title: "Edit Distance",
  description: "Compute min edit distance between strings.",
  input: "Two strings.",
  output: "Minimum operations.",
  constraints: "1 <= length <= 1000",
  topicName: "Dynamic Programming",
  testCases: [
    { input: "horse\nros", output: "3" },
    { input: "intention\nexecution", output: "5" },
    { input: "a\na", output: "0" }
  ]
}

];

const seedMoreProblems = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    for (const p of moreProblems) {
      const topic = await Topic.findOne({ name: p.topicName });
      if (!topic) {
        console.log(`❌ Topic not found: ${p.topicName}`);
        continue;
      }

      const exists = await Problem.findOne({ title: p.title });
      if (exists) {
        console.log(`⚠️ Skipped (exists): ${p.title}`);
        continue;
      }

      p.topic = topic._id;
      delete p.topicName;

      await Problem.create(p);
      console.log(`✅ Added: ${p.title}`);
    }

    console.log("🎉 Done seeding more problems");
    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Seed error:", err);
  }
};

seedMoreProblems();

