// === StorePage: Всегда берём актуальные данные из общей БД ===
document.addEventListener("DOMContentLoaded", initStorePage);

async function initStorePage() {
  const API_BASE = "http://116.203.51.133:8080";
  const token = localStorage.getItem("storeJwt");

  if (!token) {
    window.location.href = "store-login.html";
    return;
  }

  try {
    // 1) Профиль магазина
    const profileRaw = await fetchJSON(`${API_BASE}/home/store/info`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const store = normalizeStore(profileRaw, API_BASE);

    // 2) Товары магазина — всегда с сервера (без локального кэша)
    const storeId = getStoreId(profileRaw);
    store.products = await fetchProductsForStore({
      apiBase: API_BASE,
      token,
      storeId,
    });

    // 3) Рендер
    renderStore(store);
    renderProducts(store.products);
  } catch (err) {
    if (err?.status && [400, 401, 403].includes(err.status)) {
      localStorage.removeItem("storeJwt");
      window.location.href = "store-login.html";
      return;
    }
    console.error("StorePage error:", err);
    renderFallback(
      "Məlumatı yükləmək mümkün olmadı / Не удалось загрузить данные."
    );
  }
}

/* ------------------- FETCH HELPERS ------------------- */

async function fetchJSON(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const error = new Error(text || `${res.status} ${res.statusText}`);
    error.status = res.status;
    throw error;
  }
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) return {};
  try {
    return await res.json();
  } catch {
    return {};
  }
}

/**
 * Пробуем несколько кандидатов эндпоинтов для списка товаров.
 * Менять ничего на бэке не надо — берём то, что есть.
 */
async function fetchProductsForStore({ apiBase, token, storeId }) {
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  // Список «типовых» маршрутов. Если у вас свой — добавьте сюда.
  const candidates = [
    // GET-эндоинты
    {
      url: `${apiBase}/home/store/products?storeId=${encodeURIComponent(
        storeId
      )}`,
      method: "GET",
    },
    {
      url: `${apiBase}/home/products?storeId=${encodeURIComponent(storeId)}`,
      method: "GET",
    },
    {
      url: `${apiBase}/home/products/of-store?storeId=${encodeURIComponent(
        storeId
      )}`,
      method: "GET",
    },

    // Иногда список дают POST’ом:
    {
      url: `${apiBase}/home/store/products`,
      method: "POST",
      body: JSON.stringify({ storeId }),
    },
    {
      url: `${apiBase}/home/products/of-store`,
      method: "POST",
      body: JSON.stringify({ storeId }),
    },
  ];

  for (const c of candidates) {
    try {
      const data = await fetchJSON(c.url, {
        method: c.method,
        headers,
        body: c.body,
      });
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.products)
        ? data.products
        : Array.isArray(data?.items)
        ? data.items
        : [];

      if (list.length) {
        return list.map((p) => normalizeProduct(p, apiBase));
      }
    } catch (e) {
      // продолжаем пробовать следующий эндпоинт
      continue;
    }
  }
  // Если ничего не отдалось — вернём пустой массив (UI покажет «нет товаров»)
  return [];
}

/* ------------------- NORMALIZATION ------------------- */

function getStoreId(raw) {
  return raw?.id ?? raw?._id ?? raw?.storeId ?? raw?.uuid ?? "";
}

function toAbsUrl(maybe, base) {
  if (!maybe) return "";
  // data: URL (base64) оставляем как есть
  if (typeof maybe === "string" && maybe.startsWith("data:image")) return maybe;
  try {
    return new URL(maybe, base).href;
  } catch {
    return "";
  }
}

function normalizeStore(raw, base) {
  return {
    id: getStoreId(raw),
    ownerName: raw?.ownerName ?? raw?.owner ?? raw?.owner_full_name ?? "",
    name: raw?.name ?? raw?.storeName ?? "",
    category: raw?.category ?? raw?.storeCategory ?? "",
    description: raw?.description ?? raw?.desc ?? "",
    location: raw?.location ?? raw?.address ?? "",
    // Телефон: поддержим разные поля
    phone: raw?.phone ?? raw?.contactPhone ?? raw?.contact ?? "",
    logo: toAbsUrl(raw?.logo ?? raw?.logoUrl, base),
    banner: toAbsUrl(raw?.banner ?? raw?.bannerUrl, base),
    products: [], // заполним отдельно
  };
}

function normalizeProduct(p, base) {
  const name = p?.name ?? p?.title ?? p?.productName ?? "";
  const imgCandidate =
    p?.image ??
    p?.imageUrl ??
    (Array.isArray(p?.images) ? p.images[0] : "") ??
    p?.photo ??
    "";
  const image = toAbsUrl(imgCandidate, base);
  const numericPrice = Number(p?.price ?? p?.amount ?? p?.cost);
  const price = Number.isFinite(numericPrice) ? numericPrice : null;
  return { name, image, price };
}

/* ------------------- RENDER ------------------- */

function renderFallback(text) {
  const root = document.getElementById("storeRoot") || document.body;
  root.innerHTML = `<p style="text-align:center;color:#666;margin:2rem 0;font-family:sans-serif">${escapeHtml(
    text
  )}</p>`;
}

function renderStore(store) {
  const ownerEl = document.getElementById("ownerName");
  const nameEl = document.getElementById("storeName");
  const catEl = document.getElementById("category");
  const descEl = document.getElementById("description");
  const phoneEl = document.getElementById("phone");
  const locationEl = document.getElementById("location");

  const logoEl = document.getElementById("logo");
  const bannerEl = document.getElementById("banner");

  if (ownerEl) ownerEl.textContent = store.ownerName || "";
  if (nameEl) nameEl.textContent = store.name || "";
  if (catEl) catEl.textContent = store.category || "";
  if (descEl) descEl.textContent = store.description || "";
  if (locationEl) locationEl.textContent = store.location || "";
  if (phoneEl) phoneEl.textContent = store.phone ? `📞 ${store.phone}` : "";

  if (logoEl) {
    logoEl.src =
      store.logo ||
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><rect width='100%' height='100%' fill='%23eee'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-family='Arial' font-size='14'>No Logo</text></svg>";
    logoEl.alt = store.name ? `${store.name} logo` : "Store logo";
  }

  if (bannerEl) {
    bannerEl.style.backgroundImage = store.banner
      ? `url('${store.banner}')`
      : "linear-gradient(135deg,#e6f2ff 0%,#f5f7fa 100%)";
  }
}

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
    img.className = "product-image";
    img.src =
      product.image ||
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='200'><rect width='100%' height='100%' fill='%23f0f0f0'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-family='Arial' font-size='14'>No Image</text></svg>";
    img.alt = product.name || "Product";

    const name = document.createElement("h3");
    name.className = "product-name";
    name.textContent = product.name || "";

    const price = document.createElement("p");
    price.className = "product-price";
    if (product.price != null && Number.isFinite(product.price)) {
      price.textContent = `$${product.price.toFixed(2)}`;
    } else {
      price.textContent = "";
    }

    card.append(img, name, price);
    grid.appendChild(card);
  });
}

/* ------------------- UTILS ------------------- */
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
