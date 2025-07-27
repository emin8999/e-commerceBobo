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
  JSON.stringify([
    {
      describe: "Apple iPhone 15 Pro — 128GB, Titanium",
      price: 1199.99,
      img: "https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/396e9/MainBefore.jpg",
      quantity: 1,
      shipping: 15,
      tax: 8.5,
    },
    {
      describe: "Sony WH-1000XM5 Noise Cancelling Headphones",
      price: 349.99,
      img: "https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/396e9/MainBefore.jpg",
      quantity: 1,
      shipping: 10,
      tax: 5,
    },
    {
      describe: 'Samsung 49" Curved Ultrawide Monitor',
      price: 999.99,
      img: "https://www.bigfootdigital.co.uk/wp-content/uploads/2020/07/image-optimisation-scaled.jpg",
      quantity: 1,
      shipping: 25,
      tax: 12,
    },
    {
      describe: "Mechanical Keyboard — Keychron K8 RGB Wireless",
      price: 89.99,
      img: "https://www.bigfootdigital.co.uk/wp-content/uploads/2020/07/image-optimisation-scaled.jpg",
      quantity: 2,
      shipping: 8,
      tax: 2,
    },
    {
      describe: "Amazon Echo Dot (5th Gen) Smart Speaker",
      price: 49.99,
      img: "https://www.bigfootdigital.co.uk/wp-content/uploads/2020/07/image-optimisation-scaled.jpg",
      quantity: 3,
      shipping: 5,
      tax: 1.5,
    },
    {
      describe: "Amazon Echo Dot (5th Gen) Smart Speaker",
      price: 49.99,
      img: "https://www.bigfootdigital.co.uk/wp-content/uploads/2020/07/image-optimisation-scaled.jpg",
      quantity: 3,
      shipping: 5,
      tax: 1.5,
    },
    {
      describe: "Amazon Echo Dot (5th Gen) Smart Speaker",
      price: 49.99,
      img: "https://www.bigfootdigital.co.uk/wp-content/uploads/2020/07/image-optimisation-scaled.jpg",
      quantity: 3,
      shipping: 5,
      tax: 1.5,
    },
  ])
);

const productJSON = localStorage.getItem("product");
const addressJSON = localStorage.getItem("address");
const products = JSON.parse(productJSON); // массив
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
if (products && Array.isArray(products)) {
  productDiv.innerHTML = products
    .map(
      (product) => `
      <div class="single-product">
        <img src="${product.img}" width="100" />
        <div class="order-item-details">
          <p>Price: USD ${product.price}</p>
          <p>Quantity: ${product.quantity}</p>      
        </div>
      </div>
    `
    )
    .join("");
} else {
  productDiv.textContent = "Информация о товарах не найдена.";
}

const summaryDiv = document.querySelector(".summary-details");
if (products && Array.isArray(products)) {
  let totalItems = 0;
  let totalShipping = 0;
  let totalTax = 0;
  let totalCost = 0;

  products.forEach((product) => {
    totalItems += product.price * product.quantity;
    totalShipping += product.shipping;
    totalTax += product.tax;
  });

  totalCost = totalItems + totalShipping + totalTax;

  summaryDiv.innerHTML = `
    <p>Items: <span>USD ${totalItems.toFixed(2)}</span></p>
    <p>Shipping & handling: <span>USD ${totalShipping.toFixed(2)}</span></p>
    <p>Estimated tax to be collected: <span>USD ${totalTax.toFixed(
      2
    )}</span></p>
    <h3>Order total: <span>USD ${totalCost.toFixed(2)}</span></h3>
  `;
}
