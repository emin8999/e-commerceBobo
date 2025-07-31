const slidesDataExample = [
  {
    img: "./assets/Img/sliderImg.jpg",
    title: "Начать покупки",
    btnText: "Посмотреть",
  },
  {
    img: "./assets/Img/sliderImg2.jpg",
    title: "Присоединиться",
    btnText: "Узнать больше",
  },
  {
    img: "./assets/Img/sliderImg.jpg",
    title: "Посмотреть новинки",
    btnText: "Купить сейчас",
  },
];

if (!localStorage.getItem("heroSlides")) {
  localStorage.setItem("heroSlides", JSON.stringify(slidesDataExample));
}

const sliderWrapper = document.querySelector(".slider-wrapper");

let slidesData = JSON.parse(localStorage.getItem("heroSlides")) || [];

function createSlide({ img, title, btnText }, isActive = false) {
  const slide = document.createElement("div");
  slide.classList.add("slide");
  if (isActive) slide.classList.add("active");

  slide.innerHTML = `
      <img src="${img}" alt="${title}" />
      <div class="slide-content">
        <h1>${title}</h1>
        <button class="cta-btn">${btnText}</button>
      </div>
    `;
  return slide;
}

sliderWrapper.innerHTML = "";
slidesData.forEach((slideData, index) => {
  sliderWrapper.appendChild(createSlide(slideData, index === 0));
});

const slides = document.querySelectorAll(".slide");
let current = 0;

function showSlide(index) {
  slides.forEach((slide) => slide.classList.remove("active"));
  slides[index].classList.add("active");
}

function nextSlide() {
  current = (current + 1) % slides.length;
  showSlide(current);
}

function prevSlide() {
  current = (current - 1 + slides.length) % slides.length;
  showSlide(current);
}

document.querySelector(".next").addEventListener("click", nextSlide);
document.querySelector(".prev").addEventListener("click", prevSlide);

showSlide(0);
current = 0;

setInterval(nextSlide, 5000);

const defaultCategories = [
  { title: "Одежда", icon: "👗" },
  { title: "Обувь", icon: "👟" },
  { title: "Электроника", icon: "📱" },
  { title: "Продукты", icon: "🛒" },
  { title: "Книги", icon: "📚" },
  { title: "Игрушки", icon: "🧸" },
  { title: "Украшения", icon: "💍" },
  { title: "Техника", icon: "💻" },
  { title: "Косметика", icon: "💄" },
  { title: "Мебель", icon: "🛋️" },
  { title: "Автотовары", icon: "🚗" },
  { title: "Дом и сад", icon: "🏡" },
  { title: "Спорт", icon: "🏀" },
  { title: "Здоровье", icon: "🩺" },
  { title: "Музыка", icon: "🎧" },
  { title: "Фильмы", icon: "🎬" },
  { title: "Фото", icon: "📷" },
  { title: "Подарки", icon: "🎁" },
  { title: "Питомцы", icon: "🐶" },
  { title: "Детское", icon: "🍼" },
  { title: "Туризм", icon: "🏕️" },
  { title: "Канцтовары", icon: "✏️" },
  { title: "Инструменты", icon: "🛠️" },
  { title: "Игры", icon: "🎮" },
  { title: "Аксессуары", icon: "🧢" },
];

if (!localStorage.getItem("categories")) {
  localStorage.setItem("categories", JSON.stringify(defaultCategories));
}

const categories = JSON.parse(localStorage.getItem("categories"));
const slider = document.getElementById("categorySlider");

categories.forEach((cat, i) => {
  const card = document.createElement("div");
  card.className = "category-card";
  card.style.animationDelay = `${i * 0.05}s`;
  card.innerHTML = `
    <div class="icon" style="font-size: 36px">${cat.icon}</div>
    <h3>${cat.title}</h3>
  `;
  slider.appendChild(card);
});

let currentPage = 0;
const cardsPerPage = 5;

function updateSliderPosition() {
  const offset = currentPage * (150 + 20) * cardsPerPage;
  slider.style.transition = "transform 0.6s ease-in-out";
  slider.style.transform = `translateX(-${offset}px)`;
}

let wheelTimeout;
const debounceWheel = (callback, delay = 300) => {
  if (wheelTimeout) clearTimeout(wheelTimeout);
  wheelTimeout = setTimeout(callback, delay);
};

document.querySelector(".category-slider-wrapper").addEventListener(
  "wheel",
  (e) => {
    e.preventDefault();

    debounceWheel(() => {
      if (e.deltaY > 0 || e.deltaX > 0) {
        const maxPage = Math.floor(categories.length / cardsPerPage);
        currentPage = currentPage + 1 >= maxPage ? 0 : currentPage + 1;
      } else {
        const maxPage = Math.floor(categories.length / cardsPerPage);
        currentPage = currentPage === 0 ? maxPage - 1 : currentPage - 1;
      }
      updateSliderPosition();
    }, 200);
  },
  { passive: false }
);

const defaultFeatured = [
  {
    title: "Смарт-часы",
    label: "🔥 New",
    image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400",
  },
  {
    title: "Наушники",
    label: "⭐ Top",
    image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400",
  },
  {
    title: "Беспроводная колонка",
    label: "💥 Discount",
    image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400",
  },
  {
    title: "Фитнес-браслет",
    label: "🔥 New",
    image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400",
  },
  {
    title: "Электросамокат",
    label: "⭐ Top",
    image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400",
  },
  {
    title: "LED-лампа",
    label: "💥 Discount",
    image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400",
  },
  {
    title: "Кофеварка",
    label: "🔥 New",
    image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400",
  },
  {
    title: "Игровая мышь",
    label: "⭐ Top",
    image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400",
  },
  {
    title: "Смарт-часы",
    label: "🔥 New",
    image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400",
  },
  {
    title: "Наушники",
    label: "⭐ Top",
    image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400",
  },
  {
    title: "Беспроводная колонка",
    label: "💥 Discount",
    image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400",
  },
  {
    title: "Фитнес-браслет",
    label: "🔥 New",
    image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400",
  },
  {
    title: "Электросамокат",
    label: "⭐ Top",
    image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400",
  },
  {
    title: "LED-лампа",
    label: "💥 Discount",
    image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400",
  },
  {
    title: "Кофеварка",
    label: "🔥 New",
    image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400",
  },
  {
    title: "Игровая мышь",
    label: "⭐ Top",
    image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400",
  },
];

if (!localStorage.getItem("featuredProducts")) {
  localStorage.setItem("featuredProducts", JSON.stringify(defaultFeatured));
}

const featured = JSON.parse(localStorage.getItem("featuredProducts"));
const featSlider = document.getElementById("featuredSlider");

featured.forEach((item, i) => {
  const card = document.createElement("div");
  card.className = "featured-card";
  card.style.animationDelay = `${i * 0.05}s`;
  card.innerHTML = `
    <span class="label">${item.label}</span>
    <img src="${item.image}" alt="${item.title}" />
    <h3>${item.title}</h3>
  `;
  featSlider.appendChild(card);
});

let featPage = 0;
const featCardsPerPage = 4;

function updateFeaturedSlider() {
  const offset = featPage * (200 + 20) * featCardsPerPage;
  featSlider.style.transform = `translateX(-${offset}px)`;
}

// Прокрутка колесом мыши
let wheelTimeoutProd;
const debounceWheelProd = (callback, delay = 300) => {
  if (wheelTimeoutProd) clearTimeout(wheelTimeoutProd);
  wheelTimeoutProd = setTimeout(callback, delay);
};

document.querySelector(".featured-slider-wrapper").addEventListener(
  "wheel",
  (e) => {
    e.preventDefault();
    debounceWheelProd(() => {
      const maxPage = Math.floor(featured.length / featCardsPerPage);
      if (e.deltaY > 0 || e.deltaX > 0) {
        featPage = featPage + 1 >= maxPage ? 0 : featPage + 1;
      } else {
        featPage = featPage === 0 ? maxPage - 1 : featPage - 1;
      }
      updateFeaturedSlider();
    }, 200);
  },
  { passive: false }
);
// 20 товаров с рабочими картинками и ценами
const defaultDiscountProducts = [
  {
    id: 1,
    title: "Смарт-часы",
    discount: 20,
    oldPrice: 120,
    image: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=400",
  },
  {
    id: 2,
    title: "Наушники",
    discount: 25,
    oldPrice: 80,
    image: "https://images.unsplash.com/photo-1580894894513-f99b87890c6b?w=400",
  },
  {
    id: 3,
    title: "Ноутбук",
    discount: 15,
    oldPrice: 850,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
  },
  {
    id: 4,
    title: "Смартфон",
    discount: 30,
    oldPrice: 600,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
  },
  {
    id: 5,
    title: "Фотоаппарат",
    discount: 10,
    oldPrice: 500,
    image: "https://images.unsplash.com/photo-1519183071298-a2962be96c8e?w=400",
  },
  {
    id: 6,
    title: "Геймпад",
    discount: 15,
    oldPrice: 70,
    image: "https://images.unsplash.com/photo-1587202372775-98973f833cb3?w=400",
  },
  {
    id: 7,
    title: "Монитор",
    discount: 20,
    oldPrice: 300,
    image: "https://images.unsplash.com/photo-1587206661348-06c9be2a84d7?w=400",
  },
  {
    id: 8,
    title: "Клавиатура",
    discount: 10,
    oldPrice: 60,
    image: "https://images.unsplash.com/photo-1587202372616-2f6ca1697a07?w=400",
  },
  {
    id: 9,
    title: "Мышка",
    discount: 12,
    oldPrice: 40,
    image: "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?w=400",
  },
  {
    id: 10,
    title: "Умная колонка",
    discount: 25,
    oldPrice: 90,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400",
  },
  {
    id: 11,
    title: "Пауэрбанк",
    discount: 18,
    oldPrice: 50,
    image: "https://images.unsplash.com/photo-1592307480634-45d939b5082d?w=400",
  },
  {
    id: 12,
    title: "Планшет",
    discount: 22,
    oldPrice: 300,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
  },
  {
    id: 13,
    title: "Телевизор",
    discount: 30,
    oldPrice: 1000,
    image: "https://images.unsplash.com/photo-1580910051073-daa4a1c12cda?w=400",
  },
  {
    id: 14,
    title: "Фитнес-браслет",
    discount: 17,
    oldPrice: 100,
    image: "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?w=400",
  },
  {
    id: 15,
    title: "Bluetooth колонка",
    discount: 19,
    oldPrice: 65,
    image: "https://images.unsplash.com/photo-1593805571331-3a9e3f2cf7d3?w=400",
  },
  {
    id: 16,
    title: "Игровая консоль",
    discount: 28,
    oldPrice: 600,
    image: "https://images.unsplash.com/photo-1606813908982-8941586c6c9b?w=400",
  },
  {
    id: 17,
    title: "Проектор",
    discount: 14,
    oldPrice: 400,
    image: "https://images.unsplash.com/photo-1586943350684-738498cb8825?w=400",
  },
  {
    id: 18,
    title: "Веб-камера",
    discount: 16,
    oldPrice: 90,
    image: "https://images.unsplash.com/photo-1611186871348-b2b6f6e9f9a0?w=400",
  },
  {
    id: 19,
    title: "Очки VR",
    discount: 35,
    oldPrice: 200,
    image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400",
  },
  {
    id: 20,
    title: "Роутер",
    discount: 13,
    oldPrice: 70,
    image: "https://images.unsplash.com/photo-1611571289373-dce94dca5fcf?w=400",
  },
];

// Сохраняем в localStorage
if (!localStorage.getItem("discountProducts")) {
  localStorage.setItem(
    "discountProducts",
    JSON.stringify(defaultDiscountProducts)
  );
}

const discountsSlider = document.getElementById("discountsSlider");
const products = JSON.parse(localStorage.getItem("discountProducts"));

// Формат в долларах
function formatUSD(price) {
  return `$${price.toFixed(2)}`;
}

// Отрисовка карточек
products.forEach((product) => {
  const newPrice = product.oldPrice * (1 - product.discount / 100);
  const card = document.createElement("div");
  card.className = "discount-card";
  card.innerHTML = `
    <img src="${product.image}" alt="${product.title}" />
    <h4>${product.title}</h4>
    <div class="price-block">
      <span class="old-price">${formatUSD(product.oldPrice)}</span>
      <span class="new-price">${formatUSD(newPrice)}</span>
    </div>
    <span class="discount-label">Скидка: ${product.discount}%</span>
  `;
  discountsSlider.appendChild(card);
});

// Прокрутка колесом мыши на 3 карточки + возврат в начало
discountsSlider.addEventListener("wheel", (e) => {
  e.preventDefault();
  const scrollAmount = 270 * 3;
  const maxScrollLeft =
    discountsSlider.scrollWidth - discountsSlider.clientWidth;

  if (e.deltaY > 0) {
    if (Math.ceil(discountsSlider.scrollLeft + scrollAmount) >= maxScrollLeft) {
      discountsSlider.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      discountsSlider.scrollLeft += scrollAmount;
    }
  } else {
    discountsSlider.scrollLeft -= scrollAmount;
  }
});

// Счётчик обратного отсчёта
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

const endDate = new Date();
endDate.setDate(endDate.getDate() + 2);
startCountdown(endDate);
