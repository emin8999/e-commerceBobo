const form = document.getElementById("storeLoginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const errorMsg = document.getElementById("errorMsg");

// Toggle password visibility
togglePassword.addEventListener("click", () => {
    const type = passwordInput.type === "password" ? "text" : "password";
    passwordInput.type = type;
});

form.addEventListener("submit", async(e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    errorMsg.textContent = "";

    try {
        const response = await fetch("http://localhost:8080/home/store/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const result = await response.json();

            // Save JWT token to localStorage for future requests
            localStorage.setItem("jwtToken", result.token);

            // Redirect to dashboard or store page
            window.location.href = "store-products.html";

        } else {
            const errorData = await response.json();
            errorMsg.textContent = errorData.message || "Invalid email or password";
        }
    } catch (error) {
        console.error("Login failed:", error);
        errorMsg.textContent = "Server error. Please try again later.";
    }
});