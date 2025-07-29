document.addEventListener("DOMContentLoaded", async() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
        document.body.innerHTML = "<h2>Please log in first.</h2>";
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/home/store/info", {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch store info");
        }

        const store = await response.json();

        document.getElementById("storeName").textContent = store.name || "";
        document.getElementById("storeCategory").textContent = store.category || "";
        document.getElementById("storeDescription").textContent = store.location || "";
        document.getElementById("storeLogo").src = store.logo;
        document.getElementById("storeBanner").style.backgroundImage = `url('${store.banner}')`;

        if (store.phone) {
            document.getElementById("storeContact").innerHTML = `📞 Contact: ${store.phone}`;
        }

    } catch (error) {
        console.error(error);
        document.body.innerHTML = "<h2>Store not found or server error</h2>";
    }
});