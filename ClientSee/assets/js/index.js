// const defaultSlides = [
//   {
//     img: "./assets/Img/images.jpg",
//     title: "Start Shopping",
//     btnText: "View",
//   },
//   {
//     img: "./assets/Img/images.jpg",
//     title: "Join Us",
//     btnText: "Learn More",
//   },
//   {
//     img: "./assets/Img/images.jpg",
//     title: "See New Arrivals",
//     btnText: "Buy Now",
//   },
// ];

// const defaultCategories = [
//   { title: "Clothing", icon: "👗" },
//   { title: "Footwear", icon: "👟" },
//   { title: "Electronics", icon: "📱" },
//   { title: "Groceries", icon: "🛒" },
//   { title: "Books", icon: "📚" },
//   { title: "Toys", icon: "🧸" },
//   { title: "Jewelry", icon: "💍" },
//   { title: "Tech", icon: "💻" },
//   { title: "Cosmetics", icon: "💄" },
//   { title: "Furniture", icon: "🛋️" },
//   { title: "Auto Products", icon: "🚗" },
//   { title: "Home & Garden", icon: "🏡" },
//   { title: "Sports", icon: "🏀" },
//   { title: "Health", icon: "🩺" },
//   { title: "Music", icon: "🎧" },
//   { title: "Movies", icon: "🎬" },
//   { title: "Photography", icon: "📷" },
//   { title: "Gifts", icon: "🎁" },
//   { title: "Pets", icon: "🐶" },
//   { title: "Baby", icon: "🍼" },
//   { title: "Tourism", icon: "🏕️" },
//   { title: "Stationery", icon: "✏️" },
//   { title: "Tools", icon: "🛠️" },
//   { title: "Games", icon: "🎮" },
//   { title: "Accessories", icon: "🧢" },
// ];

// const defaultFeatured = [
//   {
//     title: "Smartwatch",
//     label: "🔥 New",
//     image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400",
//   },
//   {
//     title: "Headphones",
//     label: "⭐ Top",
//     image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400",
//   },
//   {
//     title: "Wireless Speaker",
//     label: "💥 Discount",
//     image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400",
//   },
//   {
//     title: "Fitness Bracelet",
//     label: "🔥 New",
//     image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400",
//   },
//   {
//     title: "Electric Scooter",
//     label: "⭐ Top",
//     image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400",
//   },
//   {
//     title: "LED Lamp",
//     label: "💥 Discount",
//     image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400",
//   },
//   {
//     title: "Coffee Maker",
//     label: "🔥 New",
//     image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400",
//   },
//   {
//     title: "Gaming Mouse",
//     label: "⭐ Top",
//     image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400",
//   },
// ];

// const defaultDiscountProducts = [
//   {
//     id: 1,
//     title: "Smartwatch",
//     discount: 20,
//     oldPrice: 120,
//     image: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=400",
//   },
//   {
//     id: 2,
//     title: "Headphones",
//     discount: 25,
//     oldPrice: 80,
//     image: "https://images.unsplash.com/photo-1580894894513-f99b87890c6b?w=400",
//   },
//   {
//     id: 3,
//     title: "Laptop",
//     discount: 15,
//     oldPrice: 850,
//     image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
//   },
//   {
//     id: 4,
//     title: "Smartphone",
//     discount: 30,
//     oldPrice: 600,
//     image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
//   },
//   {
//     id: 5,
//     title: "Camera",
//     discount: 10,
//     oldPrice: 500,
//     image: "https://images.unsplash.com/photo-1519183071298-a2962be96c8e?w=400",
//   },
// ];

// // --- Функция загрузки ---
// async function fetchData(url) {
//   try {
//     const res = await fetch(url);
//     if (!res.ok) throw new Error(`Ошибка загрузки: ${res.status}`);
//     return await res.json();
//   } catch (error) {
//     console.warn("Ошибка запроса, используем дефолтные данные", error);
//     return null;
//   }
// }

// // --- Функции рендеринга (как в предыдущем ответе) ---
// function formatUSD(price) {
//   return `$${price.toFixed(2)}`;
// }

// function renderHeroSlides(slidesData) {
//   const wrapper = document.getElementById("hero-slides-wrapper");
//   wrapper.innerHTML = "";
//   slidesData.forEach(({ img, title, btnText }) => {
//     const slideEl = document.createElement("div");
//     slideEl.classList.add("swiper-slide");
//     slideEl.innerHTML = `
//       <img src="${img}" alt="${title}" />
//       <div class="slide-content">
//         <h1>${title}</h1>
//         <button class="cta-btn">${btnText}</button>
//       </div>
//     `;
//     wrapper.appendChild(slideEl);
//   });
// }

// function renderCategories(categories) {
//   const sliderWrapper = document.getElementById("categorySlider");
//   sliderWrapper.innerHTML = "";
//   categories.forEach((cat, i) => {
//     const slide = document.createElement("div");
//     slide.className = "swiper-slide";
//     slide.innerHTML = `
//       <div class="category-card" style="animation-delay: ${i * 0.05}s">
//         <div class="icon" style="font-size: 36px">${cat.icon}</div>
//         <h3>${cat.title}</h3>
//       </div>
//     `;
//     sliderWrapper.appendChild(slide);
//   });
//   const emptySlide = document.createElement("div");
//   emptySlide.className = "swiper-slide";
//   emptySlide.style.minWidth = "30px";
//   sliderWrapper.appendChild(emptySlide);
// }

// function renderFeaturedProducts(featured) {
//   const featSlider = document.getElementById("featuredSlider");
//   featSlider.innerHTML = "";
//   featured.forEach((item, i) => {
//     const card = document.createElement("div");
//     card.className = "featured-card";
//     card.style.animationDelay = `${i * 0.05}s`;
//     card.innerHTML = `
//       <span class="label">${item.label}</span>
//       <img src="${item.image}" alt="${item.title}" />
//       <h3>${item.title}</h3>
//     `;
//     featSlider.appendChild(card);
//   });
// }

// function renderDiscountProducts(products) {
//   const discountsSlider = document.getElementById("discountsSlider");
//   discountsSlider.innerHTML = "";

//   products.forEach((product) => {
//     const newPrice = product.oldPrice * (1 - product.discount / 100);
//     const card = document.createElement("div");
//     card.className = "discount-card";
//     card.innerHTML = `
//       <img src="${product.image}" alt="${product.title}" />
//       <h4>${product.title}</h4>
//       <div class="price-block">
//         <span class="old-price">${formatUSD(product.oldPrice)}</span>
//         <span class="new-price">${formatUSD(newPrice)}</span>
//       </div>
//       <span class="discount-label">Скидка: ${product.discount}%</span>
//     `;
//     discountsSlider.appendChild(card);
//   });
// }

// // --- Инициализация слайдеров и логики (как в предыдущем ответе) ---
// function initSliders() {
//   // Hero
//   new Swiper(".hero-swiper", {
//     loop: true,
//     autoplay: { delay: 5000, disableOnInteraction: false },
//     navigation: { nextEl: ".next", prevEl: ".prev" },
//     effect: "fade",
//     fadeEffect: { crossFade: true },
//   });

//   // Категории
//   new Swiper(".category-swiper", {
//     slidesPerView: "auto",
//     spaceBetween: 20,
//     freeMode: true,
//     mousewheel: true,
//     grabCursor: true,
//     breakpoints: {
//       0: { slidesPerView: 2.2 },
//       480: { slidesPerView: 3 },
//       768: { slidesPerView: 4 },
//       1024: { slidesPerView: 6 },
//       1280: { slidesPerView: 8 },
//     },
//   });

//   // Рекомендуемые товары (прокрутка колесом)
//   const featSlider = document.getElementById("featuredSlider");
//   let featPage = 0;
//   const getCardsPerPage = () => {
//     const w = window.innerWidth;
//     if (w >= 1280) return 6;
//     if (w >= 1024) return 5;
//     if (w >= 768) return 4;
//     if (w >= 480) return 3;
//     return 4;
//   };
//   const featCardsPerPage = getCardsPerPage();

//   function updateFeaturedSlider() {
//     const offset = featPage * (200 + 20) * featCardsPerPage;
//     featSlider.style.transform = `translateX(-${offset}px)`;
//   }

//   let wheelTimeoutProd;
//   const debounceWheelProd = (callback, delay = 300) => {
//     if (wheelTimeoutProd) clearTimeout(wheelTimeoutProd);
//     wheelTimeoutProd = setTimeout(callback, delay);
//   };

//   document.querySelector(".featured-slider-wrapper").addEventListener(
//     "wheel",
//     (e) => {
//       e.preventDefault();
//       debounceWheelProd(() => {
//         const maxPage = Math.ceil(
//           featSlider.children.length / featCardsPerPage
//         );
//         if (e.deltaY > 0 || e.deltaX > 0) {
//           featPage = featPage + 1 >= maxPage ? 0 : featPage + 1;
//         } else {
//           featPage = featPage === 0 ? maxPage - 1 : featPage - 1;
//         }
//         updateFeaturedSlider();
//       }, 200);
//     },
//     { passive: false }
//   );

//   // Скидочные товары — прокрутка колесом
//   const discountsSlider = document.getElementById("discountsSlider");
//   discountsSlider.addEventListener("wheel", (e) => {
//     e.preventDefault();
//     const scrollAmount = 270 * 3;
//     const maxScrollLeft =
//       discountsSlider.scrollWidth - discountsSlider.clientWidth;

//     if (e.deltaY > 0) {
//       if (
//         Math.ceil(discountsSlider.scrollLeft + scrollAmount) >= maxScrollLeft
//       ) {
//         discountsSlider.scrollTo({ left: 0, behavior: "smooth" });
//       } else {
//         discountsSlider.scrollLeft += scrollAmount;
//       }
//     } else {
//       discountsSlider.scrollLeft -= scrollAmount;
//     }
//   });
// }

// // Таймер обратного отсчёта
// function startCountdown(targetDate) {
//   const countdownEl = document.getElementById("countdown");

//   function updateCountdown() {
//     const now = new Date();
//     const diff = targetDate - now;

//     if (diff <= 0) {
//       countdownEl.textContent = "Акция завершена!";
//       clearInterval(intervalId);
//       return;
//     }

//     const days = Math.floor(diff / (1000 * 60 * 60 * 24));
//     const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
//     const minutes = Math.floor((diff / (1000 * 60)) % 60);
//     const seconds = Math.floor((diff / 1000) % 60);

//     countdownEl.textContent = `${days}д ${hours}ч ${minutes}м ${seconds}с`;
//   }

//   updateCountdown();
//   const intervalId = setInterval(updateCountdown, 1000);
// }

// // --- Главная инициализация страницы ---
// async function initPage() {
//   // Пытаемся загрузить с сервера, если не выходит — используем дефолтные данные
//   const heroSlides = (await fetchData("/api/heroSlides")) || defaultSlides;
//   const categories = (await fetchData("/api/categories")) || defaultCategories;
//   const featuredProducts =
//     (await fetchData("/api/featuredProducts")) || defaultFeatured;
//   const discountProducts =
//     (await fetchData("/api/discountProducts")) || defaultDiscountProducts;

//   renderHeroSlides(heroSlides);
//   renderCategories(categories);
//   renderFeaturedProducts(featuredProducts);
//   renderDiscountProducts(discountProducts);

//   initSliders();

//   const endDate = new Date();
//   endDate.setDate(endDate.getDate() + 2);
//   startCountdown(endDate);
// }

// document.addEventListener("DOMContentLoaded", initPage);

const API_BASE = "http://116.203.51.133:8080";
const ENDPOINTS = {
  hero: `${API_BASE}/homepage/hero`,
  categories: `${API_BASE}/homepage/categories`,
  featured: `${API_BASE}/homepage/featured`,
  discounts: `${API_BASE}/homepage/discounts`,
};

/* ================== FALLBACK ДАННЫЕ (как у тебя) ================== */
const defaultSlides = [
  {
    img: "./assets/Img/images.jpg",
    title: "Start Shopping",
    btnText: "View",
  },
  {
    img: "./assets/Img/images.jpg",
    title: "Join Us",
    btnText: "Learn More",
  },
  {
    img: "./assets/Img/images.jpg",
    title: "See New Arrivals",
    btnText: "Buy Now",
  },
];
const defaultCategories = [
  { title: "Clothing", icon: "👗" },
  { title: "Footwear", icon: "👟" },
  { title: "Electronics", icon: "📱" },
  { title: "Groceries", icon: "🛒" },
  { title: "Books", icon: "📚" },
  { title: "Toys", icon: "🧸" },
  { title: "Jewelry", icon: "💍" },
  { title: "Tech", icon: "💻" },
  { title: "Cosmetics", icon: "💄" },
  { title: "Furniture", icon: "🛋️" },
  { title: "Auto Products", icon: "🚗" },
  { title: "Home & Garden", icon: "🏡" },
  { title: "Sports", icon: "🏀" },
  { title: "Health", icon: "🩺" },
  { title: "Music", icon: "🎧" },
  { title: "Movies", icon: "🎬" },
  { title: "Photography", icon: "📷" },
  { title: "Gifts", icon: "🎁" },
  { title: "Pets", icon: "🐶" },
  { title: "Baby", icon: "🍼" },
  { title: "Tourism", icon: "🏕️" },
  { title: "Stationery", icon: "✏️" },
  { title: "Tools", icon: "🛠️" },
  { title: "Games", icon: "🎮" },
  { title: "Accessories", icon: "🧢" },
];

const defaultFeatured = [
  {
    title: "Smartwatch",
    label: "🔥 New",
    image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400",
  },
  {
    title: "Headphones",
    label: "⭐ Top",
    image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400",
  },
  {
    title: "Wireless Speaker",
    label: "💥 Discount",
    image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400",
  },
  {
    title: "Fitness Bracelet",
    label: "🔥 New",
    image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400",
  },
  {
    title: "Electric Scooter",
    label: "⭐ Top",
    image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400",
  },
  {
    title: "LED Lamp",
    label: "💥 Discount",
    image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400",
  },
  {
    title: "Coffee Maker",
    label: "🔥 New",
    image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400",
  },
  {
    title: "Gaming Mouse",
    label: "⭐ Top",
    image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400",
  },
  {
    title: "Headphones",
    label: "⭐ Top",
    image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400",
  },
  {
    title: "Wireless Speaker",
    label: "💥 Discount",
    image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400",
  },
  {
    title: "Fitness Bracelet",
    label: "🔥 New",
    image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400",
  },
  {
    title: "Electric Scooter",
    label: "⭐ Top",
    image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400",
  },
  {
    title: "LED Lamp",
    label: "💥 Discount",
    image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400",
  },
  {
    title: "Coffee Maker",
    label: "🔥 New",
    image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400",
  },
  {
    title: "Gaming Mouse",
    label: "⭐ Top",
    image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400",
  },
  {
    title: "Headphones",
    label: "⭐ Top",
    image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400",
  },
  {
    title: "Wireless Speaker",
    label: "💥 Discount",
    image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400",
  },
  {
    title: "Fitness Bracelet",
    label: "🔥 New",
    image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400",
  },
  {
    title: "Electric Scooter",
    label: "⭐ Top",
    image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400",
  },
  {
    title: "LED Lamp",
    label: "💥 Discount",
    image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400",
  },
  {
    title: "Coffee Maker",
    label: "🔥 New",
    image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400",
  },
  {
    title: "Gaming Mouse",
    label: "⭐ Top",
    image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400",
  },
  {
    title: "Headphones",
    label: "⭐ Top",
    image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400",
  },
  {
    title: "Wireless Speaker",
    label: "💥 Discount",
    image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400",
  },
  {
    title: "Fitness Bracelet",
    label: "🔥 New",
    image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400",
  },
  {
    title: "Electric Scooter",
    label: "⭐ Top",
    image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400",
  },
  {
    title: "LED Lamp",
    label: "💥 Discount",
    image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400",
  },
  {
    title: "Coffee Maker",
    label: "🔥 New",
    image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400",
  },
  {
    title: "Gaming Mouse",
    label: "⭐ Top",
    image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400",
  },
];
const defaultDiscountProducts = [
  {
    id: 1,
    title: "Smartwatch",
    discount: 20,
    oldPrice: 120,
    image: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=400",
  },
  {
    id: 2,
    title: "Headphones",
    discount: 25,
    oldPrice: 80,
    image: "https://images.unsplash.com/photo-1580894894513-f99b87890c6b?w=400",
  },
  {
    id: 3,
    title: "Laptop",
    discount: 15,
    oldPrice: 850,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
  },
  {
    id: 4,
    title: "Smartphone",
    discount: 30,
    oldPrice: 600,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
  },
  {
    id: 5,
    title: "Camera",
    discount: 10,
    oldPrice: 500,
    image: "https://images.unsplash.com/photo-1519183071298-a2962be96c8e?w=400",
  },

  // 🔽 Новые товары
  {
    id: 6,
    title: "Wireless Keyboard",
    discount: 18,
    oldPrice: 70,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400",
  },
  {
    id: 7,
    title: "Gaming Mouse",
    discount: 22,
    oldPrice: 50,
    image: "https://images.unsplash.com/photo-1589571894960-20bbe2828d0a?w=400",
  },
  {
    id: 8,
    title: "Tablet",
    discount: 12,
    oldPrice: 300,
    image: "https://images.unsplash.com/photo-1587829741301-c504e3e0f276?w=400",
  },
  {
    id: 9,
    title: "Bluetooth Speaker",
    discount: 28,
    oldPrice: 120,
    image: "https://images.unsplash.com/photo-1589561084283-930aa7b1ce50?w=400",
  },
  {
    id: 10,
    title: "Drone",
    discount: 20,
    oldPrice: 900,
    image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400",
  },
  {
    id: 11,
    title: "Smart Glasses",
    discount: 15,
    oldPrice: 250,
    image: "https://images.unsplash.com/photo-1581368129689-94a04b7b04a7?w=400",
  },
  {
    id: 12,
    title: "External Hard Drive",
    discount: 25,
    oldPrice: 100,
    image: "https://images.unsplash.com/photo-1612817159949-195b6eb9a0ab?w=400",
  },
  {
    id: 13,
    title: "Portable Charger",
    discount: 30,
    oldPrice: 60,
    image: "https://images.unsplash.com/photo-1593011958529-07e5f9df6e28?w=400",
  },
  {
    id: 14,
    title: "Mechanical Keyboard",
    discount: 20,
    oldPrice: 110,
    image: "https://images.unsplash.com/photo-1585079542156-2755d9c5d5c1?w=400",
  },
  {
    id: 15,
    title: "VR Headset",
    discount: 18,
    oldPrice: 400,
    image: "https://images.unsplash.com/photo-1626378734322-01b1d69d0b94?w=400",
  },
  {
    id: 16,
    title: "Fitness Tracker",
    discount: 22,
    oldPrice: 90,
    image: "https://images.unsplash.com/photo-1554475909-682c4a0f1b7c?w=400",
  },
  {
    id: 17,
    title: "E-Book Reader",
    discount: 10,
    oldPrice: 150,
    image: "https://images.unsplash.com/photo-1589820296156-2454bb8e9e0f?w=400",
  },
  {
    id: 18,
    title: "Smart Home Hub",
    discount: 17,
    oldPrice: 200,
    image: "https://images.unsplash.com/photo-1587574293445-61a98b19c217?w=400",
  },
  {
    id: 19,
    title: "Gaming Console",
    discount: 25,
    oldPrice: 500,
    image: "https://images.unsplash.com/photo-1606813907291-d86efa0d0c77?w=400",
  },
  {
    id: 20,
    title: "Smart Light Bulb",
    discount: 35,
    oldPrice: 40,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400",
  },
  {
    id: 21,
    title: "Coffee Maker",
    discount: 20,
    oldPrice: 180,
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400",
  },
  {
    id: 22,
    title: "Action Camera",
    discount: 15,
    oldPrice: 300,
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400",
  },
  {
    id: 23,
    title: "Electric Scooter",
    discount: 12,
    oldPrice: 800,
    image: "https://images.unsplash.com/photo-1615397349754-2b6e67a3a065?w=400",
  },
  {
    id: 24,
    title: "Projector",
    discount: 18,
    oldPrice: 450,
    image: "https://images.unsplash.com/photo-1509822929063-6b6cfc9b42f2?w=400",
  },
  {
    id: 25,
    title: "Air Purifier",
    discount: 22,
    oldPrice: 220,
    image: "https://images.unsplash.com/photo-1606811841689-5d5e9d5b2de3?w=400",
  },
];

/* ================== HELPERS ================== */
async function fetchJSON(url) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}
const money = (n) => `$${Number(n).toFixed(2)}`;

function getCardsPerPage(base = 4) {
  const w = window.innerWidth;
  if (w < 480) return 2;
  if (w < 768) return 3;
  if (w < 1024) return base;
  if (w < 1280) return base + 2;
  return base + 4;
}

/* ================== HERO SLIDER ================== */
async function initHero() {
  // пробуем сервер → fallback на localStorage → fallback на defaultSlides
  let slides = defaultSlides;
  try {
    slides = await fetchJSON(ENDPOINTS.hero);
    if (!Array.isArray(slides) || !slides.length)
      throw new Error("bad hero payload");
    localStorage.setItem("heroSlides", JSON.stringify(slides));
  } catch {
    slides =
      JSON.parse(localStorage.getItem("heroSlides") || "null") || defaultSlides;
  }

  const wrapper = document.getElementById("hero-slides-wrapper");
  wrapper.innerHTML = "";
  slides.forEach(({ img, title, btnText }) => {
    const slideEl = document.createElement("div");
    slideEl.classList.add("swiper-slide");
    slideEl.innerHTML = `
      <img src="${img}" alt="${title}" />
      <div class="slide-content">
        <h1>${title}</h1>
        <button class="cta-btn">${btnText}</button>
      </div>
    `;
    wrapper.appendChild(slideEl);
  });

  new Swiper(".hero-swiper", {
    loop: true,
    autoplay: { delay: 5000, disableOnInteraction: false },
    navigation: { nextEl: ".next", prevEl: ".prev" },
    effect: "fade",
    fadeEffect: { crossFade: true },
  });
}

/* ================== CATEGORIES SLIDER ================== */
let catSwiper; // сохраним, чтобы управлять свайпом жестами
async function initCategories() {
  let categories = defaultCategories;
  try {
    categories = await fetchJSON(ENDPOINTS.categories);
    if (!Array.isArray(categories) || !categories.length)
      throw new Error("bad categories");
    localStorage.setItem("categories", JSON.stringify(categories));
  } catch {
    categories =
      JSON.parse(localStorage.getItem("categories") || "null") ||
      defaultCategories;
  }

  const sliderWrapper = document.getElementById("categorySlider");
  sliderWrapper.innerHTML = "";
  categories.forEach((cat, i) => {
    const slide = document.createElement("div");
    slide.className = "swiper-slide";
    slide.innerHTML = `
      <div class="category-card" style="animation-delay:${i * 0.05}s">
        <div class="icon" style="font-size:36px">${cat.icon}</div>
        <h3>${cat.title}</h3>
      </div>
    `;
    sliderWrapper.appendChild(slide);
  });

  // добавляем 2 пустых слайда
  for (let i = 0; i < 3; i++) {
    const emptySlide = document.createElement("div");
    emptySlide.className = "swiper-slide";
    emptySlide.style.minWidth = "30px";
    sliderWrapper.appendChild(emptySlide);
  }

  catSwiper = new Swiper(".category-swiper", {
    slidesPerView: "auto",
    spaceBetween: 20,
    freeMode: true,
    mousewheel: true,
    grabCursor: true,
    breakpoints: {
      0: { slidesPerView: 2.2 },
      480: { slidesPerView: 3 },
      768: { slidesPerView: 4 },
      1024: { slidesPerView: 6 },
      1280: { slidesPerView: 8 },
    },
  });

  // touch swipe support (жесты на оболочке)
  addSwipeSupport(
    document.querySelector(".category-slider-wrapper"),
    () => catSwiper?.slideNext(),
    () => catSwiper?.slidePrev()
  );
}

/* ================== FEATURED GRID (страницы по ширине) ================== */
let featPage = 0;
function updateFeaturedSlider() {
  const featSlider = document.getElementById("featuredSlider");
  const featCardsPerPage = getCardsPerPage(4);
  const cardWidth = 200;
  const gap = 20;
  const offset = featPage * (cardWidth + gap) * featCardsPerPage;
  featSlider.style.transform = `translateX(-${offset}px)`;
}

async function initFeatured() {
  let featured = defaultFeatured;
  try {
    featured = await fetchJSON(ENDPOINTS.featured);
    if (!Array.isArray(featured) || !featured.length)
      throw new Error("bad featured");
    localStorage.setItem("featuredProducts", JSON.stringify(featured));
  } catch {
    featured =
      JSON.parse(localStorage.getItem("featuredProducts") || "null") ||
      defaultFeatured;
  }

  const featWrapper = document.getElementById("featuredSlider");
  featWrapper.innerHTML = "";

  featured.forEach((item, i) => {
    const slide = document.createElement("div");
    slide.className = "swiper-slide";
    slide.innerHTML = `
      <div class="featured-card" style="animation-delay:${i * 0.05}s">
        <span class="label">${item.label}</span>
        <img src="${item.image}" alt="${item.title}" />
        <h3>${item.title}</h3>
      </div>
    `;
    featWrapper.appendChild(slide);
  });

  // добавляем 2 пустых слайда в конце (для отступа)
  for (let i = 0; i < 2; i++) {
    const emptySlide = document.createElement("div");
    emptySlide.className = "swiper-slide";
    emptySlide.style.minWidth = "30px";
    featWrapper.appendChild(emptySlide);
  }

  // инициализация Swiper
  const featSwiper = new Swiper(".featured-swiper", {
    slidesPerView: "auto",
    spaceBetween: 20,
    freeMode: true,
    mousewheel: true,
    grabCursor: true,
    breakpoints: {
      0: { slidesPerView: 2.2 },
      480: { slidesPerView: 3 },
      768: { slidesPerView: 4 },
      1024: { slidesPerView: 5 },
      1280: { slidesPerView: 6 },
    },
  });

  // свайпы по оболочке
  addSwipeSupport(
    document.querySelector(".featured-slider-wrapper"),
    () => featSwiper?.slideNext(),
    () => featSwiper?.slidePrev()
  );
}

/* ================== DISCOUNTS H-SCROLLER ================== */
function formatUSD(price) {
  return `$${Number(price).toFixed(2)}`;
}
async function initDiscounts() {
  let products = defaultDiscountProducts;
  try {
    products = await fetchJSON(ENDPOINTS.discounts);
    if (!Array.isArray(products) || !products.length)
      throw new Error("bad discounts");
    localStorage.setItem("discountProducts", JSON.stringify(products));
  } catch {
    products =
      JSON.parse(localStorage.getItem("discountProducts") || "null") ||
      defaultDiscountProducts;
  }

  const discountsWrapper = document.getElementById("discountsSlider");
  discountsWrapper.innerHTML = "";

  products.forEach((product, i) => {
    const newPrice =
      Number(product.oldPrice) * (1 - Number(product.discount) / 100);

    const slide = document.createElement("div");
    slide.className = "swiper-slide";
    slide.innerHTML = `
      <div class="discount-card" style="animation-delay:${i * 0.05}s">
        <img src="${product.image}" alt="${product.title}" />
        <h4>${product.title}</h4>
        <div class="price-block">
          <span class="old-price">${formatUSD(product.oldPrice)}</span>
          <span class="new-price">${formatUSD(newPrice)}</span>
        </div>
        <span class="discount-label">Discount: ${product.discount}%</span>
      </div>
    `;
    discountsWrapper.appendChild(slide);
  });

  // 2 пустых слайда для отступа
  for (let i = 0; i < 2; i++) {
    const emptySlide = document.createElement("div");
    emptySlide.className = "swiper-slide";
    emptySlide.style.minWidth = "30px";
    discountsWrapper.appendChild(emptySlide);
  }

  // инициализация Swiper
  const discountsSwiper = new Swiper(".discounts-swiper", {
    slidesPerView: "auto",
    spaceBetween: 20,
    freeMode: true,
    mousewheel: true,
    grabCursor: true,
    breakpoints: {
      0: { slidesPerView: 1.2 },
      480: { slidesPerView: 2 },
      768: { slidesPerView: 3 },
      1024: { slidesPerView: 4 },
      1280: { slidesPerView: 5 },
    },
  });

  // свайпы на оболочке
  addSwipeSupport(
    document.querySelector(".discounts-slider-wrapper"),
    () => discountsSwiper?.slideNext(),
    () => discountsSwiper?.slidePrev()
  );
}

/* ================== COUNTDOWN (как у тебя) ================== */
function startCountdown(targetDate) {
  const countdownEl = document.getElementById("countdown");
  function updateCountdown() {
    const now = new Date();
    const diff = targetDate - now;
    if (diff <= 0) {
      countdownEl.textContent = "Акция завершена!";
      clearInterval(intervalId);
      return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    countdownEl.textContent = `${days}д ${hours}ч ${minutes}м ${seconds}с`;
  }
  updateCountdown();
  const intervalId = setInterval(updateCountdown, 1000);
}

/* ================== TOUCH SWIPE SUPPORT (общая) ================== */
function addSwipeSupport(wrapper, onSwipeLeft, onSwipeRight) {
  if (!wrapper) return;
  let touchStartX = 0;
  let touchEndX = 0;
  wrapper.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });
  wrapper.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const swipeDistance = touchEndX - touchStartX;
    if (Math.abs(swipeDistance) < 50) return;
    if (swipeDistance < 0) onSwipeLeft?.();
    else onSwipeRight?.();
  });
}

/* ================== INIT ================== */
(async function initHome() {
  await Promise.all([
    initHero(),
    initCategories(),
    initFeatured(),
    initDiscounts(),
  ]);
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 2);
  startCountdown(endDate);
})();
