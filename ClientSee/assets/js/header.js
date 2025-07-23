function updateCartCountFromStorage() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const total = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  document.querySelector(".cart-count").textContent = total;
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCountFromStorage();
});

// Чтобы обновлять в реальном времени при переходах — можно добавить:
window.addEventListener("storage", () => {
  updateCartCountFromStorage();
});
// Обновлять корзину при загрузке страницы
document.addEventListener("DOMContentLoaded", renderCart);

// Обновлять корзину при любом изменении (например, из другой вкладки или из shop.js)
window.addEventListener("storage", renderCart);

// Добавление категорий в селект
document.addEventListener("DOMContentLoaded", function () {
  const select = document.getElementById("categorySelect");

  // Получаем товары из localStorage
  const storedProducts = localStorage.getItem("products");

  if (storedProducts) {
    try {
      const products = JSON.parse(storedProducts);

      // Получаем уникальные категории
      const categoriesSet = new Set();
      products.forEach((product) => {
        if (product.category) {
          categoriesSet.add(product.category.trim());
        }
      });

      const uniqueCategories = Array.from(categoriesSet);

      // Добавляем в select
      uniqueCategories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        select.appendChild(option);
      });

      // При выборе категории — фильтровать товары или переходить (можно настроить)
      select.addEventListener("change", function () {
        const selectedCategory = this.value;
        alert(`Вы выбрали категорию: ${selectedCategory}`);
        // Можно также сделать window.location.href = `category.html?cat=${selectedCategory}`;
      });
    } catch (err) {
      console.error("Ошибка при разборе товаров:", err);
    }
  } else {
    console.warn("Продукты не найдены в localStorage.");
  }
});
