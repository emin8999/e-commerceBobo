const orders = JSON.parse(localStorage.getItem("orders") || "[]");

const tbody = document.getElementById("shippingBody");
const cityInput = document.getElementById("filterCity");
const methodInput = document.getElementById("filterMethod");
const statusInput = document.getElementById("filterStatus");
const applyFilters = document.getElementById("applyFilters");

function renderTable(data) {
  tbody.innerHTML = "";

  if (!data.length) {
    tbody.innerHTML =
      "<tr><td colspan='10'>No shipping records found.</td></tr>";
    return;
  }

  data.forEach((order) => {
    const row = document.createElement("tr");

    const shipping = order.shipping || {
      address: "N/A",
      city: "N/A",
      country: "",
      method: "N/A",
      tracking: "",
      status: "Not shipped",
      date: "",
      notes: "",
    };

    row.innerHTML = `
      <td>${order.orderId}</td>
      <td>${order.customer.name}</td>
      <td>${shipping.address}</td>
      <td>${shipping.city} / ${shipping.country}</td>
      <td>${shipping.method}</td>
      <td>${shipping.tracking || "-"}</td>
      <td>${shipping.status}</td>
      <td>${shipping.date || "-"}</td>
      <td>${shipping.notes || "-"}</td>
      <td class="actions">
        <button class="edit" onclick="editTracking('${
          order.orderId
        }')">Edit</button>
        <button class="status" onclick="updateStatus('${
          order.orderId
        }')">Status</button>
        <button class="delete" onclick="deleteShipping('${
          order.orderId
        }')">Delete</button>
      </td>
    `;

    tbody.appendChild(row);
  });
}

function editTracking(orderId) {
  const order = orders.find((o) => o.orderId === orderId);
  if (!order) return;

  const tracking = prompt(
    "Enter or update tracking number:",
    order.shipping?.tracking || ""
  );
  if (tracking !== null) {
    order.shipping = order.shipping || {};
    order.shipping.tracking = tracking;
    localStorage.setItem("orders", JSON.stringify(orders));
    renderTable(orders);
  }
}

function updateStatus(orderId) {
  const order = orders.find((o) => o.orderId === orderId);
  if (!order) return;

  const newStatus = prompt(
    "Enter new shipping status:",
    order.shipping?.status || "Not shipped"
  );
  if (newStatus) {
    order.shipping = order.shipping || {};
    order.shipping.status = newStatus;
    localStorage.setItem("orders", JSON.stringify(orders));
    renderTable(orders);
  }
}

function deleteShipping(orderId) {
  const index = orders.findIndex((o) => o.orderId === orderId);
  if (index >= 0 && confirm("Delete shipping info for this order?")) {
    delete orders[index].shipping;
    localStorage.setItem("orders", JSON.stringify(orders));
    renderTable(orders);
  }
}

applyFilters.addEventListener("click", () => {
  const cityVal = cityInput.value.toLowerCase();
  const methodVal = methodInput.value.toLowerCase();
  const statusVal = statusInput.value.toLowerCase();

  const filtered = orders.filter((order) => {
    const s = order.shipping || {};
    return (
      (s.city || "").toLowerCase().includes(cityVal) &&
      (s.method || "").toLowerCase().includes(methodVal) &&
      (s.status || "").toLowerCase().includes(statusVal)
    );
  });

  renderTable(filtered);
});

// Initial render
renderTable(orders);
