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
];

// --- Функция загрузки ---
async function fetchData(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Ошибка загрузки: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.warn("Ошибка запроса, используем дефолтные данные", error);
    return null;
  }
}

// --- Функции рендеринга (как в предыдущем ответе) ---
function formatUSD(price) {
  return `$${price.toFixed(2)}`;
}

function renderHeroSlides(slidesData) {
  const wrapper = document.getElementById("hero-slides-wrapper");
  wrapper.innerHTML = "";
  slidesData.forEach(({ img, title, btnText }) => {
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
}

function renderCategories(categories) {
  const sliderWrapper = document.getElementById("categorySlider");
  sliderWrapper.innerHTML = "";
  categories.forEach((cat, i) => {
    const slide = document.createElement("div");
    slide.className = "swiper-slide";
    slide.innerHTML = `
      <div class="category-card" style="animation-delay: ${i * 0.05}s">
        <div class="icon" style="font-size: 36px">${cat.icon}</div>
        <h3>${cat.title}</h3>
      </div>
    `;
    sliderWrapper.appendChild(slide);
  });
  const emptySlide = document.createElement("div");
  emptySlide.className = "swiper-slide";
  emptySlide.style.minWidth = "30px";
  sliderWrapper.appendChild(emptySlide);
}

function renderFeaturedProducts(featured) {
  const featSlider = document.getElementById("featuredSlider");
  featSlider.innerHTML = "";
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
}

function renderDiscountProducts(products) {
  const discountsSlider = document.getElementById("discountsSlider");
  discountsSlider.innerHTML = "";

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
}

// --- Инициализация слайдеров и логики (как в предыдущем ответе) ---
function initSliders() {
  // Hero
  new Swiper(".hero-swiper", {
    loop: true,
    autoplay: { delay: 5000, disableOnInteraction: false },
    navigation: { nextEl: ".next", prevEl: ".prev" },
    effect: "fade",
    fadeEffect: { crossFade: true },
  });

  // Категории
  new Swiper(".category-swiper", {
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

  // Рекомендуемые товары (прокрутка колесом)
  const featSlider = document.getElementById("featuredSlider");
  let featPage = 0;
  const getCardsPerPage = () => {
    const w = window.innerWidth;
    if (w >= 1280) return 6;
    if (w >= 1024) return 5;
    if (w >= 768) return 4;
    if (w >= 480) return 3;
    return 4;
  };
  const featCardsPerPage = getCardsPerPage();

  function updateFeaturedSlider() {
    const offset = featPage * (200 + 20) * featCardsPerPage;
    featSlider.style.transform = `translateX(-${offset}px)`;
  }

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
        const maxPage = Math.ceil(
          featSlider.children.length / featCardsPerPage
        );
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

  // Скидочные товары — прокрутка колесом
  const discountsSlider = document.getElementById("discountsSlider");
  discountsSlider.addEventListener("wheel", (e) => {
    e.preventDefault();
    const scrollAmount = 270 * 3;
    const maxScrollLeft =
      discountsSlider.scrollWidth - discountsSlider.clientWidth;

    if (e.deltaY > 0) {
      if (
        Math.ceil(discountsSlider.scrollLeft + scrollAmount) >= maxScrollLeft
      ) {
        discountsSlider.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        discountsSlider.scrollLeft += scrollAmount;
      }
    } else {
      discountsSlider.scrollLeft -= scrollAmount;
    }
  });
}

// Таймер обратного отсчёта
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

// --- Главная инициализация страницы ---
async function initPage() {
  // Пытаемся загрузить с сервера, если не выходит — используем дефолтные данные
  const heroSlides = (await fetchData("/api/heroSlides")) || defaultSlides;
  const categories = (await fetchData("/api/categories")) || defaultCategories;
  const featuredProducts =
    (await fetchData("/api/featuredProducts")) || defaultFeatured;
  const discountProducts =
    (await fetchData("/api/discountProducts")) || defaultDiscountProducts;

  renderHeroSlides(heroSlides);
  renderCategories(categories);
  renderFeaturedProducts(featuredProducts);
  renderDiscountProducts(discountProducts);

  initSliders();

  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 2);
  startCountdown(endDate);
}

document.addEventListener("DOMContentLoaded", initPage);
