const Customers_API_BASE = "http://116.203.51.133:8080";
const ENDPOINT = `${Customers_API_BASE}/contact`; // поменяй, если у тебя другой путь
const form = document.querySelector(".contact-form");
const textarea = document.getElementById("message");
const submitBtn = form.querySelector('button[type="submit"]');
const statusEl =
  document.querySelector(".form-status") ||
  (() => {
    const el = document.createElement("div");
    el.className = "form-status";
    el.style.marginTop = "10px";
    form.appendChild(el);
    return el;
  })();
textarea.style.resize = "none";
function setStatus(msg, type = "info") {
  statusEl.textContent = msg;
  statusEl.style.color = type === "error" ? "#B91C1C" : "#065F46";
}
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = form.querySelector('[name="name"]')?.value.trim();
  const email = form.querySelector('[name="email"]')?.value.trim();
  const subject =
    form.querySelector('[name="subject"]')?.value.trim() || "Contact form";
  const message = form
    .querySelector('[name="message"], #message')
    ?.value.trim();
  // простая валидация
  if (!name || !email || !message) {
    setStatus("Please fill in your name, email, and message.", "error");
    return;
  }
  // блокируем сабмит
  submitBtn.disabled = true;
  submitBtn.dataset.originalText = submitBtn.textContent;
  submitBtn.textContent = "Sending…";
  setStatus("");
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, subject, message }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `Request failed: ${res.status}`);
    }
    // успех
    setStatus("Your message has been sent successfully!");
    form.reset();
  } catch (err) {
    console.error(err);
    setStatus("Failed to send message. Please try again.", "error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = submitBtn.dataset.originalText || "Send";
  }
});
