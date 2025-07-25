let products = JSON.parse(localStorage.getItem("products") || "[]");
let currentStoreId = localStorage.getItem("storeId"); // example session
let editingProductId = null;

const tableBody = document.querySelector("#productTable tbody");
const modal = document.getElementById("editModal");
const closeBtn = document.querySelector(".closeBtn");
const cancelBtn = document.getElementById("cancelEdit");
const deleteBtn = document.getElementById("deleteProduct");
const form = document.getElementById("editForm");

function renderProducts(filter = {}) {
  tableBody.innerHTML = "";
  const filtered = products.filter(
    (p) =>
      p.storeId === currentStoreId &&
      (!filter.name ||
        p.name.toLowerCase().includes(filter.name.toLowerCase())) &&
      (!filter.category ||
        p.category.toLowerCase().includes(filter.category.toLowerCase())) &&
      (!filter.status || p.status === filter.status)
  );

  filtered.forEach((product, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${product.name}</td>
      <td>${product.category}</td>
      <td>$${product.price}</td>
      <td>${product.status}</td>
      <td><button onclick="editProduct(${index})">Edit</button></td>
    `;
    tableBody.appendChild(row);
  });
}

function editProduct(index) {
  const product = products.filter((p) => p.storeId === currentStoreId)[index];
  editingProductId = product.id;

  document.getElementById("editName").value = product.name;
  document.getElementById("editDescription").value = product.description;
  document.getElementById("editPrice").value = product.price;
  document.getElementById("editCategory").value = product.category;
  document.getElementById("editQuantity").value = product.quantity;
  document.getElementById("editSizes").value = product.sizes?.join(", ") || "";
  document.getElementById("editColors").value =
    product.colors?.join(", ") || "";
  document.getElementById("editStatus").value = product.status;

  modal.classList.add("show");
}

form.onsubmit = function (e) {
  e.preventDefault();
  const index = products.findIndex((p) => p.id === editingProductId);
  if (index === -1) return;

  products[index] = {
    ...products[index],
    name: document.getElementById("editName").value,
    description: document.getElementById("editDescription").value,
    price: parseFloat(document.getElementById("editPrice").value),
    category: document.getElementById("editCategory").value,
    quantity: parseInt(document.getElementById("editQuantity").value),
    sizes: document
      .getElementById("editSizes")
      .value.split(",")
      .map((s) => s.trim()),
    colors: document
      .getElementById("editColors")
      .value.split(",")
      .map((c) => c.trim()),
    status: document.getElementById("editStatus").value,
  };

  localStorage.setItem("products", JSON.stringify(products));
  modal.classList.remove("show");
  renderProducts();
};

closeBtn.onclick = cancelBtn.onclick = () => {
  modal.classList.remove("show");
};

deleteBtn.onclick = () => {
  products = products.filter((p) => p.id !== editingProductId);
  localStorage.setItem("products", JSON.stringify(products));
  modal.classList.remove("show");
  renderProducts();
};

document.getElementById("applyFilter").onclick = () => {
  const name = document.getElementById("filterName").value;
  const category = document.getElementById("filterCategory").value;
  const status = document.getElementById("filterStatus").value;
  renderProducts({ name, category, status });
};

window.onload = () => renderProducts();
