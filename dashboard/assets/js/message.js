// Получение элементов DOM
const messageBody = document.getElementById("messageBody");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const applyFilter = document.getElementById("applyFilter");

// Модальное окно
const modal = document.getElementById("messageModal");
const closeModal = document.querySelector(".closeModal");
const modalSubject = document.getElementById("modalSubject");
const modalEmail = document.getElementById("modalEmail");
const modalDate = document.getElementById("modalDate");
const modalText = document.getElementById("modalText");

// Загрузка сообщений из LocalStorage
function loadMessages() {
  const messages = JSON.parse(localStorage.getItem("customerMessages")) || [];
  return messages.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Отображение сообщений в таблице
function displayMessages(messages) {
  messageBody.innerHTML = "";

  messages.forEach((msg) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${msg.id}</td>
      <td>${msg.name}</td>
      <td>${msg.email}</td>
      <td>${msg.subject}</td>
      <td>${new Date(msg.date).toLocaleString()}</td>
      <td>${msg.status}</td>
      <td class="actions">
        <button class="view" onclick='viewMessage(${JSON.stringify(
          msg
        )})'>View</button>
        <a class="reply" href="mailto:${
          msg.email
        }?subject=Re: ${encodeURIComponent(
      msg.subject
    )}" target="_blank">Reply</a>
        <button class="status" onclick='changeStatus("${
          msg.id
        }")'>Mark as Replied</button>
      </td>
    `;

    messageBody.appendChild(row);
  });
}

// Просмотр полного сообщения
function viewMessage(msg) {
  modalSubject.textContent = msg.subject;
  modalEmail.textContent = msg.email;
  modalDate.textContent = new Date(msg.date).toLocaleString();
  modalText.textContent = msg.message;
  modal.classList.add("show");
}

// Закрытие модального окна
closeModal.onclick = () => {
  modal.classList.remove("show");
};

window.onclick = (e) => {
  if (e.target === modal) modal.classList.remove("show");
};

// Фильтрация
applyFilter.addEventListener("click", () => {
  const keyword = searchInput.value.toLowerCase();
  const status = statusFilter.value;
  const all = loadMessages();

  const filtered = all.filter((msg) => {
    const matchKeyword =
      msg.email.toLowerCase().includes(keyword) ||
      msg.subject.toLowerCase().includes(keyword);

    const matchStatus = status ? msg.status === status : true;

    return matchKeyword && matchStatus;
  });

  displayMessages(filtered);
});

// Обновление статуса
function changeStatus(id) {
  const messages = loadMessages();
  const index = messages.findIndex((m) => m.id === id);

  if (index !== -1) {
    messages[index].status = "Replied";
    localStorage.setItem("customerMessages", JSON.stringify(messages));
    displayMessages(messages);
  }
}

// Инициализация
document.addEventListener("DOMContentLoaded", () => {
  const initialMessages = loadMessages();
  displayMessages(initialMessages);
});
