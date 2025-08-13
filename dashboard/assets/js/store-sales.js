document.addEventListener("DOMContentLoaded", () => {
  /* ========== CONFIG ========== */
  const API_BASE = "http://116.203.51.133:8080";
  const ORDERS_URL = (storeId) =>
    `${API_BASE}/admin/orders?storeId=${encodeURIComponent(storeId)}`;

  /* ========== DOM ========== */
  const salesTableBody = document.querySelector("#salesTable tbody");
  const exportBtn = document.getElementById("exportCSV");

  /* ========== STATE ========== */
  const storeId =
    localStorage.getItem("currentStoreId") ||
    new URLSearchParams(location.search).get("storeId") ||
    "";
  let orders = []; // актуальные заказы магазина

  /* ========== HELPERS ========== */
  async function fetchJSON(url, opts = {}) {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(localStorage.getItem("jwtToken")
          ? { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` }
          : {}),
        ...(opts.headers || {}),
      },
      ...opts,
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      const err = new Error(txt || `${res.status} ${res.statusText}`);
      err.status = res.status;
      throw err;
    }
    const ct = res.headers.get("content-type") || "";
    return ct.includes("application/json") ? res.json() : {};
  }

  function getLocalOrders() {
    try {
      return JSON.parse(localStorage.getItem("orders") || "[]");
    } catch {
      return [];
    }
  }

  function renderTable(data) {
    salesTableBody.innerHTML = "";
    if (!data?.length) {
      salesTableBody.innerHTML =
        "<tr><td colspan='6' style='text-align:center;padding:16px;'>No sales found</td></tr>";
      return;
    }

    const frag = document.createDocumentFragment();
    data.forEach((order) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${order.id}</td>
        <td>${(order.products || [])
          .map((p) => p?.name)
          .filter(Boolean)
          .join(", ")}</td>
        <td>${order.buyer || "-"}</td>
        <td>$${Number(order.total || 0).toFixed(2)}</td>
        <td>${new Date(order.date).toLocaleDateString()}</td>
        <td>${order.status || "-"}</td>
      `;
      frag.appendChild(row);
    });
    salesTableBody.appendChild(frag);
  }

  function exportToCSV(data) {
    const headers = [
      "Order ID",
      "Products",
      "Buyer",
      "Total Amount",
      "Date",
      "Status",
    ];
    const rows = (data || []).map((o) => [
      o.id,
      (o.products || [])
        .map((p) => p?.name)
        .filter(Boolean)
        .join(" | "),
      o.buyer || "",
      Number(o.total || 0).toFixed(2),
      new Date(o.date).toLocaleDateString(),
      o.status || "",
    ]);

    const csv = [headers, ...rows]
      .map((r) =>
        r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "store-sales.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /* ========== LOAD ========== */
  async function loadSales() {
    if (!storeId) {
      renderTable([]);
      return;
    }

    try {
      const data = await fetchJSON(ORDERS_URL(storeId));
      if (!Array.isArray(data)) throw new Error("Bad orders payload");
      // фильтруем на всякий случай по storeId, если сервер вернул «лишнее»
      orders = data.filter(
        (o) => String(o.storeId || storeId) === String(storeId)
      );
    } catch (e) {
      console.warn("Backend unavailable, using local cache.", e);
      // локальный запасной путь: возьмём все локальные заказы и отфильтруем по storeId
      const local = getLocalOrders();
      orders = local.filter((o) => String(o.storeId) === String(storeId));
    }
    renderTable(orders);
  }

  /* ========== EVENTS ========== */
  exportBtn?.addEventListener("click", () => exportToCSV(orders));

  /* ========== INIT ========== */
  loadSales();
});
