(() => {
  const root = document.documentElement;
  const body = document.body;
  const header = document.querySelector("[data-header]");
  const main = document.querySelector("main");
  const footer = document.querySelector("footer");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navLabel = document.querySelector("[data-nav-label]");
  const navMenu = document.querySelector("[data-nav-menu]");
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const themeLabel = document.querySelector("[data-theme-label]");
  const themeMeta = document.querySelector("#meta-theme-color");
  const form = document.querySelector("[data-contact-form]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const increasedContrast = window.matchMedia("(prefers-contrast: more)");
  const forcedColors = window.matchMedia("(forced-colors: active)");
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
    if (themeLabel) themeLabel.textContent = `Switch to ${nextTheme} theme`;
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

  const setPageInert = (inert) => {
    [main, footer].forEach((element) => {
      if (element) element.inert = inert;
    });
  };

  const closeNavigation = (restoreFocus = false) => {
    if (!navToggle || !navMenu) return;
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation");
    navMenu.classList.remove("is-open");
    body.classList.remove("nav-open");
    setPageInert(false);
    if (navLabel) navLabel.textContent = "Menu";
    if (restoreFocus) navToggle.focus();
  };

  const openNavigation = () => {
    if (!navToggle || !navMenu) return;
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close navigation");
    navMenu.classList.add("is-open");
    body.classList.add("nav-open");
    setPageInert(true);
    if (navLabel) navLabel.textContent = "Close";
    const firstLink = navMenu.querySelector("a");
    if (firstLink instanceof HTMLElement) firstLink.focus();
  };

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      if (navToggle.getAttribute("aria-expanded") === "true") closeNavigation(true);
      else openNavigation();
    });

    navMenu.addEventListener("click", (event) => {
      if (event.target instanceof HTMLAnchorElement) closeNavigation();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 1080 && navMenu.classList.contains("is-open")) closeNavigation();
    }, { passive: true });
  }

  document.addEventListener("keydown", (event) => {
    if (!navMenu || !navToggle || !navMenu.classList.contains("is-open")) return;

    if (event.key === "Escape") {
      closeNavigation(true);
      return;
    }

    if (event.key !== "Tab") return;
    const focusable = [
      navToggle,
      ...navMenu.querySelectorAll("a[href], button:not([disabled])"),
    ].filter((element) => element instanceof HTMLElement);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  const enableMotion = () => {
    if (reducedMotion.matches) return;
    requestAnimationFrame(() => root.classList.add("motion-ready"));
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
  const storyViewport = window.matchMedia("(min-width: 1081px) and (min-height: 640px)");
  let storyFrame = 0;

  const textIsScaled = () => {
    const scaled = Number.parseFloat(getComputedStyle(root).fontSize) > 20;
    root.classList.toggle("text-scaled", scaled);
    return scaled;
  };

  const clampUnit = (value) => Math.min(1, Math.max(0, value));
  const smoothStep = (value) => {
    const t = clampUnit(value);
    return t * t * (3 - (2 * t));
  };
  const smootherStep = (value) => {
    const t = clampUnit(value);
    return t * t * t * ((t * ((t * 6) - 15)) + 10);
  };

  const resetStory = () => {
    if (!story) return;
    story.classList.remove("is-outcome-state");
    story.style.removeProperty("--story-reveal");
    story.style.removeProperty("--story-tilt");
    story.style.removeProperty("--story-shift");
    story.style.removeProperty("--story-depth-z");
    story.style.removeProperty("--story-input-opacity");
    story.style.removeProperty("--story-output-tilt");
    story.style.removeProperty("--story-output-z");
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
    const scaledText = textIsScaled();
    const enabled = supportsSticky
      && supportsMask
      && storyViewport.matches
      && !reducedMotion.matches
      && !increasedContrast.matches
      && !forcedColors.matches
      && !scaledText;
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
    const depth = smootherStep((progress - 0.18) / 0.58);
    const reveal = 53 + (build * 51);

    story.style.setProperty("--story-reveal", `${reveal.toFixed(2)}%`);
    story.style.setProperty("--story-tilt", `${(-9.6 * depth).toFixed(3)}deg`);
    story.style.setProperty("--story-shift", `${(1 * depth).toFixed(2)}px`);
    story.style.setProperty("--story-depth-z", `${(-6 * depth).toFixed(2)}px`);
    story.style.setProperty("--story-input-opacity", (1 - (0.16 * depth)).toFixed(3));
    story.style.setProperty("--story-output-tilt", `${(0.75 * depth).toFixed(3)}deg`);
    story.style.setProperty("--story-output-z", `${(28 * depth).toFixed(2)}px`);
    story.classList.toggle("is-outcome-state", progress >= 0.58);

    storyOutputs.forEach((label, index) => {
      const amount = smoothStep((progress - (0.60 + (index * 0.055))) / 0.16);
      label.style.opacity = amount.toFixed(3);
      label.style.transform = `translate3d(${((1 - amount) * 12).toFixed(2)}px, 0, 0)`;
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
    increasedContrast.addEventListener("change", () => {
      setStoryMode();
      scheduleStory();
    });
    forcedColors.addEventListener("change", () => {
      setStoryMode();
      scheduleStory();
    });

    new MutationObserver(() => {
      setStoryMode();
      scheduleStory();
    }).observe(root, { attributes: true, attributeFilter: ["style"] });
  }

  if (!form) return;
  form.noValidate = true;

  const submit = form.querySelector("[data-submit]");
  const submitLabel = form.querySelector("[data-submit-label]");
  const status = form.querySelector("[data-form-status]");
  const fallback = form.querySelector("[data-form-fallback]");
  const emailField = form.querySelector('[name="email"]');
  const messageField = form.querySelector('[name="message"]');
  const defaultLabel = submitLabel ? submitLabel.textContent : "Join design partner program";
  let invalidOwner = null;

  const setStatus = (kind, text) => {
    if (fallback) fallback.hidden = true;
    if (!status) return;
    if (kind) status.dataset.kind = kind;
    else delete status.dataset.kind;
    status.textContent = text || "";
  };

  const clearInvalid = (field) => {
    if (!field) return;
    field.removeAttribute("aria-invalid");
    field.removeAttribute("aria-describedby");
    if (invalidOwner === field) {
      invalidOwner = null;
      setStatus("", "");
    }
  };

  const markInvalid = (field, message) => {
    if (!field) return;
    invalidOwner = field;
    setStatus("error", message);
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

    if (!payload.email || payload.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      markInvalid(emailField, "Please enter a valid work email.");
      return;
    }

    if (payload.message.length < 10) {
      markInvalid(messageField, "Add a sentence of context (at least 10 characters).");
      return;
    }

    if (payload.message.length > 4000) {
      markInvalid(messageField, "Keep the context to 4,000 characters or fewer.");
      return;
    }

    clearInvalid(emailField);
    clearInvalid(messageField);
    if (submit) submit.disabled = true;
    if (submitLabel) submitLabel.textContent = "Sending…";
    setStatus("pending", "Sending your note…");

    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const detail = await response.json().catch(() => ({}));
        if (response.status === 429) {
          throw new Error("Too many attempts. Please wait a few minutes before trying again.");
        }
        const message = response.status === 400 && typeof detail.error === "string"
          ? detail.error
          : "We couldn’t send your message. Please try again or email us.";
        throw new Error(message);
      }

      form.reset();
      setStatus("success", "Thanks. Kishore will be in touch shortly.");
      if (submitLabel) submitLabel.textContent = "Sent";
    } catch (error) {
      setStatus("error", error instanceof Error && !(error instanceof TypeError)
        ? error.message
        : "We couldn’t send your message. Please try again or email us.");
      if (fallback) fallback.hidden = false;
      if (submitLabel) submitLabel.textContent = defaultLabel;
    } finally {
      if (submit) submit.disabled = false;
    }
  });
})();
