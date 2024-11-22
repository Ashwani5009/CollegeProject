function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const loginMessage = document.getElementById("loginMessage");

    // Mock authentication logic
    if (username === "user" && password === "password") {
        // Store login status in local storage (simulated login)
        localStorage.setItem("isLoggedIn", "true");
        window.location.href = "profile.html";  // Redirect to profile page
    } else {
        loginMessage.innerText = "Invalid username or password";
    }
}

// Redirect to profile if already logged in
if (localStorage.getItem("isLoggedIn") === "true") {
    window.location.href = "profile.html";
}
