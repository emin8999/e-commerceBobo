document.querySelector(".contact-form").addEventListener("submit", function () {
  alert("Your message has been sent successfully!");
});
const textarea = document.getElementById("message");
textarea.style.resize = "none"; // запрещает изменение размера вообще
