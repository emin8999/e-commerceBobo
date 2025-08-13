// ==== НАСТРОЙКА API (поменяй при необходимости) ==============================
const Checkout_API_BASE = "http://116.203.51.133:8080";
const ADDRESS_ENDPOINT = `${Checkout_API_BASE}/checkout/address`;
const PRODUCTS_ENDPOINT = `${Checkout_API_BASE}/checkout/items`;
// ==== DOM-элементы ===========================================================
const addressDiv = document.querySelector(".address-details");
const productDiv = document.querySelector(".order-item");
const summaryDiv = document.querySelector(".summary-details");
// ==== Вспомогательные: безопасный fetch и формат денег =======================
async function safeFetchJSON(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}
const usd = (n) => Number(n || 0).toFixed(2);
// ==== Fallback localStorage (как у тебя было) ================================
function getLocalAddress() {
  try {
    const addressJSON = localStorage.getItem("address");
    return addressJSON ? JSON.parse(addressJSON) : null;
  } catch {
    return null;
  }
}
function getLocalProducts() {
  try {
    const productJSON = localStorage.getItem("product");
    const products = productJSON ? JSON.parse(productJSON) : null;
    return Array.isArray(products) ? products : [];
  } catch {
    return [];
  }
}
// ==== Загрузка с сервера с fallback на localStorage ==========================
async function loadAddress() {
  try {
    const addr = await safeFetchJSON(ADDRESS_ENDPOINT);
    return addr && addr.name ? addr : getLocalAddress();
  } catch {
    return getLocalAddress();
  }
}
async function loadProducts() {
  try {
    const items = await safeFetchJSON(PRODUCTS_ENDPOINT);
    return Array.isArray(items) ? items : getLocalProducts();
  } catch {
    return getLocalProducts();
  }
}
// ==== Рендеры ================================================================
function renderAddress(address) {
  if (address && address.name) {
    addressDiv.innerHTML = `
      <strong>${address.name}</strong><br />
      ${address.address}<br />
      Phone number: ${address.number}
    `;
  } else {
    addressDiv.textContent = "Адрес не найден.";
  }
}
function renderProducts(products) {
  if (products && products.length) {
    productDiv.innerHTML = products
      .map(
        (p) => `
        <div class="single-product">
          <img src="${p.img}" width="100" />
          <div class="order-item-details">
            <p>${usd(p.price)} $</p>
          </div>
        </div>
      `
      )
      .join("");
  } else {
    productDiv.textContent = "Информация о товарах не найдена.";
  }
}
function renderSummary(products) {
  if (!products || !products.length) {
    summaryDiv.innerHTML = `
      <p>Items: <span>USD 0.00</span></p>
      <p>Shipping & handling: <span>USD 0.00</span></p>
      <p>Estimated tax to be collected: <span>USD 0.00</span></p>
      <h3>Order total: <span>USD 0.00</span></h3>
    `;
    return;
  }
  let totalItems = 0;
  let totalShipping = 0;
  let totalTax = 0;
  products.forEach((p) => {
    totalItems += Number(p.price || 0) * Number(p.quantity || 0);
    totalShipping += Number(p.shipping || 0);
    totalTax += Number(p.tax || 0);
  });
  const totalCost = totalItems + totalShipping + totalTax;
  summaryDiv.innerHTML = `
    <p>Items: <span>USD ${usd(totalItems)}</span></p>
    <p>Shipping & handling: <span>USD ${usd(totalShipping)}</span></p>
    <p>Estimated tax to be collected: <span>USD ${usd(totalTax)}</span></p>
    <h3>Order total: <span>USD ${usd(totalCost)}</span></h3>
  `;
}
// ==== Инициализация ==========================================================
(async function initCheckout() {
  try {
    // 1) грузим с сервера; 2) если не вышло — используем localStorage
    const [address, products] = await Promise.all([
      loadAddress(),
      loadProducts(),
    ]);
    renderAddress(address);
    renderProducts(products);
    renderSummary(products);
  } catch (e) {
    console.error("Checkout init error:", e);
    // жёсткий fallback на локальные данные
    const address = getLocalAddress();
    const products = getLocalProducts();
    renderAddress(address);
    renderProducts(products);
    renderSummary(products);
  }
})();
