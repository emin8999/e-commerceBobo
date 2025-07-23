const storeName = localStorage.getItem("selectedStore") || "";
const allProducts = JSON.parse(localStorage.getItem("products") || "[]");
const products = allProducts.filter((p) => (p.store || p.shop) === storeName);

document.getElementById("store-title").textContent = storeName;

const container = document.getElementById("store-products");

if (products.length === 0) {
  container.innerHTML = "<p>No products found for this store.</p>";
} else {
  products.forEach((p) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
            <img src="${
              Array.isArray(p.images) ? p.images[0] : p.image
            }" alt="${p.name}" />
            <h3>${p.name}</h3>
            <p>₼${p.price}</p>
          `;

    card.addEventListener("click", () => {
      localStorage.setItem("selectedProduct", JSON.stringify(p));
      window.location.href = "productVision.html";
    });

    container.appendChild(card);
  });
}
