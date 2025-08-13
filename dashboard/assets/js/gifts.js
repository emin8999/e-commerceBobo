/* ========= CONFIG ========= */
const API_BASE = "http://116.203.51.133:8080";
const ENDPOINTS = {
  list: (q = {}) => {
    const usp = new URLSearchParams();
    if (q.store) usp.set("store", q.store);
    if (q.status) usp.set("status", q.status); // "Active" | "Expired"
    const qs = usp.toString();
    return `${API_BASE}/admin/gifts${qs ? `?${qs}` : ""}`;
  },
  create: `${API_BASE}/admin/gifts`,
};
// Если используешь JWT:
// const AUTH = localStorage.getItem("token") || "";

/* ========= DOM ========= */
const giftTableBody = document.querySelector("#giftTable tbody");
const giftForm = document.getElementById("giftForm");
const addGiftBtn = document.getElementById("openGiftModal");
const giftModal = document.getElementById("giftModal");
const closeModalBtn = document.querySelector(".closeModal");
const statusFilter = document.getElementById("statusFilter");
const storeFilter = document.getElementById("storeFilter");

/* ========= STATE ========= */
let gifts = [];

/* ========= HELPERS ========= */
async function apiJSON(url, options = {}) {
  const res = await fetch(url, {
    headers: {
      // Заголовки ставим только если не multipart
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
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

function setLocalGifts(arr) {
  localStorage.setItem("gifts", JSON.stringify(arr || []));
}
function getLocalGifts() {
  try {
    return JSON.parse(localStorage.getItem("gifts") || "[]");
  } catch {
    return [];
  }
}

function getGiftStatus(gift) {
  const now = new Date();
  return new Date(gift.expiresAt) >= now ? "Active" : "Expired";
}

function displayImageOf(g) {
  // бэк вернёт imageUrl, локально — base64 в поле image
  return g.imageUrl || g.image || "";
}

/* ========= LOAD & RENDER ========= */
async function loadGifts() {
  // фильтры для запроса к бэкенду
  const query = {};
  if (storeFilter.value) query.store = storeFilter.value;
  if (statusFilter.value) query.status = statusFilter.value; // "Active"/"Expired"

  try {
    const data = await apiJSON(ENDPOINTS.list(query));
    if (!Array.isArray(data)) throw new Error("Bad gifts payload");
    gifts = data;
    setLocalGifts(gifts); // кэш на случай офлайна
  } catch (e) {
    console.warn("Backend unavailable, using local gifts cache.", e);
    gifts = getLocalGifts();
    // локальная фильтрация, если выбраны фильтры
    gifts = gifts.filter((g) => {
      const storeMatch =
        !storeFilter.value || String(g.store) === String(storeFilter.value);
      const statusMatch =
        !statusFilter.value || getGiftStatus(g) === statusFilter.value;
      return storeMatch && statusMatch;
    });
  }

  renderGifts();
  populateStoreOptions();
}

function renderGifts() {
  giftTableBody.innerHTML = "";
  if (!gifts.length) {
    giftTableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;">No gifts found</td></tr>`;
    return;
  }

  const frag = document.createDocumentFragment();
  gifts.forEach((gift) => {
    const tr = document.createElement("tr");
    const status = getGiftStatus(gift);

    tr.innerHTML = `
      <td>${gift.name}</td>
      <td><img src="${displayImageOf(gift)}" alt="gift" width="60"/></td>
      <td>$${Number(gift.condition?.minOrder || 0)}</td>
      <td>${gift.condition?.category || "-"}</td>
      <td>${gift.store || "-"}</td>
      <td class="status-${status.toLowerCase()}">${status}</td>
      <td>${new Date(gift.expiresAt).toLocaleDateString()}</td>
    `;
    frag.appendChild(tr);
  });
  giftTableBody.appendChild(frag);
}

function populateStoreOptions() {
  const stores = [...new Set(gifts.map((g) => g.store).filter(Boolean))];
  storeFilter.innerHTML = `<option value="">All Stores</option>`;
  stores.forEach((store) => {
    const option = document.createElement("option");
    option.value = store;
    option.textContent = store;
    storeFilter.appendChild(option);
  });
}

/* ========= MODAL ========= */
addGiftBtn.addEventListener("click", () => {
  giftModal.classList.add("show");
});
closeModalBtn.addEventListener("click", () => {
  giftModal.classList.remove("show");
});
window.addEventListener("click", (e) => {
  if (e.target === giftModal) giftModal.classList.remove("show");
});

/* ========= CREATE ========= */
async function createGiftOnBackend(fields) {
  // Сначала пробуем multipart (предпочтительно)
  const fd = new FormData();
  fd.append("name", fields.name);
  fd.append("image", fields.file); // файл
  fd.append("minOrder", String(fields.minOrder));
  fd.append("category", fields.category);
  fd.append("expiresAt", fields.expiresAt);
  fd.append("store", fields.store);
  fd.append("active", String(fields.active));

  try {
    const created = await apiJSON(ENDPOINTS.create, {
      method: "POST",
      body: fd,
    });
    return created;
  } catch (e) {
    console.warn("Multipart upload failed, trying JSON base64…", e);
    // Fallback: JSON с base64
    const reader = await fileToBase64(fields.file);
    const payload = {
      name: fields.name,
      imageBase64: reader, // ожидается поддержка на бэке
      minOrder: fields.minOrder,
      category: fields.category,
      expiresAt: fields.expiresAt,
      store: fields.store,
      active: fields.active,
    };
    const created = await apiJSON(ENDPOINTS.create, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return created;
  }
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

giftForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("giftName").value.trim();
  const imageFile = document.getElementById("giftImage").files[0];
  const minOrder = parseFloat(document.getElementById("giftMinOrder").value);
  const category = document.getElementById("giftCategory").value.trim();
  const expiresAt = document.getElementById("giftExpiresAt").value;
  const store = document.getElementById("giftStore").value.trim();
  const active = document.getElementById("giftActive").checked;

  if (!name || !imageFile || !expiresAt || !store) {
    alert("Please fill required fields (name, image, expiresAt, store).");
    return;
  }

  // optimistic UI: локально добавим черновик, пока ждём бэкенд
  const tempId = "gift_" + Date.now();
  const tempGift = {
    giftId: tempId,
    name,
    image: URL.createObjectURL(imageFile), // временный preview
    condition: { minOrder, category },
    store,
    active,
    expiresAt,
  };
  const oldGifts = [...gifts];
  gifts.push(tempGift);
  renderGifts();
  populateStoreOptions();

  try {
    const created = await createGiftOnBackend({
      name,
      file: imageFile,
      minOrder,
      category,
      expiresAt,
      store,
      active,
    });

    // обновим список правильным объектом с сервера
    // (подменим временный элемент на серверный)
    gifts = gifts.map((g) =>
      g.giftId === tempId
        ? {
            ...g,
            ...created, // ожидаем giftId, imageUrl и т.д.
            image: undefined, // больше не нужен локальный objectURL
          }
        : g
    );

    // кэш на офлайн: приведём к единому виду (imageUrl предпочтительно)
    const cache = gifts.map((g) => ({
      giftId: g.giftId,
      name: g.name,
      imageUrl: g.imageUrl || g.image, // на будущее
      condition: g.condition,
      store: g.store,
      active: g.active,
      expiresAt: g.expiresAt,
    }));
    setLocalGifts(cache);

    giftModal.classList.remove("show");
    giftForm.reset();
    // перерисуем с новыми данными
    renderGifts();
    populateStoreOptions();
  } catch (err) {
    alert("Failed to save gift on server. Local draft kept.");
    console.error(err);
    // оставим локальный объект в gifts и в кэше (base64 — если нужно)
    const reader = new FileReader();
    reader.onloadend = function () {
      gifts = gifts.map((g) =>
        g.giftId === tempId ? { ...g, image: reader.result } : g
      );
      setLocalGifts(gifts);
      renderGifts();
      populateStoreOptions();
    };
    reader.readAsDataURL(imageFile);
  }
});

/* ========= FILTERS ========= */
statusFilter.addEventListener("change", loadGifts);
storeFilter.addEventListener("change", loadGifts);

/* ========= INIT ========= */
loadGifts();
