const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const eyeIcon = document.getElementById("eyeIcon");
const eyeSlashIcon = document.getElementById("eyeSlashIcon");

// Показ/скрытие пароля
togglePassword.addEventListener("click", () => {
  const isPasswordHidden = passwordInput.type === "password";
  passwordInput.type = isPasswordHidden ? "text" : "password";
  eyeIcon.classList.toggle("hidden", isPasswordHidden);
  eyeSlashIcon.classList.toggle("hidden", !isPasswordHidden);
});

// Проверяем, есть ли JWT в localStorage, если есть — сразу редирект
const existingToken = localStorage.getItem("jwtToken");
if (existingToken) {
  console.log("JWT найден в localStorage:", existingToken);
  window.location.href = "summary.html";
}

const form = document.getElementById("storeLoginForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const rememberMe = document.getElementById("rememberMe").checked; // true или false

  // Подготавливаем payload с rememberMe
  const payload = { email, password, rememberMe };

  // Выводим в консоль данные, которые будут отправлены
  console.log("Отправляем на сервер следующие данные (payload):");
  console.log(payload);
  console.log("Формат данных JSON:", JSON.stringify(payload));

  try {
    const response = await fetch(
      "http://116.203.51.133:8080/home/admin/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const text = await response.text();
    console.log("Status:", response.status);
    console.log("Ответ сервера (raw text):", text);

    if (!response.ok) {
      let message;
      try {
        const errorData = JSON.parse(text);
        message = errorData.message || response.statusText;
      } catch {
        message = text || response.statusText;
      }
      alert("Ошибка: " + message);
      return;
    }

    const data = JSON.parse(text);

    // Сохраняем JWT в localStorage
    if (data.token) {
      localStorage.setItem("jwtToken", data.token);
      console.log("JWT сохранён в localStorage:", data.token);
    }

    // Редирект на summary.html после успешного логина
    window.location.href = "summary.html";
  } catch (error) {
    console.error("Ошибка запроса:", error);
    alert("Ошибка соединения с сервером");
  }
});
