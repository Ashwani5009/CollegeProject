// Toggle the profile modal visibility
function toggleProfileModal() {
    const modal = document.getElementById("profile-modal");
    const overlay = document.getElementById("modal-overlay");

    // Dynamically update the username and progress
    const username = sessionStorage.getItem("username") || "Guest";
    document.getElementById("username").textContent = username;
    document.getElementById("navbar-username").textContent = username;
    
    // Update all progress elements
    updateProgressBar();

    if (modal.style.display === "block") {
        modal.style.display = "none";
        overlay.style.display = "none";
        setTimeout(() => {
            modal.classList.remove("active");
        }, 10);
    } else {
        modal.style.display = "block";
        overlay.style.display = "block";
        setTimeout(() => {
            modal.classList.add("active");
        }, 10);
    }
    
    // Ensure main content remains visible
    document.querySelector('.main-container').style.display = 'flex';
    document.querySelector('.progress-container').style.display = 'block';
    document.querySelector('.question-list-container').style.display = 'block';
}

// Handle logout
function logout() {
    // Add confirmation for logout
    if (confirm("Are you sure you want to logout?")) {
        // Clear session data
        sessionStorage.clear(); // Clear sessionStorage or localStorage if necessary

        // Redirect to the login page
        window.location.href = "index.html";
    }
}

// Trigger file input when profile photo is clicked
function triggerFileInput() {
    document.getElementById("upload-photo").click();
}

// Change Profile Photo
function changeProfilePhoto(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // Add transition effect
            const profilePhoto = document.getElementById("profile-photo");
            const navbarPhoto = document.getElementById("navbar-profile-photo");
            
            profilePhoto.classList.add("photo-changing");
            navbarPhoto.classList.add("photo-changing");
            
            setTimeout(() => {
                profilePhoto.src = e.target.result;
                navbarPhoto.src = e.target.result;
                
                // Store the photo in sessionStorage
                sessionStorage.setItem("profilePhoto", e.target.result);
                
                setTimeout(() => {
                    profilePhoto.classList.remove("photo-changing");
                    navbarPhoto.classList.remove("photo-changing");
                }, 300);
            }, 300);
        };
        reader.readAsDataURL(file);
    }
}

// Immediate fix for content visibility (runs before DOMContentLoaded)
(function() {
    if (document.readyState === "interactive" || document.readyState === "complete") {
        fixContentVisibility();
    } else {
        document.addEventListener("DOMContentLoaded", fixContentVisibility, { once: true });
    }
    
    function fixContentVisibility() {
        // Force main container to be visible
        setTimeout(() => {
            const mainContainer = document.querySelector('.main-container');
            if (mainContainer) {
                mainContainer.style.display = 'flex';
                mainContainer.style.visibility = 'visible';
                
                const progressContainer = document.querySelector('.progress-container');
                if (progressContainer) {
                    progressContainer.style.display = 'block';
                    progressContainer.style.visibility = 'visible';
                }
                
                const questionContainer = document.querySelector('.question-list-container');
                if (questionContainer) {
                    questionContainer.style.display = 'block';
                    questionContainer.style.visibility = 'visible';
                }
                
                // Make sure all topic groups are visible
                const topicGroups = document.querySelectorAll('.topic-group');
                topicGroups.forEach(group => {
                    group.style.display = 'block';
                    group.style.visibility = 'visible';
                });
            }
        }, 0);
    }
})();

document.addEventListener("DOMContentLoaded", async () => {
    const topicSelect = document.getElementById("topic-select");
    const problemSelect = document.getElementById("question-select");
    const progressBar = document.getElementById("progress");
    
    // Check for newly completed questions
    const newlyCompleted = sessionStorage.getItem("newlyCompletedQuestion");
    if (newlyCompleted) {
        // Show notification for newly completed question
        showCompletionNotification();
        // Clear the flag so notification doesn't show again on refresh
        sessionStorage.removeItem("newlyCompletedQuestion");
    }
    
    // Load saved profile photo (if any) from sessionStorage
    const savedPhoto = sessionStorage.getItem("profilePhoto");
    if (savedPhoto) {
        document.getElementById("profile-photo").src = savedPhoto;
        document.getElementById("navbar-profile-photo").src = savedPhoto;
    }
    
    // Update username in navbar
    const username = sessionStorage.getItem("username") || "Guest";
    document.getElementById("navbar-username").textContent = username;
    document.getElementById("username").textContent = username;
    
    // Update progress bar
    updateProgressBar();
    
    // Ensure content is visible regardless of animations
    document.querySelector('.progress-container').style.display = 'block';
    document.querySelector('.question-list-container').style.display = 'block';
    
    // Add animation classes after ensuring visibility
    setTimeout(() => {
        document.querySelector('.progress-container').classList.add('animate-in');
        setTimeout(() => {
            document.querySelector('.question-list-container').classList.add('animate-in');
        }, 200);
    }, 300);
    
    // Add visual effects for the topic list immediately to ensure visibility
    const topicGroups = document.querySelectorAll('.topic-group');
    topicGroups.forEach((group) => {
        group.style.display = 'block';
        group.classList.add('topic-animate');
    });
    
    // Check authentication
    const token = sessionStorage.getItem('token');
    /* 
    Temporarily commented out to ensure content visibility for testing
    if (!token) {
        // Redirect to login page if no token found
        window.location.href = "index.html";
    }
    */

    // Fetch topics on page load
    try {
        const topicResponse = await fetch("https://collegeproject-fnkx.onrender.com/api/topics");
        const topics = await topicResponse.json();

        if (topicResponse.ok && topics.length > 0) {
            topics.forEach((topic, index) => {
                const option = document.createElement("option");
                option.value = topic._id;
                option.textContent = topic.name;
                topicSelect.appendChild(option);
                
                // Add slight delay to each option for a staggered effect
                option.style.transitionDelay = `${index * 50}ms`;
            });
            
            // Add animation class to show options
            setTimeout(() => {
                topicSelect.classList.add('options-loaded');
            }, 300);
        } else {
            console.error("No topics found");
        }
    } catch (error) {
        console.error("Error fetching topics:", error);
    }

    // Event listener for topic selection
    topicSelect.addEventListener("change", async () => {
        const selectedTopicId = topicSelect.value;

        // Clear existing problem options
        problemSelect.innerHTML = '<option value="" disabled selected>Select a Problem</option>';
        problemSelect.disabled = true;
        problemSelect.classList.remove('options-loaded');

        // Show loading indicator
        const startButton = document.getElementById("start-question-button");
        startButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        startButton.disabled = true;

        // Fetch problems for the selected topic
        try {
            const response = await fetch(`https://collegeproject-fnkx.onrender.com/api/problems/by-topic/${selectedTopicId}`);
            const problems = await response.json();

            if (response.ok && problems.length > 0) {
                problems.forEach((problem, index) => {
                    const option = document.createElement("option");
                    option.value = problem._id;
                    option.textContent = problem.title;
                    problemSelect.appendChild(option);
                    
                    // Add slight delay to each option
                    option.style.transitionDelay = `${index * 30}ms`;
                });
                
                problemSelect.disabled = false;
                
                // Add animation class after a slight delay
                setTimeout(() => {
                    problemSelect.classList.add('options-loaded');
                    startButton.innerHTML = 'Start Question <i class="fas fa-arrow-right"></i>';
                    startButton.disabled = false;
                }, 300);
            } else {
                console.error("No problems found for this topic");
                startButton.innerHTML = 'No questions available';
                setTimeout(() => {
                    startButton.innerHTML = 'Start Question <i class="fas fa-arrow-right"></i>';
                    startButton.disabled = true;
                }, 2000);
            }
        } catch (error) {
            console.error("Error fetching problems:", error);
            startButton.innerHTML = 'Error loading questions';
            setTimeout(() => {
                startButton.innerHTML = 'Start Question <i class="fas fa-arrow-right"></i>';
                startButton.disabled = true;
            }, 2000);
        }
    });

    // Event listener for problem submission
    document.getElementById("start-question-button").addEventListener("click", async () => {
        const selectedProblemId = problemSelect.value;
        if (!selectedProblemId) {
            // Visual feedback for the user
            const startButton = document.getElementById("start-question-button");
            startButton.innerHTML = '<i class="fas fa-exclamation-circle"></i> Select a problem first';
            startButton.classList.add('button-error');
            
            setTimeout(() => {
                startButton.innerHTML = 'Start Question <i class="fas fa-arrow-right"></i>';
                startButton.classList.remove('button-error');
            }, 2000);
            return;
        }

        // Visual feedback that we're starting
        const startButton = document.getElementById("start-question-button");
        startButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Starting...';
        
        // Store problem ID in sessionStorage
        sessionStorage.setItem('problemId', selectedProblemId);

        // Redirect to the problem-solving page after a brief delay
        setTimeout(() => {
            window.location.href = "solve.html";
        }, 500);
    });
});

// Function to update progress bar
function updateProgressBar() {
    const completedQuestions = JSON.parse(sessionStorage.getItem("completedQuestions") || "[]");
    const totalQuestions = 15; // Example total number of questions
    const progressPercentage = Math.round((completedQuestions.length / totalQuestions) * 100);
    
    const progressElement = document.getElementById("progress");
    const modalProgressElement = document.getElementById("modal-progress");
    const progressPercentageElement = document.getElementById("progress-percentage");
    const progressPercentageMainElement = document.getElementById("progress-percentage-main");
    const completedCountElement = document.getElementById("completed-count");
    const totalCountElement = document.getElementById("total-count");
    
    // Update the percentage display elements
    if (progressPercentageElement) {
        progressPercentageElement.textContent = `${progressPercentage}%`;
    }
    
    if (progressPercentageMainElement) {
        progressPercentageMainElement.textContent = `${progressPercentage}%`;
    }
    
    // Update the completed count
    if (completedCountElement) {
        completedCountElement.textContent = completedQuestions.length;
    }
    
    // Update the total count
    if (totalCountElement) {
        totalCountElement.textContent = totalQuestions;
    }
    
    // Update the progress bars
    if (progressElement) {
        progressElement.style.width = `${progressPercentage}%`;
        progressElement.textContent = progressPercentage > 0 ? `${progressPercentage}%` : '';
    }
    
    if (modalProgressElement) {
        modalProgressElement.style.width = `${progressPercentage}%`;
        modalProgressElement.textContent = progressPercentage > 0 ? `${progressPercentage}%` : '';
    }
}

// Function to show completion notification on dashboard
function showCompletionNotification() {
    // Create the notification element if it doesn't exist
    let notification = document.getElementById('dashboard-notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'dashboard-notification';
        notification.className = 'dashboard-notification';
        document.body.appendChild(notification);
    }
    
    // Get the number of completed questions
    const completedQuestions = JSON.parse(sessionStorage.getItem("completedQuestions") || "[]");
    const totalQuestions = 15; // Example total
    
    // Set notification message
    notification.innerHTML = `
        <div class="notification-icon">🏆</div>
        <div class="notification-content">
            <div class="notification-title">Progress Updated!</div>
            <div class="notification-message">You've completed ${completedQuestions.length} out of ${totalQuestions} questions.</div>
        </div>
        <button class="notification-close" onclick="this.parentElement.classList.remove('show')">×</button>
    `;
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 500);
    
    // Hide notification after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 5500);
}
