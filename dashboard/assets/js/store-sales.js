document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = "http://116.203.51.133:8080";
  const TOP_URL = (limit = 100) =>
    `${API_BASE}/admin/stores/top?limit=${limit}`;
  const LS_KEY = "topStoresCache";

  /* ========= CHECK TOKEN ========= */
  const token = localStorage.getItem("storeJwt"); // <-- ключ именно storeJwt
  if (!token) {
    window.location.href = "store-login.html";
    return; // прекращаем выполнение скрипта
  }

  const tableBody = document.querySelector("#storesTable tbody");
  const searchEl = document.getElementById("storeSearch");
  const chartCtx = document.getElementById("topStoresChart")?.getContext("2d");

  let storesData = [];
  let chart;

  async function fetchJSON(url) {
    try {
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        // токен недействителен → удаляем и редирект
        localStorage.removeItem("storeJwt"); // <-- ключ именно storeJwt
        window.location.href = "store-login.html";
        return null;
      }

      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      return res.json();
    } catch (err) {
      console.warn("Fetch failed, используя кеш.", err);
      return loadCache();
    }
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
    if (!tableBody) return;
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
    if (!chartCtx) return;
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
      options: { responsive: true, scales: { y: { beginAtZero: true } } },
    });
  }

  function applySearch() {
    if (!searchEl) return;
    const keyword = (searchEl.value || "").toLowerCase();
    const filtered = storesData.filter((s) =>
      (s.name || "").toLowerCase().includes(keyword)
    );
    renderTable(filtered);
    renderChart(filtered);
  }

  (async function init() {
    const data = await fetchJSON(TOP_URL(100));
    if (data === null) return; // остановка init после редиректа
    storesData = Array.isArray(data) ? data : [];
    saveCache(storesData);
    renderTable(storesData);
    renderChart(storesData);
  })();

  if (searchEl) searchEl.addEventListener("input", applySearch);
});
