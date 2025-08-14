const form = document.querySelector(".payment-container");
const cardNumberInput = form.querySelector(".card-number");
const cardCvvInput = form.querySelector(".card-cvv");
const expMonthSelect = form.querySelector(".exp-month");
const expYearSelect = form.querySelector(".exp-year");
const cancelBtn = form.querySelector(".btn-cancel");
const cardListDiv = form.querySelector(".card-list");

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
  form.reset();
}

async function addCard(e) {
  e.preventDefault(); // предотвращаем перезагрузку страницы

  const formData = new FormData(form);
  const number = formData.get("cardNumber").replace(/\s/g, "").trim();
  const name = formData.get("cardName").trim();
  const cvv = formData.get("cardCvv").trim();
  const month = formData.get("expMonth");
  const year = formData.get("expYear");

  // Валидация
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

  // Сохраняем в localStorage
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

  // Отправка на бэк
  try {
    const response = await fetch("/api/add-card", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cardNumber: number,
        cardName: name,
        expMonth: month,
        expYear: year,
        cvv,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
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

// Форматирование номера карты
cardNumberInput.addEventListener("input", () => {
  let value = cardNumberInput.value.replace(/\D/g, "");
  value = value.slice(0, 16);
  const formatted = value.replace(/(\d{4})(?=\d)/g, "$1 ");
  cardNumberInput.value = formatted;
});

// Форматирование CVV
cardCvvInput.addEventListener("input", () => {
  cardCvvInput.value = cardCvvInput.value.replace(/\D/g, "").slice(0, 3);
});

// Обработчики
form.addEventListener("submit", addCard);
cancelBtn.addEventListener("click", resetForm);

populateSelects();
renderCards();
