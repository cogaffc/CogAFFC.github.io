const navLinks = [...document.querySelectorAll(".site-nav a")];
const sectionTargets = navLinks
  .map((link) => {
    const selector = link.getAttribute("href");
    if (!selector || !selector.startsWith("#")) {
      return null;
    }

    const target = document.querySelector(selector);
    return target ? { link, target } : null;
  })
  .filter(Boolean);

const revealItems = document.querySelectorAll("[data-reveal]");

if (!("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
  if (navLinks[0]) {
    navLinks[0].classList.add("is-active");
  }
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const match = sectionTargets.find((item) => item.target === entry.target);
        if (!match || !entry.isIntersecting) {
          return;
        }

        navLinks.forEach((link) => link.classList.remove("is-active"));
        match.link.classList.add("is-active");
      });
    },
    {
      threshold: 0.4,
      rootMargin: "-20% 0px -55% 0px",
    }
  );

  sectionTargets.forEach(({ target }) => navObserver.observe(target));
}
