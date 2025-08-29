const header_API_BASE = "http://116.203.51.133:8080";
const PUBLIC_PRODUCTS_URL = `${header_API_BASE}/home/product/public`;

const inputEl = document.getElementById("boboSearch");
const dropdownEl = document.getElementById("boboSearchDropdown");

document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.getElementById("logoutButton"); // десктоп
  const mobileLogoutButton = document.getElementById("mobileLogoutButton"); // мобильная
  const userGreeting = document.getElementById("userGreeting"); // ссылка Hello, sign in

  // Проверка токена и отображение logout кнопок
  function checkToken() {
    const token = localStorage.getItem("jwtToken");

    if (logoutButton) {
      logoutButton.style.display = token ? "flex" : "none";
    }

    if (mobileLogoutButton) {
      mobileLogoutButton.style.display = token ? "flex" : "none";
    }
  }

  // Сразу проверяем при загрузке
  checkToken();

  // --- Логика смены Hello, sign in на имя пользователя ---
  async function updateUserGreeting() {
    const token = localStorage.getItem("jwtToken");
    if (!userGreeting) return;

    if (token) {
      try {
        const response = await fetch(`${header_API_BASE}/home/user/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const text = await response.text(); // читаем тело в любом случае

        let userData = null;
        try {
          userData = JSON.parse(text); // пытаемся распарсить JSON
        } catch (err) {
          console.warn("Не удалось распарсить JSON:", err);
        }

        // Если JSON есть и есть поле name/username — используем
        const name =
          (userData && (userData.name || userData.username)) || "User";

        userGreeting.textContent = `Hello, ${name}`;
        userGreeting.removeAttribute("href");
      } catch (err) {
        console.error("Ошибка сети или сервера:", err);
        userGreeting.textContent = "Hello, User"; // fallback
        userGreeting.removeAttribute("href");
      }
    } else {
      userGreeting.textContent = "Hello, sign in";
      userGreeting.setAttribute("href", "./signIn.html");
    }
  }

  updateUserGreeting();

  // Логика выхода (общая для обеих кнопок)
  function handleLogout() {
    localStorage.removeItem("jwtToken"); // удаляем токен
    checkToken(); // обновляем кнопки
    updateUserGreeting(); // обновляем приветствие
    window.location.href = "signIn.html"; // редирект на страницу входа
  }

  if (logoutButton) {
    logoutButton.addEventListener("click", handleLogout);
  }

  if (mobileLogoutButton) {
    mobileLogoutButton.addEventListener("click", handleLogout);
  }

  const accountLink = document.getElementById("accountLink");
  if (accountLink) {
    accountLink.addEventListener("click", (e) => {
      e.preventDefault();
      const token = localStorage.getItem("jwtToken");
      if (token) {
        window.location.href = "./account.html";
      } else {
        window.location.href = "./signIn.html";
      }
    });
  }

  const accountMenuLink = document.getElementById("accountMenuLink");
  if (accountMenuLink) {
    accountMenuLink.addEventListener("click", (e) => {
      e.preventDefault();
      const token = localStorage.getItem("jwtToken");
      if (token) {
        window.location.href = "account.html";
      } else {
        window.location.href = "signIn.html";
      }
    });
  }
});

function openProduct(product) {
  localStorage.setItem("selectedProduct", JSON.stringify(product));
  window.location.href = "productVision.html";
}

let ALL_PRODUCTS = [];
let activeIndex = -1;

function loadCache() {
  try {
    return JSON.parse(localStorage.getItem("products") || "[]");
  } catch {
    return [];
  }
}
function saveCache(list) {
  localStorage.setItem("products", JSON.stringify(list || []));
}

// Временные mock-данные на случай недоступности сервера
const MOCK_PRODUCTS = [
  { id: 1, name: "Товар 1", price: 100, storeName: "Магазин A", imageUrls: [] },
  { id: 2, name: "Товар 2", price: 200, storeName: "Магазин B", imageUrls: [] },
];

async function fetchAllProducts() {
  try {
    const res = await fetch(PUBLIC_PRODUCTS_URL);
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data)) {
      saveCache(data);
      return data;
    }
    return loadCache();
  } catch (e) {
    console.warn("Backend unavailable, using local cache or mock.", e);
    const cached = loadCache();
    return cached.length ? cached : MOCK_PRODUCTS;
  }
}

// --- Утилиты ---
function norm(v) {
  return String(v ?? "").toLowerCase();
}
function safeNum(v) {
  const n = Number(v);
  return isFinite(n) ? n : NaN;
}
function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
function highlight(text, q) {
  if (!q) return escapeHtml(text);
  const esc = escapeRegExp(q);
  return escapeHtml(text).replace(
    new RegExp(`(${esc})`, "ig"),
    "<span class='bobo-search-highlight'>$1</span>"
  );
}

// --- Фильтрация ---
function filterProducts(products, query, limit = 4) {
  const q = norm(query);
  if (!q) return [];

  const qNum = safeNum(q);
  const isPriceSearch = !isNaN(qNum);

  const results = [];
  for (const p of products) {
    const name = norm(p.name);
    const desc = norm(p.description);
    const color = norm(p.color);
    const status = norm(p.status);
    const storeName = norm(p.storeName || p.store || p.shop);
    const priceStr = String(p.price ?? "");
    const priceMatch = isPriceSearch
      ? Number(p.price) === qNum
      : priceStr.includes(q);

    const matches =
      name.includes(q) ||
      desc.includes(q) ||
      color.includes(q) ||
      status.includes(q) ||
      storeName.includes(q) ||
      priceMatch;
    if (matches) results.push(p);
    if (results.length >= limit) break;
  }
  return results;
}

// --- Рендер ---
function firstImage(p) {
  if (Array.isArray(p.imageUrls) && p.imageUrls.length) return p.imageUrls[0];
  if (Array.isArray(p.images) && p.images.length) return p.images[0];
  if (typeof p.imageUrls === "string" && p.imageUrls) return p.imageUrls;
  return p.image || "";
}

function renderDropdown(items, query) {
  dropdownEl.innerHTML = "";
  activeIndex = -1;

  if (!items.length) {
    dropdownEl.innerHTML = `<div class="bobo-search-empty">Ничего не найдено</div>`;
    dropdownEl.style.display = "block";
    return;
  }

  const frag = document.createDocumentFragment();
  items.forEach((p, idx) => {
    const el = document.createElement("div");
    el.className = "bobo-search-item";
    el.dataset.index = String(idx);

    const img = firstImage(p);
    const price = Number(p.price || 0);

    el.innerHTML = `
      <img class="bobo-search-thumb" src="${escapeHtml(
        img
      )}" alt="product" onerror="this.style.display='none'"/>
      <div class="bobo-search-main">
        <div class="bobo-search-title">${highlight(p.name || "-", query)}</div>
        <div class="bobo-search-meta">
          ${highlight(p.storeName || p.store || p.shop || "-", query)} •
          ${highlight(p.status || "-", query)} •
          ${highlight(p.color || "-", query)}
        </div>
      </div>
      <div class="bobo-search-price">$${price.toFixed(2)}</div>
    `;

    el.addEventListener("mousedown", (e) => {
      e.preventDefault();
      openProduct(p);
      hideDropdown();
    });

    frag.appendChild(el);
  });

  dropdownEl.appendChild(frag);
  dropdownEl.style.display = "block";
}

function hideDropdown() {
  dropdownEl.style.display = "none";
  dropdownEl.innerHTML = "";
  activeIndex = -1;
}

function moveActive(delta) {
  const items = Array.from(dropdownEl.querySelectorAll(".bobo-search-item"));
  if (!items.length) return;
  activeIndex = (activeIndex + delta + items.length) % items.length;
  items.forEach((it, i) => it.classList.toggle("is-active", i === activeIndex));
}

function selectActive() {
  const items = Array.from(dropdownEl.querySelectorAll(".bobo-search-item"));
  if (!items.length || activeIndex < 0) return;
  const idx = Number(items[activeIndex].dataset.index);
  const results = filterProducts(ALL_PRODUCTS, inputEl.value, 4);
  const p = results[idx];
  if (p) {
    openProduct(p);
    hideDropdown();
  }
}

let typTimer;
function onType() {
  clearTimeout(typTimer);
  typTimer = setTimeout(() => {
    const q = inputEl.value.trim();
    if (!q) {
      hideDropdown();
      return;
    }
    const results = filterProducts(ALL_PRODUCTS, q, 4);
    renderDropdown(results, q);
  }, 120);
}

// --- События ---
inputEl.addEventListener("input", onType);
inputEl.addEventListener("focus", onType);
inputEl.addEventListener("keydown", (e) => {
  if (dropdownEl.style.display !== "block") return;
  if (e.key === "ArrowDown") {
    e.preventDefault();
    moveActive(1);
  }
  if (e.key === "ArrowUp") {
    e.preventDefault();
    moveActive(-1);
  }
  if (e.key === "Enter") {
    e.preventDefault();
    selectActive();
  }
  if (e.key === "Escape") {
    hideDropdown();
  }
});

document.addEventListener("click", (e) => {
  const within =
    e.target.closest(".search-bar") || e.target.closest("#boboSearchDropdown");
  if (!within) hideDropdown();
});

// --- Инициализация ---
(async function initBoboSearch() {
  ALL_PRODUCTS = await fetchAllProducts();
})();
