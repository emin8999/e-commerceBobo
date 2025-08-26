document.addEventListener("DOMContentLoaded", initStoreProfile);

async function initStoreProfile() {
  const API_BASE = "http://116.203.51.133:8080";
  const INFO_URL = `${API_BASE}/home/store/info`;

  // 1) Проверка токена
  const token = localStorage.getItem("storeJwt");
  if (!token) {
    window.location.href = "store-login.html";
    return;
  }

  try {
    // 2) Получаем профиль магазина
    const raw = await fetchJSON(INFO_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // 3) Нормализуем профиль и товары
    const store = normalizeStore(raw, API_BASE);

    // 4) Рендер строго из нормализованных данных (без повторного рендера raw)
    renderStore(store);
    renderProducts(store.products);
  } catch (err) {
    // 5) Обработка статусов доступа
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
  // Бывает пустой ответ или не-JSON
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) return {};
  try {
    return await res.json();
  } catch {
    return {};
  }
}

function renderMessage(text) {
  document.body.innerHTML = `<h2 style="font-family:sans-serif;text-align:center;margin-top:2rem;">${escapeHtml(
    text
  )}</h2>`;
}

function toAbsUrl(maybeUrl, base) {
  if (!maybeUrl) return "";
  try {
    return new URL(maybeUrl, base).href;
  } catch {
    return "";
  }
}

/* ---------------- NORMALIZATION ---------------- */

function normalizeStore(raw, base) {
  const store = {
    ownerName:
      raw?.ownerName ??
      raw?.owner ??
      raw?.owner_full_name ??
      raw?.owner_fullname ??
      "",
    name: raw?.name ?? raw?.storeName ?? "",
    category: raw?.category ?? raw?.storeCategory ?? "",
    description: raw?.description ?? raw?.desc ?? "",
    location: raw?.location ?? raw?.address ?? "",
    phone: raw?.phone ?? raw?.contactPhone ?? "",
    logo: toAbsUrl(raw?.logo ?? raw?.logoUrl, base),
    banner: toAbsUrl(raw?.banner ?? raw?.bannerUrl, base),
    products: [],
  };

  const list = Array.isArray(raw?.products)
    ? raw.products
    : Array.isArray(raw?.items)
    ? raw.items
    : [];

  store.products = list.map((p) => normalizeProduct(p, base));
  return store;
}

function normalizeProduct(p, base) {
  // имя
  const name = p?.name ?? p?.title ?? p?.productName ?? "";

  // картинка
  let imageCandidate =
    p?.image ??
    p?.imageUrl ??
    (Array.isArray(p?.images) ? p.images[0] : undefined) ??
    p?.photo ??
    "";

  const image = toAbsUrl(imageCandidate, base);

  // цена
  const rawPrice = p?.price ?? p?.amount ?? p?.cost;
  const price = Number(rawPrice);
  const hasPrice = Number.isFinite(price);

  return {
    name,
    image,
    price: hasPrice ? price : null,
  };
}

/* ---------------- RENDER STORE ---------------- */

function renderStore(store) {
  const ownerEl = document.getElementById("ownerName");
  const nameEl = document.getElementById("storeName");
  const catEl = document.getElementById("category");
  const descEl = document.getElementById("description");
  const logoEl = document.getElementById("logo");
  const bannerEl = document.getElementById("banner");
  const phoneEl = document.getElementById("phone");
  const locationEl = document.getElementById("location");

  if (ownerEl) ownerEl.textContent = store.ownerName || "";
  if (nameEl) nameEl.textContent = store.name || "";
  if (catEl) catEl.textContent = store.category || "";
  if (descEl) descEl.textContent = store.description || "";
  if (locationEl) locationEl.textContent = store.location || "";

  if (logoEl) {
    logoEl.src =
      store.logo ||
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><rect width='100%' height='100%' fill='%23eee'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-family='Arial' font-size='14'>No Logo</text></svg>";
    logoEl.alt = store.name ? `${store.name} logo` : "Store logo";
  }

  if (bannerEl) {
    bannerEl.style.backgroundImage = store.banner
      ? `url('${store.banner}')`
      : "linear-gradient(135deg, #e6f2ff 0%, #f5f7fa 100%)";
  }

  if (phoneEl) {
    phoneEl.textContent = store.phone ? `📞 ${store.phone}` : "";
  }
}

/* ---------------- RENDER PRODUCTS ---------------- */

function renderProducts(products) {
  const grid = document.getElementById("storeProducts");
  if (!grid) return;

  grid.innerHTML = "";

  if (!Array.isArray(products) || products.length === 0) {
    grid.innerHTML =
      "<p style='color:#666;font-family:sans-serif'>No products yet</p>";
    return;
  }

  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";

    const img = document.createElement("img");
    img.src =
      product.image ||
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='200'><rect width='100%' height='100%' fill='%23f0f0f0'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-family='Arial' font-size='14'>No Image</text></svg>";
    img.alt = product.name || "Product";
    img.className = "product-image";

    const name = document.createElement("h3");
    name.textContent = product.name || "";
    name.className = "product-name";

    const price = document.createElement("p");
    if (product.price != null && Number.isFinite(product.price)) {
      price.textContent = `$${product.price.toFixed(2)}`;
    } else {
      price.textContent = "";
    }
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
