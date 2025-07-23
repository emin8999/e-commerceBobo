const menuBtn = document.getElementById("menuBtn");
const menuModal = document.getElementById("menuModal");
const categoryList = document.getElementById("categoryList");
const storeList = document.getElementById("storeList");

menuBtn.addEventListener("click", (e) => {
  e.preventDefault();
  renderCategoriesAndStores();

  // Позиционируем под кнопкой
  const rect = menuBtn.getBoundingClientRect();
  menuModal.style.top = rect.bottom + window.scrollY + "px";
  menuModal.style.left = rect.left + "px";

  menuModal.classList.toggle("show");
});

// Скрыть при клике вне меню
document.addEventListener("click", function (e) {
  if (!menuModal.contains(e.target) && e.target !== menuBtn) {
    menuModal.classList.remove("show");
  }
});

function renderCategoriesAndStores() {
  const allProducts = JSON.parse(localStorage.getItem("products") || "[]");
  const allStores = JSON.parse(localStorage.getItem("stores") || "[]");

  const categories = [...new Set(allProducts.map((p) => p.category))];
  categoryList.innerHTML = categories.length
    ? categories
        .map(
          (cat) =>
            `<li><a href="shop.html?category=${encodeURIComponent(
              cat
            )}">${cat}</a></li>`
        )
        .join("")
    : "<li>No categories found</li>";

  storeList.innerHTML = allStores.length
    ? allStores
        .map(
          (store) =>
            `<li><a href="shop.html?store=${encodeURIComponent(
              store.storeName
            )}">${store.storeName}</a></li>`
        )
        .join("")
    : "<li>No stores found</li>";
}
