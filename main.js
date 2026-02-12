// Año dinámico
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Menú simple para mobile
const btn = document.getElementById("menuBtn");
const nav = document.querySelector(".nav ul");
btn?.addEventListener("click", () => {
  if (!nav) return;
  const visible = getComputedStyle(nav).display !== "none";
  nav.style.display = visible ? "none" : "flex";
});

// WORK: layout automático + flechas + autoplay
const workGrid = document.getElementById("workGrid");
const carouselWrap = document.getElementById("workCarousel");
const prevBtn = document.getElementById("workPrev");
const nextBtn = document.getElementById("workNext");

function setWorkLayout() {
  if (!workGrid) return;

  const cards = workGrid.querySelectorAll(".card");
  const count = cards.length;

  workGrid.classList.remove("cols-1", "cols-2", "cols-3", "carousel");
  carouselWrap?.classList.remove("is-carousel");

  if (count <= 1) workGrid.classList.add("cols-1");
  else if (count === 2) workGrid.classList.add("cols-2");
  else if (count === 3) workGrid.classList.add("cols-3");
  else {
    workGrid.classList.add("carousel");
    carouselWrap?.classList.add("is-carousel");
  }
}

function getStep() {
  const firstCard = workGrid?.querySelector(".card");
  if (!firstCard) return 320;

  const cardWidth = firstCard.getBoundingClientRect().width;
  const styles = getComputedStyle(workGrid);
  const gap = parseFloat(styles.columnGap || styles.gap || "20");
  return cardWidth + gap;
}

function scrollByStep(dir) {
  if (!workGrid || !workGrid.classList.contains("carousel")) return;
  workGrid.scrollBy({ left: dir * getStep(), behavior: "smooth" });
}

// Flechas
prevBtn?.addEventListener("click", () => scrollByStep(-1));
nextBtn?.addEventListener("click", () => scrollByStep(1));

// Autoplay (solo si es carrusel)
let autoplayId = null;
let paused = false;

function startAutoplay() {
  stopAutoplay();
  if (!workGrid || !workGrid.classList.contains("carousel")) return;

  autoplayId = setInterval(() => {
    if (paused) return;

    const max = workGrid.scrollWidth - workGrid.clientWidth;
    const atEnd = workGrid.scrollLeft >= max - 2;

    if (atEnd) {
      workGrid.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      scrollByStep(1);
    }
  }, 4000);
}

function stopAutoplay() {
  if (autoplayId) clearInterval(autoplayId);
  autoplayId = null;
}

// Pausa cuando el usuario interactúa
carouselWrap?.addEventListener("mouseenter", () => (paused = true));
carouselWrap?.addEventListener("mouseleave", () => (paused = false));
workGrid?.addEventListener("touchstart", () => (paused = true), { passive: true });
workGrid?.addEventListener("touchend", () => (paused = false), { passive: true });
workGrid?.addEventListener("wheel", () => (paused = true), { passive: true });

// Inicializar
setWorkLayout();
startAutoplay();

// Recalcular al resize
window.addEventListener("resize", () => {
  const wasCarousel = workGrid?.classList.contains("carousel");
  setWorkLayout();
  const isCarousel = workGrid?.classList.contains("carousel");
  if (wasCarousel !== isCarousel) startAutoplay();
});
