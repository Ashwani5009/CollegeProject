document.addEventListener("DOMContentLoaded", async () => {
    const problemId = sessionStorage.getItem('problemId');
    const problemTitleElement = document.getElementById("problem-title");
    const problemDescriptionElement = document.getElementById("problem-description");
    const problemIOElement = document.getElementById("problem-input-output");
    const codeEditor = document.getElementById("code-editor");
    const submitButton = document.getElementById("submit-code-button");

    const editor = CodeMirror.fromTextArea(codeEditor, {
        lineNumbers: true,
        mode: "javascript",
        theme: "dracula",
    });

    try {
        const response = await fetch(`http://localhost:5000/api/problems/${problemId}`);
        if (response.ok) {
            const problem = await response.json();
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

    if (submitButton) {
        submitButton.addEventListener("click", async () => {
            const code = editor.getValue();

            if (!code) {
                alert("Please write some code.");
                return;
            }

            const language = document.getElementById("language").value;
            const languageId = getLanguageId(language);

            try {
                const response = await fetch("http://localhost:5000/api/submissions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzQ1ZDA0ZmJhNTdiNWZhNmQ4MTYwN2QiLCJpYXQiOjE3MzI2MzU2MzAsImV4cCI6MTczMjYzOTIzMH0.k2okyZdT8OmnE_YKRgRKtWXnFZbB4enZyW6Lvma1zlo"
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
                    document.getElementById("resultMessage").innerText = `Status: ${status}\nOutput: ${output}`;
                    document.getElementById("executionResults").style.display = "block";
                    document.getElementById("status").innerText = status;
                    document.getElementById("output").innerText = output || "No Output";
                    document.getElementById("execution-time").innerText = execution_time ? `${execution_time} sec` : "N/A";
                    document.getElementById("memory-usage").innerText = memory_usage ? `${memory_usage} MB` : "N/A";
                } else {
                    console.error("Error submitting code:", result);
                }
            } catch (error) {
                console.error("Error submitting code:", error);
            }
        });
    }

    function getLanguageId(language) {
        switch (language) {
            case 'python':
                return 71;
            case 'java':
                return 62;
            case 'cpp':
                return 54;
            default:
                return 71; // Default to Python 3
        }
    }
});

function showHint() {
    const problemId = sessionStorage.getItem('problemId');

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

