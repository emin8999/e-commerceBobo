const Cart_API_BASE = "http://116.203.51.133:8080/home/cart";
const cartContainer = document.getElementById("cartContainer");
const summarySubtotal = document.getElementById("summarySubtotal");
const checkoutBtn = document.querySelector(".checkout-button");
checkoutBtn?.addEventListener("click", () => {
  window.location.href = "checkout.html";
});
// ─── API helpers ───────────────────────────────────────────────────────────────
async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Request failed ${res.status}: ${text || res.statusText}`);
  }
  return res.json().catch(() => ({}));
}
async function getCart() {
  // Ожидаем структуру { items: [...] }
  const data = await apiFetch(`${Cart_API_BASE}/cart`);
  return Array.isArray(data.items) ? data.items : [];
}
async function updateItemQty(itemId, quantity) {
  return apiFetch(`${Cart_API_BASE}/cart/items/${encodeURIComponent(itemId)}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
}
async function deleteItem(itemId) {
  return apiFetch(`${Cart_API_BASE}/cart/items/${encodeURIComponent(itemId)}`, {
    method: "DELETE",
  });
}
// ─── UI rendering ──────────────────────────────────────────────────────────────
function money(n) {
  return Number(n).toFixed(2);
}
async function renderCart() {
  cartContainer.innerHTML = `<div class="loading">Loading cart…</div>`;
  summarySubtotal.textContent = "Subtotal (—): $0.00";
  let items = [];
  try {
    items = await getCart();
  } catch (e) {
    console.error(e);
    cartContainer.innerHTML = `
      <div class="error">
        Failed to load cart from server.
      </div>`;
    return;
  }
  cartContainer.innerHTML = "";
  if (!items.length) {
    cartContainer.innerHTML = `
      <div>
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
  let total = 0;
  let count = 0;
  items.forEach((product) => {
    const image = Array.isArray(product.images)
      ? product.images[0]
      : product.image || "";
    const lineTotal = Number(product.price) * Number(product.quantity || 0);
    total += lineTotal;
    count += Number(product.quantity || 0);
    const item = document.createElement("div");
    item.className = "cart-item";
    item.innerHTML = `
      <img src="${image}" alt="${product.name || ""}" />
      <div class="cart-item-details">
        <h3>${product.name || "—"}</h3>
        <p><span style="color:green;">In Stock</span></p>
        <label><input type="checkbox" /> This is a gift <a href="#">Learn more</a></label>
        <p><strong>Size:</strong> ${product.size ?? "—"}</p>
        <p><strong>Color:</strong> ${product.color ?? "—"}</p>
        <div class="cart-item-controls">
          <button class="decrease" data-id="${
            product.id
          }">:wastebasket:</button>
          <span class="quantity">${product.quantity}</span>
          <button class="increase" data-id="${product.id}">+</button>
        </div>
        <button class="delete-btn" data-id="${product.id}">Delete</button>
      </div>
      <div style="margin-left:auto; font-weight:bold;">$${money(
        lineTotal
      )}</div>
    `;
    cartContainer.appendChild(item);
  });
  summarySubtotal.textContent = `Subtotal (${count} item${
    count > 1 ? "s" : ""
  }): $${money(total)}`;
  // events
  cartContainer.querySelectorAll(".increase").forEach((btn) =>
    btn.addEventListener("click", async function () {
      const id = this.dataset.id;
      const qtyEl = this.parentElement.querySelector(".quantity");
      const current = Number(qtyEl.textContent || 0);
      try {
        await updateItemQty(id, current + 1);
        await renderCart();
      } catch (e) {
        console.error(e);
        alert("Failed to increase quantity.");
      }
    })
  );
  cartContainer.querySelectorAll(".decrease").forEach((btn) =>
    btn.addEventListener("click", async function () {
      const id = this.dataset.id;
      const qtyEl = this.parentElement.querySelector(".quantity");
      const current = Number(qtyEl.textContent || 0);
      try {
        if (current > 1) {
          await updateItemQty(id, current - 1);
        } else {
          await deleteItem(id);
        }
        await renderCart();
      } catch (e) {
        console.error(e);
        alert("Failed to decrease quantity.");
      }
    })
  );
  cartContainer.querySelectorAll(".delete-btn").forEach((btn) =>
    btn.addEventListener("click", async function () {
      const id = this.dataset.id;
      if (!confirm("Delete this item?")) return;
      try {
        await deleteItem(id);
        await renderCart();
      } catch (e) {
        console.error(e);
        alert("Failed to delete item.");
      }
    })
  );
}
document.addEventListener("DOMContentLoaded", renderCart);
