// Carousel Navigation Logic
let next = document.getElementById('next');
let prev = document.getElementById('prev');
let carousel = document.querySelector('.carousel');
let items = document.querySelectorAll('.carousel .item');
let countItem = items.length;
let active = 1;
let other_1 = null;
let other_2 = null;

next.onclick = () => {
    carousel.classList.remove('prev');
    carousel.classList.add('next');
    active = active + 1 >= countItem ? 0 : active + 1;
    other_1 = active - 1 < 0 ? countItem - 1 : active - 1;
    other_2 = active + 1 >= countItem ? 0 : active + 1;
    changeSlider();
};

prev.onclick = () => {
    carousel.classList.remove('next');
    carousel.classList.add('prev');
    active = active - 1 < 0 ? countItem - 1 : active - 1;
    other_1 = active + 1 >= countItem ? 0 : active + 1;
    other_2 = other_1 + 1 >= countItem ? 0 : other_1 + 1;
    changeSlider();
};

const changeSlider = () => {
    let itemOldActive = document.querySelector('.carousel .item.active');
    if (itemOldActive) itemOldActive.classList.remove('active');

    let itemOldOther_1 = document.querySelector('.carousel .item.other_1');
    if (itemOldOther_1) itemOldOther_1.classList.remove('other_1');

    let itemOldOther_2 = document.querySelector('.carousel .item.other_2');
    if (itemOldOther_2) itemOldOther_2.classList.remove('other_2');

    items.forEach(e => {
        e.querySelector('.image img').style.animation = 'none';
        e.querySelector('.image figcaption').style.animation = 'none';
        void e.offsetWidth;
        e.querySelector('.image img').style.animation = '';
        e.querySelector('.image figcaption').style.animation = '';
    });

    items[active].classList.add('active');
    items[other_1].classList.add('other_1');
    items[other_2].classList.add('other_2');

    clearInterval(autoPlay);
    autoPlay = setInterval(() => {
        next.click();
    }, 5000);
};

let autoPlay = setInterval(() => {
    next.click();
}, 5000);

// Dragging and Scrolling Logic
const firstImg = carousel.querySelectorAll("img")[0];
const arrowIcons = document.querySelectorAll(".wrapper i");

let isDragStart = false, prevPageX, prevScrollLeft;
let firstImgWidth = firstImg.clientWidth + 400;

const showHideIcons = () => {
    const scrollWidth = carousel.scrollWidth - carousel.clientWidth;
    const threshold = 1;
    arrowIcons[0].style.display = carousel.scrollLeft <= threshold ? "none" : "block";
    arrowIcons[1].style.display = carousel.scrollLeft >= scrollWidth - threshold ? "none" : "block";
};

document.addEventListener("selectstart", (e) => e.preventDefault());

arrowIcons.forEach(icon => {
    icon.addEventListener("click", (e) => {
        e.preventDefault();
        let direction = icon.id === "left" ? -1 : 1;
        carousel.scrollBy({ left: firstImgWidth * direction, behavior: "smooth" });
        setTimeout(showHideIcons, 500);
    });
});

const dragStart = (e) => {
    isDragStart = true;
    prevPageX = e.pageX || e.touches[0].pageX;
    prevScrollLeft = carousel.scrollLeft;
};

const dragging = (e) => {
    if (!isDragStart) return;
    e.preventDefault();
    carousel.classList.add("dragging");
    let positionDiff = (e.pageX || e.touches[0].pageX) - prevPageX;
    carousel.scrollLeft = prevScrollLeft - positionDiff;
    showHideIcons();
};

const dragStop = () => {
    isDragStart = false;
    carousel.classList.remove("dragging");
};

carousel.querySelectorAll("img").forEach(img => img.setAttribute("draggable", false));

let isScrolling;
carousel.addEventListener("scroll", () => {
    window.clearTimeout(isScrolling);
    isScrolling = setTimeout(() => showHideIcons(), 100);
});

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
carousel.addEventListener("mouseup", dragStop);
carousel.addEventListener("mouseleave", dragStop);

carousel.addEventListener("touchstart", dragStart);
carousel.addEventListener("touchmove", dragging);
carousel.addEventListener("touchend", dragStop);
carousel.addEventListener("touchleave", dragStop);

showHideIcons();
