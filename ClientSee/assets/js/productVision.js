/* ================== CONFIG ================== */
const API_BASE = "http://116.203.51.133:8080";
const PRODUCT_ENDPOINT = (id) =>
  `${API_BASE}/products/${encodeURIComponent(id)}`;
const ADD_TO_CART_ENDPOINT = `${API_BASE}/cart/items`;
const TOKEN = localStorage.getItem("token") || ""; // если используешь JWT

/* ================== HELPERS ================== */
function qs(id) {
  return document.getElementById(id);
}

function getQueryParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function firstImageOf(p) {
  return Array.isArray(p.imageUrls) && p.imageUrls.length ? p.imageUrls[0] : "";
}

async function fetchJSON(url, options = {}) {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
    },
    ...options,
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText} ${t}`);
  }
  return res.json();
}

/* ================== DATA LOAD (backend → fallback) ================== */
async function loadProduct() {
  const idFromUrl = getQueryParam("id");
  if (idFromUrl) {
    try {
      const p = await fetchJSON(PRODUCT_ENDPOINT(idFromUrl));
      localStorage.setItem("selectedProduct", JSON.stringify(p));
      return p;
    } catch (e) {
      console.warn("Product by id failed, fallback to localStorage:", e);
    }
  }
  try {
    return JSON.parse(localStorage.getItem("selectedProduct") || "{}");
  } catch {
    return {};
  }
}

/* ================== RENDER ================== */
function renderProduct(p) {
  // stub для пустого продукта
  if (!p || (!p.id && !p.name)) {
    qs("title").textContent = "Unknown";
    qs("store").textContent = "Store: Unknown";
    qs("price").textContent = "₼0";
    qs("description").textContent = "";
    qs("colors").textContent = "Colors: —";
    qs("size").textContent = "Size: —";
    qs("category").textContent = "Category: —";
    return;
  }

  // main image и миниатюры
  const mainImage = qs("main-image");
  const thumbnails = qs("thumbnails");

  if (thumbnails) {
    // очищаем контейнер полностью
    thumbnails.innerHTML = "";
  }

  const mainSrc = firstImageOf(p);
  if (mainImage && mainSrc) mainImage.src = mainSrc;

  // добавляем миниатюры
  (Array.isArray(p.imageUrls) ? p.imageUrls : []).forEach((src) => {
    if (!thumbnails) return;
    const thumb = document.createElement("img");
    thumb.src = src;
    thumb.onclick = () => {
      if (mainImage) mainImage.src = src;
    };
    thumbnails.appendChild(thumb);
  });

  // текстовые поля
  qs("title").textContent = p.name || "Unknown";
  qs("store").textContent = "Store: " + (p.store || p.shop || "Unknown");
  qs("price").textContent = "₼" + (p.price ?? "0");
  qs("description").textContent = p.description || "";
  qs("colors").textContent = "Colors: " + (p.colors || "—");
  qs("size").textContent = "Size: " + (p.sizeQuantities || "—");
  qs("category").textContent = "Category: " + (p.category || "—");

  // обработчик addToCart
  const addBtn = document.getElementById("addToCartBtn");
  if (addBtn) {
    addBtn.onclick = () => addToCart(p);
  } else {
    window.addToCart = () => addToCart(p);
  }
}

/* ================== CART (backend → fallback) ================== */
async function addToCartBackend(product, quantity = 1) {
  const body = product?.id
    ? { productId: product.id, quantity }
    : { product, quantity };
  await fetchJSON(ADD_TO_CART_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

function addToCartLocal(product, quantity = 1) {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const idx = cart.findIndex((i) =>
    product.id ? i.id === product.id : i.name === product.name
  );
  if (idx >= 0) {
    cart[idx].quantity = Number(cart[idx].quantity || 0) + Number(quantity);
  } else {
    cart.push({
      ...(product.id ? { id: product.id } : {}),
      name: product.name,
      price: product.price,
      images: product.imageUrls,
      image: firstImageOf(product),
      store: product.store || product.shop,
      colors: product.colors,
      size: product.size,
      quantity: Number(quantity),
    });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
}

async function addToCart(product) {
  try {
    await addToCartBackend(product, 1);
    alert("Added to cart");
  } catch (e) {
    console.warn("Backend addToCart failed, using localStorage:", e);
    addToCartLocal(product, 1);
    alert("Server unavailable — added to local cart");
  }
}

/* ================== INIT ================== */
(async function initProductPage() {
  const product = await loadProduct();
  renderProduct(product);
})();
