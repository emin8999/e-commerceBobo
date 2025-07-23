function renderStores(products) {
  const container = document.getElementById("shopContainer");
  container.innerHTML = "";

  if (!products || products.length === 0) {
    container.innerHTML = "<p style='padding:20px;'>No products available.</p>";
    return;
  }

  // Группируем товары по магазинам
  const grouped = {};
  products.forEach((p) => {
    const storeName = p.store || p.shop || "Unknown Store";
    if (!grouped[storeName]) grouped[storeName] = [];
    grouped[storeName].push(p);
  });

  for (const store in grouped) {
    const storeBox = document.createElement("div");
    storeBox.className = "store-box";
    storeBox.setAttribute("data-store", store);

    const storeHeader = document.createElement("h2");
    storeHeader.textContent = store;
    storeBox.appendChild(storeHeader);

    const sliderWrapper = document.createElement("div");
    sliderWrapper.className = "slider-wrapper";

    const leftButton = document.createElement("button");
    leftButton.innerHTML = "←";
    leftButton.className = "slider-btn left";

    const rightButton = document.createElement("button");
    rightButton.innerHTML = "→";
    rightButton.className = "slider-btn right";

    const productsWrapper = document.createElement("div");
    productsWrapper.className = "products-wrapper";

    grouped[store].forEach((product) => {
      const productCard = document.createElement("div");
      productCard.className = "product-card";

      const firstImage = Array.isArray(product.images)
        ? product.images[0]
        : product.image || "";

      productCard.innerHTML = `
        <img src="${firstImage}" alt="${product.name || "Product"}" />
        <p>${product.name || "Unnamed"}</p>
        <strong>${product.price} ₼</strong>
      `;

      productCard.addEventListener("click", (e) => {
        e.stopPropagation(); // не запускаем переход на store при клике на товар
        localStorage.setItem("selectedProduct", JSON.stringify(product));
        window.location.href = "productVision.html";
      });

      productsWrapper.appendChild(productCard);
    });

    sliderWrapper.appendChild(leftButton);
    sliderWrapper.appendChild(productsWrapper);
    sliderWrapper.appendChild(rightButton);
    storeBox.appendChild(sliderWrapper);
    container.appendChild(storeBox);

    // 👉 Переход на storePage.html по клику на блок
    storeBox.addEventListener("click", () => {
      localStorage.setItem("selectedStore", store);
      window.location.href = "storePage.html";
    });

    // 👉 Прокрутка товаров
    const scrollAmount = 250;
    rightButton.addEventListener("click", (e) => {
      e.stopPropagation();
      productsWrapper.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });
    leftButton.addEventListener("click", (e) => {
      e.stopPropagation();
      productsWrapper.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });
  }
}
const products = JSON.parse(localStorage.getItem("products") || "[]");
renderStores(products);
