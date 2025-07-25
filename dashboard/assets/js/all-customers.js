// customers.js

document.addEventListener("DOMContentLoaded", () => {
  const customerTable = document.querySelector("#customerTable tbody");

  const customers = JSON.parse(localStorage.getItem("customers")) || [];

  customers.forEach((cust, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${cust.name}</td>
      <td>${cust.email}</td>
      <td>${cust.phone}</td>
      <td>${cust.address}</td>
      <td>${cust.ordersCount}</td>
      <td>$${cust.totalSpent.toFixed(2)}</td>
      <td>${new Date(cust.lastVisit).toLocaleDateString()}</td>
      <td>${cust.status}</td>
      <td>
        <button onclick='openAnalytics(${JSON.stringify(
          cust
        )})'>Analytics</button>
      </td>
    `;
    customerTable.appendChild(row);
  });
});

function openAnalytics(cust) {
  document.getElementById("modalCustName").textContent = cust.name;
  document.getElementById("modalCustEmail").textContent = cust.email;
  document.getElementById("modalCustOrders").textContent = cust.ordersCount;
  document.getElementById(
    "modalCustSpent"
  ).textContent = `$${cust.totalSpent.toFixed(2)}`;
  document.getElementById("modalCustVisit").textContent = new Date(
    cust.lastVisit
  ).toLocaleString();
  document.getElementById("modalCustPhone").textContent = cust.phone;
  document.getElementById("modalCustAddress").textContent = cust.address;
  document.getElementById("modalCustCategory").textContent =
    cust.favoriteCategory || "-";
  document.getElementById("modalCustFavProduct").textContent =
    cust.favoriteProduct || "-";

  document.getElementById("analyticsModal").classList.add("show");
}

function closeModal() {
  document.getElementById("analyticsModal").classList.remove("show");
}
