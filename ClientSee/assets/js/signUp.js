getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = {
    name: form.name.value.trim(),
    surname: form.surname.value.trim(),
    phone: form.phone.value.trim(),
    address: form.address.value.trim(),
    email: form.email.value.trim(),
    password: form.password.value,
    gender: form.gender.value,
    consent: form.consent.checked,
  };

  try {
    const response = await fetch(
      "http://116.203.51.133:8080/home/auth/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    );

    const text = await response.text();

    if (response.ok) {
      const data = text ? JSON.parse(text) : null;
      console.log("Успех:", data);
      alert("Регистрация прошла успешно!");
      form.reset();
    } else {
      const errorData = text ? JSON.parse(text) : null;
      console.error("Ошибка сервера:", errorData);
      alert(
        "Ошибка при регистрации: " + (errorData?.message || response.statusText)
      );
    }
  } catch (error) {
    console.error("Ошибка сети:", error);
    alert("Ошибка сети. Попробуйте еще раз.");
  }
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
