/* ================== CONFIG ================== */
const API_BASE_NAV_BAR = "http://116.203.51.133:8080";
const ENDPOINTS = {
  session: `${API_BASE_NAV_BAR}/auth/session`,
  translations: (lang) =>
    `${API_BASE_NAV_BAR}/i18n/translations?lang=${encodeURIComponent(lang)}`,
  saveLang: `${API_BASE_NAV_BAR}/i18n/preference`,
};
const FALLBACK_LANG = "EN";

/* ================== MENU (как у тебя) ================== */
document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  const burgerBtn = document.querySelector(".burger-btn");

  if (!sidebar || !overlay || !burgerBtn) return;

  function toggleMenu() {
    sidebar.classList.toggle("open");
    overlay.classList.toggle("active");
  }

  function closeMenu() {
    sidebar.classList.remove("open");
    overlay.classList.remove("active");
  }

  // Кнопка бургера
  burgerBtn.addEventListener("click", toggleMenu);

  // Клик на затемнение — закрывает
  overlay.addEventListener("click", closeMenu);

  // Авто-закрытие при большой ширине
  window.addEventListener("resize", () => {
    if (window.innerWidth > 600) {
      closeMenu();
    }
  });
});

/* ================== LANG / FLAGS ================== */
const flagImg = document.querySelector(".nav-bar-language img");
const languageSelect = document.getElementById("language-select");
const FLAGS = { EN: "us", AZ: "az", RU: "ru" };

// храним текущий язык и словарь
let currentLang = localStorage.getItem("lang") || FALLBACK_LANG;
let i18nDict = {};

function setFlag(lang) {
  const code = FLAGS[lang] || "us";
  if (flagImg) {
    flagImg.src = `https://flagcdn.com/${code}.svg`;
    flagImg.alt = lang;
  }
}

function applyTranslations(dict) {
  // элементы, у которых есть data-i18n="key"
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (key && dict[key]) el.textContent = dict[key];
  });

  // плейсхолдеры (если нужно): data-i18n-placeholder="key"
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (key && dict[key]) el.placeholder = dict[key];
  });
}

/* ================== API HELPERS ================== */
async function apiJSON(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    credentials: "include", // если сессия через cookie
    ...options,
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText} ${t}`);
  }
  return res.json().catch(() => ({}));
}

/* ================== LOAD & SAVE LANGUAGE ================== */
async function loadTranslations(lang) {
  try {
    const dict = await apiJSON(ENDPOINTS.translations(lang));
    if (!dict || typeof dict !== "object") throw new Error("Bad i18n payload");
    // кэшнём в localStorage на случай офлайна
    localStorage.setItem(`i18n:${lang}`, JSON.stringify(dict));
    return dict;
  } catch (e) {
    console.warn(
      "Translations from server failed, fallback to localStorage",
      e
    );
    const cached = localStorage.getItem(`i18n:${lang}`);
    return cached ? JSON.parse(cached) : {};
  }
}

async function saveLanguagePreference(lang) {
  try {
    await apiJSON(ENDPOINTS.saveLang, {
      method: "POST",
      body: JSON.stringify({ lang }),
    });
  } catch (e) {
    // не критично: просто лог
    console.warn("Failed to persist language on backend", e);
  }
}

/* ================== INIT ================== */
async function initLanguage() {
  // установим select и флаг
  if (languageSelect) languageSelect.value = currentLang;
  setFlag(currentLang);

  // загрузим переводы (с сервера → fallback на кэш)
  i18nDict = await loadTranslations(currentLang);
  applyTranslations(i18nDict);
}

languageSelect?.addEventListener("change", async () => {
  const selected = languageSelect.value;
  currentLang = selected || FALLBACK_LANG;

  // визуально
  setFlag(currentLang);

  // загрузка словаря и применение
  i18nDict = await loadTranslations(currentLang);
  applyTranslations(i18nDict);

  // сохранить локально и на бэкенде
  localStorage.setItem("lang", currentLang);
  saveLanguagePreference(currentLang).catch(() => {});
});

// Авто-инициализация при загрузке
document.addEventListener("DOMContentLoaded", initLanguage);
