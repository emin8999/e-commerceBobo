const API_BASE = "http://116.203.51.133:8080";
const ENDPOINTS = {
  list: `${API_BASE}/admin/categories`,
  create: `${API_BASE}/admin/categories`,
  update: (id) => `${API_BASE}/admin/categories/${encodeURIComponent(id)}`,
  remove: (id) => `${API_BASE}/admin/categories/${encodeURIComponent(id)}`,
};
// Если нужен JWT:
// const AUTH = localStorage.getItem("token") || "";

const tbody = document.getElementById("categoryTableBody");

const categoryForm = document.getElementById("categoryForm");
const addCategoryBtn = document.getElementById("addCategoryBtn");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

const categoryModal = document.getElementById("categoryModal");
const confirmModal = document.getElementById("confirmModal");

const inputId = document.getElementById("categoryId");
const inputName = document.getElementById("categoryName");
const inputDesc = document.getElementById("categoryDescription");
const inputDeleteId = document.getElementById("deleteCategoryId");

/* ========== helpers ========== */
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

function getLocalCategories() {
  try {
    return JSON.parse(localStorage.getItem("categories") || "[]");
  } catch {
    return [];
  }
}
function setLocalCategories(arr) {
  localStorage.setItem("categories", JSON.stringify(arr || []));
}

function updateStats(categories) {
  const total = categories.length;
  const totalProducts = categories.reduce(
    (acc, c) => acc + (c.productCount || 0),
    0
  );
  document.getElementById("totalCategories").textContent = total;
  document.getElementById("totalProducts").textContent = totalProducts;
}

function openModal(el) {
  el.style.display = "flex";
}
function closeModal(id) {
  document.getElementById(id).style.display = "none";
}

/* ========== load & render ========== */
let categories = [];

async function loadCategories() {
  try {
    const data = await apiJSON(ENDPOINTS.list);
    if (!Array.isArray(data)) throw new Error("Bad categories payload");
    categories = data;
    setLocalCategories(categories); // кэш на случай офлайна
  } catch (e) {
    console.warn("Backend unavailable, using local cache.", e);
    categories = getLocalCategories();
  }
  renderTable(categories);
  updateStats(categories);
}

function renderTable(list) {
  tbody.innerHTML = "";
  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:16px;">No categories</td></tr>`;
    return;
  }

  for (let i = 0; i < list.length; i++) {
    const cat = list[i];
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${cat.name}</td>
      <td>${cat.description || "-"}</td>
      <td>${cat.productCount || 0}</td>
      <td>
        <button class="action-btn edit" data-action="edit" data-id="${
          cat.id
        }">Edit</button>
        <button class="action-btn delete" data-action="delete" data-id="${
          cat.id
        }">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  }
}

/* ========== actions ========== */
function openAddModal() {
  categoryForm.reset();
  inputId.value = "";
  openModal(categoryModal);
}

function openEditModal(id) {
  const cat = categories.find((c) => String(c.id) === String(id));
  if (!cat) return;

  inputId.value = cat.id;
  inputName.value = cat.name || "";
  inputDesc.value = cat.description || "";
  openModal(categoryModal);
}

function confirmDelete(id) {
  inputDeleteId.value = id;
  openModal(confirmModal);
}

async function deleteCategory() {
  const id = inputDeleteId.value;
  if (!id) return;

  // optimistic UI
  const backup = [...categories];
  categories = categories.filter((c) => String(c.id) !== String(id));
  setLocalCategories(categories);
  renderTable(categories);
  updateStats(categories);
  closeModal("confirmModal");

  try {
    await apiJSON(ENDPOINTS.remove(id), { method: "DELETE" });
  } catch (e) {
    alert("Delete failed. Reverting.");
    categories = backup;
    setLocalCategories(categories);
    renderTable(categories);
    updateStats(categories);
  }
}

async function saveCategory(e) {
  e.preventDefault();
  const id = inputId.value.trim();
  const name = inputName.value.trim();
  const description = inputDesc.value.trim();

  if (!name) {
    alert("Category name is required");
    return;
  }

  if (id) {
    // UPDATE
    const idx = categories.findIndex((c) => String(c.id) === String(id));
    if (idx < 0) return;

    const patch = { name, description };
    const backup = { ...categories[idx] };
    const updated = { ...backup, ...patch };

    // optimistic UI
    categories[idx] = updated;
    setLocalCategories(categories);
    renderTable(categories);
    updateStats(categories);
    closeModal("categoryModal");

    try {
      await apiJSON(ENDPOINTS.update(id), {
        method: "PATCH",
        body: JSON.stringify(patch),
      });
    } catch (e) {
      alert("Update failed. Reverting.");
      categories[idx] = backup;
      setLocalCategories(categories);
      renderTable(categories);
      updateStats(categories);
    }
  } else {
    // CREATE
    const tmpId = "cat-" + Date.now();
    const newCat = { id: tmpId, name, description, productCount: 0 };

    // optimistic UI
    categories.push(newCat);
    setLocalCategories(categories);
    renderTable(categories);
    updateStats(categories);
    closeModal("categoryModal");

    try {
      const created = await apiJSON(ENDPOINTS.create, {
        method: "POST",
        body: JSON.stringify({ name, description }),
      });
      // заменим временный id на реальный, если вернулся
      const i = categories.findIndex((c) => c.id === tmpId);
      if (i >= 0) {
        categories[i] = { ...newCat, ...(created || {}) };
        setLocalCategories(categories);
        renderTable(categories);
        updateStats(categories);
      }
    } catch (e) {
      alert("Create failed. Removing local draft.");
      categories = categories.filter((c) => c.id !== tmpId);
      setLocalCategories(categories);
      renderTable(categories);
      updateStats(categories);
    }
  }
}

/* ========== events ========== */
addCategoryBtn.addEventListener("click", openAddModal);
categoryForm.addEventListener("submit", saveCategory);
confirmDeleteBtn.addEventListener("click", deleteCategory);

// закрытие модалок
document.querySelectorAll(".close").forEach((btn) => {
  btn.addEventListener("click", () => closeModal(btn.dataset.close));
});

// делегирование кликов по таблице (Edit/Delete)
tbody.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;
  const { action, id } = btn.dataset;
  if (action === "edit") openEditModal(id);
  if (action === "delete") confirmDelete(id);
});

/* ========== init ========== */
loadCategories();
