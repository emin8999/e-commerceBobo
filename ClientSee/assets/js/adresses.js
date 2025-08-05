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

  addresses.forEach(({ id, street, city, state, zip }) => {
    const li = document.createElement("li");
    li.classList.add("list-addresses__item");

    const inputsBox = document.createElement("div");
    inputsBox.classList.add("list-addresses__inputs");

    const inputStreet = createInput(street);
    const inputCity = createInput(city);
    const inputState = createInput(state);
    const inputZip = createInput(zip);

    inputsBox.append(inputStreet, inputCity, inputState, inputZip);

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
        [inputStreet, inputCity, inputState, inputZip].forEach(
          (i) => (i.disabled = false)
        );
        editBtn.textContent = "Save";
        isEditing = true;
      } else {
        const updated = {
          id,
          street: inputStreet.value.trim(),
          city: inputCity.value.trim(),
          state: inputState.value.trim(),
          zip: inputZip.value.trim(),
        };

        if (
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

  const street = inputs[0].value.trim();
  const city = inputs[1].value.trim();
  const state = inputs[2].value.trim();
  const zip = inputs[3].value.trim();

  if (!street || !city || !state || !zip) {
    alert("Please fill in all fields");
    return;
  }

  const newAddress = {
    id: generateId(),
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

//  const API_BASE = '/api/addresses';

//     const container = document.querySelector('.page-container');
//     const addressListEl = container.querySelector('.list-addresses');
//     const addForm = container.querySelector('.form-address-add');
//     const newAddressInput = addForm.querySelector('.form-address-add__input');

//     let addresses = [];

//     async function loadAddresses() {
//       try {
//         const res = await fetch(API_BASE);
//         if (!res.ok) throw new Error('Failed to load addresses');
//         addresses = await res.json();
//         renderAddresses();
//       } catch (error) {
//         console.error(error);
//         alert('Could not load addresses from the server.');
//       }
//     }

//     async function updateAddress(id, newStreet) {
//       try {
//         const res = await fetch(`${API_BASE}/${id}`, {
//           method: 'PUT',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ street: newStreet }),
//         });
//         if (!res.ok) throw new Error('Failed to update address');
//       } catch (error) {
//         console.error(error);
//         alert('Could not update the address.');
//       }
//     }

//     async function addAddress(street) {
//       try {
//         const res = await fetch(API_BASE, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ street }),
//         });
//         if (!res.ok) throw new Error('Failed to add address');
//         const newAddress = await res.json();
//         addresses.push(newAddress);
//         renderAddresses();
//       } catch (error) {
//         console.error(error);
//         alert('Could not add the address.');
//       }
//     }

//     async function deleteAddress(id) {
//       try {
//         const res = await fetch(`${API_BASE}/${id}`, {
//           method: 'DELETE',
//         });
//         if (!res.ok) throw new Error('Failed to delete address');
//         addresses = addresses.filter(addr => addr.id !== id);
//         renderAddresses();
//       } catch (error) {
//         console.error(error);
//         alert('Could not delete the address.');
//       }
//     }

//     function renderAddresses() {
//       addressListEl.innerHTML = '';

//       addresses.forEach(({ id, street }) => {
//         const li = document.createElement('li');
//         li.classList.add('list-addresses__item');

//         const input = document.createElement('input');
//         input.type = 'text';
//         input.value = street;
//         input.classList.add('list-addresses__input');
//         input.disabled = true;

//         const editBtn = document.createElement('button');
//         editBtn.textContent = 'Edit';
//         editBtn.classList.add('list-addresses__btn');

//         const deleteBtn = document.createElement('button');
//         deleteBtn.textContent = 'Delete';
//         deleteBtn.classList.add('list-addresses__btn', 'list-addresses__delete-btn');

//         let isEditing = false;

//         editBtn.addEventListener('click', () => {
//           if (!isEditing) {
//             input.disabled = false;
//             input.focus();
//             editBtn.textContent = 'Save';
//             isEditing = true;
//           } else {
//             const newVal = input.value.trim();
//             if (!newVal) {
//               alert('Address cannot be empty');
//               input.focus();
//               return;
//             }
//             input.disabled = true;
//             editBtn.textContent = 'Edit';
//             isEditing = false;
//             updateAddress(id, newVal);
//             const addrIndex = addresses.findIndex(a => a.id === id);
//             if (addrIndex > -1) addresses[addrIndex].street = newVal;
//           }
//         });

//         deleteBtn.addEventListener('click', () => {
//           if (confirm('Are you sure you want to delete this address?')) {
//             deleteAddress(id);
//           }
//         });

//         li.appendChild(input);
//         li.appendChild(editBtn);
//         li.appendChild(deleteBtn);
//         addressListEl.appendChild(li);
//       });
//     }

//     addForm.addEventListener('submit', e => {
//       e.preventDefault();
//       const newStreet = newAddressInput.value.trim();
//       if (!newStreet) return alert('Please enter an address');
//       addAddress(newStreet);
//       newAddressInput.value = '';
//       newAddressInput.focus();
//     });

//     loadAddresses();
