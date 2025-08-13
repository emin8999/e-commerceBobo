/* ============== CONFIG ============== */
const API_BASE = "http://116.203.51.133:8080";
const ENDPOINTS = {
  list: (q = {}) => {
    const usp = new URLSearchParams();
    if (q.store) usp.set("store", q.store);
    if (q.status) usp.set("status", q.status);
    const qs = usp.toString();
    return `${API_BASE}/admin/orders${qs ? `?${qs}` : ""}`;
  },
  status: (orderId) =>
    `${API_BASE}/admin/orders/${encodeURIComponent(orderId)}/status`,
  del: (orderId) => `${API_BASE}/admin/orders/${encodeURIComponent(orderId)}`,
  one: (orderId) => `${API_BASE}/admin/orders/${encodeURIComponent(orderId)}`,
};
// Если нужен JWT:
// const AUTH = localStorage.getItem("token") || "";

/* ============== DOM ============== */
const tbody = document.getElementById("ordersBody");
const filterStore = document.getElementById("filterStore");
const filterStatus = document.getElementById("filterStatus");
const applyFiltersBtn = document.getElementById("applyFilters");

/* ============== STATE ============== */
let orders = []; // текущий список в памяти

/* ============== HELPERS ============== */
async function apiJSON(url, options = {}) {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      // ...(AUTH ? { Authorization: `Bearer ${AUTH}` } : {}),
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
  return `$${(isFinite(x) ? x : 0).toFixed(2)}`;
}
function safeText(x) {
  return (x ?? "").toString();
}
function setLocalOrders(arr) {
  localStorage.setItem("orders", JSON.stringify(arr || []));
}
function getLocalOrders() {
  try {
    return JSON.parse(localStorage.getItem("orders") || "[]");
  } catch {
    return [];
  }
}

/* ============== LOAD & RENDER ============== */
async function loadOrders(filters = {}) {
  try {
    const data = await apiJSON(ENDPOINTS.list(filters));
    if (!Array.isArray(data)) throw new Error("Bad orders payload");
    orders = data;
    setLocalOrders(orders); // кэш на случай офлайна
  } catch (e) {
    console.warn("Backend unavailable, using local orders cache.", e);
    orders = getLocalOrders();
    // локальная фильтрация, если заданы фильтры
    if (filters.store || filters.status) {
      const store = (filters.store || "").toLowerCase();
      const status = (filters.status || "").toLowerCase();
      orders = orders.filter((o) => {
        const matchStore = safeText(o.store?.name)
          .toLowerCase()
          .includes(store);
        const matchStatus = safeText(o.status).toLowerCase().includes(status);
        return matchStore && matchStatus;
      });
    }
  }
  renderOrders(orders);
}

function renderOrders(orderList) {
  tbody.innerHTML = "";

  if (!orderList.length) {
    tbody.innerHTML = "<tr><td colspan='12'>No orders found.</td></tr>";
    return;
  }

  const frag = document.createDocumentFragment();
  orderList.forEach((order) => {
    const tr = document.createElement("tr");

    const productNames = Array.isArray(order.products)
      ? order.products
          .map((p) => p?.name)
          .filter(Boolean)
          .join(", ")
      : "";

    const customerInfo = [
      safeText(order.customer?.name),
      safeText(order.customer?.email),
      safeText(order.customer?.phone || "N/A"),
    ].join("++");

    tr.innerHTML = `
      <td>${safeText(order.orderId)}</td>
      <td>${productNames}</td>
      <td>${customerInfo}</td>
      <td>${safeText(order.store?.name)}</td>
      <td>${safeText(order.store?.contactName || "N/A")}</td>
      <td>${safeText(order.store?.email || "N/A")}</td>
      <td>${safeText(order.store?.phone || "N/A")}</td>
      <td>${fmtMoney(order.totalAmount)}</td>
      <td>${safeText(order.status)}</td>
      <td>${safeText(order.orderDate)}</td>
      <td>${safeText(order.paymentMethod)}</td>
      <td class="actions">
        <button class="view"   data-action="view"   data-id="${safeText(
          order.orderId
        )}">View</button>
        <button class="status" data-action="status" data-id="${safeText(
          order.orderId
        )}">Change</button>
        <button class="delete" data-action="delete" data-id="${safeText(
          order.orderId
        )}">Delete</button>
      </td>
    `;
    frag.appendChild(tr);
  });
  tbody.appendChild(frag);
}

/* ============== ACTIONS ============== */
async function viewDetails(orderId) {
  // если есть страница/модал деталей — открой её, пока простой alert:
  try {
    // попробуем подтянуть свежие данные с бэка (если есть such endpoint)
    const detail = await apiJSON(ENDPOINTS.one(orderId));
    alert(
      `Order ${orderId}\nStatus: ${detail.status}\nTotal: ${fmtMoney(
        detail.totalAmount
      )}`
    );
  } catch {
    // fallback: из orders в памяти
    const o = orders.find((x) => String(x.orderId) === String(orderId));
    if (!o) return alert("Order not found");
    alert(
      `Order ${orderId}\nStatus: ${o.status}\nTotal: ${fmtMoney(o.totalAmount)}`
    );
  }
}

async function changeStatus(orderId) {
  const order = orders.find((o) => String(o.orderId) === String(orderId));
  if (!order) return;

  const newStatus = prompt("Enter new status:", order.status);
  if (!newStatus) return;

  // optimistic UI
  const oldStatus = order.status;
  order.status = newStatus;
  setLocalOrders(orders);
  renderOrders(orders);

  try {
    await apiJSON(ENDPOINTS.status(orderId), {
      method: "PATCH",
      body: JSON.stringify({ status: newStatus }),
    });
  } catch (e) {
    alert("Failed to update status. Reverting.");
    order.status = oldStatus;
    setLocalOrders(orders);
    renderOrders(orders);
  }
}

async function deleteOrder(orderId) {
  if (!confirm("Are you sure you want to delete this order?")) return;

  const idx = orders.findIndex((o) => String(o.orderId) === String(orderId));
  if (idx < 0) return;

  // optimistic UI
  const backup = [...orders];
  orders.splice(idx, 1);
  setLocalOrders(orders);
  renderOrders(orders);

  try {
    await apiJSON(ENDPOINTS.del(orderId), { method: "DELETE" });
  } catch (e) {
    alert("Failed to delete order. Reverting.");
    orders = backup;
    setLocalOrders(orders);
    renderOrders(orders);
  }
}

/* ============== EVENTS ============== */
// фильтры
applyFiltersBtn.addEventListener("click", () => {
  const store = filterStore.value.trim();
  const status = filterStatus.value.trim();
  loadOrders({ store, status });
});

// делегирование кликов по кнопкам в таблице
tbody.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;
  const action = btn.dataset.action;
  const id = btn.dataset.id;
  if (action === "view") return viewDetails(id);
  if (action === "status") return changeStatus(id);
  if (action === "delete") return deleteOrder(id);
});

// первичная загрузка
loadOrders();
