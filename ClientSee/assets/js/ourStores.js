const API_BASE = "http://116.203.51.133:8080";
const PRODUCTS_ENDPOINT = `${API_BASE}/products`;

/* ----------------- helpers ----------------- */
async function fetchProducts() {
  const res = await fetch(PRODUCTS_ENDPOINT, {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`Products fetch failed: ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error("Products must be an array");
  // кеш на случай офлайна
  localStorage.setItem("products", JSON.stringify(data));
  return data;
}

function getLocalProducts() {
  try {
    return JSON.parse(localStorage.getItem("products") || "[]");
  } catch {
    return [];
  }
}

function firstImageOf(product) {
  if (Array.isArray(product.images) && product.images.length > 0)
    return product.images[0];
  if (Array.isArray(product.imageUrls) && product.imageUrls.length > 0)
    return product.imageUrls[0];
  return product.image || "";
}

/* ----------------- render ----------------- */
function renderStores(products) {
  const container = document.getElementById("shopContainer");
  container.innerHTML = "";

  if (!products || products.length === 0) {
    container.innerHTML = "<p style='padding:20px;'>No products available.</p>";
    return;
  }

  // группируем по магазину
  const grouped = {};
  products.forEach((p) => {
    const storeName = p.storeName || p.store || p.shop || "Unknown Store";
    if (!grouped[storeName]) grouped[storeName] = [];
    grouped[storeName].push(p);
  });

  for (const store in grouped) {
    const storeBox = document.createElement("div");
    storeBox.className = "store-box";
    storeBox.setAttribute("data-store", store);

    const storeHeader = document.createElement("h2");
    storeHeader.textContent = store;
    storeBox.appendChild(storeHeader);

    const sliderWrapper = document.createElement("div");
    sliderWrapper.className = "slider-wrapper";

    const leftButton = document.createElement("button");
    leftButton.innerHTML = "←";
    leftButton.className = "slider-btn left";

    const rightButton = document.createElement("button");
    rightButton.innerHTML = "→";
    rightButton.className = "slider-btn right";

    const productsWrapper = document.createElement("div");
    productsWrapper.className = "products-wrapper";

    grouped[store].forEach((product) => {
      const productCard = document.createElement("div");
      productCard.className = "product-card";

      productCard.innerHTML = `
        <img src="${firstImageOf(product)}" alt="${
        product.name || "Product"
      }" />
        <p>${product.name || product.title || "Unnamed"}</p>
        <strong>${
          product.price != null ? product.price + " ₼" : "Price N/A"
        }</strong>
      `;

      // клик по товару — не открывать магазин
      productCard.addEventListener("click", (e) => {
        e.stopPropagation();
        localStorage.setItem("selectedProduct", JSON.stringify(product));
        window.location.href = "productVision.html";
      });

      productsWrapper.appendChild(productCard);
    });

    sliderWrapper.appendChild(leftButton);
    sliderWrapper.appendChild(productsWrapper);
    sliderWrapper.appendChild(rightButton);
    storeBox.appendChild(sliderWrapper);
    container.appendChild(storeBox);

    // клик по магазину — переход на страницу магазина
    storeBox.addEventListener("click", () => {
      localStorage.setItem("selectedStore", store);
      window.location.href = "storePage.html";
    });

    // прокрутка товаров
    const scrollAmount = 250;
    rightButton.addEventListener("click", (e) => {
      e.stopPropagation();
      productsWrapper.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });
    leftButton.addEventListener("click", (e) => {
      e.stopPropagation();
      productsWrapper.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });
  }
}

/* ----------------- init (backend → fallback) ----------------- */
(async function bootstrapStores() {
  let products = [];
  try {
    products = await fetchProducts(); // с бэкенда
  } catch (e) {
    console.warn("Backend unavailable, using localStorage products.", e);
    products = getLocalProducts(); // fallback
  }
  console.log("Loaded products:", products);
  renderStores(products);
})();
