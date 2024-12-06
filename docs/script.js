document.addEventListener("DOMContentLoaded", async () => {
    const topicSelect = document.getElementById("topic-select");
    const problemSelect = document.getElementById("question-select");
    const progressBar = document.getElementById("progress");

    // Fetch topics on page load
    try {
        const topicResponse = await fetch("http://localhost:5000/api/topics");
        const topics = await topicResponse.json();

        if (topicResponse.ok && topics.length > 0) {
            topics.forEach(topic => {
                const option = document.createElement("option");
                option.value = topic._id;
                option.textContent = topic.name;
                topicSelect.appendChild(option);
            });
        } else {
            console.error("No topics found");
        }
    } catch (error) {
        console.error("Error fetching topics:", error);
    }

    // Event listener for topic selection
    topicSelect.addEventListener("change", async () => {
        const selectedTopicId = topicSelect.value;

        // Clear existing problem options
        problemSelect.innerHTML = '<option value="" disabled selected>Select a Problem</option>';
        problemSelect.disabled = true;

        // Fetch problems for the selected topic
        try {
            const response = await fetch(`http://localhost:5000/api/problems/by-topic/${selectedTopicId}`);
            const problems = await response.json();

            if (response.ok && problems.length > 0) {
                problems.forEach(problem => {
                    const option = document.createElement("option");
                    option.value = problem._id;
                    option.textContent = problem.title;
                    problemSelect.appendChild(option);
                });
                problemSelect.disabled = false;
            } else {
                console.error("No problems found for this topic");
            }
        } catch (error) {
            console.error("Error fetching problems:", error);
        }
    });

    // Event listener for problem submission
    document.getElementById("start-question-button").addEventListener("click", async () => {
        const selectedProblemId = problemSelect.value;
        if (!selectedProblemId) {
            alert("Please select a problem first.");
            return;
        }

        // Store problem ID in sessionStorage
        sessionStorage.setItem('problemId', selectedProblemId); 

        // Redirect to the problem-solving page
        window.location.href = "solve.html";
    });

    // Event listener for code submission on the problem-solving page
    document.getElementById("solve-form")?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const code = document.getElementById("code-input").value;
        const language = document.getElementById("language-select").value;
        const problemId = new URLSearchParams(window.location.search).get('problemId'); // Get problem ID from URL

        const submissionData = {
            user: "user_id_placeholder", // Replace with actual user ID
            problem: problemId,
            code,
            language,
        };

        try {
            const response = await fetch("http://localhost:5000/api/submissions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(submissionData),
            });

            const submissionResult = await response.json();

            // Handle response and display status
            document.getElementById("status-text").textContent = submissionResult.status;
            document.getElementById("output-text").textContent = submissionResult.output || "No output available.";
        } catch (error) {
            console.error("Error submitting solution:", error);
            document.getElementById("status-text").textContent = "Error";
            document.getElementById("output-text").textContent = "An error occurred while submitting your solution.";
        }
    });

    // Profile Management
    function toggleProfile() {
        const profilePopup = document.getElementById('profilePopup');
        profilePopup.style.display = profilePopup.style.display === 'block' ? 'none' : 'block';
    }

    function closeProfile() {
        const profilePopup = document.getElementById('profilePopup');
        profilePopup.style.display = 'none';
    }

    function logout() {
        // Clear session data
        localStorage.clear(); // Or sessionStorage.clear();

        // Redirect to the login page
        window.location.href = "login.html";
    }

    // Static Topics and Questions (Fallback or Local Data)
    const topics = {
        "Data Structures and Algorithms": {
            "Stacks": ["Implement Stack using Queue", "Evaluate Postfix Expression", "Design a Stack with Min Function"],
            "Queues": ["Implement Queue using Stack", "Design Circular Queue", "Priority Queue Implementation"],
            "Linked Lists": ["Reverse a Linked List", "Detect Loop in Linked List", "Merge Two Sorted Linked Lists"],
            "Trees": ["Binary Tree Inorder Traversal", "Binary Search Tree Validation", "Height of a Binary Tree"],
            "Graphs": ["Depth First Search", "Breadth First Search", "Shortest Path in Unweighted Graph"]
        }
    };

    let completedQuestions = [];

    // Populate topics dropdown with subtopics
    function loadTopics() {
        const topicSelect = document.getElementById("topic");
        topicSelect.innerHTML = '<option value="" disabled selected>Select a topic</option>';

        const mainTopic = "Data Structures and Algorithms"; // Main topic
        for (const subtopic in topics[mainTopic]) {
            const option = document.createElement("option");
            option.value = subtopic;
            option.textContent = subtopic;
            topicSelect.appendChild(option);
        }
    }

    // Load questions based on selected subtopic
    function loadQuestions() {
        const mainTopic = "Data Structures and Algorithms";
        const selectedSubtopic = document.getElementById("topic").value;
        const questionSelect = document.getElementById("question");

        questionSelect.innerHTML = '<option value="" disabled selected>Select a question</option>'; // Reset question dropdown

        if (topics[mainTopic][selectedSubtopic]) {
            topics[mainTopic][selectedSubtopic].forEach(question => {
                const option = document.createElement("option");
                option.value = question;
                option.textContent = question;
                questionSelect.appendChild(option);
            });
        }
    }

    // Start the selected question
    function startQuestion() {
        const selectedQuestion = document.getElementById("question").value;
        if (selectedQuestion) {
            if (!completedQuestions.includes(selectedQuestion)) {
                completedQuestions.push(selectedQuestion);
                updateProgress();
            }
            window.location.href = "solve.html"; // Redirect to code editor
        } else {
            alert("Please select a question to start.");
        }
    }

    // Update progress dynamically
    function updateProgress() {
        const totalQuestions = Object.values(topics["Data Structures and Algorithms"]).flat().length;
        const progressPercentage = (completedQuestions.length / totalQuestions) * 100;

        const progressBar = document.getElementById("progress");
        progressBar.style.width = `${progressPercentage}%`;
        progressBar.textContent = `${Math.round(progressPercentage)}%`;

        if (progressPercentage === 100) {
            alert("Congratulations! You've completed all questions.");
        }
    }

    // Load all topics and questions
    function loadAllQuestions() {
        const questionList = document.getElementById("questionList");
        questionList.innerHTML = ""; // Clear previous list

        for (const subtopic in topics["Data Structures and Algorithms"]) {
            const subtopicItem = document.createElement("li");
            subtopicItem.textContent = subtopic;
            questionList.appendChild(subtopicItem);

            topics["Data Structures and Algorithms"][subtopic].forEach(question => {
                const questionItem = document.createElement("li");
                questionItem.textContent = `- ${question}`;
                questionItem.style.marginLeft = "20px";
                questionList.appendChild(questionItem);
            });
        }
    }

    function redirectToProfile() {
        const profilePopup = document.getElementById('profilePopup');
        profilePopup.style.display = profilePopup.style.display === 'block' ? 'none' : 'block';
    }

    // Initial load
    window.onload = function () {
        loadTopics();
        loadAllQuestions();
        updateProgress();
    };
});

