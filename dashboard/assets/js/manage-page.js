document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("editStoreForm");
  const preview = document.getElementById("previewContainer");

  // ===== ПРОВЕРКА ТОКЕНА =====
  const token = localStorage.getItem("storeJwt");
  if (!token) {
    window.location.href = "store-login.html";
    return;
  }

  // Данные магазина (только в памяти, без локалки)
  let storeData = {};

  // ===== Загрузка данных с сервера (GET) =====
  async function loadFromServer() {
    try {
      const res = await fetch("http://116.203.51.133:8080/home/store/info", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("storeJwt");
        window.location.href = "store-login.html";
        return;
      }

      if (!res.ok) throw new Error("Failed to fetch store data");

      const data = await res.json();

      // Подстраховка: приведение ключей к ожидаемым
      storeData = {
        name: data.name || data.storeName || "",
        description: data.description || data.storeDescription || "",
        contact: data.contact || data.phone || "",
        logo: data.logo || null,
        banner: data.banner || null,
      };

      loadInitialData();
    } catch (err) {
      console.warn("Не удалось загрузить данные с сервера:", err);
      storeData = {
        name: "",
        description: "",
        contact: "",
        logo: null,
        banner: null,
      };
      loadInitialData(); // Заполним хотя бы пустыми полями
    }
  }

  // ===== Заполняем форму =====
  function loadInitialData() {
    document.getElementById("storeName").value = storeData.name || "";
    document.getElementById("storeDescription").value =
      storeData.description || "";
    document.getElementById("storeContact").value = storeData.contact || "";
    updatePreview();
  }

  // ===== Обновляем превью =====
  function updatePreview() {
    preview.innerHTML = `
      <h2>${storeData.name || "Store Name"}</h2>
      <p>${storeData.description || "Store description..."}</p>
      <p><strong>Contact:</strong> ${storeData.contact || "N/A"}</p>
      ${
        storeData.logo
          ? `<img src="${storeData.logo}" alt="Logo" style="max-width:100px;">`
          : ""
      }
      ${
        storeData.banner
          ? `<img src="${storeData.banner}" alt="Banner" style="max-width:100%;">`
          : ""
      }
    `;
  }

  // ===== Конвертация файлов в Base64 =====
  function toBase64(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  }

  // ===== Отправка данных на сервер (PUT) =====
  async function sendToBackend() {
    try {
      const payload = {
        name: storeData.name,
        description: storeData.description,
        contact: storeData.contact,
        logo: storeData.logo || null,
        banner: storeData.banner || null,
      };

      const res = await fetch("http://116.203.51.133:8080/home/store/info", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("storeJwt");
        window.location.href = "store-login.html";
        return;
      }

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Ошибка сервера ${res.status}: ${text}`);
      }

      const data = await res.json();
      console.log("Ответ сервера:", data);
      alert("✅ Магазин обновлён на сервере!");
    } catch (err) {
      console.error("Ошибка при отправке на сервер:", err);
      alert("❌ Не удалось обновить магазин на сервере.");
    }
  }

  // ===== Обработка формы =====
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    storeData.name = document.getElementById("storeName").value;
    storeData.description = document.getElementById("storeDescription").value;
    storeData.contact = document.getElementById("storeContact").value;

    const logoFile = document.getElementById("storeLogo").files[0];
    const bannerFile = document.getElementById("storeBanner").files[0];

    if (logoFile) storeData.logo = await toBase64(logoFile);
    if (bannerFile) storeData.banner = await toBase64(bannerFile);

    updatePreview();
    sendToBackend();
  });

  // ===== Инициализация =====
  await loadFromServer();
});
