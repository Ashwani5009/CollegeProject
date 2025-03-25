document.addEventListener("DOMContentLoaded", async () => {
    const problemId = sessionStorage.getItem('problemId');
    const token = sessionStorage.getItem('token');
    
    // Apply theme immediately
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.add(savedTheme);
    
    // Ensure the theme toggle checkbox is set properly
    const themeToggleInput = document.getElementById('input');
    if (themeToggleInput) {
        themeToggleInput.checked = savedTheme === 'dark';
    }
    
    if (!token) {
        alert("You are not logged in!");
        window.location.href = "login.html";
        return;
    }

    const problemTitleElement = document.getElementById("problem-title");
    const problemDescriptionElement = document.getElementById("problem-description");
    const problemIOElement = document.getElementById("problem-input-output");
    const codeEditor = document.getElementById("code-editor");
    const submitButton = document.getElementById("submit-code-button");

    // Initialize CodeMirror editor
    const editor = CodeMirror.fromTextArea(codeEditor, {
        lineNumbers: true,
        mode: "javascript",
        theme: "dracula",
    });

    // Fetch problem details using problemId
    try {
        const response = await fetch(`https://collegeproject-fnkx.onrender.com/api/problems/${problemId}`);
        if (response.ok) {
            const problem = await response.json();

            // Update the problem title, description, and input/output formats
            if (problemTitleElement) {
                problemTitleElement.textContent = problem.title;
            }

            if (problemDescriptionElement) {
                problemDescriptionElement.textContent = problem.description;
            }

            if (problemIOElement) {
                problemIOElement.textContent = `Input: ${problem.input || 'N/A'}\nOutput: ${problem.output || 'N/A'}\nConstraints: ${problem.constraints || 'N/A'}`;
            }
        } else {
            console.error("Problem not found.");
        }
    } catch (error) {
        console.error("Error fetching problem:", error);
    }

    // Handle code submission
    if (submitButton) {
        submitButton.addEventListener("click", async () => {
            const code = editor.getValue();

            if (!code) {
                alert("Please write some code.");
                return;
            }

            const language = document.getElementById("language").value;
            const languageId = getLanguageId(language);
            
            // Show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            document.getElementById("resultMessage").innerText = "Processing your submission...";

            // Submit the code to the backend for evaluation
            try {
                const response = await fetch("https://collegeproject-fnkx.onrender.com/api/submissions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        problem: problemId,
                        code: code,
                        language_id: languageId,
                        stdin: "",
                    }),
                });

                const result = await response.json();
                if (response.ok && result.submission) {
                    const { status, output, execution_time, memory_usage } = result.submission;

                    // Display the result of code submission
                    document.getElementById("resultMessage").innerText = `Status: ${status}\nOutput: ${output}`;
                    document.getElementById("executionResults").style.display = "block";
                    document.getElementById("execution-time").innerText = execution_time ? `${execution_time} sec` : "N/A";
                    document.getElementById("memory-usage").innerText = memory_usage ? `${memory_usage} MB` : "N/A";
                    
                    // Update progress if submission was successful
                    if (status === "Accepted" || status === "Success" || status.toLowerCase().includes("success")) {
                        updateProgress(problemId);
                        
                        // Show success message
                        const resultElement = document.getElementById("resultMessage");
                        resultElement.classList.add("success-result");
                        resultElement.innerText = `✅ ${status}\nOutput: ${output}\n\nGreat job! Your solution has been accepted.`;
                    } else {
                        // Show failure message
                        const resultElement = document.getElementById("resultMessage");
                        resultElement.classList.add("error-result");
                        resultElement.innerText = `❌ ${status}\nOutput: ${output}\n\nTry again, you're getting closer!`;
                    }
                } else {
                    console.error("Error submitting code:", result);
                    document.getElementById("resultMessage").innerText = `Error: ${result.message || "Unknown error occurred"}`;
                    document.getElementById("resultMessage").classList.add("error-result");
                }
            } catch (error) {
                console.error("Error submitting code:", error);
                document.getElementById("resultMessage").innerText = "Error: Could not connect to the server. Please try again.";
                document.getElementById("resultMessage").classList.add("error-result");
            } finally {
                // Reset button state
                submitButton.disabled = false;
                submitButton.innerHTML = '<i class="fas fa-play"></i> Submit Code';
            }
        });
    }

    // Function to map language selection to corresponding language ID
    function getLanguageId(language) {
        switch (language) {
            case 'python':
                return 71;  // Python
            case 'java':
                return 62;  // Java
            case 'cpp':
                return 54;  // C++
            default:
                return 71;  // Default to Python
        }
    }
});

// Function to show hint for the selected problem
function showHint() {
    const problemId = sessionStorage.getItem('problemId');

    fetch(`https://collegeproject-fnkx.onrender.com/api/problems/${problemId}`)
        .then(response => response.json())
        .then(data => {
            if (data && data.hint) {
                alert(`Hint: ${data.hint}`);
            } else {
                alert("No hint available for this problem.");
            }
        })
        .catch(error => {
            console.error("Error fetching hint:", error);
            alert("Failed to fetch hint.");
        });
}

// Function to update progress when a solution is accepted
function updateProgress(problemId) {
    // Get current completed questions from session storage
    let completedQuestions = JSON.parse(sessionStorage.getItem("completedQuestions") || "[]");
    
    // Check if this problem is already in the completed list
    if (!completedQuestions.includes(problemId)) {
        // Add the problem to completed questions
        completedQuestions.push(problemId);
        
        // Save updated list back to session storage
        sessionStorage.setItem("completedQuestions", JSON.stringify(completedQuestions));
        
        // Set flag to show notification on dashboard
        sessionStorage.setItem("newlyCompletedQuestion", "true");
        
        // Show success notification
        showSuccessNotification("Progress updated! You've completed a new question.");
        
        // Add a button to return to dashboard
        addReturnToDashboardButton();
    }
}

// Function to add a return to dashboard button
function addReturnToDashboardButton() {
    const buttonsContainer = document.querySelector('.execution-results');
    
    // Check if button already exists
    if (!document.getElementById('return-dashboard-btn')) {
        const returnButton = document.createElement('button');
        returnButton.id = 'return-dashboard-btn';
        returnButton.className = 'return-dashboard-btn';
        returnButton.innerHTML = '<i class="fas fa-arrow-left"></i> Return to Dashboard';
        returnButton.onclick = () => {
            window.location.href = 'dashboard.html';
        };
        
        // Insert before the first child of execution results
        buttonsContainer.insertBefore(returnButton, buttonsContainer.firstChild);
    }
}

// Function to show a success notification
function showSuccessNotification(message) {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('progress-notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'progress-notification';
        notification.className = 'progress-notification';
        document.body.appendChild(notification);
    }
    
    // Set notification message and show it
    notification.textContent = message;
    notification.classList.add('show');
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}
