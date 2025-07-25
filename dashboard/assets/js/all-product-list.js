document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("#productTable tbody");
  const filterForm = document.getElementById("filterForm");
  const modal = document.getElementById("editModal");
  const closeModalBtn = document.querySelector(".closeModal");
  const editForm = document.getElementById("editForm");

  let allProducts = JSON.parse(localStorage.getItem("products")) || [];
  let currentEditIndex = null;

  function renderProducts(products) {
    tableBody.innerHTML = "";
    products.forEach((product, index) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td><img src="${product.image}" alt="${product.name}" width="40" /></td>
        <td>${product.name}</td>
        <td>${product.category}</td>
        <td>$${product.price.toFixed(2)}</td>
        <td>${product.store}</td>
        <td>${product.inStock ? "In Stock" : "Out of Stock"}</td>
        <td>${product.quantity}</td>
        <td>${new Date(product.dateAdded).toLocaleDateString()}</td>
        <td>
          <button class="editBtn" data-index="${index}">Edit</button>
          <button class="deleteBtn" data-index="${index}">Delete</button>
        </td>
      `;

      tableBody.appendChild(row);
    });
  }

  function applyFilters() {
    const store = document.getElementById("filterStore").value;
    const category = document.getElementById("filterCategory").value;
    const minPrice = parseFloat(
      document.getElementById("filterMinPrice").value
    );
    const maxPrice = parseFloat(
      document.getElementById("filterMaxPrice").value
    );

    let filtered = allProducts.filter((p) => {
      let match = true;
      if (store && p.store !== store) match = false;
      if (category && p.category !== category) match = false;
      if (!isNaN(minPrice) && p.price < minPrice) match = false;
      if (!isNaN(maxPrice) && p.price > maxPrice) match = false;
      return match;
    });

    renderProducts(filtered);
  }

  filterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    applyFilters();
  });

  tableBody.addEventListener("click", (e) => {
    const index = e.target.dataset.index;
    if (e.target.classList.contains("editBtn")) {
      currentEditIndex = index;
      openEditModal(allProducts[index]);
    }
    if (e.target.classList.contains("deleteBtn")) {
      if (confirm("Are you sure you want to delete this product?")) {
        allProducts.splice(index, 1);
        saveAndRender();
      }
    }
  });

  function openEditModal(product) {
    modal.classList.add("show");
    editForm.name.value = product.name;
    editForm.category.value = product.category;
    editForm.price.value = product.price;
    editForm.store.value = product.store;
    editForm.quantity.value = product.quantity;
    editForm.inStock.checked = product.inStock;
  }

  closeModalBtn.addEventListener("click", () => {
    modal.classList.remove("show");
  });

  editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const updated = {
      ...allProducts[currentEditIndex],
      name: editForm.name.value,
      category: editForm.category.value,
      price: parseFloat(editForm.price.value),
      store: editForm.store.value,
      quantity: parseInt(editForm.quantity.value),
      inStock: editForm.inStock.checked,
    };
    allProducts[currentEditIndex] = updated;
    modal.classList.remove("show");
    saveAndRender();
  });

  function saveAndRender() {
    localStorage.setItem("products", JSON.stringify(allProducts));
    renderProducts(allProducts);
  }

  renderProducts(allProducts);
});
