const logoutBtn = document.querySelector(".logout-btn");

logoutBtn.addEventListener("click", async () => {
  try {
    const token = localStorage.getItem("jwtToken");

    const response = await fetch(
      "http://116.203.51.133:8080/home/admin/logout",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ logout: true }),
      }
    );

    if (response.ok) {
      console.log("Logout successful");
      localStorage.removeItem("jwtToken");
      window.location.href = "../../index.html";
    } else {
      const errorData = await response.json();
      console.error("Logout failed:", errorData);
    }
  } catch (error) {
    console.error("Network error:", error);
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("jwtToken");

  if (!token) {
    window.location.href = "../../index.html";
  }
});
