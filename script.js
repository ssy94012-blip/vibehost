const visitCountElements = document.querySelectorAll("[data-visit-count]");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
const revealElements = document.querySelectorAll(".reveal");
const sections = document.querySelectorAll("main section[id]");

function updateVisitCount() {
  const storageKey = "sy-personal-site-visit-count";
  const sessionKey = "sy-personal-site-session-marked";
  let visitCount = Number(localStorage.getItem(storageKey) || "0");

  if (!sessionStorage.getItem(sessionKey)) {
    visitCount += 1;
    localStorage.setItem(storageKey, String(visitCount));
    sessionStorage.setItem(sessionKey, "true");
  }

  const formattedCount = new Intl.NumberFormat("ko-KR").format(visitCount);

  visitCountElements.forEach((element) => {
    element.textContent = formattedCount;
  });
}

function closeMenu() {
  if (!menuToggle || !siteNav) {
    return;
  }

  menuToggle.setAttribute("aria-expanded", "false");
  siteNav.classList.remove("open");
  document.body.classList.remove("menu-open");
}

function toggleMenu() {
  if (!menuToggle || !siteNav) {
    return;
  }

  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  siteNav.classList.toggle("open", !isExpanded);
  document.body.classList.toggle("menu-open", !isExpanded);
}

function observeReveals() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (prefersReducedMotion.matches) {
    revealElements.forEach((element) => element.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealElements.forEach((element) => observer.observe(element));
}

function highlightActiveSection() {
  const scrollPosition = window.scrollY + 140;
  let activeId = "";

  sections.forEach((section) => {
    const start = section.offsetTop;
    const end = start + section.offsetHeight;

    if (scrollPosition >= start && scrollPosition < end) {
      activeId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${activeId}`;
    link.classList.toggle("active", isActive);
  });
}

updateVisitCount();
observeReveals();
highlightActiveSection();

if (menuToggle) {
  menuToggle.addEventListener("click", toggleMenu);
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    closeMenu();
  });
});

window.addEventListener("scroll", highlightActiveSection, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 760) {
    closeMenu();
  }
  highlightActiveSection();
});
