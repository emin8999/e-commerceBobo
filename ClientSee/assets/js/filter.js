function applyFilters() {
  const name = document.getElementById("filter-name").value.toLowerCase();
  const category = document
    .getElementById("filter-category")
    .value.toLowerCase();
  const shop = document.getElementById("filter-shop").value.toLowerCase();
  const size = document.getElementById("filter-size").value.toLowerCase();
  const color = document.getElementById("filter-color").value.toLowerCase();
  const price = parseFloat(document.getElementById("filter-price").value);

  const all = JSON.parse(localStorage.getItem("products") || "[]");

  const filtered = all.filter((p) => {
    return (
      (!name || p.name.toLowerCase().includes(name)) &&
      (!category || p.category.toLowerCase().includes(category)) &&
      (!shop || p.shop.toLowerCase().includes(shop)) &&
      (!size || p.size.toLowerCase().includes(size)) &&
      (!color || p.color.toLowerCase().includes(color)) &&
      (!price || parseFloat(p.price) <= price)
    );
  });

  if (filtered.length > 0) {
    showModal(filtered[0]);
  } else {
    alert("Ничего не найдено.");
  }
}

function showModal(product) {
  const detail = document.getElementById("product-detail");
  detail.innerHTML = `
    <h3>${product.name}</h3>
    ${
      product.images && product.images[0]
        ? `<img src="${product.images[0]}" style="width:100%;border-radius:8px;" />`
        : ""
    }
    <p><strong>Цена:</strong> $${product.price}</p>
    <p><strong>Категория:</strong> ${product.category}</p>
    <p><strong>Магазин:</strong> ${product.shop}</p>
    <p><strong>Размер:</strong> ${product.size}</p>
    <p><strong>Цвет:</strong> ${product.color}</p>
  `;
  document.getElementById("modal").style.display = "block";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

function addToCart() {
  alert("Товар добавлен в корзину (симуляция)");
  closeModal();
}
