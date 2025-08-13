const Dash_Nav_API_BASE = "http://116.203.51.133:8080";
/* ───────────── Accordion ───────────── */
document.querySelectorAll(".accordion-header").forEach((header) => {
  header.setAttribute("role", "button");
  header.setAttribute("aria-expanded", "false");
  const content = header.nextElementSibling;
  if (content) {
    content.style.maxHeight = null;
    content.classList.remove("open");
    content.setAttribute("aria-hidden", "true");
  }
  header.addEventListener("click", () => {
    const thisContent = header.nextElementSibling;
    // закрываем все
    document.querySelectorAll(".accordion-content").forEach((c) => {
      c.style.maxHeight = null;
      c.classList.remove("open");
      c.setAttribute("aria-hidden", "true");
      const h = c.previousElementSibling;
      h?.setAttribute("aria-expanded", "false");
      h?.querySelector(".icon") &&
        (h.querySelector(".icon").textContent = ":heavy_plus_sign:");
    });
    // открываем текущий
    if (thisContent) {
      const icon = header.querySelector(".icon");
      thisContent.classList.add("open");
      thisContent.style.maxHeight = thisContent.scrollHeight + "px";
      thisContent.setAttribute("aria-hidden", "false");
      header.setAttribute("aria-expanded", "true");
      if (icon) icon.textContent = ":heavy_minus_sign:";
    }
  });
});
// Рекоммендуемый CSS для плавности (добавь в свой CSS):
// .accordion-content { overflow: hidden; transition: max-height .25s ease; }
/* ───────────── Logout ───────────── */
// ── ВАРИАНТ A: cookie-сессии на сервере (рекомендуется)
// Сервер хранит сессию, на фронте только делаем POST /auth/logout
async function logoutCookieSession() {
  try {
    const res = await fetch(`${Dash_Nav_API_BASE}/auth/logout`, {
      method: "POST",
      credentials: "include", // отправим cookie на домен бэка
      headers: { "Content-Type": "application/json" },
    });
    // даже если ответ не 200, всё равно чистим клиент и уводим
  } catch (e) {
    console.warn("Logout request failed, proceeding to client cleanup.");
  } finally {
    // почистим только свои ключи, не весь localStorage
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    window.location.href = "login.html";
  }
}
// ── ВАРИАНТ B: Bearer-токен (если ты хранишь токен в localStorage)
async function logoutBearer() {
  const token = localStorage.getItem("access_token");
  try {
    await fetch(`${Dash_Nav_API_BASE}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  } catch (e) {
    console.warn("Logout request failed, proceeding to client cleanup.");
  } finally {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    window.location.href = "login.html";
  }
}
// ВЫБЕРИ ОДИН ИЗ ВАРИАНТОВ:
// Если у тебя cookie-сессии на сервере:
async function logout() {
  await logoutCookieSession();
}
// Если у тебя Bearer-токены:
// async function logout() { await logoutBearer(); }
