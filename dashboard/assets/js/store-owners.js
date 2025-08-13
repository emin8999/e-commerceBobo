document.addEventListener("DOMContentLoaded", () => {
  /* ============ CONFIG ============ */
  const API_BASE = "http://116.203.51.133:8080";
  const ENDPOINTS = {
    list: (q = {}) => {
      const usp = new URLSearchParams();
      if (q.search) usp.set("search", q.search);
      if (q.status) usp.set("status", q.status);
      const qs = usp.toString();
      return `${API_BASE}/admin/store-owners${qs ? `?${qs}` : ""}`;
    },
    patchStatus: (id) =>
      `${API_BASE}/admin/store-owners/${encodeURIComponent(id)}/status`,
    remove: (id) => `${API_BASE}/admin/store-owners/${encodeURIComponent(id)}`,
  };
  // Если нужен JWT:
  // const AUTH = localStorage.getItem("token") || "";

  /* ============ DOM ============ */
  const ownersBody = document.getElementById("ownersBody");
  const searchInput = document.getElementById("searchInput");
  const statusFilter = document.getElementById("statusFilter");
  const applyFilter = document.getElementById("applyFilter");
  const exportBtn = document.getElementById("exportCSV");

  const modal = document.getElementById("ownerModal");
  const closeModalX = document.querySelector(".closeModal");

  const modalFields = {
    name: document.getElementById("modalName"),
    email: document.getElementById("modalEmail"),
    store: document.getElementById("modalStore"),
    phone: document.getElementById("modalPhone"),
    status: document.getElementById("modalStatus"),
    registered: document.getElementById("modalRegistered"),
    login: document.getElementById("modalLogin"),
  };

  /* ============ STATE ============ */
  let allOwners = []; // текущий список в памяти

  /* ============ HELPERS ============ */
  async function apiJSON(url, options = {}) {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        // ...(AUTH ? { Authorization: `Bearer ${AUTH}` } : {}),
        ...(options.headers || {}),
      },
      ...options,
    });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(`${res.status} ${res.statusText} ${t}`);
    }
    const ct = res.headers.get("content-type") || "";
    return ct.includes("application/json") ? res.json() : {};
  }

  function safe(x) {
    return (x ?? "").toString();
  }
  function fmtDateTime(x) {
    const d = new Date(x);
    return isNaN(d) ? "-" : d.toLocaleString();
  }

  function setLocalOwners(arr) {
    localStorage.setItem("storeOwners", JSON.stringify(arr || []));
  }
  function getLocalOwners() {
    try {
      return JSON.parse(localStorage.getItem("storeOwners") || "[]");
    } catch {
      return [];
    }
  }

  /* ============ RENDER ============ */
  function renderTable(data) {
    ownersBody.innerHTML = "";
    if (!data.length) {
      ownersBody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:16px;">No owners found</td></tr>`;
      return;
    }

    const frag = document.createDocumentFragment();
    data.forEach((owner, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${safe(owner.name)}</td>
        <td>${safe(owner.email)}</td>
        <td>${safe(owner.storeName)}</td>
        <td>${safe(owner.phone)}</td>
        <td>${safe(owner.status)}</td>
        <td>${safe(owner.registeredAt)}</td>
        <td>${fmtDateTime(owner.lastLogin)}</td>
        <td class="actions">
          <button class="view" data-index="${index}">View</button>
          <button class="permissions" data-index="${index}">Permissions</button>
          <button class="deactivate" data-index="${index}">
            ${owner.status === "blocked" ? "Unblock" : "Block"}
          </button>
          <button class="delete" data-index="${index}">Delete</button>
        </td>
      `;
      frag.appendChild(tr);
    });
    ownersBody.appendChild(frag);
  }

  /* ============ LOAD ============ */
  async function loadOwners(filters = {}) {
    try {
      const data = await apiJSON(ENDPOINTS.list(filters));
      if (!Array.isArray(data)) throw new Error("Bad owners payload");
      allOwners = data;
      setLocalOwners(allOwners); // кэш на офлайн
    } catch (e) {
      console.warn("Backend unavailable, using local cache.", e);
      allOwners = getLocalOwners();

      // локальная фильтрация как запасной вариант
      const searchTerm = (filters.search || "").toLowerCase();
      const statusVal = filters.status || "";
      if (searchTerm || statusVal) {
        allOwners = allOwners.filter((o) => {
          const matchText =
            safe(o.name).toLowerCase().includes(searchTerm) ||
            safe(o.email).toLowerCase().includes(searchTerm);
          const matchStatus = !statusVal || o.status === statusVal;
          return matchText && matchStatus;
        });
      }
    }
    renderTable(allOwners);
  }

  /* ============ ACTIONS ============ */
  function openModal(owner) {
    modalFields.name.textContent = safe(owner.name);
    modalFields.email.textContent = safe(owner.email);
    modalFields.store.textContent = safe(owner.storeName);
    modalFields.phone.textContent = safe(owner.phone);
    modalFields.status.textContent = safe(owner.status);
    modalFields.registered.textContent = safe(owner.registeredAt);
    modalFields.login.textContent = fmtDateTime(owner.lastLogin);
    modal.style.display = "flex";
  }

  async function toggleBlock(index) {
    const owner = allOwners[index];
    if (!owner) return;
    const newStatus = owner.status === "active" ? "blocked" : "active";

    // optimistic UI
    const prevStatus = owner.status;
    owner.status = newStatus;
    setLocalOwners(allOwners);
    renderTable(allOwners);

    try {
      await apiJSON(ENDPOINTS.patchStatus(owner.id), {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (e) {
      alert("Failed to update status. Reverting.");
      owner.status = prevStatus;
      setLocalOwners(allOwners);
      renderTable(allOwners);
    }
  }

  async function deleteOwner(index) {
    const owner = allOwners[index];
    if (!owner) return;
    if (!confirm("Are you sure you want to delete this store owner?")) return;

    // optimistic UI
    const backup = [...allOwners];
    allOwners.splice(index, 1);
    setLocalOwners(allOwners);
    renderTable(allOwners);

    try {
      await apiJSON(ENDPOINTS.remove(owner.id), { method: "DELETE" });
    } catch (e) {
      alert("Failed to delete owner. Reverting.");
      allOwners = backup;
      setLocalOwners(allOwners);
      renderTable(allOwners);
    }
  }

  /* ============ EVENTS ============ */
  applyFilter.addEventListener("click", () => {
    loadOwners({
      search: searchInput.value.trim(),
      status: statusFilter.value.trim(),
    });
  });

  // делегирование: View / Permissions / Block / Delete
  ownersBody.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const index = Number(btn.dataset.index);
    if (btn.classList.contains("view")) {
      const owner = allOwners[index];
      if (owner) openModal(owner);
    } else if (btn.classList.contains("permissions")) {
      // тут можно открыть модал/страницу прав — оставляю заглушку
      alert("Permissions UI is not implemented yet.");
    } else if (btn.classList.contains("deactivate")) {
      toggleBlock(index);
    } else if (btn.classList.contains("delete")) {
      deleteOwner(index);
    }
  });

  closeModalX.addEventListener("click", () => (modal.style.display = "none"));
  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });

  // Экспорт CSV из текущего списка (после фильтра/загрузки)
  exportBtn?.addEventListener("click", () => {
    let csv = "Name,Email,Store,Phone,Status,Registered At,Last Login\n";
    allOwners.forEach((o) => {
      const row = [
        safe(o.name),
        safe(o.email),
        safe(o.storeName),
        safe(o.phone),
        safe(o.status),
        safe(o.registeredAt),
        fmtDateTime(o.lastLogin),
      ]
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(",");
      csv += row + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "store-owners.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  /* ============ INIT ============ */
  loadOwners(); // без фильтров
});
