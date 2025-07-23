document.addEventListener("DOMContentLoaded", () => {
  const storeId = new URLSearchParams(window.location.search).get("storeId");
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const productsList = document.getElementById("productsList");

  function renderProducts(filterText = "", filterStatus = "all") {
    productsList.innerHTML = "";
    const filtered = products.filter(
      (p) =>
        p.storeId === storeId &&
        p.name.toLowerCase().includes(filterText.toLowerCase()) &&
        (filterStatus === "all" || p.status === filterStatus)
    );

    filtered.forEach((product) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><img src="${product.images?.[0] || ""}" alt="product" /></td>
        <td>${product.name}</td>
        <td>${product.category}</td>
        <td>$${product.price}</td>
        <td>${product.quantity}</td>
        <td>${product.status}</td>
        <td class="actions-btns">
          <button class="edit" onclick="editProduct('${
            product.id
          }')">Edit</button>
          <button class="delete" onclick="deleteProduct('${
            product.id
          }')">Delete</button>
        </td>
      `;
      productsList.appendChild(tr);
    });
  }

  document.getElementById("searchInput").addEventListener("input", (e) => {
    renderProducts(
      e.target.value,
      document.getElementById("statusFilter").value
    );
  });

  document.getElementById("statusFilter").addEventListener("change", (e) => {
    renderProducts(
      document.getElementById("searchInput").value,
      e.target.value
    );
  });

  window.editProduct = (id) => {
    alert("Edit function for product ID: " + id);
  };

  window.deleteProduct = (id) => {
    const updated = products.filter((p) => p.id !== id);
    localStorage.setItem("products", JSON.stringify(updated));
    renderProducts();
  };

  renderProducts();
});
