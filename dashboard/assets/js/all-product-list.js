document.addEventListener("DOMContentLoaded", () => {
  /* ================= CONFIG ================= */
  const API_BASE = "http://116.203.51.133:8080";
  const ENDPOINTS = {
    list: `${API_BASE}/admin/products`,
    patch: (id) => `${API_BASE}/admin/products/${encodeURIComponent(id)}`,
    del: (id) => `${API_BASE}/admin/products/${encodeURIComponent(id)}`,
  };
  // Если используешь JWT:
  // const AUTH = localStorage.getItem("token") || "";

  /* ================= DOM ================= */
  const tableBody = document.querySelector("#productTable tbody");
  const filterForm = document.getElementById("filterForm");
  const modal = document.getElementById("editModal");
  const closeModalBtn = document.querySelector(".closeModal");
  const editForm = document.getElementById("editForm");

  /* ================= STATE ================= */
  let allProducts = [];
  let currentEditIndex = null;

  /* ================= HELPERS ================= */
  async function apiJSON(url, options = {}) {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        // ...(AUTH ? { Authorization: `Bearer ${AUTH}` } : {}),
        ...(options.headers || {}),
      },
      ...options,
    });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(`${res.status} ${res.statusText} ${t}`);
    }
    const ct = res.headers.get("content-type") || "";
    return ct.includes("application/json") ? res.json() : {};
  }

  function money(n) {
    const x = Number(n || 0);
    return `$${(isFinite(x) ? x : 0).toFixed(2)}`;
  }

  function firstImage(p) {
    if (Array.isArray(p.images) && p.images.length) return p.images[0];
    if (Array.isArray(p.imageUrls) && p.imageUrls.length) return p.imageUrls[0];
    if (typeof p.imageUrls === "string" && p.imageUrls.trim())
      return p.imageUrls;
    return p.image || "";
  }

  function safeDate(d) {
    const dd = new Date(d);
    return isNaN(dd) ? "-" : dd.toLocaleDateString();
  }

  function getLocalProducts() {
    try {
      return JSON.parse(localStorage.getItem("products") || "[]");
    } catch {
      return [];
    }
  }
  function setLocalProducts(list) {
    localStorage.setItem("products", JSON.stringify(list || []));
  }

  /* ================= LOAD ================= */
  async function loadProducts() {
    try {
      const data = await apiJSON(ENDPOINTS.list);
      if (!Array.isArray(data)) throw new Error("Bad products payload");
      allProducts = data;
      // Кэш на офлайн
      setLocalProducts(allProducts);
    } catch (e) {
      console.warn("Backend unavailable, using local cache.", e);
      allProducts = getLocalProducts();
    }
    renderProducts(allProducts);
  }

  /* ================= RENDER ================= */
  function renderProducts(products) {
    tableBody.innerHTML = "";
    products.forEach((product, index) => {
      const row = document.createElement("tr");
      const imgSrc = firstImage(product);
      row.innerHTML = `
        <td><img src="${imgSrc}" alt="${
        product.name || "Product"
      }" width="40" /></td>
        <td>${product.name ?? "-"}</td>
        <td>${product.category ?? "-"}</td>
        <td>${money(product.price)}</td>
        <td>${product.store ?? "-"}</td>
        <td>${product.inStock ? "In Stock" : "Out of Stock"}</td>
        <td>${Number(product.quantity ?? 0)}</td>
        <td>${safeDate(product.dateAdded)}</td>
        <td>
          <button class="editBtn" data-index="${index}">Edit</button>
          <button class="deleteBtn" data-index="${index}">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  }

  /* ================= FILTERS ================= */
  function applyFilters() {
    const store = document.getElementById("filterStore").value;
    const category = document.getElementById("filterCategory").value;
    const minPrice = parseFloat(
      document.getElementById("filterMinPrice").value
    );
    const maxPrice = parseFloat(
      document.getElementById("filterMaxPrice").value
    );

    const filtered = allProducts.filter((p) => {
      if (store && p.store !== store) return false;
      if (category && p.category !== category) return false;
      const price = Number(p.price || 0);
      if (!isNaN(minPrice) && price < minPrice) return false;
      if (!isNaN(maxPrice) && price > maxPrice) return false;
      return true;
    });

    renderProducts(filtered);
  }

  filterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    applyFilters();
  });

  /* ================= TABLE EVENTS ================= */
  tableBody.addEventListener("click", async (e) => {
    const index = e.target.dataset.index;
    if (index === undefined) return;

    if (e.target.classList.contains("editBtn")) {
      currentEditIndex = Number(index);
      openEditModal(allProducts[currentEditIndex]);
    }

    if (e.target.classList.contains("deleteBtn")) {
      const prod = allProducts[Number(index)];
      if (!prod) return;
      if (!confirm("Are you sure you want to delete this product?")) return;

      // optimistic UI
      const backup = [...allProducts];
      allProducts.splice(Number(index), 1);
      setLocalProducts(allProducts);
      renderProducts(allProducts);
      try {
        await apiJSON(ENDPOINTS.del(prod.id), { method: "DELETE" });
      } catch (err) {
        alert("Delete failed. Reverting.");
        allProducts = backup;
        setLocalProducts(allProducts);
        renderProducts(allProducts);
      }
    }
  });

  /* ================= MODAL EDIT ================= */
  function openEditModal(product) {
    modal.classList.add("show");
    editForm.name.value = product.name ?? "";
    editForm.category.value = product.category ?? "";
    editForm.price.value = product.price ?? 0;
    editForm.store.value = product.store ?? "";
    editForm.quantity.value = product.quantity ?? 0;
    editForm.inStock.checked = !!product.inStock;
  }

  closeModalBtn.addEventListener("click", () => {
    modal.classList.remove("show");
  });

  editForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (currentEditIndex == null) return;

    const original = allProducts[currentEditIndex];
    if (!original) return;

    const patch = {
      name: editForm.name.value,
      category: editForm.category.value,
      price: parseFloat(editForm.price.value),
      store: editForm.store.value,
      quantity: parseInt(editForm.quantity.value, 10),
      inStock: editForm.inStock.checked,
    };

    // optimistic UI
    const updated = { ...original, ...patch };
    const backup = { ...original };
    allProducts[currentEditIndex] = updated;
    setLocalProducts(allProducts);
    renderProducts(allProducts);
    modal.classList.remove("show");

    try {
      await apiJSON(ENDPOINTS.patch(original.id), {
        method: "PATCH",
        body: JSON.stringify(patch),
      });
    } catch (err) {
      alert("Update failed. Reverting changes.");
      allProducts[currentEditIndex] = backup;
      setLocalProducts(allProducts);
      renderProducts(allProducts);
    }
  });

  /* ================= INIT ================= */
  loadProducts();
});
