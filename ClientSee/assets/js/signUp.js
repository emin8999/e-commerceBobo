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

  // Проверка требований к паролю
  function validatePassword(password) {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,}$/;
    return pattern.test(password);
  }

  // Проверка совпадения паролей
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

  // Переключение видимости пароля
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

  // Отправка формы
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const addressValue = form.address.value.trim();
    if (!addressValue) {
      alert("Введите адрес");
      return;
    }

    if (!validatePassword(passwordInput.value)) {
      alert("Пароль не соответствует требованиям.");
      return;
    }

    if (passwordInput.value !== passwordConfirmInput.value) {
      alert("Пароли не совпадают.");
      return;
    }

    // Преобразуем gender к допустимому enum
    let genderValue = form.gender.value.trim().toUpperCase();
    if (!["MALE", "FEMALE", "OTHER"].includes(genderValue)) {
      genderValue = null; // если поле необязательное
    }

    // Формируем объект для отправки
    const formData = {
      name: form.name.value.trim(),
      surname: form.surname.value.trim(),
      phone: form.phone.value.trim(),
      email: form.email.value.trim(),
      password: passwordInput.value,
      confirmPassword: passwordConfirmInput.value,
      gender: genderValue,
      consentMembershipAgreement: form.consent.checked,
      addresses: [
        {
          addresses: addressValue,
          // если есть другие поля в AddressRequestDto, добавьте их здесь
        },
      ],
    };

    console.log("Отправляемые данные (объект):", formData);

    try {
      const response = await fetch(`${API_BASE}/home/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
