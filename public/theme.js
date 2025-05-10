// Theme toggle functionality
function initTheme() {
    const body = document.body;

    // Check for saved theme preference or default to 'light'
    const currentTheme = localStorage.getItem('theme') || 'light';

    // Set initial theme class
    if (!body.classList.contains(currentTheme)) {
        if (body.classList.contains('light')) body.classList.remove('light');
        if (body.classList.contains('dark')) body.classList.remove('dark');
        body.classList.add(currentTheme);
    }

    // Set initial CSS variables
    document.documentElement.style.setProperty('--container-bg', currentTheme === 'dark' ? '#1e1e1e' : '#ffffff');
    document.documentElement.style.setProperty('--heading-color', currentTheme === 'dark' ? '#f0f0f0' : '#333');

    // Find the theme toggle input
    const themeToggleInput = document.getElementById('input');

    if (themeToggleInput) {
        // Set checked state based on current theme (checked = dark, unchecked = light)
        themeToggleInput.checked = currentTheme === 'dark';

        // Listen for change events on the toggle switch
        themeToggleInput.addEventListener('change', () => {
            if (themeToggleInput.checked) {
                // Switch to dark theme
                body.classList.remove('light');
                body.classList.add('dark');
                document.documentElement.style.setProperty('--container-bg', '#1e1e1e');
                document.documentElement.style.setProperty('--heading-color', '#f0f0f0');
                localStorage.setItem('theme', 'dark');
            } else {
                // Switch to light theme
                body.classList.remove('dark');
                body.classList.add('light');
                document.documentElement.style.setProperty('--container-bg', '#ffffff');
                document.documentElement.style.setProperty('--heading-color', '#333');
                localStorage.setItem('theme', 'light');
            }

            // Ensure the dashboard content remains visible after theme change
            setTimeout(() => {
                const mainContainer = document.querySelector('.main-container');
                if (mainContainer) {
                    mainContainer.style.display = 'flex';
                    mainContainer.style.visibility = 'visible';

                    const progressContainer = document.querySelector('.progress-container');
                    const questionContainer = document.querySelector('.question-list-container');

                    if (progressContainer) {
                        progressContainer.style.display = 'block';
                        progressContainer.style.visibility = 'visible';
                    }

                    if (questionContainer) {
                        questionContainer.style.display = 'block';
                        questionContainer.style.visibility = 'visible';
                    }
                }
            }, 100);
        });
    } else {
        // If toggle not found in the DOM, create a fallback toggle
        createFallbackToggle(body, currentTheme);
    }

    // Ensure the dashboard content is visible on initial load
    setTimeout(() => {
        const mainContainer = document.querySelector('.main-container');
        if (mainContainer) {
            mainContainer.style.display = 'flex';
            mainContainer.style.visibility = 'visible';

            const progressContainer = document.querySelector('.progress-container');
            const questionContainer = document.querySelector('.question-list-container');

            if (progressContainer) {
                progressContainer.style.display = 'block';
                progressContainer.style.visibility = 'visible';
            }

            if (questionContainer) {
                questionContainer.style.display = 'block';
                questionContainer.style.visibility = 'visible';
            }
        }
    }, 100);
}

// Creates a fallback toggle if the custom toggle isn't found
function createFallbackToggle(body, currentTheme) {
    let themeToggle = document.createElement('button');
    themeToggle.id = 'theme-toggle';
    themeToggle.className = 'theme-toggle';

    const sunIcon = document.createElement('i');
    sunIcon.className = 'fas fa-sun';
    themeToggle.appendChild(sunIcon);

    const moonIcon = document.createElement('i');
    moonIcon.className = 'fas fa-moon';
    themeToggle.appendChild(moonIcon);

    themeToggle.style.position = 'fixed';
    themeToggle.style.top = '20px';
    themeToggle.style.right = '20px';
    document.body.appendChild(themeToggle);

    updateFallbackButton(themeToggle, currentTheme);

    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark')) {
            body.classList.remove('dark');
            body.classList.add('light');
            localStorage.setItem('theme', 'light');
            document.documentElement.style.setProperty('--container-bg', '#ffffff');
            document.documentElement.style.setProperty('--heading-color', '#333');
            updateFallbackButton(themeToggle, 'light');
        } else {
            body.classList.remove('light');
            body.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            document.documentElement.style.setProperty('--container-bg', '#1e1e1e');
            document.documentElement.style.setProperty('--heading-color', '#f0f0f0');
            updateFallbackButton(themeToggle, 'dark');
        }
    });
}

// Update fallback button appearance
function updateFallbackButton(themeToggle, theme) {
    if (theme === 'dark') {
        themeToggle.querySelector('.fa-sun').style.display = 'inline-block';
        themeToggle.querySelector('.fa-moon').style.display = 'none';
    } else {
        themeToggle.querySelector('.fa-sun').style.display = 'none';
        themeToggle.querySelector('.fa-moon').style.display = 'inline-block';
    }
}

// Initialize theme when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initTheme);
