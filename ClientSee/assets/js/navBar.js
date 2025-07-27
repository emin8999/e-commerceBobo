function toggleMenu() {
  document.getElementById("sidebar").classList.toggle("open");
  document.getElementById("overlay").classList.toggle("active");
}

// Автоматическое закрытие меню при ширине > 600px
window.addEventListener("resize", function () {
  if (window.innerWidth > 600) {
    document.getElementById("sidebar").classList.remove("open");
    document.getElementById("overlay").classList.remove("active");
  }
});
const flagImg = document.querySelector(".nav-bar-language img");
const languageSelect = document.getElementById("language-select");

languageSelect.addEventListener("change", () => {
  const selected = languageSelect.value;

  const flags = {
    EN: "us",
    AZ: "az",
    RU: "ru",
  };

  flagImg.src = `https://flagcdn.com/${flags[selected]}.svg`;
  flagImg.alt = selected;
});
