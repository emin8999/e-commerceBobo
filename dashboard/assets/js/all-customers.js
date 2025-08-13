/* ====== CONFIG ====== */
const API_BASE = "http://116.203.51.133:8080";
const ENDPOINTS = {
  list: `${API_BASE}/admin/customers`,
  one: (id) => `${API_BASE}/admin/customers/${encodeURIComponent(id)}`,
};
// Если используешь JWT:
// const AUTH_TOKEN = localStorage.getItem("token") || "";

/* ====== HELPERS ====== */
async function apiJSON(url, options = {}) {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      // ...(AUTH_TOKEN ? { Authorization: `Bearer ${AUTH_TOKEN}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText} ${t}`);
  }
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : {};
}
function fmtMoney(n) {
  const x = Number(n || 0);
  return `$${x.toFixed(2)}`;
}
function fmtDate(d) {
  const dd = new Date(d);
  return isNaN(dd) ? "-" : dd.toLocaleDateString();
}
function fmtDateTime(d) {
  const dd = new Date(d);
  return isNaN(dd) ? "-" : dd.toLocaleString();
}

/* ====== LOCAL FALLBACK ====== */
function getLocalCustomers() {
  try {
    return JSON.parse(localStorage.getItem("customers") || "[]");
  } catch {
    return [];
  }
}
function setLocalCustomers(arr) {
  localStorage.setItem("customers", JSON.stringify(arr || []));
}

/* ====== RENDER ====== */
function renderTableRows(customers) {
  const tbody = document.querySelector("#customerTable tbody");
  tbody.innerHTML = "";

  if (!Array.isArray(customers) || customers.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="10" style="text-align:center;padding:16px;">No customers</td>`;
    tbody.appendChild(row);
    return;
  }

  customers.forEach((cust, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${cust.name ?? "-"}</td>
      <td>${cust.email ?? "-"}</td>
      <td>${cust.phone ?? "-"}</td>
      <td>${cust.address ?? "-"}</td>
      <td>${cust.ordersCount ?? 0}</td>
      <td>${fmtMoney(cust.totalSpent)}</td>
      <td>${fmtDate(cust.lastVisit)}</td>
      <td>${cust.status ?? "-"}</td>
      <td><button class="btn-analytics" data-id="${
        cust.id
      }">Analytics</button></td>
    `;
    tbody.appendChild(row);
  });

  // навесим обработчики на кнопки
  tbody.querySelectorAll(".btn-analytics").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      await openAnalyticsById(id);
    });
  });
}

/* ====== BACKEND LOAD ====== */
async function loadCustomers() {
  try {
    const data = await apiJSON(ENDPOINTS.list);
    if (!Array.isArray(data)) throw new Error("Bad customers payload");
    setLocalCustomers(data); // кэш на случай офлайна
    return data;
  } catch (e) {
    console.warn("Backend unavailable, using local customers cache.", e);
    return getLocalCustomers();
  }
}

async function openAnalyticsById(id) {
  const local = getLocalCustomers();
  // сначала попробуем сервер — вдруг там более свежие данные
  let cust = null;
  try {
    cust = await apiJSON(ENDPOINTS.one(id));
  } catch {
    // если не удалось — найдём в локальном кэше
    cust = local.find((c) => String(c.id) === String(id)) || null;
  }
  if (!cust) {
    alert("Customer not found");
    return;
  }
  openAnalyticsModal(cust);
}

/* ====== MODAL ====== */
function openAnalyticsModal(cust) {
  document.getElementById("modalCustName").textContent = cust.name ?? "-";
  document.getElementById("modalCustEmail").textContent = cust.email ?? "-";
  document.getElementById("modalCustOrders").textContent =
    cust.ordersCount ?? 0;
  document.getElementById("modalCustSpent").textContent = fmtMoney(
    cust.totalSpent
  );
  document.getElementById("modalCustVisit").textContent = fmtDateTime(
    cust.lastVisit
  );
  document.getElementById("modalCustPhone").textContent = cust.phone ?? "-";
  document.getElementById("modalCustAddress").textContent = cust.address ?? "-";
  document.getElementById("modalCustCategory").textContent =
    cust.favoriteCategory ?? "-";
  document.getElementById("modalCustFavProduct").textContent =
    cust.favoriteProduct ?? "-";

  document.getElementById("analyticsModal").classList.add("show");
}
function closeModal() {
  document.getElementById("analyticsModal").classList.remove("show");
}
window.closeModal = closeModal; // если кнопка в разметке вызывает closeModal()

/* ====== INIT ====== */
document.addEventListener("DOMContentLoaded", async () => {
  const customers = await loadCustomers();
  renderTableRows(customers);
});
