document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("storeJwt");

  if (!token) {
    window.location.href = "/dashboard/store-login.html";
  }
});
