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

// form.addEventListener("submit", async (e) => {
//   e.preventDefault();

//   const email = emailInput.value.trim();
//   const password = passwordInput.value.trim();
//   errorMsg.textContent = "";

//   try {
//     const response = await fetch("http://localhost:8080/home/store/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password }),
//     });

//     if (response.ok) {
//       const result = await response.json();

//       localStorage.setItem("jwtToken", result.token);

//       window.location.href = "store-products.html";
//     } else {
//       const errorData = await response.json();
//       errorMsg.textContent = errorData.message || "Invalid email or password";
//     }
//   } catch (error) {
//     console.error("Login failed:", error);
//     errorMsg.textContent = "Server error. Please try again later.";
//   }
// });
document
  .getElementById("storeLoginForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMsg = document.getElementById("errorMsg");

    errorMsg.textContent = "";

    if (!email || !password) {
      errorMsg.textContent = "Please fill in all fields.";
      return;
    }

    try {
      const response = await fetch(
        "http://116.203.51.133:8080/home/store/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        errorMsg.textContent = `Server error: ${response.status} ${response.statusText}`;
        return;
      }

      const data = await response.json();

      console.log("Server response:", data);

      if (data.success) {
        alert("Login successful!");
        window.location.href = "../dash-store-panel.html";
      } else {
        errorMsg.textContent = data.message || "Login failed.";
      }
    } catch (error) {
      console.error("Error:", error);
      errorMsg.textContent = "An error occurred. Please try again.";
    }
  });
