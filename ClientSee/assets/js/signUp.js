document
  .getElementById("registerForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!validatePassword(password)) {
      alert("Пароль не соответствует требованиям безопасности.");
      return;
    }

    localStorage.setItem("userEmail", email);
    localStorage.setItem("userPassword", password);

    alert("Регистрация прошла успешно!");
    document.getElementById("registerForm").reset();
  });

function validatePassword(password) {
  const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,}$/;
  return pattern.test(password);
}

function signInWithGoogle() {
  alert("Google авторизация пока что демонстрационная :)");
}

const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", () => {
  const isVisible = passwordInput.type === "text";
  passwordInput.type = isVisible ? "password" : "text";
  togglePassword.classList.toggle("fa-eye", isVisible);
  togglePassword.classList.toggle("fa-eye-slash", !isVisible);
});

document
  .getElementById("registerForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const surname = document.getElementById("surname").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const gender = document.getElementById("gender").value;
    const consentChecked = document.getElementById("consent").checked;

    const allFilled = name && surname && phone && address && email && password;

    if (allFilled && !consentChecked) {
      document.getElementById("consentModal").style.display = "block";
      return;
    }

    const formData = {
      name,
      surname,
      phone,
      address,
      email,
      password,
      gender,
    };

    try {
      const response = await fetch("https://your-backend-api.com/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Successfully registered!");
        e.target.reset();
      } else {
        const error = await response.json();
        alert("Error: " + error.message);
      }
    } catch (err) {
      alert("Network error: " + err.message);
    }
  });
