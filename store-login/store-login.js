const form = document.getElementById("storeLoginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const errorMsg = document.getElementById("errorMsg");

togglePassword.addEventListener("click", () => {
  const type = passwordInput.type === "password" ? "text" : "password";
  passwordInput.type = type;
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  const users = JSON.parse(localStorage.getItem("storeUsers") || "[]");
  const matched = users.find(
    (user) => user.email === email && user.password === password
  );

  if (matched) {
    localStorage.setItem(
      "storeLoggedIn",
      JSON.stringify({ storeId: matched.storeId, email: matched.email })
    );
    window.location.href = "store-dashboard.html";
  } else {
    errorMsg.textContent = "Invalid email or password";
  }
});
