const container = document.querySelector(".payment-container");
const cardNumberInput = container.querySelector(".card-number");
const cardNameInput = container.querySelector(".card-name");
const cardCvvInput = container.querySelector(".card-cvv");
const expMonthSelect = container.querySelector(".exp-month");
const expYearSelect = container.querySelector(".exp-year");
const cancelBtn = container.querySelector(".btn-cancel");
const submitBtn = container.querySelector(".btn-submit");
const cardListDiv = container.querySelector(".card-list");

function populateSelects() {
  for (let i = 1; i <= 12; i++) {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = i.toString().padStart(2, "0");
    expMonthSelect.appendChild(opt);
  }

  const currentYear = new Date().getFullYear();
  for (let i = 0; i < 15; i++) {
    const year = currentYear + i;
    const opt = document.createElement("option");
    opt.value = year;
    opt.textContent = year;
    expYearSelect.appendChild(opt);
  }
}

function resetForm() {
  cardNumberInput.value = "";
  cardNameInput.value = "";
  cardCvvInput.value = "";
  expMonthSelect.selectedIndex = 0;
  expYearSelect.selectedIndex = 0;
}

async function addCard() {
  const number = cardNumberInput.value.replace(/\s/g, "").trim();
  const name = cardNameInput.value.trim();
  const cvv = cardCvvInput.value.trim();
  const month = expMonthSelect.value;
  const year = expYearSelect.value;

  if (!number || !name || !cvv) {
    alert("Please fill all fields.");
    return;
  }

  if (number.length < 13 || number.length > 16 || !/^\d+$/.test(number)) {
    alert("Card number must be 13–16 digits.");
    return;
  }

  if (cvv.length !== 3 || !/^\d{3}$/.test(cvv)) {
    alert("CVV must be exactly 3 digits.");
    return;
  }

  const card = {
    id: Date.now(),
    number: "**** **** **** " + number.slice(-4),
    name,
    exp: `${month}/${year}`,
    cvv: "***",
  };

  const cards = JSON.parse(localStorage.getItem("cards")) || [];
  cards.push(card);
  localStorage.setItem("cards", JSON.stringify(cards));

  try {
    await fetch("/api/add-card", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        number,
        name,
        expMonth: month,
        expYear: year,
        cvv,
      }),
    });
  } catch (err) {
    console.error("Error sending card data:", err);
  }

  renderCards();
  resetForm();
}

function deleteCard(id) {
  if (!confirm("Are you sure you want to delete this card?")) return;
  let cards = JSON.parse(localStorage.getItem("cards")) || [];
  cards = cards.filter((card) => card.id !== id);
  localStorage.setItem("cards", JSON.stringify(cards));
  renderCards();
}

function renderCards() {
  cardListDiv.innerHTML = "";
  const cards = JSON.parse(localStorage.getItem("cards")) || [];

  if (cards.length === 0) {
    cardListDiv.innerHTML = "<p>No cards added yet.</p>";
    return;
  }

  cards.forEach((card) => {
    const div = document.createElement("div");
    div.className = "card-item";
    div.innerHTML = `
      <span><strong>Card:</strong> ${card.number}</span>
      <span><strong>Name:</strong> ${card.name}</span>
      <span><strong>Expires:</strong> ${card.exp}</span>
      <span><strong>CVV:</strong> ${card.cvv}</span>
      <button class="btn-delete">Delete</button>
    `;
    div
      .querySelector(".btn-delete")
      .addEventListener("click", () => deleteCard(card.id));
    cardListDiv.appendChild(div);
  });
}

cardNumberInput.addEventListener("input", () => {
  let value = cardNumberInput.value.replace(/\D/g, "");
  value = value.slice(0, 16);
  const formatted = value.replace(/(\d{4})(?=\d)/g, "$1 ");
  cardNumberInput.value = formatted;
});

cardCvvInput.addEventListener("input", () => {
  cardCvvInput.value = cardCvvInput.value.replace(/\D/g, "").slice(0, 3);
});

submitBtn.addEventListener("click", addCard);
cancelBtn.addEventListener("click", resetForm);

populateSelects();
renderCards();
