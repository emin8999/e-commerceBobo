document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("editStoreForm");
  const preview = document.getElementById("previewContainer");

  // ===== ПРОВЕРКА ТОКЕНА =====
  const token = localStorage.getItem("storeJwt");
  if (!token) {
    window.location.href = "store-login.html";
    return;
  }

  // Данные магазина
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

      if (!res.ok) throw new Error("Не удалось получить данные магазина");

      const data = await res.json();

      storeData = {
        name: data.storeName || "",
        description: data.description || "",
        contact: data.phone || "",
        logo: data.logo || null,
        banner: data.banner || null,
      };

      loadInitialData();
    } catch (err) {
      console.warn("Ошибка при загрузке с сервера:", err);
      storeData = {
        name: "",
        description: "",
        contact: "",
        logo: null,
        banner: null,
      };
      loadInitialData();
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

  // ===== Отправка данных на сервер (PUT /update) =====
  async function sendToBackend() {
    try {
      const formData = new FormData();
      formData.append("storeName", storeData.name);
      formData.append("description", storeData.description);
      formData.append("phone", storeData.contact);

      const logoFile = document.getElementById("storeLogo").files[0];
      const bannerFile = document.getElementById("storeBanner").files[0];

      if (logoFile) formData.append("logo", logoFile);
      if (bannerFile) formData.append("banner", bannerFile);

      const res = await fetch("http://116.203.51.133:8080/home/store/update", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          // Content-Type НЕ ставим, fetch сам установит multipart/form-data
        },
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Ошибка сервера ${res.status}: ${text}`);
      }

      const updatedData = await res.json();
      storeData = {
        name: updatedData.storeName || storeData.name,
        description: updatedData.description || storeData.description,
        contact: updatedData.phone || storeData.contact,
        logo: updatedData.logo || storeData.logo,
        banner: updatedData.banner || storeData.banner,
      };

      loadInitialData();
      alert("✅ Магазин успешно обновлён!");
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

    await sendToBackend();
  });

  // ===== Инициализация =====
  await loadFromServer();
});
