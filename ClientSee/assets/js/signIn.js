const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

if (togglePassword && passwordInput) {
  togglePassword.addEventListener("click", () => {
    const isPasswordVisible = passwordInput.type === "text";
    passwordInput.type = isPasswordVisible ? "password" : "text";

    togglePassword.classList.toggle("fa-eye", isPasswordVisible);
    togglePassword.classList.toggle("fa-eye-slash", !isPasswordVisible);
  });
}

const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (email && password) {
      localStorage.setItem("userEmail", email);
      alert("Logged in successfully!");
      loginForm.reset();
    } else {
      alert("Please fill in both email and password.");
    }
  });
}

const signupButton = document.querySelector(".signup");
if (signupButton) {
  signupButton.addEventListener("click", () => {
    window.location.href = "signUp.html";
  });
}

function signInWithGoogle() {
  alert("Google sign-in clicked (demo mode)");
}

window.signInWithGoogle = signInWithGoogle;
