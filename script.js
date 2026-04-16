const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const page = document.body.dataset.page;
document.querySelectorAll(".site-nav a").forEach((link) => {
  const href = link.getAttribute("href");
  if (
    (page === "home" && href === "index.html") ||
    (page === "about" && href === "about.html") ||
    (page === "classes" && href === "classes.html") ||
    (page === "contact" && href === "contact.html")
  ) {
    link.classList.add("is-active");
  }
});

const revealItems = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      } else if (entry.boundingClientRect.top > 0) {
        entry.target.classList.remove("is-visible");
      }
    });
  },
  {
    threshold: 0.18,
    rootMargin: "0px 0px -10% 0px",
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

document.querySelectorAll(".dynamic-text").forEach((element) => {
  const values = JSON.parse(element.dataset.rotate || "[]");

  if (values.length < 2) {
    return;
  }

  let index = 0;

  window.setInterval(() => {
    element.style.opacity = "0";
    element.style.transform = "translateY(10px)";

    window.setTimeout(() => {
      index = (index + 1) % values.length;
      element.textContent = values[index];
      element.style.opacity = "1";
      element.style.transform = "translateY(0)";
    }, 600);
  }, 4200);
});

const contactForm = document.querySelector(".contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const button = contactForm.querySelector("button");

    if (button) {
      button.textContent = "Inquiry Sent";
      button.disabled = true;
    }
  });
}
