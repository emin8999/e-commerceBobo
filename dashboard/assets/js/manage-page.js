document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("editStoreForm");
  const preview = document.getElementById("previewContainer");

  const storeData = JSON.parse(localStorage.getItem("currentStore")) || {};

  function loadInitialData() {
    document.getElementById("storeName").value = storeData.name || "";
    document.getElementById("storeDescription").value =
      storeData.description || "";
    document.getElementById("storeContact").value = storeData.contact || "";
    updatePreview();
  }

  function updatePreview() {
    preview.innerHTML = `
      <h2>${storeData.name || "Store Name"}</h2>
      <p>${storeData.description || "Store description..."}</p>
      <p><strong>Contact:</strong> ${storeData.contact || "N/A"}</p>
      ${storeData.logo ? `<img src="${storeData.logo}" alt="Logo" />` : ""}
      ${
        storeData.banner ? `<img src="${storeData.banner}" alt="Banner" />` : ""
      }
    `;
  }

  function toBase64(file, callback) {
    const reader = new FileReader();
    reader.onload = () => callback(reader.result);
    reader.readAsDataURL(file);
  }

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
      localStorage.setItem("currentStore", JSON.stringify(storeData));
      updatePreview();
      alert("Store updated successfully!");
    };

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
