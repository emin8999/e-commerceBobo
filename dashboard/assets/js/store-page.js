document.addEventListener("DOMContentLoaded", () => {
  const storeId = new URLSearchParams(window.location.search).get("storeId");

  const stores = JSON.parse(localStorage.getItem("stores")) || [];
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const store = stores.find((s) => s.storeId === storeId);

  if (!store) {
    document.body.innerHTML =
      "<h2 style='text-align:center'>Store not found</h2>";
    return;
  }

  document.getElementById("storeName").textContent = store.storeName;
  document.getElementById("storeCategory").textContent = store.category;
  document.getElementById("storeDescription").textContent =
    store.description || "";
  document.getElementById("storeLogo").src = store.logo || "";
  document.getElementById(
    "storeBanner"
  ).style.backgroundImage = `url('${store.banner}')`;

  if (store.contact) {
    document.getElementById(
      "storeContact"
    ).innerHTML = `📞 Contact: ${store.contact}`;
  }

  const storeProducts = products.filter((p) => p.storeId === storeId);
  const productContainer = document.getElementById("storeProducts");

  storeProducts.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.onclick = () =>
      (window.location.href = `product.html?id=${product.id}`);

    card.innerHTML = `
      <img src="${product.images?.[0] || ""}" alt="Product">
      <p class="product-name">${product.name}</p>
      <p class="product-price">$${product.price}</p>
    `;

    productContainer.appendChild(card);
  });
});
