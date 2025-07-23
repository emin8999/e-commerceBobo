document.addEventListener("DOMContentLoaded", () => {
  const storesData = [
    {
      name: "Tech World",
      orders: 120,
      revenue: 15600,
      lastOrder: "2025-07-21T14:22:00Z",
    },
    {
      name: "Fresh Foods",
      orders: 90,
      revenue: 8700,
      lastOrder: "2025-07-21T13:40:00Z",
    },
    {
      name: "Fashion Hub",
      orders: 150,
      revenue: 23400,
      lastOrder: "2025-07-21T15:10:00Z",
    },
    {
      name: "Gadget Zone",
      orders: 60,
      revenue: 9900,
      lastOrder: "2025-07-21T12:10:00Z",
    },
  ];

  const tableBody = document.querySelector("#storesTable tbody");

  function renderTable(data) {
    tableBody.innerHTML = "";
    data.forEach((store) => {
      const avg = store.revenue / store.orders;
      const row = `<tr>
        <td>${store.name}</td>
        <td>${store.orders}</td>
        <td>$${store.revenue.toLocaleString()}</td>
        <td>$${avg.toFixed(2)}</td>
        <td>${new Date(store.lastOrder).toLocaleString()}</td>
      </tr>`;
      tableBody.innerHTML += row;
    });
  }

  function renderChart(data) {
    const ctx = document.getElementById("topStoresChart").getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.map((s) => s.name),
        datasets: [
          {
            label: "Total Revenue ($)",
            data: data.map((s) => s.revenue),
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

  renderTable(storesData);
  renderChart(storesData);

  document.getElementById("storeSearch").addEventListener("input", (e) => {
    const keyword = e.target.value.toLowerCase();
    const filtered = storesData.filter((store) =>
      store.name.toLowerCase().includes(keyword)
    );
    renderTable(filtered);
  });
});
