// Load categories from localStorage
function loadCategories() {
  const categories = JSON.parse(localStorage.getItem("categories")) || [];
  const tbody = document.getElementById("categoryTableBody");
  tbody.innerHTML = "";

  categories.forEach((cat, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${cat.name}</td>
      <td>${cat.description || "-"}</td>
      <td>${cat.productCount || 0}</td>
      <td>
        <button class="action-btn edit" onclick="openEditModal('${
          cat.id
        }')">Edit</button>
        <button class="action-btn delete" onclick="confirmDelete('${
          cat.id
        }')">Delete</button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  updateStats(categories);
}

// Update analytics block
function updateStats(categories) {
  const total = categories.length;
  const totalProducts = categories.reduce(
    (acc, c) => acc + (c.productCount || 0),
    0
  );
  document.getElementById("totalCategories").textContent = total;
  document.getElementById("totalProducts").textContent = totalProducts;
}

// Save new or edited category
function saveCategory(e) {
  e.preventDefault();
  const name = document.getElementById("categoryName").value.trim();
  const desc = document.getElementById("categoryDescription").value.trim();
  const id = document.getElementById("categoryId").value;

  if (!name) return alert("Category name is required");

  let categories = JSON.parse(localStorage.getItem("categories")) || [];

  if (id) {
    // Update existing
    const index = categories.findIndex((c) => c.id === id);
    if (index >= 0) {
      categories[index].name = name;
      categories[index].description = desc;
    }
  } else {
    // Add new
    categories.push({
      id: "cat-" + Date.now(),
      name,
      description: desc,
      productCount: 0,
    });
  }

  localStorage.setItem("categories", JSON.stringify(categories));
  closeModal("categoryModal");
  loadCategories();
}

// Open modal to add new category
function openAddModal() {
  document.getElementById("categoryForm").reset();
  document.getElementById("categoryId").value = "";
  document.getElementById("categoryModal").style.display = "flex";
}

// Open modal to edit category
function openEditModal(id) {
  const categories = JSON.parse(localStorage.getItem("categories")) || [];
  const category = categories.find((c) => c.id === id);
  if (!category) return;

  document.getElementById("categoryId").value = category.id;
  document.getElementById("categoryName").value = category.name;
  document.getElementById("categoryDescription").value =
    category.description || "";

  document.getElementById("categoryModal").style.display = "flex";
}

// Open confirm modal
function confirmDelete(id) {
  document.getElementById("deleteCategoryId").value = id;
  document.getElementById("confirmModal").style.display = "flex";
}

// Perform delete
function deleteCategory() {
  const id = document.getElementById("deleteCategoryId").value;
  let categories = JSON.parse(localStorage.getItem("categories")) || [];
  categories = categories.filter((c) => c.id !== id);
  localStorage.setItem("categories", JSON.stringify(categories));
  closeModal("confirmModal");
  loadCategories();
}

// Close modal
function closeModal(id) {
  document.getElementById(id).style.display = "none";
}

// Event Listeners
document
  .getElementById("addCategoryBtn")
  .addEventListener("click", openAddModal);
document
  .getElementById("categoryForm")
  .addEventListener("submit", saveCategory);
document
  .getElementById("confirmDeleteBtn")
  .addEventListener("click", deleteCategory);
document
  .querySelectorAll(".close")
  .forEach((btn) =>
    btn.addEventListener("click", () => closeModal(btn.dataset.close))
  );

// Initial load
loadCategories();
