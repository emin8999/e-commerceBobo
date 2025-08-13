document.addEventListener("DOMContentLoaded", () => {
  /* ========= CONFIG ========= */
  const API_BASE = "http://116.203.51.133:8080";
  const TOP_URL = (limit = 100) =>
    `${API_BASE}/admin/stores/top?limit=${limit}`;
  const LS_KEY = "topStoresCache"; // кэш на офлайн

  /* ========= DOM ========= */
  const tableBody = document.querySelector("#storesTable tbody");
  const searchEl = document.getElementById("storeSearch");
  const chartCtx = document.getElementById("topStoresChart").getContext("2d");

  /* ========= STATE ========= */
  let storesData = [];
  let chart; // Chart.js instance

  /* ========= HELPERS ========= */
  async function fetchJSON(url) {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        // Если нужен JWT:
        // ...(localStorage.getItem("jwtToken") ? { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` } : {}),
      },
    });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return res.json();
  }
  function saveCache(data) {
    localStorage.setItem(LS_KEY, JSON.stringify(data || []));
  }
  function loadCache() {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
    } catch {
      return [];
    }
  }

  function renderTable(data) {
    tableBody.innerHTML = "";
    if (!data.length) {
      tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:16px;">No stores</td></tr>`;
      return;
    }
    const frag = document.createDocumentFragment();
    data.forEach((store) => {
      const avg = Number(store.revenue || 0) / (Number(store.orders || 0) || 1);
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${store.name || "-"}</td>
        <td>${Number(store.orders || 0)}</td>
        <td>$${Number(store.revenue || 0).toLocaleString()}</td>
        <td>$${avg.toFixed(2)}</td>
        <td>${
          store.lastOrder ? new Date(store.lastOrder).toLocaleString() : "-"
        }</td>
      `;
      frag.appendChild(tr);
    });
    tableBody.appendChild(frag);
  }

  function renderChart(data) {
    const labels = data.map((s) => s.name);
    const values = data.map((s) => Number(s.revenue || 0));

    if (chart) chart.destroy();
    chart = new Chart(chartCtx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Total Revenue ($)",
            data: values,
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

  function applySearch() {
    const keyword = (searchEl.value || "").toLowerCase();
    const filtered = storesData.filter((s) =>
      (s.name || "").toLowerCase().includes(keyword)
    );
    renderTable(filtered);
    renderChart(filtered);
  }

  /* ========= INIT LOAD ========= */
  (async function init() {
    try {
      const data = await fetchJSON(TOP_URL(100));
      if (!Array.isArray(data)) throw new Error("Bad payload");
      storesData = data;
      saveCache(storesData);
    } catch (e) {
      console.warn("Backend unavailable, using local cache.", e);
      storesData = loadCache();
    }
    renderTable(storesData);
    renderChart(storesData);
  })();

  /* ========= EVENTS ========= */
  searchEl.addEventListener("input", applySearch);
});
