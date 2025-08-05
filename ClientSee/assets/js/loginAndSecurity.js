document
  .getElementById("securityForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    const messageDiv = document.getElementById("message");
    messageDiv.textContent = "";
    messageDiv.style.color = "";

    if ((password || confirmPassword) && password !== confirmPassword) {
      messageDiv.textContent = "Passwords do not match!";
      messageDiv.style.color = "red";
      return;
    }

    // const payload = {};
    // if (username) payload.username = username;
    // if (email) payload.email = email;
    // if (phone) payload.phone = phone;
    // if (password) {
    //   payload.newPassword = password;
    //   payload.confirmPassword = confirmPassword;
    // }

    // if (Object.keys(payload).length === 0) {
    //   messageDiv.textContent = "No changes to update.";
    //   messageDiv.style.color = "gray";
    //   return;
    // }

    // fetch("http://localhost:8080/api/user/update", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: "Bearer " + localStorage.getItem("token"),
    //   },
    //   body: JSON.stringify(payload),
    // })
    //   .then((res) => {
    //     if (!res.ok) {
    //       return res.text().then((text) => {
    //         throw new Error(text || "Update failed");
    //       });
    //     }
    //     return res.text();
    //   })
    //   .then((data) => {
    //     messageDiv.textContent = data || "Changes saved successfully.";
    //     messageDiv.style.color = "green";

    //     document.getElementById("password").value = "";
    //     document.getElementById("confirmPassword").value = "";
    //   })
    //   .catch((err) => {
    //     console.error("Error:", err);
    //     messageDiv.textContent = err.message || "Failed to update data.";
    //     messageDiv.style.color = "red";
    //   });
  });

document.querySelectorAll(".toggle-password").forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const targetId = toggle.getAttribute("data-target");
    const input = document.getElementById(targetId);
    if (!input) return;

    if (input.type === "password") {
      input.type = "text";
      toggle.querySelector(".icon-eye-open").style.display = "inline";
      toggle.querySelector(".icon-eye-closed").style.display = "none";
    } else {
      input.type = "password";
      toggle.querySelector(".icon-eye-open").style.display = "none";
      toggle.querySelector(".icon-eye-closed").style.display = "inline";
    }
  });
});
