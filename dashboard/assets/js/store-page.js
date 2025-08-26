document.addEventListener("DOMContentLoaded", async function initStorePage() {
  const API_BASE = "http://116.203.51.133:8080";
  const token = localStorage.getItem("storeJwt");

  if (!token) {
    window.location.href = "store-login.html";
    return;
  }

  // ------------------- Тестовый GET-запрос -------------------
  async function testFetch(token) {
    try {
      const url = `${API_BASE}/home/store/products?storeId=26`;
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log("Test fetch result:", data);
    } catch (err) {
      console.error("Test fetch error:", err);
    }
  }

  // Запускаем тест
  await testFetch(token);

  // ------------------- Основной код -------------------
  try {
    // 1) Профиль магазина
    const profileRaw = await fetchJSON(`${API_BASE}/home/store/info`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    let store = normalizeStore(profileRaw, API_BASE);

    // 2) Товары магазина
    const storeId = store.id;
    store.products = await fetchProductsForStore({
      apiBase: API_BASE,
      token,
      storeId,
    });

    // Если ничего не пришло → дефолтные данные
    if (!store.storeName) {
      store = getDefaultStore(API_BASE);
    }
    if (!store.products?.length) {
      store.products = getDefaultProducts(API_BASE);
    }

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

    // При фейле тоже отобразим дефолтные данные
    const store = getDefaultStore(API_BASE);
    store.products = getDefaultProducts(API_BASE);
    renderStore(store);
    renderProducts(store.products);
  }
});

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

async function fetchProductsForStore({ apiBase, token, storeId }) {
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const candidates = [
    `${apiBase}/home/store/products?storeId=${encodeURIComponent(storeId)}`,
    `${apiBase}/home/products?storeId=${encodeURIComponent(storeId)}`,
    `${apiBase}/home/products/of-store?storeId=${encodeURIComponent(storeId)}`,
  ];

  for (const url of candidates) {
    try {
      const data = await fetchJSON(url, { method: "GET", headers });
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.products)
        ? data.products
        : Array.isArray(data?.items)
        ? data.items
        : [];
      if (list.length) return list.map((p) => normalizeProduct(p, apiBase));
    } catch (e) {
      console.warn("Endpoint failed:", url, e);
      continue;
    }
  }

  return [];
}

/* ------------------- NORMALIZATION ------------------- */
function toAbsUrl(maybe, base) {
  if (!maybe) return "";
  if (typeof maybe === "string" && maybe.startsWith("data:image")) return maybe;
  try {
    return new URL(maybe, base).href;
  } catch {
    return "";
  }
}

function normalizeStore(raw, base) {
  return {
    id: raw?.id ?? raw?._id ?? raw?.storeId ?? raw?.uuid ?? "",
    storeName: raw?.storeName ?? raw?.name ?? "",
    ownerName: raw?.ownerName ?? raw?.owner ?? raw?.owner_full_name ?? "",
    email: raw?.email ?? "",
    phone: raw?.phone ?? raw?.contactPhone ?? raw?.contact ?? "",
    logo: toAbsUrl(raw?.logo ?? raw?.logoUrl, base),
    banner: toAbsUrl(raw?.banner ?? raw?.bannerUrl, base),
    description: raw?.description ?? raw?.desc ?? "",
    category: raw?.category ?? raw?.storeCategory ?? "",
    location: raw?.location ?? raw?.address ?? "",
    products: [],
  };
}

function normalizeProduct(p, base) {
  const name = p?.name ?? p?.title ?? p?.productName ?? "";
  const imageCandidate =
    p?.image ??
    p?.imageUrl ??
    (Array.isArray(p?.images) ? p.images[0] : "") ??
    p?.photo ??
    "";
  const image = toAbsUrl(imageCandidate, base);

  const numericPrice = Number(p?.price ?? p?.amount ?? p?.cost ?? p?.priceUsd);
  const price = Number.isFinite(numericPrice) ? numericPrice : null;

  return {
    id: p?.id ?? p?._id ?? "",
    name,
    image,
    price,
    description: p?.description ?? "",
  };
}

/* ------------------- DEFAULT DATA ------------------- */
function getDefaultStore(base) {
  return {
    id: "default-store",
    storeName: "Demo Shop",
    ownerName: "John Doe",
    email: "demo@shop.com",
    phone: "+1234567890",
    logo: "https://images.unsplash.com/photo-1606813902759-0a8ec1c1caaa?auto=format&fit=crop&w=200&h=200&q=80",
    banner:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&h=220&q=80",
    description:
      "This is a demo store description. Here you can find default items.",
    category: "General Goods",
    location: "Demo City, Wonderland",
    products: [],
  };
}

function getDefaultProducts(base) {
  return [
    {
      id: "p1",
      name: "Wireless Headphones",
      image:
        "https://images.unsplash.com/photo-1580894908361-967195033b30?auto=format&fit=crop&w=800&q=80",
      price: 59.99,
      description: "Comfortable wireless headphones with noise cancellation.",
    },
    {
      id: "p2",
      name: "Smartwatch",
      image:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
      price: 129.99,
      description: "Track your fitness and notifications on the go.",
    },
    {
      id: "p3",
      name: "Coffee Mug",
      image:
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
      price: 14.99,
      description: "Ceramic coffee mug for your perfect morning routine.",
    },
    {
      id: "p4",
      name: "Running Shoes",
      image:
        "https://images.unsplash.com/photo-1600185365483-26d7a6b1c1de?auto=format&fit=crop&w=800&q=80",
      price: 89.99,
      description: "Lightweight running shoes built for comfort and speed.",
    },
    {
      id: "p5",
      name: "Backpack",
      image:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
      price: 49.99,
      description: "Durable and stylish backpack for everyday use.",
    },
  ];
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
  if (nameEl) nameEl.textContent = store.storeName || "";
  if (catEl) catEl.textContent = store.category || "";
  if (descEl) descEl.textContent = store.description || "";
  if (locationEl) locationEl.textContent = store.location || "";
  if (phoneEl) phoneEl.textContent = store.phone ? `📞 ${store.phone}` : "";

  if (logoEl) {
    logoEl.src =
      store.logo ||
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><rect width='100%' height='100%' fill='%23eee'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-family='Arial' font-size='14'>No Logo</text></svg>";
    logoEl.alt = store.storeName ? `${store.storeName} logo` : "Store logo";
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
