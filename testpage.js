// Toggle Profile Popup
function toggleProfile() {
    const profilePopup = document.getElementById('profilePopup');
    profilePopup.style.display = profilePopup.style.display === 'block' ? 'none' : 'block';
}

// Close Profile Popup
function closeProfile() {
    const profilePopup = document.getElementById('profilePopup');
    profilePopup.style.display = 'none';
}

// Logout function
function logout() {
    // Clear session data (e.g., localStorage or sessionStorage)
    localStorage.clear();  // Or sessionStorage.clear();

    // Redirect to the login page
    window.location.href = "index.html"; // Replace with the actual login page URL
}

// Topics and questions structure
const topics = {
    "Data Structures and Algorithms": {
        "Stacks": ["Implement Stack using Queue", "Evaluate Postfix Expression", "Design a Stack with Min Function"],
        "Queues": ["Implement Queue using Stack", "Design Circular Queue", "Priority Queue Implementation"],
        "Linked Lists": ["Reverse a Linked List", "Detect Loop in Linked List", "Merge Two Sorted Linked Lists"],
        "Trees": ["Binary Tree Inorder Traversal", "Binary Search Tree Validation", "Height of a Binary Tree"],
        "Graphs": ["Depth First Search", "Breadth First Search", "Shortest Path in Unweighted Graph"]
    }
};

let completedQuestions = []; // Track completed questions

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

// Start the selected question (redirect to code editor)
function startQuestion() {
    const selectedQuestion = document.getElementById("question").value;
    if (selectedQuestion) {
        if (!completedQuestions.includes(selectedQuestion)) {
            completedQuestions.push(selectedQuestion);
            updateProgress();
        }
        window.location.href = "submit.html"; // Replace with the actual code editor URL
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

// Load all topics and questions in the list on the right side
function loadAllQuestions() {
    const questionList = document.getElementById("questionList");
    questionList.innerHTML = "";  // Clear previous list

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

// Initial load of topics and all questions
window.onload = function () {
    loadTopics();
    loadAllQuestions();
    updateProgress();  // Initial call to set progress
};
