document.addEventListener("DOMContentLoaded", async () => {
    const problemId = sessionStorage.getItem("problemId");
    if (!problemId) {
        document.getElementById("problem-title").textContent = "Problem ID not found.";
        return;
    }

    try {
        const response = await fetch(`https://collegeproject-fnkx.onrender.com/api/problems/${problemId}`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.message || "Problem not found");

        document.getElementById("problem-title").textContent = data.title || "Untitled Problem";
        document.getElementById("problem-description").textContent = data.description || "No description available.";

        const inputOutput = `Input: ${data.input || "N/A"}\n\nOutput: ${data.output || "N/A"}`;
        document.getElementById("problem-input-output").textContent = inputOutput;

        const examples = data.examples || [];
        const examplesContainer = document.getElementById("problem-examples");
        examplesContainer.innerHTML = examples.map(example =>
            `<div>
                <strong>Input:</strong> <pre>${escapeHtml(example.input)}</pre>
                <strong>Output:</strong> <pre>${escapeHtml(example.output)}</pre>
            </div>`
        ).join("");
        
        const extraDetailsElement = document.getElementById("problem-full-content");
        if (data.extraDetailsHtml) {
            extraDetailsElement.innerHTML = data.extraDetailsHtml;
        } else {
            extraDetailsElement.style.display = "none";
        }




    } catch (error) {
        console.error("Error fetching problem details:", error);
        document.getElementById("problem-title").textContent = "Failed to load question.";
    }
});
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}
