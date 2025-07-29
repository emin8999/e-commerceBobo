const BACKEND_BASE_URL = "http://localhost:8080"; // Change if needed

// Fetch products from backend using JWT
async function fetchProducts() {
    try {
        const token = localStorage.getItem("jwtToken");

        const response = await fetch(`${BACKEND_BASE_URL}/home/product/my-store`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error("Failed to fetch products");

        return await response.json();
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}

// Render products to the table
function renderProducts(products, filterText = "", filterStatus = "all") {
    const productsList = document.getElementById("productsList");
    productsList.innerHTML = "";

    const filtered = products.filter((p) =>
        p.name.toLowerCase().includes(filterText.toLowerCase()) &&
        (filterStatus === "all" || p.status === filterStatus)
    );

    const sizeDisplayMap = {
        TWO_XS: "2XS",
        XS: "XS",
        S: "S",
        M: "M",
        L: "L",
        XL: "XL",
        TWO_XL: "2XL"
    };

    filtered.forEach((product) => {
        const imageUrl = product.imageUrls && product.imageUrls.length > 0 ?
            `${product.imageUrls[0]}` :
            "";

        const sizes = product.sizeQuantities
            .map(sq => sizeDisplayMap[sq.size] || sq.size)
            .join(", ");
        const quantities = product.sizeQuantities.map(sq => sq.quantity).join(", ");

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><img src="${imageUrl}" alt="product" style="width: 70px; height: auto;" /></td>
            <td>${product.name}</td>
            <td>${product.description}</td>
            <td>${product.category || "-"}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${sizes}</td>
            <td>${quantities}</td>
            <td>${product.status}</td>
            <td>-</td>
        `;
        productsList.appendChild(tr);
    });
}

// When DOM is ready
document.addEventListener("DOMContentLoaded", async() => {
    const products = await fetchProducts();

    // Initial render
    renderProducts(products);

    // Search filter
    document.getElementById("searchInput").addEventListener("input", (e) => {
        renderProducts(products, e.target.value, document.getElementById("statusFilter").value);
    });

    // Status filter
    document.getElementById("statusFilter").addEventListener("change", (e) => {
        renderProducts(products, document.getElementById("searchInput").value, e.target.value);
    });
});