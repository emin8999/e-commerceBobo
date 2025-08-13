/* ========= CONFIG ========= */
const API_BASE = "http://116.203.51.133:8080";
const PRODUCTS_BY_STORE = (store) =>
  `${API_BASE}/products?store=${encodeURIComponent(store)}`;

/* ========= UTILS ========= */
function firstImage(p) {
  if (Array.isArray(p.images) && p.images.length) return p.images[0];
  if (Array.isArray(p.imageUrls) && p.imageUrls.length) return p.imageUrls[0];
  if (typeof p.imageUrls === "string" && p.imageUrls.trim()) return p.imageUrls;
  return p.image || "";
}
function getStoreName() {
  // 1) из URL: storePage.html?store=NAME
  const q = new URLSearchParams(window.location.search);
  const fromUrl = q.get("store");
  if (fromUrl) return fromUrl;

  // 2) fallback из localStorage
  return localStorage.getItem("selectedStore") || "";
}

/* ========= DOM ========= */
const titleEl = document.getElementById("store-title");
const container = document.getElementById("store-products");

/* ========= API ========= */
async function fetchStoreProducts(store) {
  const res = await fetch(PRODUCTS_BY_STORE(store), {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error("Products must be an array");
  // кэш на случай офлайна
  const all = JSON.parse(localStorage.getItem("products") || "[]");
  // обновим кэш «умно»: объединим по id/name
  const merged = mergeProductsCache(all, data);
  localStorage.setItem("products", JSON.stringify(merged));
  return data;
}

function mergeProductsCache(oldArr, newArr) {
  const byKey = new Map();
  const keyOf = (p) => p.id ?? p.name ?? Math.random().toString(36);
  oldArr.forEach((p) => byKey.set(keyOf(p), p));
  newArr.forEach((p) => byKey.set(keyOf(p), p));
  return Array.from(byKey.values());
}

function getLocalStoreProducts(store) {
  const all = JSON.parse(localStorage.getItem("products") || "[]");
  return all.filter((p) => {
    const s = p.storeName || p.store || p.shop || "";
    return String(s).toLowerCase() === String(store).toLowerCase();
  });
}

/* ========= RENDER ========= */
function render(products, storeName) {
  titleEl.textContent = storeName || "Store";
  container.innerHTML = "";

  if (!products.length) {
    container.innerHTML = "<p>No products found for this store.</p>";
    return;
  }

  products.forEach((p) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${firstImage(p)}" alt="${p.name || "Product"}" />
      <h3>${p.name || "Unnamed"}</h3>
      <p>₼${Number(p.price || 0)}</p>
    `;
    card.addEventListener("click", () => {
      localStorage.setItem("selectedProduct", JSON.stringify(p));
      // если на странице просмотра поддерживается id в query — лучше так:
      // window.location.href = \`productVision.html?id=\${encodeURIComponent(p.id)}\`;
      window.location.href = "productVision.html";
    });
    container.appendChild(card);
  });
}

/* ========= INIT ========= */
(async function initStorePage() {
  const storeName = getStoreName();
  if (!storeName) {
    titleEl.textContent = "Store";
    container.innerHTML = "<p>No store selected.</p>";
    return;
  }

  try {
    const data = await fetchStoreProducts(storeName);
    render(data, storeName);
  } catch (e) {
    console.warn("Backend unavailable, using local cache.", e);
    const local = getLocalStoreProducts(storeName);
    render(local, storeName);
  }
})();
