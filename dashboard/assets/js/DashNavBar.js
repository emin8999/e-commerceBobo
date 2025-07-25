document.querySelectorAll(".accordion-header").forEach((header) => {
  header.addEventListener("click", () => {
    const content = header.nextElementSibling;
    const icon = header.querySelector(".icon");

    const isOpen = content.style.maxHeight;

    // Закрыть все
    document.querySelectorAll(".accordion-content").forEach((c) => {
      c.style.maxHeight = null;
      c.previousElementSibling.querySelector(".icon").textContent = "➕";
    });

    // Открыть, если не было открыто
    if (!isOpen) {
      content.style.maxHeight = content.scrollHeight + "px";
      icon.textContent = "➖";
    }
  });
});
// logout button functionality

function logout() {
  // Очистка токенов / localStorage
  localStorage.clear();
  // Перенаправление на страницу входа
  window.location.href = "login.html";
}
