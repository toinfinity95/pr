(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function setMenuExpanded(isExpanded) {
    const toggle = $("#menuToggle");
    const mobileNav = $("#mobileNav");
    if (!toggle || !mobileNav) return;

    toggle.setAttribute("aria-expanded", String(isExpanded));
    toggle.setAttribute("aria-label", isExpanded ? "메뉴 닫기" : "메뉴 열기");
    mobileNav.classList.toggle("is-open", isExpanded);
  }

  function closeMenu() {
    setMenuExpanded(false);
  }

  function openMenu() {
    setMenuExpanded(true);
  }

  function showToast(message) {
    const toastRegion = $("#toastRegion");
    if (!toastRegion) return;

    // Remove previous toasts to keep the UI clean.
    toastRegion.innerHTML = "";

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    toastRegion.appendChild(toast);

    // Next frame to ensure transition triggers.
    requestAnimationFrame(() => {
      toast.classList.add("is-show");
    });

    window.setTimeout(() => {
      toast.classList.remove("is-show");
      // Clean up after transition.
      window.setTimeout(() => {
        if (toast.parentElement) toast.parentElement.removeChild(toast);
      }, 220);
    }, 3200);
  }

  function initMenu() {
    const toggle = $("#menuToggle");
    const closeBtn = $("#mobileClose");
    const mobileNav = $("#mobileNav");
    if (!toggle || !mobileNav) return;

    toggle.addEventListener("click", () => {
      const isOpen = mobileNav.classList.contains("is-open");
      setMenuExpanded(!isOpen);
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", () => closeMenu());
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });

    // Close on overlay click (but keep clicks inside the drawer).
    mobileNav.addEventListener("click", (e) => {
      const inner = mobileNav.querySelector(".mobile-nav-inner");
      if (!inner) return;
      if (!inner.contains(e.target)) closeMenu();
    });

    // Close menu after navigating to anchors.
    $$(".mobile-list a, .desktop-nav a").forEach((a) => {
      a.addEventListener("click", () => closeMenu());
    });
  }

  function initCoffeeToast() {
    const btns = ["#coffeeChatBtn", "#coffeeChatBtn2"]
      .map((id) => $(id))
      .filter(Boolean);

    btns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const message = btn.getAttribute("data-toast-message") || "연결 예정입니다.";
        const href = (btn.getAttribute("href") || "").trim();

        // Placeholder 링크일 때만 토스트를 띄우고 실제 이동은 막습니다.
        if (!href || href === "#" || href.startsWith("#")) {
          e.preventDefault();
          showToast(message);
          return;
        }
      });
    });
  }

  function initReveal() {
    const items = $$(".reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );

    items.forEach((el) => obs.observe(el));
  }

  function initYear() {
    const year = $("#year");
    if (year) year.textContent = String(new Date().getFullYear());
  }

  function initSmoothAnchors() {
    // Provide a consistent experience for mobile anchor navigation.
    // (CSS doesn't always guarantee smooth scrolling in all environments.)
    document.documentElement.style.scrollBehavior = "smooth";
  }

  document.addEventListener("DOMContentLoaded", () => {
    initMenu();
    initCoffeeToast();
    initReveal();
    initYear();
    initSmoothAnchors();
  });
})();

