document.addEventListener("DOMContentLoaded", () => {
  const storeSelect = document.getElementById("storeSelector");
  const form = document.getElementById("store-permission-form");
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

    // Display owner info
    const store = storeList.find((s) => s.id === storeId);
    document.getElementById("ownerName").textContent =
      store?.ownerName || "N/A";
    document.getElementById("ownerEmail").textContent =
      store?.ownerEmail || "N/A";

    const permissions = storePermissions[storeId] || {};

    document.getElementById("canAdd").checked = !!permissions.canAdd;
    document.getElementById("canEdit").checked = !!permissions.canEdit;
    document.getElementById("canDelete").checked = !!permissions.canDelete;
    document.getElementById("canDesign").checked = !!permissions.canDesign;
    document.getElementById("canEditInventory").checked =
      !!permissions.canEditInventory;
    document.getElementById("canManageOrders").checked =
      !!permissions.canManageOrders;
    document.getElementById("canViewCustomerData").checked =
      !!permissions.canViewCustomerData;
    document.getElementById("canAccessCampaigns").checked =
      !!permissions.canAccessCampaigns;
    document.getElementById("canExportOrders").checked =
      !!permissions.canExportOrders;
    document.getElementById("canStoreMessage").checked =
      !!permissions.canStoreMessage;
    document.getElementById("dashboardAccess").value =
      permissions.dashboardAccess || "none";
    document.getElementById("isBlocked").checked = !!permissions.blocked;
    document.getElementById("adminNote").value = permissions.adminNote || "";
  });

  // Save permissions
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const storeId = storeSelect.value;
    if (!storeId) return alert("Please select a store");

    const newPermissions = {
      canAdd: document.getElementById("canAdd").checked,
      canEdit: document.getElementById("canEdit").checked,
      canDelete: document.getElementById("canDelete").checked,
      canDesign: document.getElementById("canDesign").checked,
      canEditInventory: document.getElementById("canEditInventory").checked,
      canManageOrders: document.getElementById("canManageOrders").checked,
      canViewCustomerData: document.getElementById("canViewCustomerData")
        .checked,
      canAccessCampaigns: document.getElementById("canAccessCampaigns").checked,
      canExportOrders: document.getElementById("canExportOrders").checked,
      canStoreMessage: document.getElementById("canStoreMessage").checked,
      dashboardAccess: document.getElementById("dashboardAccess").value,
      blocked: document.getElementById("isBlocked").checked,
      adminNote: document.getElementById("adminNote").value,
    };

    storePermissions[storeId] = newPermissions;
    localStorage.setItem("storePermissions", JSON.stringify(storePermissions));
    renderPermissionTable();

    alert("Permissions saved successfully.");

    // Отправка на бэк
    try {
      const response = await fetch(
        "https://your-backend-url.com/api/save-permissions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ storeId, permissions: newPermissions }),
        }
      );

      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const result = await response.json();
      console.log("Server response:", result);
    } catch (err) {
      console.error("Error sending data to backend:", err);
      alert("Ошибка при отправке данных на сервер.");
    }
  });

  function renderPermissionTable() {
    if (!permissionTableBody) return;

    permissionTableBody.innerHTML = "";

    Object.keys(storePermissions).forEach((storeId) => {
      const store = storeList.find((s) => s.id === storeId);
      const p = storePermissions[storeId];

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${store ? store.name : storeId}</td>
        <td>${p.canAdd ? "✅" : "❌"}</td>
        <td>${p.canEdit ? "✅" : "❌"}</td>
        <td>${p.canDelete ? "✅" : "❌"}</td>
        <td>${p.canDesign ? "✅" : "❌"}</td>
        <td>${p.canEditInventory ? "✅" : "❌"}</td>
        <td>${p.canManageOrders ? "✅" : "❌"}</td>
        <td>${p.canViewCustomerData ? "✅" : "❌"}</td>
        <td>${p.canAccessCampaigns ? "✅" : "❌"}</td>
        <td>${p.canExportOrders ? "✅" : "❌"}</td>
        <td>${p.canStoreMessage ? "✅" : "❌"}</td>
        <td>${p.dashboardAccess}</td>
        <td>${p.blocked ? "🔒 Blocked" : "🟢 Active"}</td>
      `;
      permissionTableBody.appendChild(row);
    });
  }

  renderPermissionTable();
});
