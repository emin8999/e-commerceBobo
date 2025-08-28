document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("storeJwt");

  if (!token) {
    window.location.href = "store-login.html";
  }
});
