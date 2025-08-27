const API_BASE = "http://116.203.51.133:8080";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addProductForm");
  const wrapper = document.getElementById("sizeQuantitiesWrapper");
  const message = document.getElementById("addProductMessage");
  const storeNameInput = document.getElementById("productStore");
  const submitBtn = form ? form.querySelector('[type="submit"]') : null;

  function setMsg(text, ok = false) {
    if (!message) return;
    message.textContent = text;
    message.style.color = ok ? "green" : "crimson";
  }

  function val(id) {
    const el = document.getElementById(id);
    return el ? el.value : "";
  }

  function decodeJwtPayload(token) {
    try {
      const part = token.split(".")[1];
      const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
      const padded = base64 + "===".slice((base64.length + 3) % 4);
      return JSON.parse(atob(padded));
    } catch {
      return null;
    }
  }

  // ---------- CHECK TOKEN ----------
  const storeJwt = localStorage.getItem("storeJwt");
  if (!storeJwt) {
    window.location.href = "store-login.html";
    return;
  }

  const decodedToken = decodeJwtPayload(storeJwt);
  if (!decodedToken) {
    localStorage.removeItem("storeJwt");
    window.location.href = "store-login.html";
    return;
  }

  const storeName =
    decodedToken.storeName || decodedToken.sub || "Unknown Store";
  if (storeNameInput) storeNameInput.value = storeName;

  // ---------- SIZE BLOCKS ----------
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
      <select name="productSizes" class="size-input">${sizeOptions}</select>
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
        <select name="productSizes" class="size-input">${sizeOptions}</select>
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

  if (wrapper) {
    const addBtn = wrapper.querySelector(".add-size-btn");
    if (addBtn) addBtn.addEventListener("click", addSizeBlock);
    bindAllExistingSizeBlocks();
    updateRemoveButtons();
  }

  // ---------- FORM SUBMIT ----------
  if (!form) return console.error("Form #addProductForm not found in DOM");

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
      const token = localStorage.getItem("storeJwt");
      if (!token) {
        localStorage.removeItem("storeJwt");
        window.location.href = "store-login.html";
        return;
      }

      const name = val("productName").trim();
      if (!name) throw new Error("Укажите название товара.");

      const priceNum = Number(val("productPrice"));
      if (!Number.isFinite(priceNum) || priceNum < 0)
        throw new Error("Цена должна быть числом ≥ 0.");

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", val("productDescription"));
      formData.append("price", priceNum);
      formData.append("category", val("productCategory"));
      formData.append("store", storeNameInput ? storeNameInput.value : "");

      // --- sizeQuantities как отдельные поля ---
      const sizeWrappers = wrapper.querySelectorAll(".size-quantity-wrapper");
      let countSizes = 0;
      sizeWrappers.forEach((blk, index) => {
        const size = blk.querySelector(".size-input")?.value || "";
        const qStr = blk.querySelector(".quantity-input")?.value || "";
        const quantity = Number(qStr);
        if (size && Number.isFinite(quantity) && quantity > 0) {
          formData.append(`sizeQuantities[${countSizes}].size`, size);
          formData.append(`sizeQuantities[${countSizes}].quantity`, quantity);
          countSizes++;
        }
      });

      if (countSizes === 0)
        throw new Error("Укажите хотя бы один размер с количеством > 0.");

      const colorsRaw = val("productColors") || "";
      const colors = colorsRaw
        .split(",")
        .map((c) => c.trim())
        .filter((c) => c.length > 0);
      formData.append("colors", JSON.stringify(colors));

      const imgInput = document.getElementById("productImages");
      if (!imgInput || imgInput.files.length === 0) {
        throw new Error("Загрузите хотя бы одно изображение товара.");
      }

      for (let i = 0; i < imgInput.files.length; i++) {
        formData.append("imageUrls", imgInput.files[i]);
      }
      const res = await fetch(`${API_BASE}/home/product`, {
        method: "POST",
        headers: { Authorization: "Bearer " + token },
        body: formData,
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("storeJwt");
        window.location.href = "store-login.html";
        return;
      }

      let payload;
      const ct = res.headers.get("content-type") || "";
      payload = ct.includes("application/json")
        ? await res.json()
        : await res.text();

      if (!res.ok) {
        const errText =
          typeof payload === "string"
            ? payload
            : (payload && (payload.message || JSON.stringify(payload))) ||
              "Unknown error";
        throw new Error(errText);
      }

      setMsg("Product added successfully!", true);
      form.reset();
      resetSizeBlocks();
    } catch (err) {
      console.error(err);
      setMsg(err?.message || "Error adding product.", false);
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
});
