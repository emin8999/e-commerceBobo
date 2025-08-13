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
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const registerButton = document.querySelector(".button-register");
const errorMsg = document.getElementById("errorMsg");

const matchMessage = document.createElement("div");
matchMessage.classList.add("password-match");
confirmPasswordInput.insertAdjacentElement("afterend", matchMessage);

function checkPasswordMatch() {
  const password = passwordInput.value.trim();
  const confirmPassword = confirmPasswordInput.value.trim();

  if (!password && !confirmPassword) {
    matchMessage.textContent = "";
    registerButton.disabled = true;
    return;
  }

  if (password === confirmPassword) {
    matchMessage.textContent = "Passwords match ✅";
    matchMessage.className = "password-match match";
    registerButton.disabled = false;
  } else {
    matchMessage.textContent = "Passwords do not match ❌";
    matchMessage.className = "password-match mismatch";
    registerButton.disabled = true;
  }
}

passwordInput.addEventListener("input", checkPasswordMatch);
confirmPasswordInput.addEventListener("input", checkPasswordMatch);

registerButton.disabled = true;

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorMsg.textContent = "";

  if (passwordInput.value.trim() !== confirmPasswordInput.value.trim()) {
    errorMsg.textContent = "Passwords do not match";
    return;
  }

  const data = {
    storeName: form.storeName.value.trim(),
    ownerName: form.ownerName.value.trim(),
    email: form.email.value.trim(),
    password: passwordInput.value.trim(),
  };

  try {
    const response = await fetch(
      "http://116.203.51.133:8080/home/store/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer YOUR_TOKEN_HERE",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const result = await response.json();
    console.log("Server response:", result);

    alert("Store registered successfully!");
    form.reset();
    matchMessage.textContent = "";
    registerButton.disabled = true;
  } catch (err) {
    console.error(err);
    errorMsg.textContent = "Failed to register store. Please try again.";
  }
});
