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
                    }
                } else {
                    console.error("Error submitting code:", result);
                    document.getElementById("resultMessage").innerText = `Error: ${result.message || "Unknown error occurred"}`;
                }
            } catch (error) {
                console.error("Error submitting code:", error);
                document.getElementById("resultMessage").innerText = "Error: Could not connect to the server. Please try again.";
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
    }
}

