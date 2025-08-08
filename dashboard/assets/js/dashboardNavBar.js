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
