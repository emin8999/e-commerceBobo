document.addEventListener("DOMContentLoaded", () => {
  /* ========= CONFIG ========= */
  const API_BASE = "http://116.203.51.133:8080";
  const OVERVIEW_URL = `${API_BASE}/admin/dashboard/overview`;
  const LS_CACHE_KEY = "dashboardOverviewCache";

  /* ========= DOM ========= */
  const el = {
    totalOrders: document.querySelector("#totalOrders .kpi-value"),
    totalRevenue: document.querySelector("#totalRevenue .kpi-value"),
    totalCustomers: document.querySelector("#totalCustomers .kpi-value"),
    totalStores: document.querySelector("#totalStores .kpi-value"),
    totalProducts: document.querySelector("#totalProducts .kpi-value"),
    todayRevenue: document.querySelector("#todayRevenue .kpi-value"),
    chartCat: document.getElementById("ordersByCategory"),
    chartRev: document.getElementById("revenueOverTime"),
  };

  /* ========= STATE ========= */
  let chartCategory, chartRevenue;

  /* ========= HELPERS ========= */
  async function fetchJSON(url) {
    const headers = {
      "Content-Type": "application/json",
    };
    const token = localStorage.getItem("jwtToken");
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(url, { headers });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      const err = new Error(txt || `${res.status} ${res.statusText}`);
      err.status = res.status;
      throw err;
    }
    return res.json();
  }

  function saveCache(data) {
    localStorage.setItem(LS_CACHE_KEY, JSON.stringify(data || {}));
  }
  function loadCache() {
    try {
      return JSON.parse(localStorage.getItem(LS_CACHE_KEY) || "{}");
    } catch {
      return {};
    }
  }
  function nonEmptyObject(o) {
    return o && typeof o === "object" && Object.keys(o).length > 0;
  }

  function renderKPIs(data) {
    el.totalOrders.textContent = Number(data.totalOrders || 0);
    el.totalRevenue.textContent = `$${Number(
      data.totalRevenue || 0
    ).toLocaleString()}`;
    el.totalCustomers.textContent = Number(data.totalCustomers || 0);
    el.totalStores.textContent = Number(data.totalStores || 0);
    el.totalProducts.textContent = Number(data.totalProducts || 0);
    el.todayRevenue.textContent = `$${Number(
      data.todayRevenue || 0
    ).toLocaleString()}`;
  }

  function renderCharts(data) {
    const ordersByCategory = data.ordersByCategory || {};
    const revenueByMonth = data.revenueByMonth || {};

    const catLabels = Object.keys(ordersByCategory);
    const catValues = Object.values(ordersByCategory).map(Number);

    const monthLabels = Object.keys(revenueByMonth);
    const monthValues = Object.values(revenueByMonth).map(Number);

    if (chartCategory) chartCategory.destroy();
    if (chartRevenue) chartRevenue.destroy();

    chartCategory = new Chart(el.chartCat, {
      type: "pie",
      data: {
        labels: catLabels,
        datasets: [
          {
            data: catValues,
            backgroundColor: ["#007acc", "#ff9933", "#66cc66", "#9966cc"],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { position: "bottom" } },
      },
    });

    chartRevenue = new Chart(el.chartRev, {
      type: "bar",
      data: {
        labels: monthLabels,
        datasets: [
          {
            label: "Monthly Revenue ($)",
            data: monthValues,
            backgroundColor: "#007acc",
          },
        ],
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true } },
      },
    });
  }

  function renderAll(data) {
    renderKPIs(data);
    renderCharts(data);
  }

  /* ========= INIT ========= */
  (async function init() {
    try {
      const data = await fetchJSON(OVERVIEW_URL);
      // простая валидация ожидаемых ключей
      if (!("totalOrders" in data) || !nonEmptyObject(data))
        throw new Error("Bad overview payload");
      saveCache(data);
      renderAll(data);
    } catch (e) {
      console.warn(
        "Backend unavailable or unauthorized, using local cache.",
        e
      );
      const cached = loadCache();
      if (nonEmptyObject(cached)) {
        renderAll(cached);
      } else {
        // как крайний случай — пустые данные, чтобы UI не ломался
        renderAll({
          totalOrders: 0,
          totalRevenue: 0,
          totalCustomers: 0,
          totalStores: 0,
          totalProducts: 0,
          todayRevenue: 0,
          ordersByCategory: {},
          revenueByMonth: {},
        });
      }
      // если токен протух — подчистим его
      if (e.status === 401 || e.status === 403) {
        localStorage.removeItem("jwtToken");
      }
    }
  })();
});
