document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("addProductForm");
    const message = document.getElementById("addProductMessage");
    const sizeSelection = document.getElementById("sizeSelection");
    const sizeQuantities = document.getElementById("sizeQuantities");
    const storeNameInput = document.getElementById("productStoreName");

    // 1. Decode JWT to get store name
    const token = localStorage.getItem("jwtToken");
    if (!token) {
        message.textContent = "⚠️ Please log in first.";
        return;
    }

    try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        // Adjust if your JWT has different claim key for store name
        const storeName = decodedToken.storeName || decodedToken.sub || "Unknown Store";
        storeNameInput.value = storeName;
    } catch (err) {
        console.error("Invalid token:", err);
        message.textContent = "❌ Invalid token. Please log in again.";
        return;
    }

    // 2. Update size quantities inputs dynamically based on selected sizes
    sizeSelection.addEventListener("change", () => {
        const selectedSizes = [...document.querySelectorAll('input[name="size"]:checked')];
        sizeQuantities.innerHTML = "";

        selectedSizes.forEach(size => {
            const label = document.createElement("label");
            label.textContent = `Quantity for ${size.value}: `;

            const input = document.createElement("input");
            input.type = "number";
            input.name = `quantity-${size.value}`;
            input.min = 0;
            input.required = true;
            input.value = "0"; // default to zero

            sizeQuantities.appendChild(label);
            sizeQuantities.appendChild(input);
            sizeQuantities.appendChild(document.createElement("br"));
        });
    });

    // 3. Handle form submission
    form.addEventListener("submit", async(e) => {
        e.preventDefault();
        message.textContent = ""; // clear previous messages

        // Validate selected sizes
        const selectedSizes = [...document.querySelectorAll('input[name="size"]:checked')].map(cb => cb.value);
        if (selectedSizes.length === 0) {
            message.textContent = "⚠️ Please select at least one size.";
            return;
        }

        // Validate quantities for each selected size
        const sizeQuantityData = [];
        for (let i = 0; i < selectedSizes.length; i++) {
            const size = selectedSizes[i];
            const qtyInput = document.querySelector(`input[name="quantity-${size}"]`);
            if (!qtyInput || qtyInput.value === "" || isNaN(qtyInput.value) || qtyInput.value < 0) {
                message.textContent = `⚠️ Please enter a valid quantity for size ${size}.`;
                return;
            }
            sizeQuantityData.push({
                size: size,
                quantity: parseInt(qtyInput.value, 10)
            });
        }

        // Validate colors
        const colorsInput = document.getElementById("productColors").value.trim();
        if (!colorsInput) {
            message.textContent = "⚠️ Please enter colors.";
            return;
        }
        const colors = colorsInput.split(",").map(c => c.trim()).filter(c => c);

        // Validate enums
        const availability = document.getElementById("productAvailability").value;
        if (!availability) {
            message.textContent = "⚠️ Please select availability.";
            return;
        }

        const status = document.getElementById("productStatus").value;
        if (!status) {
            message.textContent = "⚠️ Please select status.";
            return;
        }

        // Validate images
        const images = document.getElementById("productImages").files;
        if (images.length === 0) {
            message.textContent = "⚠️ Please upload at least one image.";
            return;
        }

        // Prepare form data for submission
        const formData = new FormData();
        formData.append("name", document.getElementById("productName").value.trim());
        formData.append("description", document.getElementById("productDescription").value.trim());
        formData.append("price", document.getElementById("productPrice").value);
        formData.append("category", document.getElementById("productCategory").value.trim());
        formData.append("availability", availability);
        formData.append("status", status);
        formData.append("colors", colors.join(","));
        formData.append("storeName", storeNameInput.value);

        // Append images
        for (let i = 0; i < images.length; i++) {
            formData.append("imageUrls", images[i]);
        }

        // Append sizeQuantities with correct keys for backend
        sizeQuantityData.forEach((sq, idx) => {
            formData.append(`sizeQuantities[${idx}].size`, sq.size);
            formData.append(`sizeQuantities[${idx}].quantity`, sq.quantity);
        });

        try {
            const response = await fetch("http://localhost:8080/home/product", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                        // Important: Don't set 'Content-Type' header for FormData
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Failed to add product");
            }

            message.style.color = "green";
            message.textContent = "✅ Product successfully added!";
            form.reset();
            sizeQuantities.innerHTML = "";

            // Redirect to store-products after short delay
            setTimeout(() => {
                window.location.href = "store-products.html";
            }, 1500);
        } catch (err) {
            message.style.color = "red";
            console.error(err);
            message.textContent = `❌ Failed to add product. ${err.message}`;
        }
    });
});