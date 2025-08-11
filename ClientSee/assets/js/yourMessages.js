const recipientSelect = document.getElementById("recipientType");
const conversationList = document.getElementById("conversationList");
const chatMessages = document.getElementById("chatMessages");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendMessageBtn");
const chatHeader = document.getElementById("chatHeader");

let currentRecipient = recipientSelect.value;
let conversations = JSON.parse(localStorage.getItem("conversations")) || {
  admin: [],
  // store: [],
};

function renderConversationList() {
  conversationList.innerHTML = "";
  // ["admin", "store"].forEach((type) => {
  ["admin"].forEach((type) => {
    // оставили только admin
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

sendButton.addEventListener("click", () => {
  const text = messageInput.value.trim();
  if (!text) return;

  conversations[currentRecipient].push({ from: "user", text });
  localStorage.setItem("conversations", JSON.stringify(conversations));

  messageInput.value = "";
  renderMessages();
});

recipientSelect.addEventListener("change", (e) => {
  currentRecipient = e.target.value;
  renderConversationList();
  renderMessages();
});
async function setCountryName() {
  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();

    if (data && data.country_name) {
      document.getElementById("countryName").textContent = data.country_name;
    } else {
      document.getElementById("countryName").textContent = "Unknown";
    }
  } catch (err) {
    console.error("Ошибка определения страны:", err);
    document.getElementById("countryName").textContent = "Unknown";
  }
}

renderConversationList();
renderMessages();
setCountryName();
