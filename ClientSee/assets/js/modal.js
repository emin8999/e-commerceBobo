const API_BASE_MODAL = "http://116.203.51.133:8080";

const menuBtn = document.getElementById("menuBtn");
const menuModal = document.getElementById("menuModal");
const categoryList = document.getElementById("categoryList");
const storeList = document.getElementById("storeList");

/* ─── helpers ─── */
async function fetchJSON(url) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}
function unique(arr) {
  return Array.from(new Set(arr.filter(Boolean)));
}

/* ─── загрузка данных с бэкенда с fallback на localStorage ─── */
async function loadCategories() {
  try {
    // 1) пробуем прямой эндпоинт
    const cats = await fetchJSON(`${API_BASE_MODAL}/categories`);
    if (!Array.isArray(cats)) throw new Error("bad categories payload");
    localStorage.setItem("categories", JSON.stringify(cats));
    return cats;
  } catch {
    try {
      // 2) если нет /categories — берём из /products
      const products = await fetchJSON(`${API_BASE_MODAL}/products`);
      const cats = unique(
        (Array.isArray(products) ? products : []).map(
          (p) => p?.category && String(p.category).trim()
        )
      );
      if (cats.length) localStorage.setItem("categories", JSON.stringify(cats));
      return cats;
    } catch {
      // 3) fallback на localStorage
      const catsLS = JSON.parse(localStorage.getItem("categories") || "[]");
      return Array.isArray(catsLS) ? catsLS : [];
    }
  }
}

async function loadStores() {
  try {
    const stores = await fetchJSON(`${API_BASE_MODAL}/stores`);
    if (!Array.isArray(stores)) throw new Error("bad stores payload");
    localStorage.setItem("stores", JSON.stringify(stores));
    return stores;
  } catch {
    const storesLS = JSON.parse(localStorage.getItem("stores") || "[]");
    return Array.isArray(storesLS) ? storesLS : [];
  }
}

/* ─── рендер меню ─── */
async function renderCategoriesAndStores() {
  // показываем «скелетон» пока грузим
  categoryList.innerHTML = `<li>Loading…</li>`;
  storeList.innerHTML = `<li>Loading…</li>`;

  const [categories, stores] = await Promise.all([
    loadCategories(),
    loadStores(),
  ]);

  categoryList.innerHTML = categories.length
    ? categories
        .map((cat) => {
          const c = String(cat).trim();
          return `<li><a href="shop.html?category=${encodeURIComponent(
            c
          )}">${c}</a></li>`;
        })
        .join("")
    : "<li>No categories found</li>";

  storeList.innerHTML = stores.length
    ? stores
        .map((store) => {
          const name = store?.storeName ? String(store.storeName).trim() : "";
          return name
            ? `<li><a href="shop.html?store=${encodeURIComponent(
                name
              )}">${name}</a></li>`
            : "";
        })
        .join("") || "<li>No stores found</li>"
    : "<li>No stores found</li>";
}

/* ─── UI: открыть под кнопкой и загрузить ─── */
menuBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  // позиционируем под кнопкой
  const rect = menuBtn.getBoundingClientRect();
  menuModal.style.top = rect.bottom + window.scrollY + "px";
  menuModal.style.left = rect.left + "px";

  // перерисуем данные при каждом открытии
  await renderCategoriesAndStores();

  menuModal.classList.toggle("show");
});

/* скрыть при клике вне */
document.addEventListener("click", function (e) {
  if (!menuModal.contains(e.target) && e.target !== menuBtn) {
    menuModal.classList.remove("show");
  }
});
