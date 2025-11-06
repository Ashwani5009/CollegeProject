document.addEventListener("DOMContentLoaded", async () => {
    const problemId = sessionStorage.getItem("problemId");
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.add(savedTheme);

    const themeToggleInput = document.getElementById('input');
    if (themeToggleInput) {
        themeToggleInput.checked = savedTheme === 'dark';

        themeToggleInput.addEventListener('change', () => {
            const newTheme = themeToggleInput.checked ? 'dark' : 'light';
            document.body.classList.remove('dark', 'light');
            document.body.classList.add(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
    if (themeToggleInput) {
        themeToggleInput.checked = savedTheme === 'dark';
    }
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
        if (typeof applyThemeToExtraDetails === 'function') {
            applyThemeToExtraDetails();
        }
        if (data.extraDetailsHtml) {
          extraDetailsElement.innerHTML = data.extraDetailsHtml;

          if (window.mermaid) {
            if (!window.__mermaidInitDone) {
              mermaid.initialize({
                startOnLoad: false,
                securityLevel: "loose",
                theme: document.body.classList.contains("dark") ? "dark" : "default"
              });
              window.__mermaidInitDone = true;
            }

            // Clean and render Mermaid blocks
            const blocks = extraDetailsElement.querySelectorAll(".mermaid");

            blocks.forEach(block => {
              let txt = block.textContent;

              // Remove leading spaces
              txt = txt.replace(/^\s+/gm, "");

              // Make sure block contains valid start keyword
              if (!txt.startsWith("flowchart") && !txt.startsWith("graph") && !txt.startsWith("sequenceDiagram")) {
                console.warn("Skipping non-mermaid text:", txt);
                return;
              }

              block.textContent = txt;
            });

            mermaid.run({ nodes: blocks }).catch(err => console.error("Mermaid render error:", err));
          }
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

