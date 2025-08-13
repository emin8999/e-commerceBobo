document.addEventListener("DOMContentLoaded", initStoreProfile);

async function initStoreProfile() {
  const API_BASE = "http://116.203.51.133:8080";
  const INFO_URL = `${API_BASE}/home/store/info`;

  const token = localStorage.getItem("jwtToken");
  if (!token) {
    renderMessage("Please log in first.");
    return;
  }

  try {
    const store = await fetchJSON(INFO_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    renderStore(store, API_BASE);
  } catch (err) {
    // если токен протух/нет прав — вычищаем токен и показываем понятное сообщение
    if (err.status === 401 || err.status === 403) {
      localStorage.removeItem("jwtToken");
      renderMessage("Session expired. Please log in again.");
      // опционально: window.location.href = "login.html";
      return;
    }
    console.error("Store load error:", err);
    renderMessage("Store not found or server error.");
  }
}

/* ---------------- helpers ---------------- */

async function fetchJSON(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const error = new Error(text || `${res.status} ${res.statusText}`);
    error.status = res.status;
    throw error;
  }
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : {};
}

function renderMessage(text) {
  document.body.innerHTML = `<h2 style="font-family:sans-serif;text-align:center;margin-top:2rem;">${text}</h2>`;
}

function toAbsUrl(maybeUrl, base) {
  if (!maybeUrl) return "";
  try {
    // если уже абсолютный — вернётся как есть
    return new URL(maybeUrl, base).href;
  } catch {
    return "";
  }
}

function renderStore(store, base) {
  const nameEl = document.getElementById("storeName");
  const catEl = document.getElementById("storeCategory");
  const descEl = document.getElementById("storeDescription");
  const logoEl = document.getElementById("storeLogo");
  const bannerEl = document.getElementById("storeBanner");
  const contactEl = document.getElementById("storeContact");

  nameEl.textContent = store?.name || "";
  catEl.textContent = store?.category || "";
  // в исходнике стоял location в description — сохраняю совместимость
  descEl.textContent = store?.location || store?.description || "";

  const logoUrl = toAbsUrl(store?.logo, base);
  const bannerUrl = toAbsUrl(store?.banner, base);

  // дефолтные изображения на случай пустых/битых ссылок
  logoEl.src =
    logoUrl ||
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><rect width='100%' height='100%' fill='%23eee'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-family='Arial' font-size='14'>No Logo</text></svg>";
  logoEl.alt = store?.name ? `${store.name} logo` : "Store logo";

  bannerEl.style.backgroundImage = bannerUrl
    ? `url('${bannerUrl}')`
    : "linear-gradient(135deg, #e6f2ff 0%, #f5f7fa 100%)";

  if (store?.phone) {
    contactEl.innerHTML = `📞 Contact: ${escapeHtml(store.phone)}`;
  } else {
    contactEl.textContent = "";
  }
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
