const addressListEl = document.querySelector(".list-addresses");
const addForm = document.querySelector(".form-address-add");
const inputs = addForm.querySelectorAll(".form-address-add__input");

let addresses = [];

function loadAddresses() {
  const stored = localStorage.getItem("addresses");
  addresses = stored ? JSON.parse(stored) : [];
  renderAddresses();
}

function saveAddresses() {
  localStorage.setItem("addresses", JSON.stringify(addresses));
}

function generateId() {
  return "_" + Math.random().toString(36).substr(2, 9);
}

function createInput(value) {
  const input = document.createElement("input");
  input.type = "text";
  input.value = value;
  input.classList.add("list-addresses__input");
  input.disabled = true;
  return input;
}

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

        if (
          !updated.country ||
          !updated.street ||
          !updated.city ||
          !updated.state ||
          !updated.zip
        ) {
          alert("All fields are required!");
          return;
        }

        const index = addresses.findIndex((a) => a.id === id);
        if (index !== -1) {
          addresses[index] = updated;
          saveAddresses();
          renderAddresses();
        }
      }
    });

    deleteBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to delete this address?")) {
        addresses = addresses.filter((a) => a.id !== id);
        saveAddresses();
        renderAddresses();
      }
    });

    buttonsBox.append(editBtn, deleteBtn);
    li.append(inputsBox, buttonsBox);
    addressListEl.appendChild(li);
  });
}

addForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const country = inputs[0].value.trim();
  const street = inputs[1].value.trim();
  const city = inputs[2].value.trim();
  const state = inputs[3].value.trim();
  const zip = inputs[4].value.trim();

  if (!country || !street || !city || !state || !zip) {
    alert("Please fill in all fields");
    return;
  }

  const newAddress = {
    id: generateId(),
    country,
    street,
    city,
    state,
    zip,
  };

  addresses.push(newAddress);
  saveAddresses();
  renderAddresses();

  inputs.forEach((i) => (i.value = ""));
  inputs[0].focus();
});

loadAddresses();
