document.getElementById("storeRegisterForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const storeName = document.getElementById("storeName").value.trim();
    const ownerName = document.getElementById("ownerName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const phone = document.getElementById("phone").value.trim();
    const logoFile = document.getElementById("logo").files[0];
    const bannerFile = document.getElementById("banner").files[0];
    const description = document.getElementById("description").value.trim();
    const category = document.getElementById("category").value;
    const location = document.getElementById("location").value.trim();
    const terms = document.getElementById("terms").checked;
    const errorMsg = document.getElementById("errorMsg");

    errorMsg.textContent = "";

    if (password !== confirmPassword) {
        errorMsg.textContent = "Passwords do not match.";
        return;
    }
    if (!terms) {
        errorMsg.textContent = "You must agree to the terms and conditions.";
        return;
    }

    const formData = new FormData();
    formData.append("name", storeName);
    formData.append("ownerName", ownerName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);
    formData.append("phone", phone);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("location", location);
    formData.append("agreedToTerms", terms);

    if (logoFile) formData.append("logo", logoFile);
    if (bannerFile) formData.append("banner", bannerFile);

    try {
        const response = await fetch("http://localhost:8080/home/store/register", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            alert("Store registered successfully!");
            window.location.href = "store-login.html";
        } else {
            const errorData = await response.json();
            errorMsg.textContent = errorData.message || "Registration failed.";
        }
    } catch (error) {
        console.error("Error:", error);
        errorMsg.textContent = "Server error. Please try again later.";
    }
});