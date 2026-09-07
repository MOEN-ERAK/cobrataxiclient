const body = document.body;
const panels = [...document.querySelectorAll("[data-hero-panel]")];
const currentLabel = document.querySelector("[data-hero-current]");
const dots = [...document.querySelectorAll("[data-hero-dot]")];
const deviceBtns = [...document.querySelectorAll("[data-device-btn]")];

const TOTAL_HEROES = panels.length;
let heroIndex = Number(body.dataset.hero || 1);

function bindHeroControls(root = document) {
  root.querySelectorAll("[data-hero-prev]").forEach((btn) => {
    if (btn.dataset.bound === "1") return;
    btn.dataset.bound = "1";
    btn.addEventListener("click", () => setHero(heroIndex - 1));
  });
  root.querySelectorAll("[data-hero-next]").forEach((btn) => {
    if (btn.dataset.bound === "1") return;
    btn.dataset.bound = "1";
    btn.addEventListener("click", () => setHero(heroIndex + 1));
  });
}

function replayMemoryMotion() {
  const active = document.querySelector(".hero--style-2.is-active");
  if (!active) return;
  active.querySelectorAll(".memory-card").forEach((card) => {
    card.style.animation = "none";
    void card.offsetWidth;
    card.style.animation = "";
  });
}

function setHero(index) {
  heroIndex = ((index - 1 + TOTAL_HEROES) % TOTAL_HEROES) + 1;
  body.dataset.hero = String(heroIndex);

  panels.forEach((panel) => {
    const active = Number(panel.dataset.heroPanel) === heroIndex;
    panel.classList.toggle("is-active", active);
    panel.hidden = !active;
  });

  if (currentLabel) currentLabel.textContent = String(heroIndex);

  dots.forEach((dot) => {
    dot.classList.toggle("is-active", Number(dot.dataset.heroDot) === heroIndex);
  });

  const mobileLabel = document.querySelector("[data-mobile-hero-label]");
  if (mobileLabel) mobileLabel.textContent = `Style ${heroIndex} / ${TOTAL_HEROES}`;

  if (heroIndex === 2) {
    requestAnimationFrame(replayMemoryMotion);
  }
}

function setDevice(device) {
  body.dataset.device = device;
  deviceBtns.forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.deviceBtn === device);
  });
}

deviceBtns.forEach((btn) => {
  btn.addEventListener("click", () => setDevice(btn.dataset.deviceBtn));
});

bindHeroControls();

dots.forEach((dot) => {
  dot.addEventListener("click", () => setHero(Number(dot.dataset.heroDot)));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") setHero(heroIndex - 1);
  if (event.key === "ArrowRight") setHero(heroIndex + 1);
});

/* Destination cards (style 1) */
const cards = [...document.querySelectorAll(".dest-card")];
const cardPrev = document.querySelector(".carousel__nav--prev");
const cardNext = document.querySelector(".carousel__nav--next");
let activeCard = cards.findIndex((card) => card.classList.contains("dest-card--active"));
if (activeCard < 0) activeCard = 1;

function setActiveCard(index) {
  if (!cards.length) return;
  activeCard = (index + cards.length) % cards.length;
  cards.forEach((card, i) => {
    card.classList.toggle("dest-card--active", i === activeCard);
  });
}

cards.forEach((card, index) => {
  card.addEventListener("click", () => setActiveCard(index));
});
cardPrev?.addEventListener("click", () => setActiveCard(activeCard - 1));
cardNext?.addEventListener("click", () => setActiveCard(activeCard + 1));

/* Menus per hero panel */
document.querySelectorAll(".hero").forEach((hero) => {
  const menuBtn = hero.querySelector(".menu-btn");
  const mobileMenu = hero.querySelector(".mobile-menu");
  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener("click", () => {
    const open = menuBtn.classList.toggle("is-open");
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    mobileMenu.hidden = !open;
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuBtn.classList.remove("is-open");
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.setAttribute("aria-label", "Open menu");
      mobileMenu.hidden = true;
    });
  });
});

document.querySelector(".fab")?.addEventListener("click", () => {
  document.querySelector("#cta")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

function ensureMobileHint() {
  if (document.querySelector(".mobile-style-hint")) return;

  const hint = document.createElement("div");
  hint.className = "mobile-style-hint";
  hint.innerHTML = `
    <button type="button" class="mobile-style-hint__btn" data-hero-prev aria-label="Previous hero style">‹</button>
    <p class="mobile-style-hint__label" data-mobile-hero-label>Style ${heroIndex} / ${TOTAL_HEROES}</p>
    <button type="button" class="mobile-style-hint__btn" data-hero-next aria-label="Next hero style">›</button>
  `;
  document.body.appendChild(hint);
  bindHeroControls(hint);
}

ensureMobileHint();
setHero(heroIndex);
setDevice(body.dataset.device || "phone");
