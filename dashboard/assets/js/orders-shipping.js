/* ========== CONFIG ========== */
const API_BASE = "http://116.203.51.133:8080";
const ENDPOINTS = {
  list: (q = {}) => {
    const usp = new URLSearchParams();
    if (q.city) usp.set("city", q.city);
    if (q.method) usp.set("method", q.method);
    if (q.status) usp.set("status", q.status);
    const qs = usp.toString();
    return `${API_BASE}/admin/orders${qs ? `?${qs}` : ""}`;
  },
  patchShipping: (orderId) =>
    `${API_BASE}/admin/orders/${encodeURIComponent(orderId)}/shipping`,
  delShipping: (orderId) =>
    `${API_BASE}/admin/orders/${encodeURIComponent(orderId)}/shipping`,
};
// Если используешь JWT:
// const AUTH = localStorage.getItem("token") || "";

/* ========== DOM ========== */
const tbody = document.getElementById("shippingBody");
const cityInput = document.getElementById("filterCity");
const methodInput = document.getElementById("filterMethod");
const statusInput = document.getElementById("filterStatus");
const applyFilters = document.getElementById("applyFilters");

/* ========== STATE ========== */
let orders = []; // актуальный список в памяти

/* ========== HELPERS ========== */
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
function safe(x) {
  return (x ?? "").toString();
}

/* ========== LOAD ========== */
async function loadOrders(filters = {}) {
  try {
    const data = await apiJSON(ENDPOINTS.list(filters));
    if (!Array.isArray(data)) throw new Error("Bad orders payload");
    orders = data;
    setLocalOrders(orders); // кэш на офлайн
  } catch (e) {
    console.warn("Backend unavailable, using local cache.", e);
    orders = getLocalOrders();

    // локальная фильтрация как запасной вариант
    const cityVal = (filters.city || "").toLowerCase();
    const methodVal = (filters.method || "").toLowerCase();
    const statusVal = (filters.status || "").toLowerCase();

    if (cityVal || methodVal || statusVal) {
      orders = orders.filter((o) => {
        const s = o.shipping || {};
        return (
          safe(s.city).toLowerCase().includes(cityVal) &&
          safe(s.method).toLowerCase().includes(methodVal) &&
          safe(s.status).toLowerCase().includes(statusVal)
        );
      });
    }
  }
  renderTable(orders);
}

/* ========== RENDER ========== */
function renderTable(data) {
  tbody.innerHTML = "";

  if (!data.length) {
    tbody.innerHTML =
      "<tr><td colspan='10'>No shipping records found.</td></tr>";
    return;
  }

  const frag = document.createDocumentFragment();

  data.forEach((order) => {
    const tr = document.createElement("tr");
    const s = order.shipping || {};
    tr.innerHTML = `
      <td>${safe(order.orderId)}</td>
      <td>${safe(order.customer?.name)}</td>
      <td>${safe(s.address || "N/A")}</td>
      <td>${safe(s.city || "N/A")} / ${safe(s.country || "")}</td>
      <td>${safe(s.method || "N/A")}</td>
      <td>${safe(s.tracking || "-")}</td>
      <td>${safe(s.status || "Not shipped")}</td>
      <td>${safe(s.date || "-")}</td>
      <td>${safe(s.notes || "-")}</td>
      <td class="actions">
        <button class="edit"   data-action="edit"   data-id="${safe(
          order.orderId
        )}">Edit</button>
        <button class="status" data-action="status" data-id="${safe(
          order.orderId
        )}">Status</button>
        <button class="delete" data-action="delete" data-id="${safe(
          order.orderId
        )}">Delete</button>
      </td>
    `;
    frag.appendChild(tr);
  });

  tbody.appendChild(frag);
}

/* ========== ACTIONS ========== */
async function editTracking(orderId) {
  const order = orders.find((o) => String(o.orderId) === String(orderId));
  if (!order) return;

  const tracking = prompt(
    "Enter or update tracking number:",
    order.shipping?.tracking || ""
  );
  if (tracking === null) return;

  // optimistic UI
  const prev = { ...(order.shipping || {}) };
  order.shipping = { ...prev, tracking };
  setLocalOrders(orders);
  renderTable(orders);

  try {
    await apiJSON(ENDPOINTS.patchShipping(orderId), {
      method: "PATCH",
      body: JSON.stringify({ tracking }),
    });
  } catch (e) {
    alert("Failed to update tracking. Reverting.");
    order.shipping = prev;
    setLocalOrders(orders);
    renderTable(orders);
  }
}

async function updateStatus(orderId) {
  const order = orders.find((o) => String(o.orderId) === String(orderId));
  if (!order) return;

  const newStatus = prompt(
    "Enter new shipping status:",
    order.shipping?.status || "Not shipped"
  );
  if (!newStatus) return;

  // optimistic UI
  const prev = { ...(order.shipping || {}) };
  order.shipping = { ...prev, status: newStatus };
  setLocalOrders(orders);
  renderTable(orders);

  try {
    await apiJSON(ENDPOINTS.patchShipping(orderId), {
      method: "PATCH",
      body: JSON.stringify({ status: newStatus }),
    });
  } catch (e) {
    alert("Failed to update status. Reverting.");
    order.shipping = prev;
    setLocalOrders(orders);
    renderTable(orders);
  }
}

async function deleteShipping(orderId) {
  const idx = orders.findIndex((o) => String(o.orderId) === String(orderId));
  if (idx < 0) return;

  if (!confirm("Delete shipping info for this order?")) return;

  // optimistic UI
  const prev = { ...(orders[idx].shipping || {}) };
  delete orders[idx].shipping;
  setLocalOrders(orders);
  renderTable(orders);

  try {
    await apiJSON(ENDPOINTS.delShipping(orderId), { method: "DELETE" });
  } catch (e) {
    alert("Failed to delete shipping info. Reverting.");
    orders[idx].shipping = prev;
    setLocalOrders(orders);
    renderTable(orders);
  }
}

/* ========== EVENTS ========== */
// фильтры
applyFilters.addEventListener("click", () => {
  loadOrders({
    city: cityInput.value.trim(),
    method: methodInput.value.trim(),
    status: statusInput.value.trim(),
  });
});

// делегирование кликов
tbody.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;
  const action = btn.dataset.action;
  const id = btn.dataset.id;
  if (action === "edit") return editTracking(id);
  if (action === "status") return updateStatus(id);
  if (action === "delete") return deleteShipping(id);
});

// первичная загрузка (без серверных фильтров)
loadOrders();
