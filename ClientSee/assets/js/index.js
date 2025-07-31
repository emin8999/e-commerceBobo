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

setInterval(nextSlide, 7000);
