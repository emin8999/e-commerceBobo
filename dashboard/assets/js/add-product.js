document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addProductForm");
  const wrapper = document.getElementById("sizeQuantitiesWrapper");
  const message = document.getElementById("addProductMessage");
  const storeNameInput = document.getElementById("productStore");

  const jwtToken = localStorage.getItem("jwtToken");
  if (jwtToken) {
    try {
      const decodedToken = JSON.parse(atob(jwtToken.split(".")[1]));
      const storeName =
        decodedToken.storeName || decodedToken.sub || "Unknown Store";
      storeNameInput.value = storeName;
    } catch (err) {
      console.error("Invalid token:", err);
      storeNameInput.value = "Invalid token";
    }
  } else {
    storeNameInput.value = "No token found";
  }

  const sizeOptions = `
        <option value="">Size</option>
        <option value="TWO_XS">2XS</option>
        <option value="XS">XS</option>
        <option value="S">S</option>
        <option value="M">M</option>
        <option value="L">L</option>
        <option value="XL">XL</option>
        <option value="TWO_XL">2XL</option>
    `;

  // Добавление нового блока размеров
  function addSizeBlock() {
    const addBtn = wrapper.querySelector(".add-size-btn");
    const sizeBlock = document.createElement("div");
    sizeBlock.classList.add("size-quantity-wrapper");
    sizeBlock.innerHTML = `
            <select name="productSizes" class="size-input" required>
                ${sizeOptions}
            </select>
            <input type="number" name="quantities" class="quantity-input" placeholder="Quantity" required />
            <button type="button" class="remove-button">X</button>
        `;
    wrapper.insertBefore(sizeBlock, addBtn);

    sizeBlock.querySelector(".remove-button").addEventListener("click", () => {
      sizeBlock.remove();
      updateRemoveButtons();
    });

    updateRemoveButtons();
  }

  // Управление отображением кнопок удаления
  function updateRemoveButtons() {
    const allRemoveBtns = wrapper.querySelectorAll(".remove-button");
    if (allRemoveBtns.length > 1) {
      allRemoveBtns.forEach((btn) => (btn.style.display = "inline-block"));
    } else {
      allRemoveBtns.forEach((btn) => (btn.style.display = "none"));
    }
  }

  // Инициализация кнопки добавления размера
  wrapper
    .querySelector(".add-size-btn")
    .addEventListener("click", addSizeBlock);
  updateRemoveButtons();

  // Обработка отправки формы
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Основные поля
    formData.append("name", document.getElementById("productName").value);
    formData.append(
      "description",
      document.getElementById("productDescription").value
    );
    formData.append(
      "price",
      parseFloat(document.getElementById("productPrice").value)
    );
    formData.append(
      "category",
      document.getElementById("productCategory").value
    );
    formData.append("store", storeNameInput.value);

    // Размеры и количество
    const sizeWrappers = document.querySelectorAll(".size-quantity-wrapper");
    const sizeQuantities = [];
    sizeWrappers.forEach((wrapper) => {
      const size = wrapper.querySelector(".size-input").value;
      const quantity = parseInt(wrapper.querySelector(".quantity-input").value);
      if (size && quantity) {
        sizeQuantities.push({ size, quantity });
      }
    });
    formData.append("sizeQuantities", JSON.stringify(sizeQuantities));

    // Цвета
    const colorsRaw = document.getElementById("productColors").value;
    const colors = colorsRaw ? colorsRaw.split(",").map((c) => c.trim()) : [];
    formData.append("colors", JSON.stringify(colors));

    // Файлы изображений
    const files = document.getElementById("productImages").files;
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }

    try {
      const response = await fetch("http://localhost:8080/home/product", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + jwtToken,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Something went wrong");

      message.innerText = "Product added successfully!";
      form.reset();

      // Сброс блоков размеров
      wrapper.innerHTML = `
                <div class="size-quantity-wrapper">
                    <select name="productSizes" class="size-input" required>
                        ${sizeOptions}
                    </select>
                    <input type="number" name="quantities" class="quantity-input" placeholder="Quantity" required />
                    <button type="button" class="remove-button" style="display:none;">X</button>
                </div>
                <input type="button" value="+" class="add-size-btn" />
            `;
      wrapper
        .querySelector(".add-size-btn")
        .addEventListener("click", addSizeBlock);
      updateRemoveButtons();
    } catch (error) {
      console.error(error);
      message.innerText = "Error adding product.";
    }
  });
});
