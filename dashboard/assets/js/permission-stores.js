document.addEventListener("DOMContentLoaded", () => {
  const storeSelect = document.getElementById("storeName");
  const form = document.getElementById("permissionsForm");
  const permissionTableBody = document.querySelector("#permissionsTable tbody");

  let storePermissions =
    JSON.parse(localStorage.getItem("storePermissions")) || {};
  let storeList = JSON.parse(localStorage.getItem("registeredStores")) || [];

  // Populate store dropdown
  storeList.forEach((store) => {
    const option = document.createElement("option");
    option.value = store.id;
    option.textContent = store.name;
    storeSelect.appendChild(option);
  });

  // Load permissions when store is selected
  storeSelect.addEventListener("change", () => {
    const storeId = storeSelect.value;
    if (!storeId) return;
    const permissions = storePermissions[storeId] || {};

    document.getElementById("canEdit").checked = !!permissions.canEdit;
    document.getElementById("canDelete").checked = !!permissions.canDelete;
    document.getElementById("canDashboard").checked =
      !!permissions.allowDashboard;
    document.getElementById("dashboardAccess").value =
      permissions.dashboardAccess || "none";
    document.getElementById("canOrders").checked = !!permissions.canOrders;
    document.getElementById("canExport").checked =
      !!permissions.canExportOrders;
    document.getElementById("canDesign").checked = !!permissions.canDesign;
    document.getElementById("canCustomers").checked =
      !!permissions.canCustomerView;
    document.getElementById("canMarketing").checked =
      !!permissions.canMarketing;
    document.getElementById("isBlocked").checked = !!permissions.blocked;
  });

  // Save permissions
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const storeId = storeSelect.value;
    if (!storeId) return alert("Please select a store");

    const newPermissions = {
      canEdit: document.getElementById("canEdit").checked,
      canDelete: document.getElementById("canDelete").checked,
      allowDashboard: document.getElementById("canDashboard").checked,
      dashboardAccess: document.getElementById("dashboardAccess").value,
      canOrders: document.getElementById("canOrders").checked,
      canExportOrders: document.getElementById("canExport").checked,
      canDesign: document.getElementById("canDesign").checked,
      canCustomerView: document.getElementById("canCustomers").checked,
      canMarketing: document.getElementById("canMarketing").checked,
      blocked: document.getElementById("isBlocked").checked,
    };

    storePermissions[storeId] = newPermissions;
    localStorage.setItem("storePermissions", JSON.stringify(storePermissions));
    alert("Permissions saved successfully.");
    renderPermissionTable();
  });

  function renderPermissionTable() {
    permissionTableBody.innerHTML = "";

    Object.keys(storePermissions).forEach((storeId) => {
      const store = storeList.find((s) => s.id === storeId);
      const p = storePermissions[storeId];

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${store ? store.name : storeId}</td>
        <td>${p.canEdit ? "✅" : "❌"}</td>
        <td>${p.canDelete ? "✅" : "❌"}</td>
        <td>${p.allowDashboard ? "✅" : "❌"} (${p.dashboardAccess})</td>
        <td>${p.canOrders ? "✅" : "❌"}</td>
        <td>${p.canExportOrders ? "✅" : "❌"}</td>
        <td>${p.canCustomerView ? "✅" : "❌"}</td>
        <td>${p.canDesign ? "✅" : "❌"}</td>
        <td>${p.canMarketing ? "✅" : "❌"}</td>
        <td>${p.blocked ? "🔒 Blocked" : "🟢 Active"}</td>
      `;
      permissionTableBody.appendChild(row);
    });
  }

  renderPermissionTable();
});
