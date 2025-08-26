document.addEventListener("DOMContentLoaded", initStoreProfile);

async function initStoreProfile() {
  const API_BASE = "http://116.203.51.133:8080";
  const INFO_URL = `${API_BASE}/home/store/info`;

  // Токен
  const token = localStorage.getItem("storeJwt");
  if (!token) {
    window.location.href = "store-login.html";
    return;
  }

  try {
    const store = await fetchJSON(INFO_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    renderStore(store, API_BASE);

    // Если магазин возвращает товары
    if (store.products && Array.isArray(store.products)) {
      renderProducts(store.products, API_BASE);
    }
  } catch (err) {
    if ([400, 401, 403].includes(err.status)) {
      localStorage.removeItem("storeJwt");
      window.location.href = "store-login.html";
      return;
    }
    console.error("Store load error:", err);
    renderMessage("Store not found or server error.");
  }
}

/* ---------------- HELPERS ---------------- */

async function fetchJSON(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const error = new Error(text || `${res.status} ${res.statusText}`);
    error.status = res.status;
    throw error;
  }
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : {};
}

function renderMessage(text) {
  document.body.innerHTML = `<h2 style="font-family:sans-serif;text-align:center;margin-top:2rem;">${text}</h2>`;
}

function toAbsUrl(maybeUrl, base) {
  if (!maybeUrl) return "";
  try {
    return new URL(maybeUrl, base).href;
  } catch {
    return "";
  }
}

/* ---------------- RENDER STORE ---------------- */
function renderStore(store, base) {
  const ownerEl = document.getElementById("ownerName");
  const nameEl = document.getElementById("storeName");

  const catEl = document.getElementById("category");
  const descEl = document.getElementById("description");
  const logoEl = document.getElementById("logo");
  const bannerEl = document.getElementById("banner");
  const phoneEl = document.getElementById("phone");

  if (nameEl) nameEl.textContent = store?.name || "";
  if (catEl) catEl.textContent = store?.category || "";
  if (descEl) descEl.textContent = store?.description || "";
  const locationEl = document.getElementById("locationText");
  if (locationEl) locationEl.textContent = store?.location || "";

  const logoUrl = toAbsUrl(store?.logo, base);
  const bannerUrl = toAbsUrl(store?.banner, base);

  if (logoEl) {
    logoEl.src =
      logoUrl ||
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><rect width='100%' height='100%' fill='%23eee'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-family='Arial' font-size='14'>No Logo</text></svg>";
    logoEl.alt = store?.name ? `${store.name} logo` : "Store logo";
  }

  if (bannerEl)
    bannerEl.style.backgroundImage = bannerUrl
      ? `url('${bannerUrl}')`
      : "linear-gradient(135deg, #e6f2ff 0%, #f5f7fa 100%)";

  if (phoneEl) {
    phoneEl.textContent = store?.phone ? `📞 ${store.phone}` : "";
  }
}

/* ---------------- RENDER PRODUCTS ---------------- */
function renderProducts(products, base) {
  const grid = document.getElementById("storeProducts");
  if (!grid) return;

  grid.innerHTML = ""; // очистить placeholder

  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";

    const img = document.createElement("img");
    img.src = toAbsUrl(product.image, base) || "";
    img.alt = product.name || "Product";
    img.className = "product-image";

    const name = document.createElement("h3");
    name.textContent = product.name || "";
    name.className = "product-name";

    const price = document.createElement("p");
    price.textContent =
      product.price != null ? `$${product.price.toFixed(2)}` : "";
    price.className = "product-price";

    card.append(img, name, price);
    grid.appendChild(card);
  });
}

/* ---------------- ESCAPE HTML ---------------- */
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
