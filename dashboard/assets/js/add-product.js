document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("addProductForm");
    const addBtn = document.querySelector(".add-size-btn");
    const wrapper = document.getElementById("sizeQuantitiesWrapper");
    const message = document.getElementById("addProductMessage");
    const storeNameInput = document.getElementById("productStore");

    const jwtToken = localStorage.getItem("jwtToken");
    if (jwtToken) {
        try {
            const decodedToken = JSON.parse(atob(jwtToken.split('.')[1]));
            const storeName = decodedToken.storeName || decodedToken.sub || "Unknown Store";
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

    addBtn.addEventListener("click", () => {
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
    });

    function updateRemoveButtons() {
        const allRemoveBtns = wrapper.querySelectorAll(".remove-button");
        if (allRemoveBtns.length > 1) {
            allRemoveBtns.forEach(btn => btn.style.display = "inline-block");
        } else {
            allRemoveBtns.forEach(btn => btn.style.display = "none");
        }
    }

    updateRemoveButtons();

    form.addEventListener("submit", async(e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const sizeElements = formData.getAll("productSizes");
        const quantityElements = formData.getAll("quantities");

        const sizeQuantities = sizeElements.map((size, index) => ({
            size: size,
            quantity: parseInt(quantityElements[index])
        }));

        const colorsRaw = formData.get("productColors");
        const body = {
            name: formData.get("productName"),
            description: formData.get("productDescription"),
            price: parseFloat(formData.get("productPrice")),
            category: formData.get("productCategory"),
            sizeQuantities: sizeQuantities,
            colors: colorsRaw ? colorsRaw.split(",").map(c => c.trim()) : []
        };


        try {
            const response = await fetch("http://localhost:8080/home/product", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + jwtToken
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) throw new Error("Something went wrong");

            message.innerText = "Product added successfully!";
            form.reset();

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

            const newAddBtn = document.querySelector(".add-size-btn");
            newAddBtn.addEventListener("click", () => {
                const sizeBlock = document.createElement("div");
                sizeBlock.classList.add("size-quantity-wrapper");
                sizeBlock.innerHTML = `
          <select name="productSizes" class="size-input" required>
            ${sizeOptions}
          </select>
          <input type="number" name="quantities" class="quantity-input" placeholder="Quantity" required />
          <button type="button" class="remove-button">X</button>
        `;
                wrapper.insertBefore(sizeBlock, newAddBtn);
                sizeBlock.querySelector(".remove-button").addEventListener("click", () => {
                    sizeBlock.remove();
                    updateRemoveButtons();
                });
                updateRemoveButtons();
            });

            updateRemoveButtons();
        } catch (error) {
            console.error(error);
            message.innerText = "Error adding product.";
        }
    });
});