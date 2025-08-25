document.addEventListener("DOMContentLoaded", () => {
  const storeId = new URLSearchParams(window.location.search).get("storeId");

  /* ============== CONFIG ============== */
  const API_BASE = "http://116.203.51.133:8080";
  const ENDPOINTS = {
    analytics: (id) =>
      `${API_BASE}/admin/stores/${encodeURIComponent(id)}/analytics`,
    ordersByStore: (id) =>
      `${API_BASE}/admin/orders?storeId=${encodeURIComponent(id)}`,
    productsByStore: (id) =>
      `${API_BASE}/admin/products?storeId=${encodeURIComponent(id)}`,
  };

  // --- JWT ---
  const AUTH = localStorage.getItem("storeJwt"); // ключ с большой буквы

  // если токена нет → сразу на логин
  if (!AUTH) {
    window.location.href = "store-login.html";
    return;
  }

  /* ============== HELPERS ============== */
  async function apiJSON(url) {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(AUTH ? { Authorization: `Bearer ${AUTH}` } : {}),
      },
    });
    if (!res.ok) {
      // если токен недействителен → кидаем на логин
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("storeJwt");
        window.location.href = "store-login.html";
        return;
      }
      throw new Error(`${res.status} ${res.statusText}`);
    }
    return res.json();
  }

  function getLocal(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || "[]");
    } catch {
      return [];
    }
  }

  function computeAnalyticsFromRaw({ orders, products }) {
    const storeOrders = (orders || []).filter(
      (o) =>
        Array.isArray(o.products) &&
        o.products.some((p) => String(p.storeId) === String(storeId))
    );
    const storeProducts = (products || []).filter(
      (p) => String(p.storeId) === String(storeId)
    );

    const totalRevenue = storeOrders.reduce(
      (sum, o) => sum + Number(o.total || 0),
      0
    );
    const totalOrders = storeOrders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const counts = {};
    storeOrders.forEach((o) => {
      o.products.forEach((p) => {
        if (String(p.storeId) === String(storeId)) {
          counts[p.name] = (counts[p.name] || 0) + 1;
        }
      });
    });
    const popularProduct =
      Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

    const soldIds = new Set();
    storeOrders.forEach((o) => {
      o.products.forEach((p) => {
        if (String(p.storeId) === String(storeId)) soldIds.add(String(p.id));
      });
    });
    const unsoldProducts = storeProducts.filter(
      (p) => !soldIds.has(String(p.id))
    );

    const dailyMap = {};
    storeOrders.forEach((o) => {
      const label = new Date(o.date).toLocaleDateString();
      dailyMap[label] = (dailyMap[label] || 0) + Number(o.total || 0);
    });
    const dailySales = Object.entries(dailyMap).map(([date, total]) => ({
      date,
      total,
    }));

    return {
      totalRevenue,
      totalOrders,
      avgOrderValue,
      popularProduct,
      unsoldProducts,
      dailySales,
    };
  }

  function renderAnalytics({
    totalRevenue,
    totalOrders,
    avgOrderValue,
    popularProduct,
    unsoldProducts,
    dailySales,
  }) {
    document.getElementById("totalRevenue").textContent = `$${Number(
      totalRevenue || 0
    ).toLocaleString()}`;
    document.getElementById("totalOrders").textContent = Number(
      totalOrders || 0
    );
    document.getElementById("avgOrderValue").textContent = `$${Number(
      avgOrderValue || 0
    ).toFixed(2)}`;
    document.getElementById("popularProduct").textContent =
      popularProduct || "—";

    const unsoldList = document.getElementById("unsoldProducts");
    unsoldList.innerHTML = "";
    (unsoldProducts || []).forEach((p) => {
      const li = document.createElement("li");
      li.textContent = p.name || "(no name)";
      unsoldList.appendChild(li);
    });

    const labels = (dailySales || []).map((d) => d.date);
    const values = (dailySales || []).map((d) => Number(d.total || 0));
    new Chart(document.getElementById("salesChart"), {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Daily Revenue",
            data: values,
            fill: true,
            borderColor: "#007acc",
            backgroundColor: "rgba(0,122,204,0.1)",
          },
        ],
      },
      options: { responsive: true, scales: { y: { beginAtZero: true } } },
    });
  }

  /* ============== LOAD (backend → fallback) ============== */
  (async function init() {
    try {
      const a = await apiJSON(ENDPOINTS.analytics(storeId));
      renderAnalytics(a);
    } catch {
      try {
        const [orders, products] = await Promise.all([
          apiJSON(ENDPOINTS.ordersByStore(storeId)),
          apiJSON(ENDPOINTS.productsByStore(storeId)),
        ]);
        const a = computeAnalyticsFromRaw({ orders, products });
        renderAnalytics(a);
      } catch {
        const localOrders = getLocal("orders");
        const localProducts = getLocal("products");
        const a = computeAnalyticsFromRaw({
          orders: localOrders,
          products: localProducts,
        });
        renderAnalytics(a);
      }
    }
  })();
});
