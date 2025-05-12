const mongoose = require('mongoose');
const Topic = require('./models/Topic');
const Problem = require('./models/Problem');

const MONGO_URI = 'mongodb+srv://ashwani:22001015009%40db@cluster0.se9jy.mongodb.net/study-assistant?retryWrites=true&w=majority';

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("MongoDB connected.");

    await Topic.deleteMany({});
    await Problem.deleteMany({});

    const topicNames = [
      "Arrays",
      "Binary Search",
      "Strings",
      "Linked List",
      "Recursion",
      "Stacks",
      "Sliding Window",
      "Binary Trees",
      "Graph",
      "Dynamic Programming"
    ];

    const topics = await Topic.insertMany(topicNames.map(name => ({ name })));
    const topicMap = {};
    topics.forEach(topic => topicMap[topic.name] = topic._id);

    const problems = [
      // Arrays
      {
        title: "Find Maximum in Array",
        description: "Find the maximum element in the array.",
        input: "N followed by N integers.",
        output: "Maximum integer.",
        constraints: "1 <= N <= 1000",
        topic: topicMap["Arrays"],
        testCases: [
          { input: "5\n1 2 3 4 5", output: "5" },
          { input: "4\n-1 -22 3 0", output: "3" },
          { input: "3\n10 20 30", output: "30" }
        ]
      },
      {
        title: "Sum of Array Elements",
        description: "Sum all elements in the array.",
        input: "N followed by N integers.",
        output: "Sum.",
        constraints: "1 <= N <= 1000",
        topic: topicMap["Arrays"],
        testCases: [
          { input: "5\n1 2 3 4 5", output: "15" },
          { input: "3\n-1 -2 -3", output: "-6" },
          { input: "4\n10 20 30 40", output: "100" }
        ]
      },
      {
        title: "Reverse Array",
        description: "Reverse the array elements.",
        input: "N followed by N integers.",
        output: "Reversed array.",
        constraints: "1 <= N <= 1000",
        topic: topicMap["Arrays"],
        testCases: [
          { input: "5\n1 2 3 4 5", output: "5 4 3 2 1" },
          { input: "3\n10 20 30", output: "30 20 10" },
          { input: "4\n-1 -2 -3 -4", output: "-4 -3 -2 -1" }
        ]
      },
      {
        title: "Find Duplicate Elements",
        description: "Find duplicates in the array.",
        input: "N followed by N integers.",
        output: "Duplicates or 'No duplicates'.",
        constraints: "1 <= N <= 1000",
        topic: topicMap["Arrays"],
        testCases: [
          { input: "6\n1 2 3 2 4 1", output: "1 2" },
          { input: "5\n5 5 5 5 5", output: "5" },
          { input: "4\n1 2 3 4", output: "No duplicates" }
        ]
      },
      {
        title: "Merge Two Sorted Arrays",
        description: "Merge two sorted arrays.",
        input: "N M followed by N integers and M integers.",
        output: "Merged array.",
        constraints: "1 <= N, M <= 1000",
        topic: topicMap["Arrays"],
        testCases: [
          { input: "3 3\n1 3 5\n2 4 6", output: "1 2 3 4 5 6" },
          { input: "2 2\n-1 0\n1 2", output: "-1 0 1 2" },
          { input: "4 3\n1 2 3 4\n5 6 7", output: "1 2 3 4 5 6 7" }
        ]
      },

      // Binary Search
      {
        title: "Binary Search in Array",
        description: "Find index of target using binary search.",
        input: "N followed by N sorted integers and target.",
        output: "Index or -1.",
        constraints: "1 <= N <= 1000",
        topic: topicMap["Binary Search"],
        testCases: [
          { input: "5\n1 2 3 4 5\n3", output: "2" },
          { input: "4\n10 20 30 40\n25", output: "-1" },
          { input: "6\n5 10 15 20 25 30\n30", output: "5" }
        ]
      },
      {
        title: "First Occurrence of Element",
        description: "Find first occurrence of element.",
        input: "N followed by sorted array and target.",
        output: "First index or -1.",
        constraints: "1 <= N <= 1000",
        topic: topicMap["Binary Search"],
        testCases: [
          { input: "6\n1 2 2 2 3 4\n2", output: "1" },
          { input: "5\n5 5 5 5 5\n5", output: "0" },
          { input: "4\n1 3 5 7\n4", output: "-1" }
        ]
      },
      {
        title: "Find Peak Element",
        description: "Find any peak element's index.",
        input: "N followed by array.",
        output: "Peak index.",
        constraints: "1 <= N <= 1000",
        topic: topicMap["Binary Search"],
        testCases: [
          { input: "5\n1 2 3 1 0", output: "2" },
          { input: "3\n1 3 2", output: "1" },
          { input: "4\n10 20 15 5", output: "1" }
        ]
      },
      {
        title: "Floor of Square Root",
        description: "Find floor of square root of N.",
        input: "Single integer N.",
        output: "Floor sqrt(N).",
        constraints: "1 <= N <= 10^6",
        topic: topicMap["Binary Search"],
        testCases: [
          { input: "10", output: "3" },
          { input: "25", output: "5" },
          { input: "8", output: "2" }
        ]
      },
      {
        title: "Search in Rotated Array",
        description: "Find target in rotated array.",
        input: "N followed by array and target.",
        output: "Index or -1.",
        constraints: "1 <= N <= 1000",
        topic: topicMap["Binary Search"],
        testCases: [
          { input: "7\n4 5 6 7 0 1 2\n0", output: "4" },
          { input: "5\n6 7 8 9 1\n8", output: "2" },
          { input: "6\n10 20 30 40 50 5\n5", output: "5" }
        ]
      },

      // Strings
      {
        title: "Check Palindrome",
        description: "Check if string is palindrome.",
        input: "Single string.",
        output: "Yes or No.",
        constraints: "1 <= Length <= 1000",
        topic: topicMap["Strings"],
        testCases: [
          { input: "racecar", output: "Yes" },
          { input: "hello", output: "No" },
          { input: "madam", output: "Yes" }
        ]
      },
      {
        title: "Reverse a String",
        description: "Reverse given string.",
        input: "Single string.",
        output: "Reversed string.",
        constraints: "1 <= Length <= 1000",
        topic: topicMap["Strings"],
        testCases: [
          { input: "hello", output: "olleh" },
          { input: "world", output: "dlrow" },
          { input: "abc", output: "cba" }
        ]
      },
      {
        title: "Count Vowels",
        description: "Count vowels in string.",
        input: "Single string.",
        output: "Number of vowels.",
        constraints: "1 <= Length <= 1000",
        topic: topicMap["Strings"],
        testCases: [
          { input: "hello", output: "2" },
          { input: "aeiou", output: "5" },
          { input: "xyz", output: "0" }
        ]
      },
      {
        title: "Longest Common Prefix",
        description: "Find longest common prefix of strings.",
        input: "N followed by N strings.",
        output: "Common prefix.",
        constraints: "1 <= N <= 1000",
        topic: topicMap["Strings"],
        testCases: [
          { input: "3\nflower\nflow\nflight", output: "fl" },
          { input: "2\nhello\nhell", output: "hell" },
          { input: "2\nabc\ndef", output: "" }
        ]
      },
      {
        title: "Check Anagrams",
        description: "Check if two strings are anagrams.",
        input: "Two strings.",
        output: "Yes or No.",
        constraints: "1 <= Length <= 1000",
        topic: topicMap["Strings"],
        testCases: [
          { input: "listen\nsilent", output: "Yes" },
          { input: "hello\nbello", output: "No" },
          { input: "triangle\nintegral", output: "Yes" }
        ]
      },

      // Linked List
      {
        title: "Find Middle of Linked List",
        description: "Find the middle node of a singly linked list.",
        input: "N followed by N integers representing nodes.",
        output: "Middle node value.",
        constraints: "1 <= N <= 1000",
        topic: topicMap["Linked List"],
        testCases: [
          { input: "5\n1 2 3 4 5", output: "3" },
          { input: "4\n1 2 3 4", output: "2" },
          { input: "3\n10 20 30", output: "20" }
        ]
      },
      {
        title: "Reverse Linked List",
        description: "Reverse a singly linked list.",
        input: "N followed by N integers.",
        output: "Reversed list.",
        constraints: "1 <= N <= 1000",
        topic: topicMap["Linked List"],
        testCases: [
          { input: "5\n1 2 3 4 5", output: "5 4 3 2 1" },
          { input: "3\n10 20 30", output: "30 20 10" },
          { input: "4\n7 8 9 10", output: "10 9 8 7" }
        ]
      },
      {
        title: "Detect Cycle in Linked List",
        description: "Detect if there is a cycle in linked list.",
        input: "N followed by N integers and a position to form cycle (-1 if no cycle).",
        output: "Yes or No.",
        constraints: "1 <= N <= 1000",
        topic: topicMap["Linked List"],
        testCases: [
          { input: "3\n1 2 3\n-1", output: "No" },
          { input: "4\n1 2 3 4\n1", output: "Yes" },
          { input: "5\n1 2 3 4 5\n-1", output: "No" }
        ]
      },
      {
        title: "Merge Two Sorted Linked Lists",
        description: "Merge two sorted linked lists into one sorted list.",
        input: "N M followed by N and M integers.",
        output: "Merged sorted list.",
        constraints: "1 <= N, M <= 1000",
        topic: topicMap["Linked List"],
        testCases: [
          { input: "3 3\n1 3 5\n2 4 6", output: "1 2 3 4 5 6" },
          { input: "2 2\n5 10\n1 7", output: "1 5 7 10" },
          { input: "4 1\n2 4 6 8\n5", output: "2 4 5 6 8" }
        ]
      },
      {
        title: "Remove Nth Node from End",
        description: "Remove the nth node from the end of list.",
        input: "N followed by N integers and an integer n.",
        output: "Updated list.",
        constraints: "1 <= N <= 1000",
        topic: topicMap["Linked List"],
        testCases: [
          { input: "5\n1 2 3 4 5\n2", output: "1 2 3 5" },
          { input: "3\n1 2 3\n1", output: "1 2" },
          { input: "4\n7 8 9 10\n4", output: "8 9 10" }
        ]
      },

      // Recursion
      {
        title: "Factorial Using Recursion",
        description: "Find factorial of a number using recursion.",
        input: "Single integer n.",
        output: "Factorial of n.",
        constraints: "0 <= n <= 15",
        topic: topicMap["Recursion"],
        testCases: [
          { input: "5", output: "120" },
          { input: "0", output: "1" },
          { input: "3", output: "6" }
        ]
      },
      {
        title: "Fibonacci Number",
        description: "Find nth Fibonacci number using recursion.",
        input: "Single integer n.",
        output: "nth Fibonacci number.",
        constraints: "0 <= n <= 20",
        topic: topicMap["Recursion"],
        testCases: [
          { input: "5", output: "5" },
          { input: "0", output: "0" },
          { input: "6", output: "8" }
        ]
      },
      {
        title: "Power Function",
        description: "Calculate a^b using recursion.",
        input: "Two integers a and b.",
        output: "Result.",
        constraints: "0 <= a, b <= 20",
        topic: topicMap["Recursion"],
        testCases: [
          { input: "2 3", output: "8" },
          { input: "5 0", output: "1" },
          { input: "3 4", output: "81" }
        ]
      },
      {
        title: "Sum of Digits",
        description: "Find sum of digits of a number recursively.",
        input: "Single integer n.",
        output: "Sum of digits.",
        constraints: "0 <= n <= 10^6",
        topic: topicMap["Recursion"],
        testCases: [
          { input: "123", output: "6" },
          { input: "456", output: "15" },
          { input: "0", output: "0" }
        ]
      },
      {
        title: "Print N to 1",
        description: "Print numbers from N to 1 using recursion.",
        input: "Single integer N.",
        output: "Numbers from N to 1.",
        constraints: "1 <= N <= 100",
        topic: topicMap["Recursion"],
        testCases: [
          { input: "5", output: "5 4 3 2 1" },
          { input: "3", output: "3 2 1" },
          { input: "1", output: "1" }
        ]
      },

      // Stacks
      {
        title: "Next Greater Element",
        description: "Find next greater element for each element in array.",
        input: "N followed by N integers.",
        output: "Array of next greater elements (-1 if none).",
        constraints: "1 <= N <= 1000",
        topic: topicMap["Stacks"],
        testCases: [
          { input: "4\n4 5 2 25", output: "5 25 25 -1" },
          { input: "3\n13 7 6", output: "-1 -1 -1" },
          { input: "5\n1 3 2 4 6", output: "3 4 4 6 -1" }
        ]
      },
      {
        title: "Implement Stack using Array",
        description: "Implement push and pop operations using array.",
        input: "Series of operations (push x / pop).",
        output: "Result after each pop.",
        constraints: "1 <= operations <= 1000",
        topic: topicMap["Stacks"],
        testCases: [
          { input: "5\npush 1\npush 2\npop\npush 3\npop", output: "2 3" },
          { input: "4\npush 5\npush 6\npop\npop", output: "6 5" },
          { input: "3\npush 10\npop\npop", output: "10 Empty" }
        ]
      },
      {
        title: "Balanced Brackets",
        description: "Check if brackets are balanced.",
        input: "A string of brackets.",
        output: "Yes or No.",
        constraints: "1 <= length <= 1000",
        topic: topicMap["Stacks"],
        testCases: [
          { input: "{[()]}", output: "Yes" },
          { input: "{[(])}", output: "No" },
          { input: "{{[[(())]]}}", output: "Yes" }
        ]
      },
      {
        title: "Min Stack",
        description: "Design a stack that supports getMin in O(1).",
        input: "push x / pop / getMin operations.",
        output: "Result for getMin.",
        constraints: "1 <= operations <= 1000",
        topic: topicMap["Stacks"],
        testCases: [
          { input: "5\npush 5\npush 3\ngetMin\npop\ngetMin", output: "3 5" },
          { input: "4\npush 1\npush 2\ngetMin\ngetMin", output: "1 1" },
          { input: "3\npush 7\npop\ngetMin", output: "Empty" }
        ]
      },
      {
        title: "Evaluate Reverse Polish Notation",
        description: "Evaluate RPN expressions.",
        input: "Tokens of RPN expression.",
        output: "Evaluated result.",
        constraints: "1 <= tokens <= 100",
        topic: topicMap["Stacks"],
        testCases: [
          { input: "5\n2 1 + 3 *", output: "9" },
          { input: "3\n4 13 5 / +", output: "6" },
          { input: "5\n10 6 9 3 + -11 * / *", output: "22" }
        ]
      },

      // Sliding Window
      {
        title: "Maximum Sum Subarray of Size K",
        description: "Find the maximum sum of a subarray of size k.",
        input: "N K followed by N integers.",
        output: "Maximum sum.",
        constraints: "1 <= N <= 1000",
        topic: topicMap["Sliding Window"],
        testCases: [
          { input: "5 3\n2 1 5 1 3", output: "9" },
          { input: "4 2\n1 4 2 10", output: "12" },
          { input: "6 4\n1 2 3 4 5 6", output: "18" }
        ]
      },
      {
        title: "First Negative Integer in Window",
        description: "Find first negative integer in every window of size k.",
        input: "N K followed by N integers.",
        output: "First negatives in each window.",
        constraints: "1 <= N <= 1000",
        topic: topicMap["Sliding Window"],
        testCases: [
          { input: "8 3\n12 -1 -7 8 -15 30 16 28", output: "-1 -1 -7 -15 -15 0" },
          { input: "5 2\n-8 2 3 -6 10", output: "-8 0 -6 -6" },
          { input: "3 1\n5 -2 7", output: "0 -2 0" }
        ]
      },
      {
        title: "Longest Substring Without Repeating Characters",
        description: "Find length of longest substring without repeating characters.",
        input: "String s.",
        output: "Length.",
        constraints: "1 <= length <= 1000",
        topic: topicMap["Sliding Window"],
        testCases: [
          { input: "abcabcbb", output: "3" },
          { input: "bbbbb", output: "1" },
          { input: "pwwkew", output: "3" }
        ]
      },
      {
        title: "Minimum Size Subarray Sum",
        description: "Find minimal length of a contiguous subarray with sum >= target.",
        input: "target N followed by N integers.",
        output: "Minimum length (0 if no such subarray).",
        constraints: "1 <= N <= 1000",
        topic: topicMap["Sliding Window"],
        testCases: [
          { input: "7 6\n2 3 1 2 4 3", output: "2" },
          { input: "15 5\n1 2 3 4 5", output: "0" },
          { input: "4 3\n1 4 4", output: "1" }
        ]
      },
      {
        title: "Sliding Window Maximum",
        description: "Find max in each window of size k.",
        input: "N K followed by N integers.",
        output: "Array of maximums.",
        constraints: "1 <= N <= 1000",
        topic: topicMap["Sliding Window"],
        testCases: [
          { input: "8 3\n1 3 -1 -3 5 3 6 7", output: "3 3 5 5 6 7" },
          { input: "5 2\n2 4 6 8 10", output: "4 6 8 10" },
          { input: "4 1\n1 2 3 4", output: "1 2 3 4" }
        ]
      },

      // Binary Trees
      {
        title: "Inorder Traversal of Binary Tree",
        description: "Return inorder traversal of binary tree.",
        input: "Array representation of tree nodes.",
        output: "Inorder traversal array.",
        constraints: "0 <= nodes <= 1000",
        topic: topicMap["Binary Trees"],
        testCases: [
          { input: "[1,null,2,3]", output: "[1,3,2]" },
          { input: "[1,2,3,4,5]", output: "[4,2,5,1,3]" },
          { input: "[]", output: "[]" }
        ]
      },
      {
        title: "Preorder Traversal of Binary Tree",
        description: "Return preorder traversal of binary tree.",
        input: "Array representation of tree nodes.",
        output: "Preorder traversal array.",
        constraints: "0 <= nodes <= 1000",
        topic: topicMap["Binary Trees"],
        testCases: [
          { input: "[1,null,2,3]", output: "[1,2,3]" },
          { input: "[1,2,3,4,5]", output: "[1,2,4,5,3]" },
          { input: "[]", output: "[]" }
        ]
      },
      {
        title: "Postorder Traversal of Binary Tree",
        description: "Return postorder traversal of binary tree.",
        input: "Array representation of tree nodes.",
        output: "Postorder traversal array.",
        constraints: "0 <= nodes <= 1000",
        topic: topicMap["Binary Trees"],
        testCases: [
          { input: "[1,null,2,3]", output: "[3,2,1]" },
          { input: "[1,2,3,4,5]", output: "[4,5,2,3,1]" },
          { input: "[]", output: "[]" }
        ]
      },
      {
        title: "Maximum Depth of Binary Tree",
        description: "Find maximum depth of binary tree.",
        input: "Array representation of tree nodes.",
        output: "Integer (maximum depth).",
        constraints: "0 <= nodes <= 1000",
        topic: topicMap["Binary Trees"],
        testCases: [
          { input: "[3,9,20,null,null,15,7]", output: "3" },
          { input: "[1,null,2]", output: "2" },
          { input: "[]", output: "0" }
        ]
      },
      {
        title: "Check if Tree is Symmetric",
        description: "Check if binary tree is symmetric around center.",
        input: "Array representation of tree nodes.",
        output: "'true' or 'false'.",
        constraints: "0 <= nodes <= 1000",
        topic: topicMap["Binary Trees"],
        testCases: [
          { input: "[1,2,2,3,4,4,3]", output: "true" },
          { input: "[1,2,2,null,3,null,3]", output: "false" },
          { input: "[]", output: "true" }
        ]
      },

      // Graph
      {
        title: "DFS Traversal of Graph",
        description: "Return DFS traversal from source node.",
        input: "N, edges list and starting node.",
        output: "DFS traversal order.",
        constraints: "0 <= nodes <= 1000",
        topic: topicMap["Graph"],
        testCases: [
          { input: "5\n0:1 2\n1:2\n2:0 3\n3:3\n4:\nStart:2", output: "2 0 1 3" },
          { input: "3\n0:1\n1:2\n2:\nStart:0", output: "0 1 2" },
          { input: "2\n0:\n1:\nStart:1", output: "1" }
        ]
      },
      {
        title: "BFS Traversal of Graph",
        description: "Return BFS traversal from source node.",
        input: "N, edges list and starting node.",
        output: "BFS traversal order.",
        constraints: "0 <= nodes <= 1000",
        topic: topicMap["Graph"],
        testCases: [
          { input: "5\n0:1 2\n1:2\n2:0 3\n3:3\n4:\nStart:2", output: "2 0 3 1" },
          { input: "3\n0:1\n1:2\n2:\nStart:0", output: "0 1 2" },
          { input: "2\n0:\n1:\nStart:1", output: "1" }
        ]
      },
      {
        title: "Detect Cycle in Undirected Graph",
        description: "Detect if there is a cycle in undirected graph.",
        input: "N, edges list.",
        output: "'true' or 'false'.",
        constraints: "0 <= nodes <= 1000",
        topic: topicMap["Graph"],
        testCases: [
          { input: "3\n0:1\n1:0 2\n2:1", output: "false" },
          { input: "3\n0:1 2\n1:0 2\n2:0 1", output: "true" },
          { input: "2\n0:1\n1:0", output: "false" }
        ]
      },
      {
        title: "Topological Sort",
        description: "Find topological sort of DAG.",
        input: "N, edges list.",
        output: "Topological order.",
        constraints: "0 <= nodes <= 1000",
        topic: topicMap["Graph"],
        testCases: [
          { input: "4\n0:1\n1:2\n2:3\n3:", output: "0 1 2 3" },
          { input: "5\n0:1 2\n1:3\n2:3\n3:4\n4:", output: "0 2 1 3 4" },
          { input: "2\n0:1\n1:", output: "0 1" }
        ]
      },
      {
        title: "Shortest Path in Unweighted Graph",
        description: "Find shortest path from source to all vertices.",
        input: "N, edges list, source node.",
        output: "Distances array.",
        constraints: "0 <= nodes <= 1000",
        topic: topicMap["Graph"],
        testCases: [
          { input: "4\n0:1\n1:2\n2:3\n3:\nSource:0", output: "0 1 2 3" },
          { input: "3\n0:1\n1:2\n2:\nSource:0", output: "0 1 2" },
          { input: "5\n0:1 2\n1:3\n2:3\n3:4\n4:\nSource:2", output: "0 1 1 2 3" }
        ]
      },

      // Dynamic Programming
      {
        title: "Climbing Stairs",
        description: "Count distinct ways to climb stairs.",
        input: "Single integer N.",
        output: "Number of ways.",
        constraints: "1 <= N <= 45",
        topic: topicMap["Dynamic Programming"],
        testCases: [
          { input: "2", output: "2" },
          { input: "3", output: "3" },
          { input: "5", output: "8" }
        ]
      },
      {
        title: "Fibonacci Using DP",
        description: "Find nth Fibonacci number using DP.",
        input: "Single integer n.",
        output: "nth Fibonacci number.",
        constraints: "0 <= n <= 100",
        topic: topicMap["Dynamic Programming"],
        testCases: [
          { input: "5", output: "5" },
          { input: "10", output: "55" },
          { input: "0", output: "0" }
        ]
      },
      {
        title: "0/1 Knapsack Problem",
        description: "Find max value in knapsack of capacity W.",
        input: "Items with weights, values, and W.",
        output: "Maximum value.",
        constraints: "1 <= items <= 100",
        topic: topicMap["Dynamic Programming"],
        testCases: [
          { input: "4\n1 3 4 5\n1 4 5 7\n7", output: "9" },
          { input: "3\n10 20 30\n60 100 120\n50", output: "220" },
          { input: "3\n1 2 3\n10 20 30\n3", output: "30" }
        ]
      },
      {
        title: "Longest Common Subsequence",
        description: "Find LCS length of two strings.",
        input: "Two strings.",
        output: "LCS length.",
        constraints: "1 <= length <= 1000",
        topic: topicMap["Dynamic Programming"],
        testCases: [
          { input: "abcde\nace", output: "3" },
          { input: "abc\nabc", output: "3" },
          { input: "abc\ndef", output: "0" }
        ]
      },
      {
        title: "Minimum Path Sum",
        description: "Find minimum path sum in grid.",
        input: "Grid rows and columns.",
        output: "Minimum path sum.",
        constraints: "1 <= grid size <= 100",
        topic: topicMap["Dynamic Programming"],
        testCases: [
          { input: "2 2\n1 3\n1 5", output: "7" },
          { input: "3 3\n1 3 1\n1 5 1\n4 2 1", output: "7" },
          { input: "2 3\n1 2 5\n3 2 1", output: "6" }
        ]
      }
    ];

    await Problem.insertMany(problems);
    console.log("Seeding completed.");
    mongoose.disconnect();
  } catch (err) {
    console.error("Error seeding:", err);
  }
};

seedData();
