const cartContainer = document.getElementById("cartContainer");
const summarySubtotal = document.getElementById("summarySubtotal");

document
  .querySelector(".checkout-button")
  .addEventListener("click", function () {
    window.location.href = "checkout.html";
  });
function renderCart() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  cartContainer.innerHTML = "";

  let total = 0;
  let count = 0;

  if (cart.length === 0) {
    cartContainer.innerHTML = `<div>
        <div class="empty-cart-box" id="emptyCartBox">
          <h2>Your BOBO Cart</h2>
          <p>
            Your Shopping Cart lives to serve. Give it purpose — fill it with
            groceries, clothing, household supplies, electronics, and more.
          </p>
          <div class="empty-cart-buttons">
            <a href="shop.html" class="btn">Continue Shopping</a>
            <a href="#" class="btn">Today's Deals</a>
            <a href="#" class="btn">Your Wish List</a>
          </div>
        </div>
      </div>`;
    summarySubtotal.textContent = "Subtotal (0 items): $0.00";
    return;
  }

  cart.forEach((product, index) => {
    const image = Array.isArray(product.images)
      ? product.images[0]
      : product.image || "";

    const item = document.createElement("div");
    item.className = "cart-item";

    item.innerHTML = `
      <img src="${image}" alt="${product.name}" />
      <div class="cart-item-details">
        <h3>${product.name}</h3>
        <p><span style="color:green;">In Stock</span></p>
        <label><input type="checkbox" /> This is a gift <a href="#">Learn more</a></label>
        <p><strong>Size:</strong> ${product.size || "—"}</p>
        <p><strong>Color:</strong> ${product.color || "—"}</p>
        <div class="cart-item-controls">
          <button class="decrease" data-index="${index}">🗑️</button>
          <span class="quantity">${product.quantity}</span>
          <button class="increase" data-index="${index}">+</button>
        </div>
        <button class="delete-btn" data-index="${index}">Delete</button>
      </div>
      <div style="margin-left:auto; font-weight:bold;">$${(
        product.price * product.quantity
      ).toFixed(2)}</div>
    `;

    total += product.price * product.quantity;
    count += product.quantity;

    cartContainer.appendChild(item);
  });

  summarySubtotal.textContent = `Subtotal (${count} item${
    count > 1 ? "s" : ""
  }): $${total.toFixed(2)}`;

  document.querySelectorAll(".increase").forEach((btn) =>
    btn.addEventListener("click", function () {
      const i = this.dataset.index;
      cart[i].quantity += 1;
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    })
  );

  document.querySelectorAll(".decrease").forEach((btn) =>
    btn.addEventListener("click", function () {
      const i = this.dataset.index;
      if (cart[i].quantity > 1) {
        cart[i].quantity -= 1;
      } else {
        cart.splice(i, 1);
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    })
  );

  document.querySelectorAll(".delete-btn").forEach((btn) =>
    btn.addEventListener("click", function () {
      const i = this.dataset.index;
      cart.splice(i, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    })
  );
}

document.addEventListener("DOMContentLoaded", renderCart);
window.addEventListener("storage", renderCart);
