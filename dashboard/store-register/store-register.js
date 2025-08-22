// document.getElementById("storeRegisterForm").addEventListener("submit", async function(e) {
//     e.preventDefault();

//     const storeName = document.getElementById("storeName").value.trim();
//     const ownerName = document.getElementById("ownerName").value.trim();
//     const email = document.getElementById("email").value.trim();
//     const password = document.getElementById("password").value;
//     const confirmPassword = document.getElementById("confirmPassword").value;
//     const phone = document.getElementById("phone").value.trim();
//     const logoFile = document.getElementById("logo").files[0];
//     const bannerFile = document.getElementById("banner").files[0];
//     const description = document.getElementById("description").value.trim();
//     const category = document.getElementById("category").value;
//     const location = document.getElementById("location").value.trim();
//     const terms = document.getElementById("terms").checked;
//     const errorMsg = document.getElementById("errorMsg");

//     errorMsg.textContent = "";

//     if (password !== confirmPassword) {
//         errorMsg.textContent = "Passwords do not match.";
//         return;
//     }
//     if (!terms) {
//         errorMsg.textContent = "You must agree to the terms and conditions.";
//         return;
//     }

//     const formData = new FormData();
//     formData.append("name", storeName);
//     formData.append("ownerName", ownerName);
//     formData.append("email", email);
//     formData.append("password", password);
//     formData.append("confirmPassword", confirmPassword);
//     formData.append("phone", phone);
//     formData.append("description", description);
//     formData.append("category", category);
//     formData.append("location", location);
//     formData.append("agreedToTerms", terms);

//     if (logoFile) formData.append("logo", logoFile);
//     if (bannerFile) formData.append("banner", bannerFile);

//     try {
//         const response = await fetch("http://localhost:8080/home/store/register", {
//             method: "POST",
//             body: formData,
//         });

//         if (response.ok) {
//             alert("Store registered successfully!");
//             window.location.href = "store-login.html";
//         } else {
//             const errorData = await response.json();
//             errorMsg.textContent = errorData.message || "Registration failed.";
//         }
//     } catch (error) {
//         console.error("Error:", error);
//         errorMsg.textContent = "Server error. Please try again later.";
//     }
// });

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
  data.append(
    "confirmPassword",
    document.getElementById("confirmPassword").value.trim()
  ); // 🔹 подтверждение
  data.append("phone", inputs.phone.value.trim());
  data.append("description", inputs.description.value.trim());
  data.append("category", inputs.category.value.trim());
  data.append("location", inputs.location.value.trim());

  if (inputs.logo.files[0]) data.append("logo", inputs.logo.files[0]);
  if (inputs.banner.files[0]) data.append("banner", inputs.banner.files[0]);

  return data;
}

function logFormData(formData) {
  const entries = {};
  for (let [key, value] of formData.entries()) {
    entries[key] =
      value instanceof File
        ? { name: value.name, type: value.type, size: value.size }
        : value;
  }
  console.log("📤 FormData отправляется:", entries);
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
    logFormData(formData);

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
