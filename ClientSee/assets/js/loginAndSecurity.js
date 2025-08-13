const API_BASE = "http://116.203.51.133:8080";
const UPDATE_PATH = "/api/user/update"; // поменяй, если другой маршрут
const UPDATE_METHOD = "POST"; // можешь сменить на "PATCH", если так на бэке

const form = document.getElementById("securityForm");
const messageDiv = document.getElementById("message");
const submitBtn = form?.querySelector('button[type="submit"]');

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRe = /^[+()\-.\s\d]{6,20}$/; // простая проверка формата

function setMessage(text, color) {
  if (!messageDiv) return;
  messageDiv.textContent = text || "";
  messageDiv.style.color = color || "";
}

function toggleBusy(on) {
  if (!submitBtn) return;
  if (on) {
    submitBtn.dataset.originalText = submitBtn.textContent;
    submitBtn.textContent = "Saving…";
    submitBtn.disabled = true;
  } else {
    submitBtn.textContent = submitBtn.dataset.originalText || "Save";
    submitBtn.disabled = false;
  }
}

async function apiUpdate(payload) {
  const token = localStorage.getItem("token") || ""; // если используешь cookie-сессии — убери заголовок Authorization и добавь credentials: 'include'
  const res = await fetch(`${API_BASE}${UPDATE_PATH}`, {
    method: UPDATE_METHOD,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    // credentials: "include", // раскомментируй, если сессия через cookie
    body: JSON.stringify(payload),
  });

  // Поддержим и JSON, и текстовые ответы
  const contentType = res.headers.get("content-type") || "";
  if (!res.ok) {
    const errText = contentType.includes("application/json")
      ? JSON.stringify(await res.json()).slice(0, 300)
      : (await res.text()).slice(0, 300);
    throw new Error(errText || `Update failed (${res.status})`);
  }

  return contentType.includes("application/json")
    ? await res.json()
    : await res.text();
}

form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username")?.value.trim();
  const email = document.getElementById("email")?.value.trim();
  const phone = document.getElementById("phone")?.value.trim();
  const password = document.getElementById("password")?.value || "";
  const confirmPassword =
    document.getElementById("confirmPassword")?.value || "";

  setMessage("", "");

  // базовые проверки
  if (email && !emailRe.test(email)) {
    setMessage("Please enter a valid email.", "red");
    return;
  }
  if (phone && !phoneRe.test(phone)) {
    setMessage("Please enter a valid phone number.", "red");
    return;
  }
  if ((password || confirmPassword) && password !== confirmPassword) {
    setMessage("Passwords do not match!", "red");
    return;
  }

  // Собираем только заполненные поля
  const payload = {};
  if (username) payload.username = username;
  if (email) payload.email = email;
  if (phone) payload.phone = phone;
  if (password) {
    payload.newPassword = password;
    payload.confirmPassword = confirmPassword;
  }

  if (Object.keys(payload).length === 0) {
    setMessage("No changes to update.", "gray");
    return;
  }

  try {
    toggleBusy(true);
    const result = await apiUpdate(payload);

    // Успех: поддержим и текст, и JSON
    setMessage(
      typeof result === "string"
        ? result || "Changes saved successfully."
        : result?.message || "Changes saved successfully.",
      "green"
    );

    // очистим поля пароля
    const pwdEl = document.getElementById("password");
    const cpwdEl = document.getElementById("confirmPassword");
    if (pwdEl) pwdEl.value = "";
    if (cpwdEl) cpwdEl.value = "";
  } catch (err) {
    console.error(err);
    setMessage(err?.message || "Failed to update data.", "red");
  } finally {
    toggleBusy(false);
  }
});

/* ========= показать/скрыть пароли (оставил твою логику, чуть укрепил) ========= */
document.querySelectorAll(".toggle-password").forEach((toggle) => {
  const targetId = toggle.getAttribute("data-target");
  const input = document.getElementById(targetId);
  const eyeOpen = toggle.querySelector(".icon-eye-open");
  const eyeClosed = toggle.querySelector(".icon-eye-closed");

  if (input) {
    input.type = "password";
    if (eyeOpen) eyeOpen.style.display = "inline";
    if (eyeClosed) eyeClosed.style.display = "none";
  }

  toggle.addEventListener("click", () => {
    if (!input) return;

    if (input.type === "password") {
      input.type = "text";
      if (eyeOpen) eyeOpen.style.display = "none";
      if (eyeClosed) eyeClosed.style.display = "inline";
    } else {
      input.type = "password";
      if (eyeOpen) eyeOpen.style.display = "inline";
      if (eyeClosed) eyeClosed.style.display = "none";
    }
  });
});
