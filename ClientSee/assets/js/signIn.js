// Toggle password visibility
const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

if (togglePassword && passwordInput) {
  togglePassword.addEventListener("click", () => {
    const type =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    togglePassword.textContent = type === "password" ? "👁️" : "🙈";
  });
}

// Handle form submission
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email && password) {
      localStorage.setItem("userEmail", email);
      alert("Logged in successfully!");
      loginForm.reset();
    }
  });
}

// Redirect to signup page
const signupButton = document.querySelector(".signup");
if (signupButton) {
  signupButton.addEventListener("click", () => {
    window.location.href = "signUp.html";
  });
}

// Demo Google login
function signInWithGoogle() {
  alert("Google sign-in clicked (demo mode)");
}
