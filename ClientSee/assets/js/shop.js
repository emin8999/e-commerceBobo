let cart = JSON.parse(localStorage.getItem("cart") || "[]");

// Получаем товары
const allProducts = JSON.parse(localStorage.getItem("products") || "[]");
const container = document.getElementById("shop");

// Функция для отображения товаров
function renderProducts(products) {
  container.innerHTML = "";

  if (products.length === 0) {
    container.innerHTML = "<p>No products available.</p>";
    return;
  }

  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";

    const firstImage = Array.isArray(product.imageUrls)
      ? product.imageUrls[0]
      : product.imageUrls;

    const imageElement = firstImage
      ? `<img src="${firstImage}" alt="${product.name}" />`
      : "<div class='no-image'>No Image</div>";

    card.innerHTML = `
      ${imageElement}
      <h3>${product.name}</h3>
      <p>Store: ${product.storeName}</p>
      <p>Price: ₼${product.price}</p>
    <p>Color: ${(() => {
      try {
        const colors = JSON.parse(product.colors);
        return Array.isArray(colors) ? colors.join(", ") : colors;
      } catch {
        return product.colors;
      }
    })()}</p>
      <p>Status: ${product.status}</p>
    `;

    const button = document.createElement("button");
    button.textContent = "Add to Cart";
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      addToCart(product);
    });

    card.appendChild(button);

    card.addEventListener("click", () => {
      localStorage.setItem("selectedProduct", JSON.stringify(product));
      window.location.href = "productVision.html";
    });

    container.appendChild(card);
  });
}

// Добавление в корзину
function addToCart(product) {
  const index = cart.findIndex((p) => p.id === product.id);
  if (index >= 0) {
    cart[index].quantity += 1;
  } else {
    product.quantity = 1;
    cart.push(product);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCountDisplay();
  alert("Added to cart");
  window.dispatchEvent(new Event("storage"));
}

// Обновление счётчика корзины
function updateCartCountDisplay() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  localStorage.setItem("cartCount", count);
}

// Фильтры по категории и магазину
const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get("category");
const store = urlParams.get("store");

let filteredProducts = [...allProducts];

if (category) {
  filteredProducts = filteredProducts.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  );
}

if (store) {
  filteredProducts = filteredProducts.filter(
    (p) => p.storeName.toLowerCase() === store.toLowerCase()
  );
}

// Отрисовка товаров
renderProducts(filteredProducts);

// Фильтры и интерактивные элементы
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

// Обновление товаров при изменении localStorage
window.addEventListener("storage", (event) => {
  if (event.key === "products") {
    const updatedProducts = JSON.parse(event.newValue || "[]");
    renderProducts(updatedProducts);
  }
});
