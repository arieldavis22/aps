(function () {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  let modalEl;
  let title;
  let video;
  let image;

  function resetMediaContent() {
    if (video) {
      video.pause();
      video.removeAttribute("src");
      video.innerHTML = "";
      video.load();
      video.hidden = true;
      video.style.display = "none";
      video.style.visibility = "hidden";
    }

    if (image) {
      image.removeAttribute("src");
      image.alt = "";
      image.hidden = true;
      image.style.display = "none";
      image.style.visibility = "hidden";
    }
  }

  function setModalMediaType(type) {
    if (!video || !image) return;
    video.hidden = type !== "reel";
    image.hidden = type !== "gallery";
    video.style.display = type === "reel" ? "" : "none";
    image.style.display = type === "gallery" ? "" : "none";
    video.style.visibility = type === "reel" ? "visible" : "hidden";
    image.style.visibility = type === "gallery" ? "visible" : "hidden";
  }

  function closeMediaModal() {
    resetMediaContent();
    if (modalEl) {
      modalEl.classList.remove("is-open");
      modalEl.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");
    }
  }

  function initMediaModal() {
    modalEl = document.getElementById("mediaModal");
    const modalPanel = modalEl?.querySelector(".modal-panel");
    title = document.getElementById("mediaModalTitle");
    video = document.getElementById("mediaVideo");
    image = document.getElementById("mediaImage");
    const closeButtons = document.querySelectorAll("[data-close-modal]");
    const reelButtons = document.querySelectorAll(".reel-card[data-video]");
    const galleryButtons = document.querySelectorAll(
      ".gallery-tile[data-gallery-src]",
    );

    if (!modalEl || !modalPanel || !title || !video || !image) return;

    function openModal(type, payload) {
      title.textContent = payload.title;
      resetMediaContent();
      setModalMediaType(type);

      if (type === "reel") {
        const source = document.createElement("source");
        source.src = payload.src;
        source.type = payload.src.endsWith(".mp4")
          ? "video/mp4"
          : "video/quicktime";
        video.appendChild(source);
        video.hidden = false;
        video.load();
      } else {
        image.src = payload.src;
        image.alt = payload.alt || "Amauriah Davis gallery image";
        image.hidden = false;
      }

      modalEl.classList.add("is-open");
      modalEl.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
    }

    reelButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        openModal("reel", {
          title: button.getAttribute("data-title") || "Performance Reel",
          src: button.getAttribute("data-video"),
        });
      });
    });

    galleryButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        openModal("gallery", {
          title: "In Character",
          src: button.getAttribute("data-gallery-src"),
          alt:
            button.getAttribute("data-gallery-alt") ||
            "Amauriah Davis gallery image",
        });
      });
    });

    closeButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        closeMediaModal();
      });
    });

    modalEl.addEventListener("click", (event) => {
      if (event.target === modalEl) {
        closeMediaModal();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modalEl.classList.contains("is-open")) {
        closeMediaModal();
      }
    });
  }

  function initActiveResumeNav() {
    const links = document.querySelectorAll(".resume-nav a");
    if (!links.length) return;

    links.forEach((link) => {
      link.addEventListener("click", () => {
        links.forEach((item) => item.classList.remove("active"));
        link.classList.add("active");
      });
    });
  }

  function initAnimations() {
    if (prefersReducedMotion || !window.gsap || !window.ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);

    gsap.from('[data-animate="hero-copy"]', {
      y: 28,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.15,
    });

    gsap.from(".hero-portrait", {
      y: 34,
      opacity: 0,
      duration: 1.1,
      delay: 0.1,
      ease: "power3.out",
    });

    gsap.utils.toArray(".reveal").forEach((item) => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: "top 84%",
        },
        y: 32,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });
    });

    gsap.utils.toArray(".reveal-image").forEach((item) => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: "top 86%",
        },
        y: 36,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
      });
    });

    gsap.utils.toArray(".section-rule").forEach((rule) => {
      gsap.from(rule, {
        scrollTrigger: {
          trigger: rule,
          start: "top 92%",
        },
        scaleX: 0,
        transformOrigin: "left center",
        duration: 0.9,
        ease: "power3.out",
      });
    });
  }

  window.closeMediaModal = closeMediaModal;

  window.addEventListener("DOMContentLoaded", function () {
    initMediaModal();
    initActiveResumeNav();
    initAnimations();
  });
})();
