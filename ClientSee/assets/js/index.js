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

document.querySelector(".cat-next").addEventListener("click", () => {
  const maxPage = Math.floor(categories.length / cardsPerPage);
  currentPage = currentPage + 1 >= maxPage ? 0 : currentPage + 1;
  updateSliderPosition();
});

document.querySelector(".cat-prev").addEventListener("click", () => {
  const maxPage = Math.floor(categories.length / cardsPerPage);
  currentPage = currentPage === 0 ? maxPage - 1 : currentPage - 1;
  updateSliderPosition();
});

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

document.querySelector(".feat-next").addEventListener("click", () => {
  const maxPage = Math.floor(featured.length / featCardsPerPage);
  featPage = featPage + 1 >= maxPage ? 0 : featPage + 1;
  updateFeaturedSlider();
});

document.querySelector(".feat-prev").addEventListener("click", () => {
  const maxPage = Math.floor(featured.length / featCardsPerPage);
  featPage = featPage === 0 ? maxPage - 1 : featPage - 1;
  updateFeaturedSlider();
});

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
