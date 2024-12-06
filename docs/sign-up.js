document.getElementById("sign-up-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    // Validate input fields
    if (!username || !password) {
        alert("Please fill in all fields.");
        return;
    }

    const signUpData = { username, password };

    try {
        // Send sign-up request to the backend
        const response = await fetch("http://localhost:5000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(signUpData),
        });

        const data = await response.json();

        if (response.ok) {
            // Successful registration
            alert("Registration successful! You can now log in.");
            window.location.href = "login.html"; // Redirect to login page
        } else {
            // Registration failed
            alert("Registration failed: " + data.message);
        }
    } catch (error) {
        console.error("Error during registration:", error);
        alert("An error occurred. Please try again later.");
    }
});
