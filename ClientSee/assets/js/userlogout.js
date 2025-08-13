const logoutButton = document.getElementById("logoutButton");
const LOGOUT_API = "http://116.203.51.133:8080/home/auth/logout";
const REDIRECT_TO = "/login.html"; // измените на нужный путь

logoutButton.addEventListener("click", handleLogout);

async function handleLogout() {
  try {
    // Отправка запроса на API
    const response = await fetch(LOGOUT_API, {
      method: "POST", // если API требует GET, меняем здесь
      credentials: "include", // если нужно отправлять куки
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Ошибка при логауте: ${response.status}`);
    }

    // Очистка токенов / данных
    localStorage.clear();
    sessionStorage.clear();

    // Редирект на страницу входа
    window.location.href = REDIRECT_TO;
  } catch (error) {
    console.error("Logout error:", error);
    alert("Не удалось выйти. Попробуйте снова.");
  }
}
