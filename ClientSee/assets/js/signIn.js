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

document
  .getElementById("loginForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
      alert("Please fill in both email and password");
      return;
    }

    try {
      const response = await fetch(
        "http://116.203.51.133:8080/home/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "Login failed");
        return;
      }

      const data = await response.json();

      const token = data.token;
      if (token) {
        localStorage.setItem("jwtToken", token);

        alert("Login successful! JWT token saved.");
      } else {
        alert("No token received");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Error during login. Check console for details.");
    }
  });
