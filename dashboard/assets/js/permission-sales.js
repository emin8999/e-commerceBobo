// Key for storing sales permissions
const SALES_PERMISSIONS_KEY = "salesPermissions";

// Load existing data on page load
document.addEventListener("DOMContentLoaded", () => {
  loadPermissions();
  document.getElementById("saveBtn").addEventListener("click", savePermissions);
});

// Save permissions to LocalStorage
function savePermissions() {
  const email = document.getElementById("userEmail").value.trim();
  if (!email) return alert("Please enter user email");

  const permissionObj = {
    email,
    canViewSales: document.getElementById("canViewSales").checked,
    canCreatePromos: document.getElementById("canCreatePromos").checked,
    canRefund: document.getElementById("canRefund").checked,
    canExport: document.getElementById("canExport").checked,
    canAffiliate: document.getElementById("canAffiliate").checked,
    assignedStores: Array.from(
      document.getElementById("assignedStores").selectedOptions
    ).map((opt) => opt.value),
  };

  let data = JSON.parse(localStorage.getItem(SALES_PERMISSIONS_KEY)) || [];

  // If already exists — update
  const index = data.findIndex((p) => p.email === email);
  if (index !== -1) {
    data[index] = permissionObj;
  } else {
    data.push(permissionObj);
  }

  localStorage.setItem(SALES_PERMISSIONS_KEY, JSON.stringify(data));
  alert("Permissions saved successfully.");
  renderTable();
}

// Load and render permissions
function loadPermissions() {
  renderTable();
}

// Render permission table
function renderTable() {
  const data = JSON.parse(localStorage.getItem(SALES_PERMISSIONS_KEY)) || [];
  const tbody = document.querySelector("#permissionsTable tbody");
  tbody.innerHTML = "";

  data.forEach((entry, i) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${entry.email}</td>
      <td>${entry.assignedStores.join(", ")}</td>
      <td>${entry.canViewSales ? "✅" : "❌"}</td>
      <td>${entry.canCreatePromos ? "✅" : "❌"}</td>
      <td>${entry.canRefund ? "✅" : "❌"}</td>
      <td>${entry.canExport ? "✅" : "❌"}</td>
      <td>${entry.canAffiliate ? "✅" : "❌"}</td>
      <td>
        <button class="edit-btn" onclick="editPermission('${
          entry.email
        }')">Edit</button>
        <button class="delete-btn" onclick="deletePermission('${
          entry.email
        }')">Delete</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

// Edit existing permission (fills form)
function editPermission(email) {
  const data = JSON.parse(localStorage.getItem(SALES_PERMISSIONS_KEY)) || [];
  const user = data.find((u) => u.email === email);
  if (!user) return;

  document.getElementById("userEmail").value = user.email;
  document.getElementById("canViewSales").checked = user.canViewSales;
  document.getElementById("canCreatePromos").checked = user.canCreatePromos;
  document.getElementById("canRefund").checked = user.canRefund;
  document.getElementById("canExport").checked = user.canExport;
  document.getElementById("canAffiliate").checked = user.canAffiliate;

  const storeSelect = document.getElementById("assignedStores");
  Array.from(storeSelect.options).forEach((opt) => {
    opt.selected = user.assignedStores.includes(opt.value);
  });
}

// Delete permission
function deletePermission(email) {
  let data = JSON.parse(localStorage.getItem(SALES_PERMISSIONS_KEY)) || [];
  data = data.filter((entry) => entry.email !== email);
  localStorage.setItem(SALES_PERMISSIONS_KEY, JSON.stringify(data));
  renderTable();
}
