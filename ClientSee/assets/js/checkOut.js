localStorage.setItem(
  "address",
  JSON.stringify({
    name: "Рустам Керимли",
    address: "Баку,Азербайджан,AZ1029, ул. Низами, 45",
    number: "+994 50 123 45 67",
  })
);
localStorage.setItem(
  "product",
  JSON.stringify({
    desribe:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
    price: 199.99,
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjb2PWBap8ebZtngZvUNxkL1FI2UfMQWVv3Q&s",
    quantity: 3,
    shipping: 20.25,
    tax: 5,
  })
);
const productJSON = localStorage.getItem("product");
const addressJSON = localStorage.getItem("address");
const product = JSON.parse(productJSON);
const address = JSON.parse(addressJSON);
const addressDiv = document.querySelector(".address-details");
if (address) {
  addressDiv.innerHTML = `
       <strong>${address.name}</strong><br />
                ${address.address}<br />
                Phone number: ${address.number} 
      `;
} else {
  addressDiv.textContent = "Адрес не найден.";
}
const productDiv = document.querySelector(".order-item");
if (product) {
  productDiv.innerHTML = `
        <img src="${product.img}" />
                <div class="order-item-details">
                 ${product.desribe}<br />
                </div>
      `;
} else {
  productDiv.textContent = "Информация о товаре не найдена.";
}
const summaryDiv = document.querySelector(".summary-details");
if (product) {
  const total =
    product.price * product.quantity + product.shipping + product.tax;
  summaryDiv.innerHTML = `
        <p>Items: <span>USD ${product.price}</span></p>
              <p>Shipping & handling: <span>USD ${product.shipping}</span></p>
              <p>Estimated tax to be collected: <span>USD ${product.tax}</span></p>
              <h3>Order total: <span>USD ${total}</span></h3>
      `;
}
