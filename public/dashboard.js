document.addEventListener("DOMContentLoaded", async () => {
    const topicSelect = document.getElementById("topic-select");
    const problemSelect = document.getElementById("question-select");
    const progressBar = document.getElementById("progress");

    // Fetch topics on page load
    try {
        const topicResponse = await fetch("https://collegeproject-fnkx.onrender.com/api/topics");
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
            const response = await fetch(`https://collegeproject-fnkx.onrender.com/api/problems/by-topic/${selectedTopicId}`);
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

    // Function to toggle the profile popup
    function toggleProfile() {
        const profilePopup = document.getElementById("profilePopup");
        profilePopup.style.display = profilePopup.style.display === "block" ? "none" : "block";

        // Set the username dynamically
        const username = sessionStorage.getItem("username");
        if (username) {
            document.getElementById("username-display").textContent = username;
        } else {
            document.getElementById("username-display").textContent = "Guest";
        }
    }

    // Attach the toggle function to the profile button
    document.querySelector(".profile button").addEventListener("click", toggleProfile);

    // Profile popup close function
    document.getElementById("close-profile").addEventListener("click", () => {
        document.getElementById("profilePopup").style.display = "none";
    });

    // Logout function
    document.getElementById("logout-button").addEventListener("click", () => {
        sessionStorage.clear(); // Clear user session
        window.location.href = "login.html"; // Redirect to login page
    });

    // Update the progress dynamically
    function updateProgress() {
        const completedQuestions = sessionStorage.getItem("completedQuestions")?.split(",") || [];
        const totalQuestions = 15; // Example total questions count
        const progressPercentage = (completedQuestions.length / totalQuestions) * 100;

        progressBar.style.width = `${progressPercentage}%`;
        progressBar.textContent = `${Math.round(progressPercentage)}%`;
    }

    // Initial call to update progress on page load
    updateProgress();
});
