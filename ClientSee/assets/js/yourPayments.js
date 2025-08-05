const container = document.querySelector(".payment-container");
const cardNumberInput = container.querySelector(".card-number");
const cardNameInput = container.querySelector(".card-name");
const expMonthSelect = container.querySelector(".exp-month");
const expYearSelect = container.querySelector(".exp-year");
const cancelBtn = container.querySelector(".btn-cancel");
const submitBtn = container.querySelector(".btn-submit");
const cardListDiv = container.querySelector(".card-list");

// Fill month and year
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
  expMonthSelect.selectedIndex = 0;
  expYearSelect.selectedIndex = 0;
}

function addCard() {
  const number = cardNumberInput.value.trim();
  const name = cardNameInput.value.trim();
  const month = expMonthSelect.value;
  const year = expYearSelect.value;

  if (!number || !name) {
    alert("Please fill all fields.");
    return;
  }

  const card = {
    number: "**** **** **** " + number.slice(-4),
    name,
    exp: `${month}/${year}`,
  };

  const cards = JSON.parse(localStorage.getItem("cards")) || [];
  cards.push(card);
  localStorage.setItem("cards", JSON.stringify(cards));

  renderCards();
  resetForm();
}

function renderCards() {
  cardListDiv.innerHTML = "";
  const cards = JSON.parse(localStorage.getItem("cards")) || [];

  cards.forEach((card) => {
    const div = document.createElement("div");
    div.className = "card-item";
    div.innerHTML = `
          <span><strong>Card:</strong> ${card.number}</span>
          <span><strong>Name:</strong> ${card.name}</span>
          <span><strong>Expires:</strong> ${card.exp}</span>
        `;
    cardListDiv.appendChild(div);
  });
}
cardNumberInput.addEventListener("input", () => {
  let value = cardNumberInput.value.replace(/\D/g, "");
  value = value.slice(0, 16);
  const formatted = value.replace(/(\d{4})(?=\d)/g, "$1 ");
  cardNumberInput.value = formatted;
});
submitBtn.addEventListener("click", addCard);
cancelBtn.addEventListener("click", resetForm);

populateSelects();
renderCards();
