document.addEventListener("DOMContentLoaded", () => {
  const salesTableBody = document.querySelector("#salesTable tbody");
  const exportBtn = document.getElementById("exportCSV");

  const storeId = localStorage.getItem("currentStoreId") || "";
  const orders = JSON.parse(localStorage.getItem("orders")) || [];

  const filteredOrders = orders.filter((order) => order.storeId === storeId);

  function renderTable(data) {
    salesTableBody.innerHTML = "";
    data.forEach((order) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${order.id}</td>
        <td>${order.products.map((p) => p.name).join(", ")}</td>
        <td>${order.buyer}</td>
        <td>$${order.total.toFixed(2)}</td>
        <td>${new Date(order.date).toLocaleDateString()}</td>
        <td>${order.status}</td>
      `;
      salesTableBody.appendChild(row);
    });
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
    const rows = data.map((order) => [
      order.id,
      order.products.map((p) => p.name).join(" | "),
      order.buyer,
      order.total.toFixed(2),
      new Date(order.date).toLocaleDateString(),
      order.status,
    ]);
    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "store-sales.csv";
    link.click();
  }

  exportBtn.addEventListener("click", () => {
    exportToCSV(filteredOrders);
  });

  renderTable(filteredOrders);
});
