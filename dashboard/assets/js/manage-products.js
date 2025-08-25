let products = [];
let currentStoreId = localStorage.getItem("storeId") || "store123";
let editingProductId = null;

// ===== ДЕФОЛТНЫЕ ПРОДУКТЫ =====
const defaultProducts = [
  {
    id: "p1",
    storeId: currentStoreId,
    name: "T-Shirt",
    description: "Cotton T-Shirt",
    price: 20,
    category: "Clothing",
    quantity: 50,
    sizes: ["S", "M", "L"],
    colors: ["Red", "Blue"],
    status: "Available",
    discount: 0,
  },
  {
    id: "p2",
    storeId: currentStoreId,
    name: "Jeans",
    description: "Blue Jeans",
    price: 40,
    category: "Clothing",
    quantity: 30,
    sizes: ["M", "L", "XL"],
    colors: ["Blue"],
    status: "Available",
    discount: 0,
  },
  {
    id: "p3",
    storeId: currentStoreId,
    name: "Sneakers",
    description: "Running Shoes",
    price: 60,
    category: "Footwear",
    quantity: 20,
    sizes: ["40", "41", "42"],
    colors: ["White", "Black"],
    status: "Hidden",
    discount: 0,
  },
  {
    id: "p4",
    storeId: currentStoreId,
    name: "Hoodie",
    description: "Warm hoodie",
    price: 35,
    category: "Clothing",
    quantity: 25,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Gray", "Black"],
    status: "Available",
    discount: 0,
  },
  {
    id: "p5",
    storeId: currentStoreId,
    name: "Cap",
    description: "Baseball cap",
    price: 15,
    category: "Accessories",
    quantity: 100,
    sizes: ["One Size"],
    colors: ["Red", "Blue", "Black"],
    status: "Available",
    discount: 0,
  },
  {
    id: "p6",
    storeId: currentStoreId,
    name: "Socks",
    description: "Cotton socks",
    price: 5,
    category: "Clothing",
    quantity: 200,
    sizes: ["S", "M", "L"],
    colors: ["White", "Black"],
    status: "Available",
    discount: 0,
  },
];

// ===== ПРОВЕРКА ТОКЕНА =====
const token = localStorage.getItem("storeJwt"); // ключ storeJwt
if (!token) {
  window.location.href = "store-login.html";
}

// ===== ИНИЦИАЛИЗАЦИЯ =====
const tableBody = document.querySelector("#productTable tbody");
const modal = document.getElementById("editModal");
const closeBtn = document.querySelector(".closeBtn");
const cancelBtn = document.getElementById("cancelEdit");
const deleteBtn = document.getElementById("deleteProduct");
const form = document.getElementById("editForm");

// ===== ЗАГРУЗКА ПРОДУКТОВ =====
async function loadProducts() {
  try {
    const res = await fetch(
      "http://116.203.51.133:8080/home/product/my-store",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!res.ok) throw new Error("Ошибка сети");

    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      products = data;
      localStorage.setItem("products", JSON.stringify(products));
    } else {
      console.warn(
        "Бэкенд вернул пустой массив — используем локальные продукты"
      );
      products =
        JSON.parse(localStorage.getItem("products")) || defaultProducts;
    }
  } catch (err) {
    console.error("Ошибка при загрузке с бэкенда:", err);
    products = JSON.parse(localStorage.getItem("products")) || defaultProducts;
  }
  renderProducts();
}

// ===== РЕНДЕР ТАБЛИЦЫ =====
function renderProducts(filter = {}) {
  tableBody.innerHTML = "";

  products.forEach((product) => {
    if (
      filter.name &&
      !product.name.toLowerCase().includes(filter.name.toLowerCase())
    )
      return;
    if (
      filter.category &&
      !product.category.toLowerCase().includes(filter.category.toLowerCase())
    )
      return;
    if (filter.status && product.status !== filter.status) return;

    const discountedPrice = (
      product.price *
      (1 - (product.discount || 0) / 100)
    ).toFixed(2);

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${product.name}</td>
      <td>${product.category}</td>
      <td class="oldPrice">$${product.price}</td>
      <td>${product.status}</td>
      <td><button class="editBtn">Edit</button></td>
      <td>
        <div class="discount-wrapper">
          <input type="number" min="0" max="100" class="discountInput" />
          <span class="percent-sign">%</span>
          <button class="saveDiscountBtn">Save</button>
        </div>
      </td>
      <td class="newPrice">$${discountedPrice}</td>
    `;
    tableBody.appendChild(row);

    const editButton = row.querySelector(".editBtn");
    editButton.addEventListener("click", () => editProduct(product.id));

    const saveButton = row.querySelector(".saveDiscountBtn");
    const discountInput = row.querySelector(".discountInput");
    const newPriceCell = row.querySelector(".newPrice");

    if (product.discount) discountInput.value = product.discount;

    saveButton.addEventListener("click", () => {
      const discountValue = parseFloat(discountInput.value) || 0;
      product.discount = discountValue;
      newPriceCell.textContent = `$${(
        product.price *
        (1 - discountValue / 100)
      ).toFixed(2)}`;
      localStorage.setItem("products", JSON.stringify(products));
    });
  });
}

// ===== РЕДАКТИРОВАНИЕ =====
function editProduct(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;
  editingProductId = product.id;

  document.getElementById("editName").value = product.name;
  document.getElementById("editDescription").value = product.description;
  document.getElementById("editPrice").value = product.price;
  document.getElementById("editCategory").value = product.category;
  document.getElementById("editQuantity").value = product.quantity;
  document.getElementById("editSizes").value = product.sizes.join(", ");
  document.getElementById("editColors").value = product.colors.join(", ");
  document.getElementById("editStatus").value = product.status;
  document.getElementById("editDiscount").value = product.discount;

  modal.classList.add("show");
}

// ===== СОХРАНЕНИЕ И УДАЛЕНИЕ =====
form.onsubmit = (e) => {
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
    discount: parseFloat(document.getElementById("editDiscount").value) || 0,
  };

  localStorage.setItem("products", JSON.stringify(products));
  modal.classList.remove("show");
  renderProducts();
};

closeBtn.onclick = cancelBtn.onclick = () => modal.classList.remove("show");

deleteBtn.onclick = () => {
  products = products.filter((p) => p.id !== editingProductId);
  localStorage.setItem("products", JSON.stringify(products));
  modal.classList.remove("show");
  renderProducts();
};

// ===== ФИЛЬТР =====
document.getElementById("applyFilter").onclick = () => {
  const name = document.getElementById("filterName").value;
  const category = document.getElementById("filterCategory").value;
  const status = document.getElementById("filterStatus").value;
  renderProducts({ name, category, status });
};

// ===== ИНИЦИАЛИЗАЦИЯ СТРАНИЦЫ =====
window.onload = () => loadProducts();
