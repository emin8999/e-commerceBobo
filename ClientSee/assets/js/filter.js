const Filter_API_BASE = "http://116.203.51.133:8080";
const PRODUCTS_ENDPOINT = `${Filter_API_BASE}/products`;
const ADD_TO_CART_ENDPOINT = `${Filter_API_BASE}/cart/items`;
const modalEl = document.getElementById("modal");
const detailEl = document.getElementById("product-detail");
/* ───────── helpers ───────── */
const safeLower = (v) => (typeof v === "string" ? v.toLowerCase() : "");
const money = (n) => Number(n || 0).toFixed(2);
function buildQuery(params) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && String(v).trim() !== "") q.set(k, v);
  });
  return q.toString();
}
async function fetchProductsFromBackend(filters) {
  const q = buildQuery({
    name: filters.name,
    category: filters.category,
    shop: filters.shop,
    size: filters.size,
    color: filters.color,
    maxPrice: filters.price, // ожидаем, что бэк понимает maxPrice
  });
  const url = q ? `${PRODUCTS_ENDPOINT}?${q}` : PRODUCTS_ENDPOINT;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Products request failed: ${res.status} ${txt}`);
  }
  const data = await res.json();
  if (!Array.isArray(data))
    throw new Error("Products response must be an array");
  return data;
}
function filterLocal(all, filters) {
  return all.filter((p) => {
    const pName = safeLower(p.name);
    const pCategory = safeLower(p.category);
    const pShop = safeLower(p.shop);
    const pSize = safeLower(p.size);
    const pColor = safeLower(p.color);
    const pPrice = parseFloat(p.price);
    const okName = !filters.name || pName.includes(filters.name);
    const okCategory =
      !filters.category || pCategory.includes(filters.category);
    const okShop = !filters.shop || pShop.includes(filters.shop);
    const okSize = !filters.size || pSize.includes(filters.size);
    const okColor = !filters.color || pColor.includes(filters.color);
    const okPrice =
      !filters.price || (!isNaN(pPrice) && pPrice <= filters.price);
    return okName && okCategory && okShop && okSize && okColor && okPrice;
  });
}
/* ───────── UI ───────── */
function showModal(product) {
  detailEl.innerHTML = `
    <h3>${product.name ?? "—"}</h3>
    ${
      product.images && product.images[0]
        ? `<img src="${product.images[0]}" style="width:100%;border-radius:8px;" />`
        : ""
    }
    <p><strong>Цена:</strong> $${money(product.price)}</p>
    <p><strong>Категория:</strong> ${product.category ?? "—"}</p>
    <p><strong>Магазин:</strong> ${product.shop ?? "—"}</p>
    <p><strong>Размер:</strong> ${product.size ?? "—"}</p>
    <p><strong>Цвет:</strong> ${product.color ?? "—"}</p>
    <div style="margin-top:10px;display:flex;gap:8px;align-items:center;">
      <label>Qty: <input id="modal-qty" type="number" min="1" value="1" style="width:70px;padding:4px;"></label>
      <button id="modal-add" class="btn">Add to Cart</button>
      <button id="modal-close" class="btn btn-secondary">Close</button>
    </div>
  `;
  modalEl.style.display = "block";
  document.getElementById("modal-close").onclick = closeModal;
  document.getElementById("modal-add").onclick = () => addToCart(product);
}
function closeModal() {
  modalEl.style.display = "none";
}
/* ───────── Cart ───────── */
async function addToCartBackend(product, quantity) {
  // если есть product.id — отправляем как productId; иначе шлём весь объект (на бэке обработай)
  const body = product.id
    ? { productId: product.id, quantity }
    : { product, quantity };
  const res = await fetch(ADD_TO_CART_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Add to cart failed: ${res.status} ${txt}`);
  }
  return res.json().catch(() => ({}));
}
function addToCartLocal(product, quantity) {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const idx = cart.findIndex((i) =>
    product.id ? i.id === product.id : i.name === product.name
  );
  if (idx >= 0) {
    cart[idx].quantity =
      Number(cart[idx].quantity || 0) + Number(quantity || 1);
  } else {
    cart.push({
      ...(product.id ? { id: product.id } : {}),
      name: product.name,
      price: product.price,
      images: product.images,
      size: product.size,
      color: product.color,
      quantity: Number(quantity || 1),
    });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
}
async function addToCart(product) {
  const qtyInput = document.getElementById("modal-qty");
  const qty = Math.max(1, parseInt(qtyInput?.value || "1", 10));
  try {
    await addToCartBackend(product, qty);
    alert("Товар добавлен в корзину!");
  } catch (e) {
    console.warn(e);
    addToCartLocal(product, qty);
    alert("Сервер недоступен, товар добавлен в локальную корзину.");
  } finally {
    closeModal();
  }
}
/* ───────── Filters (main) ───────── */
async function applyFilters() {
  const name = safeLower(document.getElementById("filter-name").value);
  const category = safeLower(document.getElementById("filter-category").value);
  const shop = safeLower(document.getElementById("filter-shop").value);
  const size = safeLower(document.getElementById("filter-size").value);
  const color = safeLower(document.getElementById("filter-color").value);
  const priceVal = document.getElementById("filter-price").value;
  const price = priceVal ? parseFloat(priceVal) : undefined;
  const filters = { name, category, shop, size, color, price };
  // Сначала — сервер
  let filtered = [];
  try {
    filtered = await fetchProductsFromBackend(filters);
  } catch (e) {
    console.warn("Backend not available, fallback to local filter.", e);
    // Fallback — локальные данные
    const all = JSON.parse(localStorage.getItem("products") || "[]");
    filtered = filterLocal(all, filters);
  }
  if (filtered.length > 0) {
    showModal(filtered[0]); // как у тебя — показываем первый найденный
  } else {
    alert("Ничего не найдено.");
  }
}
/* оставляем кнопки/хэндлеры модалки, если они уже есть где-то еще */
window.applyFilters = applyFilters;
window.closeModal = closeModal;
