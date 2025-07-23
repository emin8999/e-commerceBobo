document.addEventListener("DOMContentLoaded", () => {
  const ownersBody = document.getElementById("ownersBody");
  const searchInput = document.getElementById("searchInput");
  const statusFilter = document.getElementById("statusFilter");
  const applyFilter = document.getElementById("applyFilter");
  const exportBtn = document.getElementById("exportCSV");

  const modal = document.getElementById("ownerModal");
  const closeModal = document.querySelector(".closeModal");

  const modalFields = {
    name: document.getElementById("modalName"),
    email: document.getElementById("modalEmail"),
    store: document.getElementById("modalStore"),
    phone: document.getElementById("modalPhone"),
    status: document.getElementById("modalStatus"),
    registered: document.getElementById("modalRegistered"),
    login: document.getElementById("modalLogin"),
  };

  let allOwners = [];

  function fetchOwners() {
    const data = JSON.parse(localStorage.getItem("storeOwners")) || [];
    allOwners = data;
    renderTable(data);
  }

  function saveOwners() {
    localStorage.setItem("storeOwners", JSON.stringify(allOwners));
  }

  function renderTable(data) {
    ownersBody.innerHTML = "";

    data.forEach((owner, index) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${owner.name}</td>
        <td>${owner.email}</td>
        <td>${owner.storeName}</td>
        <td>${owner.phone}</td>
        <td>${owner.status}</td>
        <td>${owner.registeredAt}</td>
        <td>${new Date(owner.lastLogin).toLocaleString()}</td>
        <td class="actions">
          <button class="view" data-index="${index}">View</button>
          <button class="permissions">Permissions</button>
          <button class="deactivate" data-index="${index}">${
        owner.status === "blocked" ? "Unblock" : "Block"
      }</button>
          <button class="delete" data-index="${index}">Delete</button>
        </td>
      `;

      ownersBody.appendChild(row);
    });
  }

  applyFilter.addEventListener("click", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const statusValue = statusFilter.value;

    const filtered = allOwners.filter((owner) => {
      const matchText =
        owner.name.toLowerCase().includes(searchTerm) ||
        owner.email.toLowerCase().includes(searchTerm);
      const matchStatus = !statusValue || owner.status === statusValue;
      return matchText && matchStatus;
    });

    renderTable(filtered);
  });

  // Modal open
  ownersBody.addEventListener("click", (e) => {
    const target = e.target;

    // View Profile
    if (target.classList.contains("view")) {
      const index = target.dataset.index;
      const owner = allOwners[index];

      modalFields.name.textContent = owner.name;
      modalFields.email.textContent = owner.email;
      modalFields.store.textContent = owner.storeName;
      modalFields.phone.textContent = owner.phone;
      modalFields.status.textContent = owner.status;
      modalFields.registered.textContent = owner.registeredAt;
      modalFields.login.textContent = new Date(
        owner.lastLogin
      ).toLocaleString();

      modal.style.display = "flex";
    }

    // Deactivate/Block
    if (target.classList.contains("deactivate")) {
      const index = target.dataset.index;
      allOwners[index].status =
        allOwners[index].status === "active" ? "blocked" : "active";
      saveOwners();
      renderTable(allOwners);
    }

    // Delete
    if (target.classList.contains("delete")) {
      const index = target.dataset.index;
      if (confirm("Are you sure you want to delete this store owner?")) {
        allOwners.splice(index, 1);
        saveOwners();
        renderTable(allOwners);
      }
    }
  });

  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // Export CSV
  exportBtn?.addEventListener("click", () => {
    let csv = "Name,Email,Store,Phone,Status,Registered At,Last Login\n";
    allOwners.forEach((owner) => {
      csv += `${owner.name},${owner.email},${owner.storeName},${owner.phone},${
        owner.status
      },${owner.registeredAt},${new Date(owner.lastLogin).toLocaleString()}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "store-owners.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });

  fetchOwners();
});
