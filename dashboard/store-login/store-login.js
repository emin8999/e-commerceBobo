const form = document.getElementById("storeLoginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const eyeOpen = document.getElementById("eyeOpen");
const eyeClosed = document.getElementById("eyeClosed");
const errorMsg = document.getElementById("errorMsg");

togglePassword.addEventListener("mousedown", (e) => {
  e.preventDefault();

  const isVisible = passwordInput.type === "text";
  passwordInput.type = isVisible ? "password" : "text";

  eyeOpen.style.display = isVisible ? "block" : "none";
  eyeClosed.style.display = isVisible ? "none" : "block";
});

form.addEventListener("submit", async (e) => {
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

      localStorage.setItem("jwtToken", result.token);

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
