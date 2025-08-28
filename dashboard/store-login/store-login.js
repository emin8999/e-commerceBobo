const form = document.getElementById("storeLoginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const eyeOpen = document.getElementById("eyeOpen");
const eyeClosed = document.getElementById("eyeClosed");
const errorMsg = document.getElementById("errorMsg");

// ─── Переключение видимости пароля ───
togglePassword.addEventListener("mousedown", (e) => {
  e.preventDefault();
  const isVisible = passwordInput.type === "text";
  passwordInput.type = isVisible ? "password" : "text";
  eyeOpen.style.display = isVisible ? "block" : "none";
  eyeClosed.style.display = isVisible ? "none" : "block";
});

// ─── Проверка токена при загрузке ───
const savedToken = localStorage.getItem("storeJwt");
if (savedToken) {
  window.location.href = "store-page.html";
}

// ─── Обработка отправки формы ───
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  errorMsg.textContent = "";

  if (!email || !password) {
    errorMsg.textContent = "Please fill in all fields.";
    return;
  }

  const bodyData = { email, password };
  console.log("Sending request body:", bodyData);

  try {
    const response = await fetch(
      "http://116.203.51.133:8080/home/store/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(bodyData),
      }
    );

    const rawText = await response.text();
    console.log("Raw response:", rawText);

    if (!response.ok) {
      errorMsg.textContent = `Server error: ${response.status} ${response.statusText}`;
      return;
    }

    let data;
    try {
      data = JSON.parse(rawText);
    } catch (err) {
      console.error("JSON parse error:", err);
      errorMsg.textContent = "Invalid server response format.";
      return;
    }

    console.log("Parsed response:", data);

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
