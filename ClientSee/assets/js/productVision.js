const data = JSON.parse(localStorage.getItem("selectedProduct") || "{}");

if (data && data.images && data.images.length > 0) {
  const mainImage = document.getElementById("main-image");
  const thumbnails = document.getElementById("thumbnails");

  mainImage.src = data.images[0];

  data.images.forEach((src) => {
    const thumb = document.createElement("img");
    thumb.src = src;
    thumb.onclick = () => (mainImage.src = src);
    thumbnails.appendChild(thumb);
  });
}

document.getElementById("title").textContent = data.name || "Unknown";
document.getElementById("store").textContent =
  "Store: " + (data.store || "Unknown");
document.getElementById("price").textContent = "₼" + (data.price || "0");
document.getElementById("description").textContent = data.description || "";
document.getElementById("color").textContent = "Color: " + (data.color || "—");
document.getElementById("size").textContent = "Size: " + (data.size || "—");
document.getElementById("category").textContent =
  "Category: " + (data.category || "—");

// Добавление в корзину
function addToCart() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const existing = cart.find((item) => item.id === data.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    data.quantity = 1;
    cart.push(data);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart");
}
// Обновлять корзину при загрузке страницы
document.addEventListener("DOMContentLoaded", renderCart);

// Обновлять корзину при любом изменении (например, из другой вкладки или из shop.js)
window.addEventListener("storage", renderCart);
