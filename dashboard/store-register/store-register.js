const form = document.getElementById("storeRegisterForm");

const inputs = {
  password: document.getElementById("password"),
  confirmPassword: document.getElementById("confirmPassword"),
  storeName: document.getElementById("storeName"),
  ownerName: document.getElementById("ownerName"),
  email: document.getElementById("email"),
  phone: document.getElementById("phone"),
  description: document.getElementById("description"),
  category: document.getElementById("category"),
  location: document.getElementById("location"),
  logo: document.getElementById("logo"),
  banner: document.getElementById("banner"),
};

const registerBtn = document.querySelector(".button-register");
const errorMsg = document.getElementById("errorMsg");

const matchMessage = document.createElement("div");
matchMessage.classList.add("password-match");
inputs.confirmPassword.insertAdjacentElement("afterend", matchMessage);

function updatePasswordStatus() {
  const pwd = inputs.password.value.trim();
  const confirmPwd = inputs.confirmPassword.value.trim();

  if (!pwd && !confirmPwd) {
    matchMessage.textContent = "";
    registerBtn.disabled = true;
    return;
  }

  const isMatch = pwd === confirmPwd;
  matchMessage.textContent = isMatch
    ? "Passwords match ✅"
    : "Passwords do not match ❌";
  matchMessage.className = `password-match ${isMatch ? "match" : "mismatch"}`;
  registerBtn.disabled = !isMatch;
}

inputs.password.addEventListener("input", updatePasswordStatus);
inputs.confirmPassword.addEventListener("input", updatePasswordStatus);
registerBtn.disabled = true;

function buildFormData() {
  const data = new FormData();

  data.append("storeName", inputs.storeName.value.trim());
  data.append("ownerName", inputs.ownerName.value.trim());
  data.append("email", inputs.email.value.trim());
  data.append("password", inputs.password.value.trim());
  data.append("confirmPassword", inputs.confirmPassword.value.trim());
  data.append("phone", inputs.phone.value.trim());
  data.append("description", inputs.description.value.trim());
  data.append("category", inputs.category.value.trim());
  data.append("location", inputs.location.value.trim());

  if (inputs.logo.files[0]) {
    data.append("logo", inputs.logo.files[0]);
  }
  if (inputs.banner.files[0]) {
    data.append("banner", inputs.banner.files[0]);
  }

  data.append("agreedToTerms", document.getElementById("terms").checked);

  data.forEach((value, key) => {
    console.log(key, value, typeof value);
  });

  return data;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorMsg.textContent = "";

  if (inputs.password.value.trim() !== inputs.confirmPassword.value.trim()) {
    errorMsg.textContent = "Passwords do not match";
    return;
  }

  try {
    const formData = buildFormData();

    const response = await fetch(
      "http://116.203.51.133:8080/home/store/register",
      { method: "POST", body: formData }
    );

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    let result;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      result = await response.json();
    } else {
      result = await response.text();
    }

    console.log("✅ Ответ от сервера:", result);

    alert("Store registered successfully!");
    form.reset();
    matchMessage.textContent = "";
    registerBtn.disabled = true;

    inputs.logo.value = "";
    inputs.banner.value = "";
  } catch (err) {
    console.error("❌ Ошибка при регистрации:", err);
    errorMsg.textContent =
      err.message || "Failed to register store. Please try again.";
  }
});
