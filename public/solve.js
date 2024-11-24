// Handle dynamic problem loading and code submission
document.addEventListener("DOMContentLoaded", async () => {
    const problemId = sessionStorage.getItem('problemId'); // Extract problem ID from sessionStorage
    const problemTitleElement = document.getElementById("problem-title");
    const problemDescriptionElement = document.getElementById("problem-description");
    const problemIOElement = document.getElementById("problem-input-output");
    const codeEditor = document.getElementById("code-editor");
    const submitButton = document.getElementById("submit-code-button");
    const testResultsElement = document.getElementById("test-results");

    // Initialize CodeMirror for code editor
    const editor = CodeMirror.fromTextArea(codeEditor, {
        lineNumbers: true,
        mode: "javascript",
        theme: "default",
    });

    // Fetch problem details by ID
    try {
        const response = await fetch(`http://localhost:5000/api/problems/${problemId}`);
        const problem = await response.json();

        if (response.ok && problem) {
            // Populate problem details dynamically
            if (problemTitleElement) {
                problemTitleElement.textContent = problem.title;
            }
            if (problemDescriptionElement) {
                problemDescriptionElement.textContent = problem.description;
            }
            if (problemIOElement) {
                problemIOElement.textContent = `Input: ${problem.input_format}\nOutput: ${problem.output_format}\nConstraints: ${problem.constraints}`;
            }
        } else {
            console.error("Problem not found.");
        }
    } catch (error) {
        console.error("Error fetching problem:", error);
    }

    // Handle code submission
    submitButton?.addEventListener("click", async () => {
        const code = editor.getValue(); // Get code from the editor

        if (!code) {
            alert("Please write some code.");
            return;
        }

        // Send code to the server for evaluation
        try {
            const response = await fetch("http://localhost:5000/api/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    problemId: problemId,
                    code: code,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                // Show test results
                testResultsElement.innerHTML = result.testResults
                    .map((test) => {
                        return `<div>Test Case: ${test.testCase}<br>Result: ${test.result}</div>`;
                    })
                    .join('');
            } else {
                console.error("Error submitting code:", result.message);
            }
        } catch (error) {
            console.error("Error submitting code:", error);
        }
    });
});

// Main logic for displaying the question data on page load
window.onload = function () {
    const problemId = sessionStorage.getItem('problemId'); // Get problem ID from sessionStorage

    // Fetch question data dynamically from the server
    fetch(`http://localhost:5000/api/problems/${problemId}`)
        .then(response => response.json())
        .then(data => {
            if (data) {
                // Set the question title
                const questionNameElement = document.getElementById('questionName');
                if (questionNameElement) {
                    questionNameElement.innerText = data.title;
                }

                // Set the question link
                const questionAnchor = document.getElementById('questionAnchor');
                if (questionAnchor) {
                    questionAnchor.href = data.link;
                    questionAnchor.innerText = `View the full question: ${data.title}`;
                }
            } else {
                console.error("Failed to load question data.");
            }
        })
        .catch(error => console.error("Error loading question data:", error));
};

// Show hint for the selected problem
function showHint() {
    const problemId = sessionStorage.getItem('problemId'); // Get problem ID from sessionStorage

    // Fetch hint for the problem
    fetch(`http://localhost:5000/api/problems/${problemId}`)
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

// Handle code submission for dynamic problem data
function submitCode() {
    const language = document.getElementById('language').value;
    const code = document.getElementById('code').value;

    if (code.trim() === '') {
        alert('Please enter some code before submitting.');
        return;
    }

    // Mock success message (replace with actual API call)
    document.getElementById('resultMessage').innerText =
        'Code submitted successfully! Running test cases...';
}

