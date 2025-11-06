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

  // Load progress from database
  await loadProgressFromDatabase();

  // Update progress bar with loaded data
  const completedQuestions = JSON.parse(localStorage.getItem('completedQuestions') || '[]');
  if (completedQuestions.length > 0) {
    updateProgressBar();
  }

  const problemTitleElement = document.getElementById("problem-title");
  const problemDescriptionElement = document.getElementById("problem-description");
  const problemIOElement = document.getElementById("problem-input-output");
  const codeEditor = document.getElementById("code-editor");
  const submitButton = document.getElementById("submit-code-button");
  
  const editorTheme = savedTheme === 'dark' ? 'dracula' : 'eclipse';
  // Initialize CodeMirror editor
  const editor = CodeMirror.fromTextArea(document.getElementById("code-editor"), {
    lineNumbers: true,
    mode: "python",
    theme: editorTheme,
    matchBrackets: true,
    autoCloseBrackets: true,
    indentUnit: false,
    indentWithTabs: false,
    smartIndent: true,
    lineWrapping: true,
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
    foldGutter: true,
    electricChars: true,
    extraKeys: {
      "Tab": function(cm) {
        if (cm.somethingSelected()) {
          cm.indentSelection("add");
        } else {
          cm.replaceSelection("    ", "end");
        }
      },
      "Shift-Tab": function(cm) {
        cm.indentSelection("subtract");
      },
      "Enter": function(cm) {
        const pos = cm.getCursor();
        const line = cm.getLine(pos.line);
        const mode = cm.getOption("mode");
        cm.execCommand("newlineAndIndent");
        if (mode === "python" && /^\s*(else|elif|except|finally|return)\b/.test(cm.getLine(pos.line))) {
          cm.indentLine(pos.line, "subtract");
        }
        if ((mode === "text/x-java" || mode === "text/x-c++src") && /\{\s*$/.test(line)) {
          cm.replaceSelection("    ");
        }
      },
      "}": function(cm) {
        const mode = cm.getOption("mode");
        const pos = cm.getCursor();
        const line = cm.getLine(pos.line);

        if ((mode === "text/x-java" || mode === "text/x-c++src") && /^\s*\}/.test(line)) {
          cm.indentLine(pos.line, "subtract");
        }
        cm.replaceSelection("}");
      },
      "Ctrl-Space": "autocomplete"
    }
  });

  // Language selection logic
  document.getElementById("language").addEventListener("change", function() {
    const selectedLang = this.value;
    setLanguageMode(selectedLang);
  });

  let isDarkMode = savedTheme === 'dark';

  document.getElementById("input").addEventListener("click", () => {
    isDarkMode = !isDarkMode;
    const newTheme = isDarkMode ? "dracula" : "eclipse";
    editor.setOption("theme", newTheme);
    document.body.classList.toggle("dark-mode", isDarkMode);
  });

  // Set mode and hint based on language
  function setLanguageMode(language) {
    if (language === "python") {
      editor.setOption("mode", "python");
    } else if (language === "java") {
      editor.setOption("mode", "text/x-java");
    } else if (language === "cpp" || language === "c++") {
      editor.setOption("mode", "text/x-c++src");
    }
  }

  // Register custom hint
  function customHint(cm) {
    const mode = cm.getOption("mode");

    let keywords = [];

    if (mode === "python") {
      keywords = ["def", "return", "import", "for", "while", "if", "else", "elif", "print", "range", "len", "class"];
    } else if (mode === "text/x-java") {
      keywords = ["class", "public", "static", "void", "main", "System", "out", "println", "new", "String", "int"];
    } else if (mode === "text/x-c++src") {
      keywords = ["#include", "int", "main", "std", "cout", "cin", "return", "using", "namespace"];
    }

    const cur = cm.getCursor();
    const token = cm.getTokenAt(cur);
    const start = token.start;
    const end = token.end;
    const word = token.string;

    const list = keywords.filter(k => k.startsWith(word));

    return {
      list,
      from: CodeMirror.Pos(cur.line, start),
      to: CodeMirror.Pos(cur.line, end)
    };
  }

  CodeMirror.registerHelper("hint", "custom", customHint);
  editor.setOption("hintOptions", { hint: CodeMirror.hint.custom });

  editor.on("inputRead", function(cm, change) {
    if (change.text[0].match(/[\w#]/)) {
      cm.showHint({ hint: CodeMirror.hint.custom, completeSingle: false });
    }
  });

  // Fetch problem details using problemId
  try {
    const response = await fetch(`http://localhost:5000/api/problems/${problemId}`);
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
        const response = await fetch("http://localhost:5000/api/submissions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            problem: problemId,
            code: code,
            language_id: languageId,
            stdin: ""
          }),
        });

        const result = await response.json();
        console.log("Submission result:", result);

        if (response.ok && result.submission) {
          // Extract data from the response - backend returns flattened data now (not wrapped in submission object)
          const { status, output, execution_time, memory_usage, testResults } = result.submission;
          console.log()
          console.log("time", execution_time);
          // Create a formatted result message that shows test case results
          let resultMessage = `Status: ${status}\n\n`;

          if (testResults && testResults.length > 0) {
            resultMessage += "Test Case Results:\n";
            testResults.forEach((test, index) => {
              resultMessage += `\nTest Case ${index + 1}: ${test.passed ? '✅ Passed' : '❌ Failed'}\n`;
              resultMessage += `Input: ${test.input}\n`;
              resultMessage += `Expected Output: ${test.expectedOutput}\n`;
              resultMessage += `Your Output: ${test.actualOutput}\n`;
              // resultMessage += `Time: ${test.time}\n`;
              // resultMessage += `Memory: ${test.memory}`;
            });
          } else if (output) {
            // Fallback to display raw output if no test results
            resultMessage += `Output: ${output}`;
          }

          // Display the result of code submission
          // added 15april 2025
          const resultMessageElement = document.getElementById("resultMessage");
          resultMessageElement.innerHTML = resultMessage.replace(/\n/g, '<br>');
          resultMessageElement.classList.remove("error-result");
          resultMessageElement.classList.add("success-result");

          document.getElementById("executionResults").style.display = "block";
          document.getElementById("execution-time").innerText = execution_time ? `${execution_time} sec` : "N/A";
          document.getElementById("memory-usage").innerText = memory_usage ? `${memory_usage} MB` : "N/A";

          // Update progress if submission was successful
          if (status === "Accepted" || status === "Success" || status.toLowerCase().includes("success")) {
            updateProgress(problemId);
          }
        } else {
          console.error("Error submitting code:", result);
          const errorMsg = result.message || result.error || "Unknown error occurred";
          const resultMessageElement = document.getElementById("resultMessage");
          resultMessageElement.innerText = `Error: ${errorMsg}`;
          resultMessageElement.classList.add("error-result");
          resultMessageElement.classList.remove("success-result");
        }
      } catch (error) {
        console.error("Error submitting code:", error);
        // added 15april 2025
        const resultMessageElement = document.getElementById("resultMessage");
        resultMessageElement.innerText = `Error: ${error.message || "Could not connect to the server. Please try again."}`;
        resultMessageElement.classList.add("error-result");
        resultMessageElement.classList.remove("success-result");
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

// Add the updateProgressBar function
function updateProgressBar() {
  try {
    const completedQuestions = JSON.parse(localStorage.getItem('completedQuestions') || '[]');
    const totalQuestions = 50;

    // Calculate progress percentage
    const progressPercentage = (completedQuestions.length / totalQuestions) * 100;

    // Update progress bar width
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
      progressBar.style.width = `${progressPercentage}%`;
    }

    // Update progress text
    const progressText = document.querySelector('.progress-text');
    if (progressText) {
      progressText.textContent = `${completedQuestions.length}/${totalQuestions} completed`;
    }
  } catch (error) {
    console.error('Error updating progress bar:', error);
  }
}


async function saveProgressToDatabase(problemId) {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    // Use the API_BASE_URL variable
    const response = await fetch(`${API_BASE_URL}/api/progress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        problemId: problemId,
        completed: true
      })
    });

    if (!response.ok) {
      throw new Error('Failed to save progress');
    }

    const data = await response.json();
    console.log('Progress saved:', data);

    // Update local storage after successful save
    const completedQuestions = JSON.parse(localStorage.getItem('completedQuestions') || '[]');
    if (!completedQuestions.includes(problemId)) {
      completedQuestions.push(problemId);
      localStorage.setItem('completedQuestions', JSON.stringify(completedQuestions));

      // Update progress bar
      updateProgressBar();

      // Show success notification
      showSuccessNotification("Progress updated! You've completed a new question.");

      // Add return to dashboard button
      addReturnToDashboardButton();
    }
  } catch (error) {
    console.error('Error saving progress:', error);
  }
}

async function loadProgressFromDatabase() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    // Use the API_BASE_URL variable
    const response = await fetch(`${API_BASE_URL}/api/progress`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to load progress');
    }

    const data = await response.json();
    if (data.completedQuestions && data.completedQuestions.length > 0) {
      // Update session storage with loaded progress
      localStorage.setItem('completedQuestions', JSON.stringify(data.completedQuestions));
      console.log('Progress loaded:', data.completedQuestions);

      // Update progress bar
      updateProgressBar();
    }
  } catch (error) {
    console.error('Error loading progress:', error);
  }
}

// Update the updateProgress function
function updateProgress(problemId) {
  try {
    const completedQuestions = JSON.parse(localStorage.getItem('completedQuestions') || '[]');

    if (!completedQuestions.includes(problemId)) {
      completedQuestions.push(problemId);
      localStorage.setItem('completedQuestions', JSON.stringify(completedQuestions));

      // Save to database
      saveProgressToDatabase(problemId);

      // Update progress bar
      updateProgressBar();

      // Show success notification
      showSuccessNotification("Progress updated! You've completed a new question.");

      // Add return to dashboard button
      addReturnToDashboardButton();
    }
  } catch (error) {
    console.error('Error updating progress:', error);
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
