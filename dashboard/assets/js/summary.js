document.addEventListener("DOMContentLoaded", () => {
  // Dummy data from localStorage or fake setup
  const data = {
    totalOrders: 120,
    totalRevenue: 45230.75,
    totalCustomers: 89,
    totalStores: 12,
    totalProducts: 540,
    todayRevenue: 1580.5,
    ordersByCategory: {
      Electronics: 40,
      Fashion: 25,
      Food: 30,
      Books: 25,
    },
    revenueByMonth: {
      Jan: 5200,
      Feb: 4300,
      Mar: 6100,
      Apr: 4800,
      May: 6600,
      Jun: 7230,
    },
  };

  // Insert values into KPI cards
  document.querySelector("#totalOrders .kpi-value").textContent =
    data.totalOrders;
  document.querySelector(
    "#totalRevenue .kpi-value"
  ).textContent = `$${data.totalRevenue.toLocaleString()}`;
  document.querySelector("#totalCustomers .kpi-value").textContent =
    data.totalCustomers;
  document.querySelector("#totalStores .kpi-value").textContent =
    data.totalStores;
  document.querySelector("#totalProducts .kpi-value").textContent =
    data.totalProducts;
  document.querySelector(
    "#todayRevenue .kpi-value"
  ).textContent = `$${data.todayRevenue.toLocaleString()}`;

  // Chart 1 – Orders by Category
  const categoryChart = new Chart(document.getElementById("ordersByCategory"), {
    type: "pie",
    data: {
      labels: Object.keys(data.ordersByCategory),
      datasets: [
        {
          data: Object.values(data.ordersByCategory),
          backgroundColor: ["#007acc", "#ff9933", "#66cc66", "#9966cc"],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { position: "bottom" } },
    },
  });

  // Chart 2 – Revenue Over Time
  const revenueChart = new Chart(document.getElementById("revenueOverTime"), {
    type: "bar",
    data: {
      labels: Object.keys(data.revenueByMonth),
      datasets: [
        {
          label: "Monthly Revenue ($)",
          data: Object.values(data.revenueByMonth),
          backgroundColor: "#007acc",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
});
