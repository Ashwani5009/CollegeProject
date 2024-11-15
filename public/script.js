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
            } else {
                console.error("No problems found for this topic");
            }
        } catch (error) {
            console.error("Error fetching problems:", error);
        }
    });
});

document.getElementById("start-question-button").addEventListener("click", function () {
    const questionSelect = document.getElementById("question-select");
    const selectedProblemId = questionSelect.value;

    if (selectedProblemId) {
        // Redirect to the problem page or load the problem based on your application's logic
        console.log(`Selected problem ID: ${selectedProblemId}`);
        // For example, you could set window.location.href or call another function to load the question
    } else {
        alert("Please select a question first.");
    }
});
