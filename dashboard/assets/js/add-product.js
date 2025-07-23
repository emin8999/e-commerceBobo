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
