// Mock data (can be replaced with real data from backend or URL parameters)
const questionData = {
    title: 'Stack Using Queue',
    id: 'stack-using-queue',
    link: 'https://example.com/stack-using-queue',
    hint: 'Try implementing two queues to simulate stack operations.',
};

// Handle mock question display on page load
window.onload = function () {
    // Set the question name
    const questionNameElement = document.getElementById('questionName');
    if (questionNameElement) {
        questionNameElement.innerText = questionData.title;
    }

    // Set the question link
    const questionAnchor = document.getElementById('questionAnchor');
    if (questionAnchor) {
        questionAnchor.href = questionData.link;
        questionAnchor.innerText = `View the full question: ${questionData.title}`;
    }
};

// Handle code submission for mock data
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

// Show hint for mock data
function showHint() {
    alert(`Hint: ${questionData.hint}`);
}

// Main logic for dynamic problem loading and code submission
document.addEventListener("DOMContentLoaded", async () => {
    const problemId = window.location.pathname.split('/').pop(); // Extract problem ID from URL
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
            // Populate problem details
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

