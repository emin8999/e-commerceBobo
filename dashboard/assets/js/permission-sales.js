const SALES_PERMISSIONS_KEY = "salesPermissions";

// Backend URL
const BACKEND_URL = "https://your-backend-url.com/api/save-permissions";

// Load existing data on page load
document.addEventListener("DOMContentLoaded", () => {
  loadPermissions();
  document
    .getElementById("salesPermissionForm")
    .addEventListener("submit", handleFormSubmit);
});

// Handle form submit
function handleFormSubmit(e) {
  e.preventDefault(); // prevent default form submission
  savePermissions();
}

// Save permissions to LocalStorage and send to backend
function savePermissions() {
  const email = document.getElementById("userEmail").value.trim();
  if (!email) return alert("Please enter user email");

  const permissionObj = {
    email,
    canViewSales: document.getElementById("viewSales").checked,
    canCreatePromos: document.getElementById("createDiscounts").checked,
    canRefund: document.getElementById("approveRefunds").checked,
    canExport: document.getElementById("exportFinancials").checked,
    canAffiliate: document.getElementById("affiliateAccess").checked,
    assignedStores: Array.from(
      document.getElementById("assignedStores").selectedOptions
    ).map((opt) => opt.value),
    dashboardAccess: document.getElementById("dashboardAccess").value,
  };

  // Save locally
  let data = JSON.parse(localStorage.getItem(SALES_PERMISSIONS_KEY)) || [];
  const index = data.findIndex((p) => p.email === email);
  if (index !== -1) {
    data[index] = permissionObj;
  } else {
    data.push(permissionObj);
  }
  localStorage.setItem(SALES_PERMISSIONS_KEY, JSON.stringify(data));
  renderTable();

  // Send to backend
  fetch(BACKEND_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(permissionObj),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    })
    .then((response) => {
      alert("Permissions saved successfully on backend!");
    })
    .catch((error) => {
      console.error("Error sending data to backend:", error);
      alert("Permissions saved locally, but failed to send to backend.");
    });
}

// Load and render permissions
function loadPermissions() {
  renderTable();
}

// Render permission table
function renderTable() {
  const data = JSON.parse(localStorage.getItem(SALES_PERMISSIONS_KEY)) || [];
  const tbody = document.querySelector("#permissionsTable tbody");
  if (!tbody) return;
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
      <td>${
        entry.dashboardAccess === "full"
          ? "📊"
          : entry.dashboardAccess === "store"
          ? "📈"
          : "❌"
      }</td>
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
  document.getElementById("viewSales").checked = user.canViewSales;
  document.getElementById("createDiscounts").checked = user.canCreatePromos;
  document.getElementById("approveRefunds").checked = user.canRefund;
  document.getElementById("exportFinancials").checked = user.canExport;
  document.getElementById("affiliateAccess").checked = user.canAffiliate;
  document.getElementById("dashboardAccess").value = user.dashboardAccess;

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
