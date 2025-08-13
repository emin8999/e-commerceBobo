const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const eyeIcon = document.getElementById("eyeIcon");
const eyeSlashIcon = document.getElementById("eyeSlashIcon");

togglePassword.addEventListener("click", () => {
  const isPasswordHidden = passwordInput.type === "password";
  passwordInput.type = isPasswordHidden ? "text" : "password";
  eyeIcon.classList.toggle("hidden", isPasswordHidden);
  eyeSlashIcon.classList.toggle("hidden", !isPasswordHidden);
});

const form = document.getElementById("storeLoginForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = form.email.value.trim();
  const password = form.password.value;
  const rememberMe = form.rememberMe.checked;
  const payload = { email, password, rememberMe };
  try {
    const response = await fetch(
      "http://116.203.51.133:8080/home/admin/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const text = await response.text();

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

    const data = await response.json();
    console.log("Успешный вход:", data);
    alert("Вход успешен!");
  } catch (error) {
    console.error("Ошибка запроса:", error);
    alert("Ошибка соединения с сервером");
  }
});
