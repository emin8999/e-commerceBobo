document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("editStoreForm");
  const preview = document.getElementById("previewContainer");

  // Получаем данные магазина из localStorage или создаем пустой объект
  const storeData = JSON.parse(localStorage.getItem("currentStore")) || {};

  // Заполняем форму из localStorage
  function loadInitialData() {
    document.getElementById("storeName").value = storeData.name || "";
    document.getElementById("storeDescription").value =
      storeData.description || "";
    document.getElementById("storeContact").value = storeData.contact || "";
    updatePreview();
  }

  // Обновляем превью магазина
  function updatePreview() {
    preview.innerHTML = `
      <h2>${storeData.name || "Store Name"}</h2>
      <p>${storeData.description || "Store description..."}</p>
      <p><strong>Contact:</strong> ${storeData.contact || "N/A"}</p>
      ${
        storeData.logo
          ? `<img src="${storeData.logo}" alt="Logo" style="max-width:100px;" />`
          : ""
      }
      ${
        storeData.banner
          ? `<img src="${storeData.banner}" alt="Banner" style="max-width:100%;" />`
          : ""
      }
    `;
  }

  // Конвертация файла в Base64 для локального превью
  function toBase64(file, callback) {
    const reader = new FileReader();
    reader.onload = () => callback(reader.result);
    reader.readAsDataURL(file);
  }

  // Функция отправки данных на сервер
  async function sendToBackend(formData) {
    try {
      const response = await fetch(
        "https://your-backend-url.com/api/update-store",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      console.log("Server response:", result);
      alert("Store updated on server successfully!");
    } catch (error) {
      console.error("Error sending store data:", error);
      alert("Failed to update store on server.");
    }
  }

  // Обработчик отправки формы
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("storeName").value;
    const description = document.getElementById("storeDescription").value;
    const contact = document.getElementById("storeContact").value;
    const logoFile = document.getElementById("storeLogo").files[0];
    const bannerFile = document.getElementById("storeBanner").files[0];

    storeData.name = name;
    storeData.description = description;
    storeData.contact = contact;

    const saveAndRender = () => {
      // Сохраняем данные в localStorage
      localStorage.setItem("currentStore", JSON.stringify(storeData));
      updatePreview();
      alert("Store updated locally!");

      // Создаем FormData для отправки на сервер
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("contact", contact);
      if (logoFile) formData.append("logo", logoFile);
      if (bannerFile) formData.append("banner", bannerFile);

      sendToBackend(formData);
    };

    // Обновляем превью с изображениями через Base64
    if (logoFile) {
      toBase64(logoFile, (base64) => {
        storeData.logo = base64;
        if (bannerFile) {
          toBase64(bannerFile, (banner64) => {
            storeData.banner = banner64;
            saveAndRender();
          });
        } else {
          saveAndRender();
        }
      });
    } else if (bannerFile) {
      toBase64(bannerFile, (banner64) => {
        storeData.banner = banner64;
        saveAndRender();
      });
    } else {
      saveAndRender();
    }
  });

  loadInitialData();
});
