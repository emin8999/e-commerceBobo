const recipientSelect = document.getElementById("recipientType");
const conversationList = document.getElementById("conversationList");
const chatMessages = document.getElementById("chatMessages");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendMessageBtn");
const chatHeader = document.getElementById("chatHeader");

let currentRecipient = recipientSelect.value;

let conversations = JSON.parse(localStorage.getItem("conversations")) || {
  admin: [],
  // store: [], // можно добавить позже
};

// Рендер списка разговоров
function renderConversationList() {
  conversationList.innerHTML = "";

  ["admin"].forEach((type) => {
    const li = document.createElement("li");
    li.className =
      "conversation-item" + (type === currentRecipient ? " active" : "");
    li.textContent = type === "admin" ? "Admin" : "Store";
    li.addEventListener("click", () => {
      currentRecipient = type;
      recipientSelect.value = type;
      renderConversationList();
      renderMessages();
    });
    conversationList.appendChild(li);
  });
}

// Рендер сообщений
function renderMessages() {
  chatMessages.innerHTML = "";
  const msgs = conversations[currentRecipient];
  chatHeader.textContent =
    currentRecipient === "admin" ? "Chat with Admin" : "Chat with Store";

  msgs.forEach((msg) => {
    const div = document.createElement("div");
    div.className = "chat-message from-" + msg.from;
    div.textContent = msg.text;
    chatMessages.appendChild(div);
  });

  chatMessages.scrollTop = chatMessages.scrollHeight;
}

sendButton.addEventListener("click", async () => {
  const text = messageInput.value.trim();
  if (!text) return;

  const message = { from: "user", text };

  conversations[currentRecipient].push(message);
  localStorage.setItem("conversations", JSON.stringify(conversations));

  try {
    const response = await fetch("http://127.0.0.1:5500/api/send-message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipient: currentRecipient,
        ...message,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ошибка сервера: ${response.status}`);
    }

    const data = await response.json();
    console.log("Сообщение успешно отправлено:", data);
  } catch (err) {
    console.error("Ошибка при отправке сообщения:", err);
  }

  messageInput.value = "";
  renderMessages();
});

recipientSelect.addEventListener("change", (e) => {
  currentRecipient = e.target.value;
  renderConversationList();
  renderMessages();
});

// async function setCountryName() {
//   try {
//     const res = await fetch("https://ipapi.co/json/");
//     const data = await res.json();
//     if (data && data.country_name) {
//       document.getElementById("countryName").textContent = data.country_name;
//     } else {
//       document.getElementById("countryName").textContent = "Unknown";
//     }
//   } catch (err) {
//     console.error("Ошибка определения страны:", err);
//     document.getElementById("countryName").textContent = "Unknown";
//   }
// }

renderConversationList();
renderMessages();
// setCountryName();
