const form = document.getElementById("storeLoginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const eyeOpen = document.getElementById("eyeOpen");
const eyeClosed = document.getElementById("eyeClosed");
const errorMsg = document.getElementById("errorMsg");

// Переключение видимости пароля
togglePassword.addEventListener("mousedown", (e) => {
  e.preventDefault();
  const isVisible = passwordInput.type === "text";
  passwordInput.type = isVisible ? "password" : "text";
  eyeOpen.style.display = isVisible ? "block" : "none";
  eyeClosed.style.display = isVisible ? "none" : "block";
});

// Проверка, есть ли уже токен при загрузке страницы
const savedToken = localStorage.getItem("storeJwt");
if (savedToken) {
  // Если токен есть, сразу перекидываем на панель
  window.location.href = "/dashboard/dash-store-panel.html";
}

// Обработка отправки формы
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
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

    if (data.token) {
      localStorage.setItem("storeJwt", data.token);
      window.location.href = "/dashboard/dash-store-panel.html";
    } else {
      errorMsg.textContent = data.message || "Login failed.";
    }
  } catch (error) {
    console.error("Error:", error);
    errorMsg.textContent = "An error occurred. Please try again.";
  }
});
