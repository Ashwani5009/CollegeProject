document.addEventListener("DOMContentLoaded", async () => {
    const topicSelect = document.getElementById("topic-select");
    const problemSelect = document.getElementById("question-select");

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

        // Redirect to the problem-solving page or display problem content
        window.location.href = `/solve/${selectedProblemId}`; // Redirect to the problem-solving page
    });
});

// Event listener for code submission on the problem-solving page
document.getElementById("solve-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const code = document.getElementById("code-input").value;
    const language = document.getElementById("language-select").value;
    const problemId = new URLSearchParams(window.location.search).get('problemId'); // Get problem ID from URL

    const submissionData = {
        user: "user_id_placeholder", // Replace with actual user ID from session or token
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
        
        // Handle the response and display the status
        document.getElementById("status-text").textContent = submissionResult.status;
        document.getElementById("output-text").textContent = submissionResult.output || "No output available.";
    } catch (error) {
        console.error("Error submitting the solution:", error);
        document.getElementById("status-text").textContent = "Error";
        document.getElementById("output-text").textContent = "An error occurred while submitting your solution.";
    }
});
