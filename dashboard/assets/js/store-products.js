const BACKEND_BASE_URL = "http://116.203.51.133:8080"; // IP сервера
const PRODUCTS_URL = `${BACKEND_BASE_URL}/home/product/my-store`;
const LS_KEY = "myStoreProductsCache"; // локальный кэш на случай офлайна

// ====== HELPERS ======
function toAbs(url) {
  if (!url) return "";
  try {
    return new URL(url, BACKEND_BASE_URL).href;
  } catch {
    return "";
  }
}

function saveCache(products) {
  localStorage.setItem(LS_KEY, JSON.stringify(products || []));
}

function loadCache() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  } catch {
    return [];
  }
}

function renderMessage(msg) {
  const productsList = document.getElementById("productsList");
  productsList.innerHTML = `<tr><td colspan="9" style="text-align:center;padding:16px;">${msg}</td></tr>`;
}

// ====== FETCH PRODUCTS (с JWT и fallback) ======
async function fetchProducts() {
  const token = localStorage.getItem("storeJwt"); // ключ с большой буквы
  if (!token) {
    // если токена нет → сразу на логин
    window.location.href = "store-login.html";
    return loadCache();
  }

  try {
    const res = await fetch(PRODUCTS_URL, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401 || res.status === 403) {
      // токен недействителен → чистим и редирект
      localStorage.removeItem("storeJwt");
      window.location.href = "store-login.html";
      return loadCache();
    }

    if (!res.ok) throw new Error(`Failed to fetch products (${res.status})`);

    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("Bad products payload");
    saveCache(data);
    return data;
  } catch (err) {
    console.warn("Backend unavailable or error, using local cache.", err);
    return loadCache();
  }
}

// ====== RENDER ======
function renderProducts(products, filterText = "", filterStatus = "all") {
  const listEl = document.getElementById("productsList");
  listEl.innerHTML = "";

  const filtered = (products || []).filter(
    (p) =>
      (p.name || "").toLowerCase().includes(filterText.toLowerCase()) &&
      (filterStatus === "all" || String(p.status) === String(filterStatus))
  );

  if (!filtered.length) {
    renderMessage("No products found.");
    return;
  }

  const sizeDisplayMap = {
    TWO_XS: "2XS",
    XS: "XS",
    S: "S",
    M: "M",
    L: "L",
    XL: "XL",
    TWO_XL: "2XL",
  };

  const frag = document.createDocumentFragment();

  filtered.forEach((product) => {
    const imageUrl =
      Array.isArray(product.imageUrls) && product.imageUrls.length
        ? toAbs(product.imageUrls[0])
        : "";

    const sizeQs = Array.isArray(product.sizeQuantities)
      ? product.sizeQuantities
      : [];
    const sizes = sizeQs
      .map((sq) => sizeDisplayMap[sq.size] || sq.size)
      .join(", ");
    const quantities = sizeQs.map((sq) => sq.quantity).join(", ");

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        ${
          imageUrl
            ? `<img src="${imageUrl}" alt="product" style="width:70px;height:auto;object-fit:cover;border-radius:6px;" />`
            : `<div style="width:70px;height:46px;background:#eee;border-radius:6px;display:flex;align-items:center;justify-content:center;color:#999;font-size:12px;">No image</div>`
        }
      </td>
      <td>${product.name || "-"}</td>
      <td>${product.description || "-"}</td>
      <td>${product.category || "-"}</td>
      <td>$${Number(product.price || 0).toFixed(2)}</td>
      <td>${sizes || "-"}</td>
      <td>${quantities || "-"}</td>
      <td>${product.status || "-"}</td>
      <td>-</td>
    `;
    frag.appendChild(tr);
  });

  listEl.appendChild(frag);
}

// ====== INIT ======
document.addEventListener("DOMContentLoaded", async () => {
  const products = await fetchProducts();
  renderProducts(products);

  // поиск
  document.getElementById("searchInput").addEventListener("input", (e) => {
    renderProducts(
      products,
      e.target.value,
      document.getElementById("statusFilter").value
    );
  });

  // фильтр статуса
  document.getElementById("statusFilter").addEventListener("change", (e) => {
    renderProducts(
      products,
      document.getElementById("searchInput").value,
      e.target.value
    );
  });
});
