document
  .getElementById("storeRegisterForm")
  .addEventListener("submit", async function (e) {
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

    const storeUsers = JSON.parse(localStorage.getItem("storeUsers") || "[]");

    if (storeUsers.some((user) => user.email === email)) {
      errorMsg.textContent = "Email is already registered.";
      return;
    }

    if (
      storeUsers.some(
        (user) => user.storeName.toLowerCase() === storeName.toLowerCase()
      )
    ) {
      errorMsg.textContent = "Store name is already taken.";
      return;
    }

    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

    const logoBase64 = logoFile ? await toBase64(logoFile) : null;
    const bannerBase64 = bannerFile ? await toBase64(bannerFile) : null;

    const newStore = {
      storeId: Date.now().toString(),
      storeName,
      ownerName,
      email,
      password,
      phone,
      logo: logoBase64,
      banner: bannerBase64,
      description,
      category,
      location,
      createdAt: new Date().toISOString(),
    };

    storeUsers.push(newStore);
    localStorage.setItem("storeUsers", JSON.stringify(storeUsers));
    alert("Store registered successfully!");
    window.location.href = "store-login.html";
  });
