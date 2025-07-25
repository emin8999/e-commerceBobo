// Sample key: orders
const orders = JSON.parse(localStorage.getItem("orders") || "[]");

const tbody = document.getElementById("ordersBody");
const filterStore = document.getElementById("filterStore");
const filterStatus = document.getElementById("filterStatus");
const applyFilters = document.getElementById("applyFilters");

function renderOrders(orderList) {
  tbody.innerHTML = "";

  if (!orderList.length) {
    tbody.innerHTML = "<tr><td colspan='12'>No orders found.</td></tr>";
    return;
  }

  orderList.forEach((order) => {
    const row = document.createElement("tr");

    const productNames = order.products.map((p) => p.name).join(", ");
    const customerInfo = `${order.customer.name}++${order.customer.email}++${
      order.customer.phone || "N/A"
    }`;

    row.innerHTML = `
      <td>${order.orderId}</td>
      <td>${productNames}</td>
      <td>${customerInfo}</td>
      <td>${order.store.name}</td>
      <td>${order.store.contactName || "N/A"}</td>
      <td>${order.store.email || "N/A"}</td>
      <td>${order.store.phone || "N/A"}</td>
      <td>$${order.totalAmount.toFixed(2)}</td>
      <td>${order.status}</td>
      <td>${order.orderDate}</td>
      <td>${order.paymentMethod}</td>
      <td class="actions">
        <button class="view" onclick="viewDetails('${
          order.orderId
        }')">View</button>
        <button class="status" onclick="changeStatus('${
          order.orderId
        }')">Change</button>
        <button class="delete" onclick="deleteOrder('${
          order.orderId
        }')">Delete</button>
      </td>
    `;

    tbody.appendChild(row);
  });
}

function viewDetails(orderId) {
  alert("View details for order: " + orderId);
  // You can open modal or new page with full breakdown
}

function changeStatus(orderId) {
  const order = orders.find((o) => o.orderId === orderId);
  if (!order) return;

  const newStatus = prompt("Enter new status:", order.status);
  if (newStatus) {
    order.status = newStatus;
    localStorage.setItem("orders", JSON.stringify(orders));
    renderOrders(orders);
  }
}

function deleteOrder(orderId) {
  if (!confirm("Are you sure you want to delete this order?")) return;

  const index = orders.findIndex((o) => o.orderId === orderId);
  if (index >= 0) {
    orders.splice(index, 1);
    localStorage.setItem("orders", JSON.stringify(orders));
    renderOrders(orders);
  }
}

applyFilters.addEventListener("click", () => {
  const store = filterStore.value.toLowerCase();
  const status = filterStatus.value.toLowerCase();

  const filtered = orders.filter((o) => {
    const matchStore = o.store.name.toLowerCase().includes(store);
    const matchStatus = o.status.toLowerCase().includes(status);
    return matchStore && matchStatus;
  });

  renderOrders(filtered);
});

// Initial render
renderOrders(orders);
