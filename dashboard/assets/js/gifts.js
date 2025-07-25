// ----- Select Elements -----
const giftTableBody = document.querySelector("#giftTable tbody");
const giftForm = document.getElementById("giftForm");
const addGiftBtn = document.getElementById("addGiftBtn");
const giftModal = document.getElementById("giftModal");
const closeModalBtn = document.querySelector(".closeModal");
const statusFilter = document.getElementById("statusFilter");
const storeFilter = document.getElementById("storeFilter");

// ----- Load from LocalStorage -----
let gifts = JSON.parse(localStorage.getItem("gifts")) || [];

// ----- Render Functions -----
function renderGifts() {
  giftTableBody.innerHTML = "";
  const filtered = gifts.filter((g) => {
    const storeMatch =
      storeFilter.value === "" || g.store === storeFilter.value;
    const statusMatch =
      statusFilter.value === "" || getGiftStatus(g) === statusFilter.value;
    return storeMatch && statusMatch;
  });

  if (filtered.length === 0) {
    giftTableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;">No gifts found</td></tr>`;
    return;
  }

  filtered.forEach((gift) => {
    const tr = document.createElement("tr");

    const status = getGiftStatus(gift);
    tr.innerHTML = `
      <td>${gift.name}</td>
      <td><img src="${gift.image}" alt="gift" width="60"/></td>
      <td>$${gift.condition.minOrder}</td>
      <td>${gift.condition.category}</td>
      <td>${gift.store}</td>
      <td class="status-${status.toLowerCase()}">${status}</td>
      <td>${new Date(gift.expiresAt).toLocaleDateString()}</td>
    `;
    giftTableBody.appendChild(tr);
  });
}

// ----- Get Gift Status -----
function getGiftStatus(gift) {
  const now = new Date();
  return new Date(gift.expiresAt) >= now ? "Active" : "Expired";
}

// ----- Populate Store Filter Options -----
function populateStoreOptions() {
  const stores = [...new Set(gifts.map((g) => g.store))];
  storeFilter.innerHTML = `<option value="">All Stores</option>`;
  stores.forEach((store) => {
    const option = document.createElement("option");
    option.value = store;
    option.textContent = store;
    storeFilter.appendChild(option);
  });
}

// ----- Show/Hide Modal -----
addGiftBtn.addEventListener("click", () => {
  giftModal.classList.add("show");
});

closeModalBtn.addEventListener("click", () => {
  giftModal.classList.remove("show");
});

window.addEventListener("click", (e) => {
  if (e.target === giftModal) {
    giftModal.classList.remove("show");
  }
});

// ----- Handle Form Submit -----
giftForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("giftName").value;
  const image = document.getElementById("giftImage").files[0];
  const minOrder = parseFloat(document.getElementById("giftMinOrder").value);
  const category = document.getElementById("giftCategory").value;
  const expiresAt = document.getElementById("giftExpiresAt").value;
  const store = document.getElementById("giftStore").value;
  const active = document.getElementById("giftActive").checked;

  if (!image) {
    alert("Please upload an image.");
    return;
  }

  const reader = new FileReader();
  reader.onloadend = function () {
    const gift = {
      giftId: "gift_" + Date.now(),
      name,
      image: reader.result,
      condition: {
        minOrder,
        category,
      },
      store,
      active,
      expiresAt,
    };

    gifts.push(gift);
    localStorage.setItem("gifts", JSON.stringify(gifts));
    giftModal.classList.remove("show");
    giftForm.reset();
    renderGifts();
    populateStoreOptions();
  };

  reader.readAsDataURL(image);
});

// ----- Filter Events -----
statusFilter.addEventListener("change", renderGifts);
storeFilter.addEventListener("change", renderGifts);

// ----- Initial Load -----
renderGifts();
populateStoreOptions();
