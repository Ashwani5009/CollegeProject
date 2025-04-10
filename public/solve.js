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
    
    // Remove any existing floating return buttons
    const existingFloatingBtn = document.getElementById('floating-return-btn');
    if (existingFloatingBtn) {
        existingFloatingBtn.remove();
    }
    
    // Remove any fixed return buttons in the navbar
    const existingFixedBtn = document.getElementById('fixed-return-btn');
    if (existingFixedBtn) {
        existingFixedBtn.remove();
    }
    
    // Add return to dashboard button in the results area
    addReturnToDashboardButton();
    
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
    // Render examples
    const exampleSection = document.getElementById("problem-examples");
    if (exampleSection && problem.examples && problem.examples.length > 0) {
        exampleSection.innerHTML = "<strong>Examples:</strong><br><br>";
        problem.examples.forEach((ex, idx) => {
            exampleSection.innerHTML += `
                <div class="example-block">
                    <strong>Example ${idx + 1}:</strong><br>
                    <pre><code>Input: ${ex.input}
    Output: ${ex.output}</code></pre>
                    <br>
                </div>
            `;
        });
    }


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
                    }
                } else {
                    console.error("Error submitting code:", result);
                    document.getElementById("resultMessage").innerText = `Error: ${result.message || "Unknown error occurred"}`;
                }
            } catch (error) {
                console.error("Error submitting code:", error);
                // document.getElementById("resultMessage").innerText = "Error: Could not connect to the server. Please try again.";
                document.getElementById("resultMessage").classList.add("error-result");
            } finally {
                // Reset button state
                submitButton.disabled = false;
                submitButton.innerHTML = '<i class="fas fa-play"></i> Submit Code';
            }
        });
    }

    function getLanguageId(language) {
        switch (language) {
            case 'python': return 71;
            case 'java': return 62;
            case 'cpp': return 54;
            default: return 71;
        }
    }
});

function updateProgress(problemId) {
    let completedQuestions = JSON.parse(sessionStorage.getItem("completedQuestions") || "[]");
    if (!completedQuestions.includes(problemId)) {
        completedQuestions.push(problemId);
        sessionStorage.setItem("completedQuestions", JSON.stringify(completedQuestions));
        sessionStorage.setItem("newlyCompletedQuestion", "true");
        showSuccessNotification("Progress updated! You've completed a new question.");
        addReturnToDashboardButton();
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

// Function to add a return to dashboard button
function addReturnToDashboardButton() {
    const resultSection = document.querySelector('.result-section') || document.getElementById('executionResults');
    
    if (resultSection) {
        // Check if the result heading exists
        let resultHeading = document.querySelector('.result-heading') || document.querySelector('h2');
        
        // If heading doesn't exist, try to find any other elements to insert before
        if (!resultHeading) {
            // Insert at the beginning of the result section
            if (!document.getElementById('return-dashboard-btn')) {
                const returnButton = document.createElement('button');
                returnButton.id = 'return-dashboard-btn';
                returnButton.className = 'return-dashboard-btn';
                returnButton.innerHTML = '<i class="fas fa-arrow-left"></i> Return to Dashboard';
                returnButton.onclick = () => {
                    window.location.href = 'dashboard.html';
                };
                
                // Insert at the top of the result section
                resultSection.insertBefore(returnButton, resultSection.firstChild);
            }
        } else {
            // Insert after the heading
            if (!document.getElementById('return-dashboard-btn')) {
                const returnButton = document.createElement('button');
                returnButton.id = 'return-dashboard-btn';
                returnButton.className = 'return-dashboard-btn';
                returnButton.innerHTML = '<i class="fas fa-arrow-left"></i> Return to Dashboard';
                returnButton.onclick = () => {
                    window.location.href = 'dashboard.html';
                };
                
                resultHeading.parentNode.insertBefore(returnButton, resultHeading.nextSibling);
            }
        }
    } else {
        // If no result section, create the button and add it near the top
        const submitButton = document.getElementById('submitButton');
        const hintButton = document.getElementById('hintButton');
        
        if (submitButton || hintButton) {
            // Find the parent of the buttons
            const parent = (submitButton || hintButton).parentNode;
            
            if (!document.getElementById('return-dashboard-btn')) {
                const returnButton = document.createElement('button');
                returnButton.id = 'return-dashboard-btn';
                returnButton.className = 'return-dashboard-btn top-position';
                returnButton.innerHTML = '<i class="fas fa-arrow-left"></i> Return to Dashboard';
                returnButton.onclick = () => {
                    window.location.href = 'dashboard.html';
                };
                
                // Insert before the submit/hint buttons
                parent.insertBefore(returnButton, parent.firstChild);
            }
        }
    }
}

