(() => {
  const root = document.documentElement;
  const header = document.querySelector("[data-header]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navLabel = document.querySelector("[data-nav-label]");
  const navMenu = document.querySelector("[data-nav-menu]");
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const themeMeta = document.querySelector("#meta-theme-color");
  const signalMap = document.querySelector("[data-signal-map]");
  const form = document.querySelector("[data-contact-form]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const revealItems = Array.from(document.querySelectorAll("[data-reveal]"));

  const updateHeader = () => {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const updateThemeControl = () => {
    const theme = root.getAttribute("data-theme") || "dark";
    const nextTheme = theme === "dark" ? "light" : "dark";
    if (themeToggle) themeToggle.setAttribute("aria-label", `Switch to ${nextTheme} theme`);
    if (themeMeta) themeMeta.setAttribute("content", theme === "light" ? "#f9fafb" : "#0e1118");
  };

  updateThemeControl();

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = root.getAttribute("data-theme") || "dark";
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", nextTheme);
      try { localStorage.setItem("inaisec-theme", nextTheme); } catch (_) {}
      updateThemeControl();
    });
  }

  const closeNavigation = (restoreFocus = false) => {
    if (!navToggle || !navMenu) return;
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation");
    navMenu.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    if (navLabel) navLabel.textContent = "Menu";
    if (restoreFocus) navToggle.focus();
  };

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const willOpen = navToggle.getAttribute("aria-expanded") !== "true";
      navToggle.setAttribute("aria-expanded", String(willOpen));
      navToggle.setAttribute("aria-label", willOpen ? "Close navigation" : "Open navigation");
      navMenu.classList.toggle("is-open", willOpen);
      document.body.classList.toggle("nav-open", willOpen);
      if (navLabel) navLabel.textContent = willOpen ? "Close" : "Menu";
    });

    navMenu.addEventListener("click", (event) => {
      if (event.target instanceof HTMLAnchorElement) closeNavigation();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 1080 && navMenu.classList.contains("is-open")) closeNavigation();
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (navMenu && navMenu.classList.contains("is-open")) closeNavigation(true);
  });

  const enableMotion = () => {
    if (reducedMotion.matches) return;

    const start = () => requestAnimationFrame(() => root.classList.add("motion-ready"));
    if (!signalMap || signalMap.complete) start();
    else signalMap.addEventListener("load", start, { once: true });
  };

  enableMotion();

  const enableReveals = () => {
    if (!revealItems.length || reducedMotion.matches) return;

    if (!("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-revealed"));
      return;
    }

    root.classList.add("reveal-ready");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -32px" });

    revealItems.forEach((item) => observer.observe(item));
  };

  enableReveals();

  const story = document.querySelector("[data-convergence-story]");
  const storyArt = story?.querySelector("[data-story-art]");
  const storyProblem = story?.querySelector("#problem");
  const storyOutcomes = story?.querySelector("#outcomes");
  const storyOutputs = Array.from(story?.querySelectorAll("[data-story-output]") || []);
  const storyViewport = window.matchMedia("(min-width: 1081px) and (min-height: 920px)");
  let storyFrame = 0;

  const clampUnit = (value) => Math.min(1, Math.max(0, value));
  const smoothStep = (value) => {
    const t = clampUnit(value);
    return t * t * (3 - (2 * t));
  };

  const resetStory = () => {
    if (!story) return;
    story.classList.remove("is-outcome-state");
    story.style.removeProperty("--story-reveal");
    story.style.removeProperty("--story-tilt");
    story.style.removeProperty("--story-shift");
    story.style.removeProperty("--story-scale");
    storyOutputs.forEach((label) => {
      label.style.removeProperty("opacity");
      label.style.removeProperty("transform");
    });
  };

  const setStoryMode = () => {
    if (!story) return;
    const supportsSticky = CSS.supports("position", "sticky");
    const supportsMask = CSS.supports("mask-image", "linear-gradient(#000, transparent)")
      || CSS.supports("-webkit-mask-image", "linear-gradient(#000, transparent)");
    const enabled = supportsSticky && supportsMask && storyViewport.matches && !reducedMotion.matches;
    story.classList.toggle("is-scroll-enhanced", enabled);
    if (!enabled) resetStory();
  };

  const renderStory = () => {
    storyFrame = 0;
    if (!story || !storyArt || !storyProblem || !storyOutcomes || !story.classList.contains("is-scroll-enhanced")) return;

    const headerHeight = header?.getBoundingClientRect().height || 76;
    const problemRect = storyProblem.getBoundingClientRect();
    const outcomesRect = storyOutcomes.getBoundingClientRect();
    const panelTravel = Math.max(1, outcomesRect.top - problemRect.top);
    const progress = clampUnit((headerHeight - problemRect.top) / panelTravel);

    const build = smoothStep((progress - 0.16) / 0.68);
    const depth = smoothStep((progress - 0.48) / 0.42);
    const reveal = 53 + (build * 51);

    story.style.setProperty("--story-reveal", `${reveal.toFixed(2)}%`);
    story.style.setProperty("--story-tilt", `${(-3.2 * depth).toFixed(3)}deg`);
    story.style.setProperty("--story-shift", `${(-5 * depth).toFixed(2)}px`);
    story.style.setProperty("--story-scale", (1 + (0.008 * depth)).toFixed(4));
    story.classList.toggle("is-outcome-state", progress >= 0.58);

    storyOutputs.forEach((label, index) => {
      const amount = smoothStep((progress - (0.60 + (index * 0.055))) / 0.16);
      label.style.opacity = amount.toFixed(3);
      label.style.transform = `translate3d(${((1 - amount) * 14).toFixed(2)}px, 0, 0)`;
    });
  };

  const scheduleStory = () => {
    if (!storyFrame) storyFrame = requestAnimationFrame(renderStory);
  };

  if (story) {
    setStoryMode();
    scheduleStory();
    window.addEventListener("scroll", scheduleStory, { passive: true });
    window.addEventListener("resize", () => {
      setStoryMode();
      scheduleStory();
    }, { passive: true });
    window.addEventListener("pageshow", scheduleStory);
    storyViewport.addEventListener("change", () => {
      setStoryMode();
      scheduleStory();
    });
    reducedMotion.addEventListener("change", () => {
      setStoryMode();
      scheduleStory();
    });
  }

  if (!form) return;

  const submit = form.querySelector("[data-submit]");
  const submitLabel = form.querySelector("[data-submit-label]");
  const status = form.querySelector("[data-form-status]");
  const emailField = form.querySelector('[name="email"]');
  const messageField = form.querySelector('[name="message"]');
  const defaultLabel = submitLabel ? submitLabel.textContent : "Talk through one hard incident";

  const setStatus = (kind, text) => {
    if (!status) return;
    status.dataset.kind = kind;
    status.textContent = text || "";
  };

  const clearInvalid = (field) => {
    if (!field) return;
    field.removeAttribute("aria-invalid");
    field.removeAttribute("aria-describedby");
  };

  const markInvalid = (field) => {
    if (!field) return;
    field.setAttribute("aria-invalid", "true");
    field.setAttribute("aria-describedby", "form-status");
    field.focus();
  };

  [emailField, messageField].forEach((field) => {
    if (field) field.addEventListener("input", () => clearInvalid(field));
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (submit && submit.disabled) return;

    const data = new FormData(form);
    const payload = {
      email: String(data.get("email") || "").trim(),
      message: String(data.get("message") || "").trim(),
      website: String(data.get("website") || ""),
    };

    if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      setStatus("error", "Please enter a valid work email.");
      markInvalid(emailField);
      return;
    }

    if (payload.message.length < 10) {
      setStatus("error", "Add a sentence of context (at least 10 characters).");
      markInvalid(messageField);
      return;
    }

    clearInvalid(emailField);
    clearInvalid(messageField);
    if (submit) submit.disabled = true;
    if (submitLabel) submitLabel.textContent = "Sending…";
    setStatus("pending", "Sending your note…");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const detail = await response.json().catch(() => ({}));
        throw new Error(detail.error || "Could not send right now. Please email hello@inaisec.ai.");
      }

      form.reset();
      setStatus("success", "Thanks. Kishore will be in touch shortly.");
      if (submitLabel) submitLabel.textContent = "Sent";
    } catch (error) {
      setStatus("error", error instanceof Error ? error.message : "Could not send right now. Please email hello@inaisec.ai.");
      if (submitLabel) submitLabel.textContent = defaultLabel;
    } finally {
      if (submit) submit.disabled = false;
    }
  });
})();
