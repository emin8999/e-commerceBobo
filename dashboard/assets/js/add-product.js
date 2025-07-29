document.addEventListener("DOMContentLoaded", () => {
  const storeSelect = document.getElementById("productStore");
  const form = document.getElementById("addProductForm");
  const message = document.getElementById("addProductMessage");

  // Load store names from localStorage
  const stores = JSON.parse(localStorage.getItem("stores")) || [];
  stores.forEach((store) => {
    const option = document.createElement("option");
    option.value = store.id;
    option.textContent = store.name;
    storeSelect.appendChild(option);
  });
  const addBtn = document.querySelector(".add-size-btn");
  const sizeWrapper = document.querySelector(".size-wrapper");

  addBtn.addEventListener("click", () => {
    const newSizeBlock = document.createElement("div");
    newSizeBlock.classList.add("size-items");

    newSizeBlock.innerHTML = `
      <select id="productSizes" class="size-input">
                <option value="">Size</option>
                <option value="2XS">2XS</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="2XL">2XL</option>
              </select>
              <input
                type="number"
                id="productQuantity"
                placeholder="Quantity"
                class="quantity-input"
                required
              />
    `;

    sizeWrapper.insertBefore(newSizeBlock, addBtn);
  });
  const storeData = {
    name: "BOBO Store",
    id: "store123",
    address: "Baku, Azerbaijan",
    owner: "Rustam Kerimli",
  };

  localStorage.setItem("storeInfo", JSON.stringify(storeData));

  const storeInput = document.getElementById("productStore");
  const stored = localStorage.getItem("storeInfo");

  if (stored && storeInput) {
    const storeObj = JSON.parse(stored);
    storeInput.value = storeObj.name;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const product = {
      id: `prod-${Date.now()}`,
      name: document.getElementById("productName").value,
      description: document.getElementById("productDescription").value,
      price: parseFloat(document.getElementById("productPrice").value),
      category: document.getElementById("productCategory").value,
      sizes: document
        .getElementById("productSizes")
        .value.split(",")
        .map((s) => s.trim()),
      colors: document
        .getElementById("productColors")
        .value.split(",")
        .map((c) => c.trim()),
      quantity: parseInt(document.getElementById("productQuantity").value),
      availability: document.getElementById("productAvailability").value,
      storeId: document.getElementById("productStore").value,
      images: [],
    };

    const imageFiles = document.getElementById("productImages").files;
    const readers = [];

    for (let i = 0; i < imageFiles.length; i++) {
      const reader = new FileReader();
      readers.push(
        new Promise((resolve) => {
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(imageFiles[i]);
        })
      );
    }

    Promise.all(readers).then((base64Images) => {
      product.images = base64Images;

      const products = JSON.parse(localStorage.getItem("products")) || [];
      products.push(product);
      localStorage.setItem("products", JSON.stringify(products));

      message.textContent = "✅ Product successfully added!";
      form.reset();
    });
  });
});
