document.querySelectorAll(".accordion-header").forEach((header) => {
  header.addEventListener("click", () => {
    const content = header.nextElementSibling;
    const icon = header.querySelector(".icon");

    const isOpen = content.style.maxHeight;

    document.querySelectorAll(".accordion-content").forEach((c) => {
      c.style.maxHeight = null;
      c.previousElementSibling.querySelector(".icon").textContent = "➕";
    });

    if (!isOpen) {
      content.style.maxHeight = content.scrollHeight + "px";
      icon.textContent = "➖";
    }
  });
});

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}
