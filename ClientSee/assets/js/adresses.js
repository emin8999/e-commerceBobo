const Adresses_API_BASE = "http://116.203.51.133:8080/home/user"; // Убрал /addresses из базового URL
const addressListEl = document.querySelector(".list-addresses");
const addForm = document.querySelector(".form-address-add");
const inputs = addForm.querySelectorAll(".form-address-add__input");
let addresses = [];

// Загрузка адресов с сервера
async function loadAddresses() {
  try {
    const res = await fetch(`${Adresses_API_BASE}/addresses`);
    if (!res.ok)
      throw new Error(
        `Ошибка загрузки адресов: ${res.status} ${res.statusText}`
      );
    addresses = await res.json();
    renderAddresses();
  } catch (err) {
    console.error("Ошибка загрузки адресов:", err);
    addresses = [];
    renderAddresses();
  }
}

// Сохранение адреса на сервер
async function addAddress(address) {
  try {
    const res = await fetch(`${Adresses_API_BASE}/addresses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(address),
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Ошибка добавления адреса: ${res.status} ${errText}`);
    }
    await loadAddresses();
  } catch (err) {
    console.error("Ошибка добавления адреса:", err);
  }
}

// Обновление адреса на сервере
async function updateAddress(updated, editBtn, inputElements) {
  try {
    const res = await fetch(`${Adresses_API_BASE}/addresses/${updated.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Ошибка обновления адреса: ${res.status} ${errText}`);
    }
    await loadAddresses();
    // После обновления блокируем поля и меняем кнопку обратно
    inputElements.forEach((i) => (i.disabled = true));
    editBtn.textContent = "Edit";
  } catch (err) {
    console.error("Ошибка обновления адреса:", err);
  }
}

// Удаление адреса на сервере
async function deleteAddress(id) {
  try {
    const res = await fetch(`${Adresses_API_BASE}/addresses/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Ошибка удаления адреса: ${res.status} ${errText}`);
    }
    await loadAddresses();
  } catch (err) {
    console.error("Ошибка удаления адреса:", err);
  }
}

// Создание input для отображения
function createInput(value) {
  const input = document.createElement("input");
  input.type = "text";
  input.value = value;
  input.classList.add("list-addresses__input");
  input.disabled = true;
  return input;
}

// Отрисовка адресов
function renderAddresses() {
  addressListEl.innerHTML = "";
  addresses.forEach(({ id, country, street, city, state, zip }) => {
    const li = document.createElement("li");
    li.classList.add("list-addresses__item");

    const inputsBox = document.createElement("div");
    inputsBox.classList.add("list-addresses__inputs");

    const inputCountry = createInput(country);
    const inputStreet = createInput(street);
    const inputCity = createInput(city);
    const inputState = createInput(state);
    const inputZip = createInput(zip);

    inputsBox.append(
      inputCountry,
      inputStreet,
      inputCity,
      inputState,
      inputZip
    );

    const buttonsBox = document.createElement("div");
    buttonsBox.classList.add("list-addresses__buttons");

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("list-addresses__btn");

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add(
      "list-addresses__btn",
      "list-addresses__delete-btn"
    );

    let isEditing = false;

    editBtn.addEventListener("click", () => {
      if (!isEditing) {
        [inputCountry, inputStreet, inputCity, inputState, inputZip].forEach(
          (i) => (i.disabled = false)
        );
        editBtn.textContent = "Save";
        isEditing = true;
      } else {
        const updated = {
          id,
          country: inputCountry.value.trim(),
          street: inputStreet.value.trim(),
          city: inputCity.value.trim(),
          state: inputState.value.trim(),
          zip: inputZip.value.trim(),
        };
        if (Object.values(updated).some((v) => !v)) {
          alert("All fields are required!");
          return;
        }
        // Передаем элементы и кнопку в updateAddress, чтобы заблокировать после сохранения
        updateAddress(updated, editBtn, [
          inputCountry,
          inputStreet,
          inputCity,
          inputState,
          inputZip,
        ]);
        isEditing = false;
      }
    });

    deleteBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to delete this address?")) {
        deleteAddress(id);
      }
    });

    buttonsBox.append(editBtn, deleteBtn);
    li.append(inputsBox, buttonsBox);
    addressListEl.appendChild(li);
  });
}

// Добавление нового адреса
addForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const [country, street, city, state, zip] = Array.from(inputs).map((i) =>
    i.value.trim()
  );
  if (!country || !street || !city || !state || !zip) {
    alert("Please fill in all fields");
    return;
  }
  addAddress({ country, street, city, state, zip });
  inputs.forEach((i) => (i.value = ""));
  inputs[0].focus();
});

loadAddresses();
