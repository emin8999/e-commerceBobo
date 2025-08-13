const container = document.getElementById("shop");

fetch("http://116.203.51.133:8080/home/product/public")
  .then((res) => res.json())
  .then((data) => {
    container.innerHTML = "";

    if (data.length > 0) {
      data.forEach((product) => {
        const productEl = document.createElement("div");
        productEl.classList.add("product-card");

        productEl.innerHTML = `
          <h3>${product.name}</h3>
          <img src="${product.imageUrls}" />
          <p>${product.description}</p>
          <p>Price: ${product.price}</p>
          <p> ${product.color}</p>
          <p> ${product.status}</p>
          <p> ${product.storeName}</p>
          <p> ${product.sizeQuantities}</p>
        `;

        container.appendChild(productEl);
      });
    } else {
      container.innerHTML = "<p>No Products</p>";
    }
  })
  .catch((err) => {
    console.error("Error:", err);
    container.innerHTML = "<p>Error</p>";
  });

function updateCartCountDisplay() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  localStorage.setItem("cartCount", count);
}

localStorage.setItem("maxPrice", "15000");

document.addEventListener("DOMContentLoaded", () => {
  const maxPrice = parseInt(localStorage.getItem("maxPrice")) || 100;
  const priceRange = document.getElementById("filter-price");
  const priceValue = document.getElementById("price-value");

  priceRange.max = maxPrice;
  priceRange.value = 0;
  priceValue.textContent = 0;

  priceRange.addEventListener("input", () => {
    priceValue.textContent = priceRange.value;
  });
});
const toggleButton = document.getElementById("toggle-filters");
const filterWrapper = document.querySelector(".filter-box-wrapper");
const filterIcon = document.getElementById("filter-icon");

toggleButton.addEventListener("click", () => {
  filterWrapper.classList.toggle("open");

  const isOpen = filterWrapper.classList.contains("open");
  filterIcon.src = isOpen
    ? "./assets/Img/CloseSVG.svg"
    : "./assets/Img/FilterSVG.svg";
});

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
// function renderProducts(products) {
//   shop.innerHTML = ""; // Очищаем контейнер перед отрисовкой

//   if (products.length === 0) {
//     // Если товаров нет — отображаем сообщение
//     shop.innerHTML = "<p>No products available.</p>";
//     return;
//   }

//   // Перебираем каждый товар и создаём карточку
//   products.forEach((p) => {
//     const card = document.createElement("div");
//     card.className = "product-card";

//     // Берем первую картинку из массива или пустую строку
//     const firstImage = Array.isArray(p.images) ? p.images[0] : p.image || "";

//     // Если изображение есть — показываем, иначе текст "No Image"
//     const imageElement = firstImage
//       ? `<img src="${firstImage}" alt="${p.name}">`
//       : "<div class='no-image'>No Image</div>";

//     // HTML-разметка карточки товара
//     card.innerHTML = `
//       ${imageElement}
//       <h3>${p.name || "Unnamed"}</h3>
//       <p>Store: ${p.store || p.shop || ""}</p>
//       <p>Price: ₼${p.price || 0}</p>
//     `;

//     // Кнопка "Add to Cart"
//     const button = document.createElement("button");
//     button.textContent = "Add to Cart";

//     // При клике добавляем товар в корзину
//     button.addEventListener("click", (e) => {
//       e.stopPropagation(); // Чтобы не сработал переход по карточке
//       addToCart(p);
//     });

//     card.appendChild(button);

//     // Клик по карточке товара — переход на страницу просмотра
//     card.addEventListener("click", () => {
//       localStorage.setItem("selectedProduct", JSON.stringify(p));
//       window.location.href = "productVision.html";
//     });

//     // Добавляем карточку в контейнер
//     shop.appendChild(card);
//   });
// }

// Рендерим все товары при загрузке страницы
// renderProducts(products);

// Обновляем товары, если localStorage изменился (например, через другую вкладку)
window.addEventListener("storage", (event) => {
  if (event.key === "products") {
    const updatedProducts = JSON.parse(event.newValue || "[]");
    renderProducts(updatedProducts);
  }
});
// Получаем все товары из localStorage по котегориям

const allProducts = JSON.parse(localStorage.getItem("products") || "[]");
const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get("category");
const store = urlParams.get("store");

let filteredProducts = [...allProducts];

// Фильтр по категории
if (category) {
  filteredProducts = filteredProducts.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  );
}

// Фильтр по магазину
if (store) {
  filteredProducts = filteredProducts.filter(
    (p) => p.store.toLowerCase() === store.toLowerCase()
  );
}

// Отрисовать
// renderProducts(filteredProducts);
