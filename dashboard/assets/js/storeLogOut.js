const storeLogoutBtn = document.getElementById("storeLogoutBtn");

if (storeLogoutBtn) {
  storeLogoutBtn.addEventListener("click", () => {
    localStorage.removeItem("storeJwt");

    window.location.href = "store-login.html";
  });
}
