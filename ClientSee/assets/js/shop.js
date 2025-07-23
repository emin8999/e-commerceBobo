// Получаем элемент контейнера товаров на странице
const shop = document.getElementById("shop");

// Загружаем массив товаров и корзины из localStorage или создаем пустой массив
let products = JSON.parse(localStorage.getItem("products") || "[]");
let cart = JSON.parse(localStorage.getItem("cart") || "[]");

// Сохраняем текущее состояние корзины в localStorage
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Обновляем количество товаров в корзине и сохраняем в localStorage
function updateCartCountDisplay() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  localStorage.setItem("cartCount", count);
}

// Добавляем товар в корзину
function addToCart(product) {
  const index = cart.findIndex((p) => p.id === product.id);

  if (index >= 0) {
    // Если товар уже есть в корзине, увеличиваем его количество
    cart[index].quantity += 1;
  } else {
    // Иначе добавляем новый товар с количеством 1
    product.quantity = 1;
    cart.push(product);
  }

  saveCart(cart); // сохраняем корзину
  updateCartCountDisplay(); // обновляем отображение количества

  alert("Added to cart");

  // Отправляем событие "storage" для обновления корзины на других страницах
  window.dispatchEvent(new Event("storage"));
}

// Отображение товаров на странице
function renderProducts(products) {
  shop.innerHTML = ""; // Очищаем контейнер перед отрисовкой

  if (products.length === 0) {
    // Если товаров нет — отображаем сообщение
    shop.innerHTML = "<p>No products available.</p>";
    return;
  }

  // Перебираем каждый товар и создаём карточку
  products.forEach((p) => {
    const card = document.createElement("div");
    card.className = "product-card";

    // Берем первую картинку из массива или пустую строку
    const firstImage = Array.isArray(p.images) ? p.images[0] : p.image || "";

    // Если изображение есть — показываем, иначе текст "No Image"
    const imageElement = firstImage
      ? `<img src="${firstImage}" alt="${p.name}">`
      : "<div class='no-image'>No Image</div>";

    // HTML-разметка карточки товара
    card.innerHTML = `
      ${imageElement}
      <h3>${p.name || "Unnamed"}</h3>
      <p>Store: ${p.store || p.shop || ""}</p>
      <p>Price: ₼${p.price || 0}</p>
    `;

    // Кнопка "Add to Cart"
    const button = document.createElement("button");
    button.textContent = "Add to Cart";

    // При клике добавляем товар в корзину
    button.addEventListener("click", (e) => {
      e.stopPropagation(); // Чтобы не сработал переход по карточке
      addToCart(p);
    });

    card.appendChild(button);

    // Клик по карточке товара — переход на страницу просмотра
    card.addEventListener("click", () => {
      localStorage.setItem("selectedProduct", JSON.stringify(p));
      window.location.href = "productVision.html";
    });

    // Добавляем карточку в контейнер
    shop.appendChild(card);
  });
}

// Рендерим все товары при загрузке страницы
renderProducts(products);

// Обновляем товары, если localStorage изменился (например, через другую вкладку)
window.addEventListener("storage", (event) => {
  if (event.key === "products") {
    const updatedProducts = JSON.parse(event.newValue || "[]");
    renderProducts(updatedProducts);
  }
});
