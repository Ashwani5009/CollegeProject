// Handle login form submission
document.getElementById("login-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    // Validate input fields
    if (!username || !password) {
        alert("Please fill in all fields.");
        return;
    }

    const loginData = { username, password };

    try {
        // Send login request
        const response = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(loginData),
        });

        const data = await response.json();

        if (response.ok) {
            // Successful login
            alert("Login successful");

            // Store the token securely (consider sessionStorage or cookies for sensitive data)
            sessionStorage.setItem('token', data.token);

            // Redirect to dashboard or another secure page
            window.location.href = "index.html";
        } else {
            // Login failed
            alert("Login failed: " + data.message);
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert("An error occurred. Please try again later.");
    }
});

// Handle logout button (if present)
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        // Clear token from local storage
        sessionStorage.removeItem("token");

        // Redirect to the login page
        window.location.href = "/login.html";
    });
}
