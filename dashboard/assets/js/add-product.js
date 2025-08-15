// =======================
// Add Product — Full Script (API-ready)
// =======================

// PROD / DEV переключатель:
const API_BASE = "http://116.203.51.133:8080";
// Для локальной разработки:
// const API_BASE = "http://localhost:8080";

// Требуемые элементы в HTML (id):
// form#addProductForm
// input#productName
// textarea#productDescription
// input#productPrice (type="number")
// input#productCategory
// input#productStore (readonly желательно)
// input#productColors (строка вида "red, blue, black")
// input#productImages (type="file" multiple)
// div#sizeQuantitiesWrapper (внутри хотя бы 1 .size-quantity-wrapper + кнопка .add-size-btn)
// span|div#addProductMessage (для вывода сообщений)

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addProductForm");
  const wrapper = document.getElementById("sizeQuantitiesWrapper");
  const message = document.getElementById("addProductMessage");
  const storeNameInput = document.getElementById("productStore");
  const submitBtn = form ? form.querySelector('[type="submit"]') : null;

  // ---------- Утилиты ----------
  function setMsg(text, ok = false) {
    if (!message) return;
    message.textContent = text || "";
    message.style.color = ok ? "green" : "crimson";
  }

  function val(id) {
    const el = document.getElementById(id);
    return el ? el.value : "";
  }

  // Безопасное декодирование JWT (base64url)
  function decodeJwtPayload(token) {
    const part = token.split(".")[1];
    if (!part) throw new Error("Invalid JWT format");
    const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "===".slice((base64.length + 3) % 4);
    const json = atob(padded);
    return JSON.parse(json);
  }

  const sizeOptions = `
    <option value="">Size</option>
    <option value="TWO_XS">2XS</option>
    <option value="XS">XS</option>
    <option value="S">S</option>
    <option value="M">M</option>
    <option value="L">L</option>
    <option value="XL">XL</option>
    <option value="TWO_XL">2XL</option>
  `;

  function updateRemoveButtons() {
    if (!wrapper) return;
    const blocks = wrapper.querySelectorAll(".size-quantity-wrapper");
    const many = blocks.length > 1;
    blocks.forEach((blk) => {
      const btn = blk.querySelector(".remove-button");
      if (btn) btn.style.display = many ? "inline-block" : "none";
    });
  }

  function bindRemoveHandler(sizeBlock) {
    const btn = sizeBlock.querySelector(".remove-button");
    if (btn && !btn.dataset.bound) {
      btn.addEventListener("click", () => {
        sizeBlock.remove();
        updateRemoveButtons();
      });
      btn.dataset.bound = "1";
    }
  }

  function bindAllExistingSizeBlocks() {
    if (!wrapper) return;
    wrapper
      .querySelectorAll(".size-quantity-wrapper")
      .forEach(bindRemoveHandler);
  }

  function addSizeBlock() {
    if (!wrapper) return;
    const addBtn = wrapper.querySelector(".add-size-btn");
    const sizeBlock = document.createElement("div");
    sizeBlock.classList.add("size-quantity-wrapper");
    sizeBlock.innerHTML = `
      <select name="productSizes" class="size-input">
        ${sizeOptions}
      </select>
      <input type="number" name="quantities" class="quantity-input" placeholder="Quantity" />
      <button type="button" class="remove-button">X</button>
    `;
    wrapper.insertBefore(sizeBlock, addBtn);
    bindRemoveHandler(sizeBlock);
    updateRemoveButtons();
  }

  function resetSizeBlocks() {
    if (!wrapper) return;
    wrapper.innerHTML = `
      <div class="size-quantity-wrapper">
        <select name="productSizes" class="size-input">
          ${sizeOptions}
        </select>
        <input type="number" name="quantities" class="quantity-input" placeholder="Quantity" />
        <button type="button" class="remove-button" style="display:none;">X</button>
      </div>
      <input type="button" value="+" class="add-size-btn" />
    `;
    const addBtn = wrapper.querySelector(".add-size-btn");
    if (addBtn) addBtn.addEventListener("click", addSizeBlock);
    bindAllExistingSizeBlocks();
    updateRemoveButtons();
  }

  // ---------- JWT -> Store Name ----------
  try {
    const jwtToken = localStorage.getItem("jwtToken");
    if (storeNameInput) {
      if (jwtToken) {
        try {
          const decodedToken = decodeJwtPayload(jwtToken);
          const storeName =
            decodedToken.storeName || decodedToken.sub || "Unknown Store";
          storeNameInput.value = storeName;
        } catch (err) {
          console.error("Invalid token:", err);
          storeNameInput.value = "Invalid token";
        }
      } else {
        storeNameInput.value = "No token found";
      }
    }
  } catch (e) {
    console.error("JWT read error:", e);
  }

  // ---------- Инициализация блоков размеров ----------
  if (wrapper) {
    const addBtn = wrapper.querySelector(".add-size-btn");
    if (addBtn) addBtn.addEventListener("click", addSizeBlock);
    bindAllExistingSizeBlocks();
    updateRemoveButtons();
  }

  // ---------- Сабмит формы ----------
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      setMsg("");

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.dataset.orig = submitBtn.textContent || submitBtn.value || "";
        if ("textContent" in submitBtn) submitBtn.textContent = "Saving...";
        if ("value" in submitBtn && submitBtn.type === "submit")
          submitBtn.value = "Saving...";
      }

      try {
        const jwtToken = localStorage.getItem("jwtToken") || "";
        if (!jwtToken) {
          setMsg("Нет токена авторизации. Выполните вход.", false);
          return;
        }

        // Базовая валидация
        const name = val("productName").trim();
        if (!name) {
          setMsg("Укажите название товара.", false);
          return;
        }
        const priceNum = Number(val("productPrice"));
        if (!Number.isFinite(priceNum) || priceNum < 0) {
          setMsg("Цена должна быть числом ≥ 0.", false);
          return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", val("productDescription"));
        formData.append("price", priceNum);
        formData.append("category", val("productCategory"));
        formData.append("store", storeNameInput ? storeNameInput.value : "");

        // Размеры и количества
        const sizeWrappers = wrapper
          ? wrapper.querySelectorAll(".size-quantity-wrapper")
          : [];
        const sizeQuantities = [];
        sizeWrappers.forEach((blk) => {
          const size = blk.querySelector(".size-input")?.value || "";
          const qStr = blk.querySelector(".quantity-input")?.value || "";
          const quantity = Number(qStr);
          if (size && Number.isFinite(quantity) && quantity > 0) {
            sizeQuantities.push({ size, quantity });
          }
        });
        if (sizeQuantities.length === 0) {
          setMsg("Укажите хотя бы один размер с количеством > 0.", false);
          return;
        }
        formData.append("sizeQuantities", JSON.stringify(sizeQuantities));

        // Цвета
        const colorsRaw = val("productColors") || "";
        const colors = colorsRaw
          .split(",")
          .map((c) => c.trim())
          .filter((c) => c.length > 0);
        formData.append("colors", JSON.stringify(colors));

        // Изображения
        const imgInput = document.getElementById("productImages");
        if (imgInput && imgInput.files && imgInput.files.length > 0) {
          for (let i = 0; i < imgInput.files.length; i++) {
            formData.append("images", imgInput.files[i]);
          }
        }

        // Запрос на API
        const url = `${API_BASE}/home/product`;
        const res = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: "Bearer " + jwtToken, // ВАЖНО: не выставляем Content-Type вручную
          },
          body: formData,
        });

        const contentType = res.headers.get("content-type") || "";
        let payload = null;
        try {
          payload = contentType.includes("application/json")
            ? await res.json()
            : await res.text();
        } catch (_) {
          payload = null;
        }

        if (!res.ok) {
          const errText =
            typeof payload === "string"
              ? payload
              : (payload && (payload.message || JSON.stringify(payload))) ||
                "Unknown error";
          throw new Error(`API Error ${res.status}: ${errText}`);
        }

        // Успех
        setMsg("Product added successfully!", true);
        form.reset();
        resetSizeBlocks();
      } catch (error) {
        console.error(error);
        setMsg(error?.message || "Error adding product.", false);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          if ("textContent" in submitBtn && submitBtn.dataset.orig)
            submitBtn.textContent = submitBtn.dataset.orig;
          if (
            "value" in submitBtn &&
            submitBtn.type === "submit" &&
            submitBtn.dataset.orig
          )
            submitBtn.value = submitBtn.dataset.orig;
        }
      }
    });
  } else {
    console.error("Form #addProductForm not found in DOM");
  }
});
