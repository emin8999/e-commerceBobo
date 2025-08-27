if (typeof API_BASE === "undefined") {
  var API_BASE = "http://116.203.51.133:8080";
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const passwordInput = document.getElementById("password");
  const passwordConfirmInput = document.getElementById("passwordConfirm");
  const passwordValidation = document.getElementById("passwordValidation");
  const passwordMatch = document.getElementById("passwordMatch");
  const togglePassword = document.getElementById("togglePassword");
  const togglePasswordConfirm = document.getElementById(
    "togglePasswordConfirm"
  );

  // ===== Проверка пароля на сложность =====
  function validatePassword(password) {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,}$/;
    return pattern.test(password);
  }

  // ===== Проверка совпадения паролей =====
  function checkPasswordMatch() {
    if (!passwordConfirmInput.value) {
      passwordMatch.textContent = "";
      return;
    }
    if (passwordInput.value === passwordConfirmInput.value) {
      passwordMatch.textContent = "Passwords match";
      passwordMatch.style.color = "green";
    } else {
      passwordMatch.textContent = "Passwords do not match";
      passwordMatch.style.color = "red";
    }
  }

  passwordInput.addEventListener("input", () => {
    if (validatePassword(passwordInput.value)) {
      passwordValidation.textContent = "Password meets requirements";
      passwordValidation.style.color = "green";
    } else {
      passwordValidation.textContent = "Password does not meet requirements";
      passwordValidation.style.color = "red";
    }
    checkPasswordMatch();
  });

  passwordConfirmInput.addEventListener("input", checkPasswordMatch);

  // ===== Иконки глаза =====
  function toggleVisibility(input, toggle) {
    toggle.addEventListener("click", () => {
      const isVisible = input.type === "text";
      input.type = isVisible ? "password" : "text";
      toggle.classList.toggle("fa-eye", isVisible);
      toggle.classList.toggle("fa-eye-slash", !isVisible);
    });
  }

  toggleVisibility(passwordInput, togglePassword);
  toggleVisibility(passwordConfirmInput, togglePasswordConfirm);

  // ===== Отправка формы в виде массива =====
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validatePassword(passwordInput.value)) {
      alert("Пароль не соответствует требованиям.");
      return;
    }

    if (passwordInput.value !== passwordConfirmInput.value) {
      alert("Пароли не совпадают.");
      return;
    }

    // Формируем массив данных
    const formArray = [
      { field: "name", value: form.name.value.trim() },
      { field: "surname", value: form.surname.value.trim() },
      { field: "phone", value: form.phone.value.trim() },
      { field: "addresses", value: form.address.value.trim() },
      { field: "email", value: form.email.value.trim() },
      { field: "password", value: passwordInput.value },
      { field: "confirmPassword", value: passwordConfirmInput.value },
      { field: "gender", value: form.gender.value },
      { field: "consentMembershipAgreement", value: form.consent.checked },
    ];

    // ===== Вывод в консоль =====
    console.log("Отправляемые данные (массив):", formArray);

    const jsonToSend = JSON.stringify(formArray);
    console.log("JSON для отправки на бэк:", jsonToSend);

    try {
      const response = await fetch(`${API_BASE}/home/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: jsonToSend,
      });

      const text = await response.text();

      if (response.ok) {
        const data = text ? JSON.parse(text) : null;
        console.log("Ответ сервера:", data);
        alert("Регистрация прошла успешно!");
        form.reset();
        passwordValidation.textContent = "";
        passwordMatch.textContent = "";
      } else {
        const errorData = text ? JSON.parse(text) : null;
        console.error("Ошибка сервера:", errorData);
        alert(
          "Ошибка при регистрации: " +
            (errorData?.message || response.statusText)
        );
      }
    } catch (error) {
      console.error("Ошибка сети:", error);
      alert("Ошибка сети. Попробуйте еще раз.");
    }
  });
});
