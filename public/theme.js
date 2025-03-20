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
                localStorage.setItem('theme', 'dark');
            } else {
                // Switch to light theme
                body.classList.remove('dark');
                body.classList.add('light');
                localStorage.setItem('theme', 'light');
            }
        });
    } else {
        // If toggle not found in the DOM, create a fallback toggle
        // This ensures the theme functionality works even if the custom toggle isn't present
        createFallbackToggle(body, currentTheme);
    }
}

// Creates a fallback toggle if the custom toggle isn't found
function createFallbackToggle(body, currentTheme) {
    // Create the theme toggle button
    let themeToggle = document.createElement('button');
    themeToggle.id = 'theme-toggle';
    themeToggle.className = 'theme-toggle';
    
    // Create sun icon
    const sunIcon = document.createElement('i');
    sunIcon.className = 'fas fa-sun';
    themeToggle.appendChild(sunIcon);
    
    // Create moon icon
    const moonIcon = document.createElement('i');
    moonIcon.className = 'fas fa-moon';
    themeToggle.appendChild(moonIcon);
    
    // Add button to the top-right corner of the page
    themeToggle.style.position = 'fixed';
    themeToggle.style.top = '20px';
    themeToggle.style.right = '20px';
    document.body.appendChild(themeToggle);
    
    // Update button appearance based on current theme
    updateFallbackButton(themeToggle, currentTheme);
    
    // Toggle theme when button is clicked
    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark')) {
            body.classList.remove('dark');
            body.classList.add('light');
            localStorage.setItem('theme', 'light');
            updateFallbackButton(themeToggle, 'light');
        } else {
            body.classList.remove('light');
            body.classList.add('dark');
            localStorage.setItem('theme', 'dark');
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