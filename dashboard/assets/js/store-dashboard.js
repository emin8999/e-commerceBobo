document.addEventListener("DOMContentLoaded", () => {
  const storeId = new URLSearchParams(window.location.search).get("storeId");
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const orders = JSON.parse(localStorage.getItem("orders")) || [];

  const storeOrders = orders.filter((order) =>
    order.products.some((p) => p.storeId === storeId)
  );

  const storeProducts = products.filter((p) => p.storeId === storeId);

  const totalRevenue = storeOrders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = storeOrders.length;
  const avgOrderValue =
    totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0;

  document.getElementById(
    "totalRevenue"
  ).textContent = `$${totalRevenue.toLocaleString()}`;
  document.getElementById("totalOrders").textContent = totalOrders;
  document.getElementById("avgOrderValue").textContent = `$${avgOrderValue}`;

  const productCounts = {};
  storeOrders.forEach((order) => {
    order.products.forEach((p) => {
      if (p.storeId === storeId) {
        productCounts[p.name] = (productCounts[p.name] || 0) + 1;
      }
    });
  });

  const sortedProducts = Object.entries(productCounts).sort(
    (a, b) => b[1] - a[1]
  );
  document.getElementById("popularProduct").textContent =
    sortedProducts[0]?.[0] || "—";

  const soldProductIds = new Set();
  storeOrders.forEach((order) => {
    order.products.forEach((p) => {
      if (p.storeId === storeId) {
        soldProductIds.add(p.id);
      }
    });
  });

  const unsold = storeProducts.filter((p) => !soldProductIds.has(p.id));
  const unsoldList = document.getElementById("unsoldProducts");
  unsold.forEach((p) => {
    const li = document.createElement("li");
    li.textContent = p.name;
    unsoldList.appendChild(li);
  });

  const dailySales = {};
  storeOrders.forEach((order) => {
    const date = new Date(order.date).toLocaleDateString();
    dailySales[date] = (dailySales[date] || 0) + order.total;
  });

  const chartLabels = Object.keys(dailySales);
  const chartData = Object.values(dailySales);

  new Chart(document.getElementById("salesChart"), {
    type: "line",
    data: {
      labels: chartLabels,
      datasets: [
        {
          label: "Daily Revenue",
          data: chartData,
          fill: true,
          borderColor: "#007acc",
          backgroundColor: "rgba(0,122,204,0.1)",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true },
      },
    },
  });
});
