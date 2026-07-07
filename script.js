(function () {
  const header = document.querySelector("[data-header]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navMenu = document.querySelector("[data-nav-menu]");
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const form = document.querySelector("[data-contact-form]");
  const themeColorMeta = document.querySelector("#meta-theme-color");

  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 48);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const updateThemeControl = () => {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    if (themeToggle) themeToggle.setAttribute("aria-label", `Switch to ${nextTheme} theme`);
    if (themeColorMeta) themeColorMeta.setAttribute("content", currentTheme === "light" ? "#eef4fa" : "#0e1118");
  };

  updateThemeControl();

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", nextTheme);
      localStorage.setItem("inaisec-theme", nextTheme);
      updateThemeControl();
    });
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      navMenu.classList.toggle("is-open", !expanded);
      document.body.classList.toggle("nav-open", !expanded);
    });

    navMenu.addEventListener("click", (event) => {
      if (!(event.target instanceof HTMLAnchorElement)) return;
      navToggle.setAttribute("aria-expanded", "false");
      navMenu.classList.remove("is-open");
      document.body.classList.remove("nav-open");
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || !navMenu.classList.contains("is-open")) return;
      navToggle.setAttribute("aria-expanded", "false");
      navMenu.classList.remove("is-open");
      document.body.classList.remove("nav-open");
      navToggle.focus();
    });
  }

  // Hero deadline board: the GDPR clock ticks; clocks without a statutory
  // anchor stay honest and never tick. Static under reduced motion.
  const countdown = document.querySelector("[data-countdown]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (countdown && !reducedMotion) {
    let remaining = parseInt(countdown.getAttribute("data-countdown"), 10);
    if (Number.isFinite(remaining)) {
      const render = () => {
        const h = Math.floor(remaining / 3600);
        const m = Math.floor((remaining % 3600) / 60);
        const s = remaining % 60;
        countdown.textContent = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
      };
      render();
      setInterval(() => {
        if (remaining > 0) {
          remaining -= 1;
          render();
        }
      }, 1000);
    }
  }

  if (form) {
    const submit = form.querySelector("[data-submit]");
    const submitLabel = form.querySelector("[data-submit-label]");
    const status = form.querySelector("[data-form-status]");
    const defaultLabel = submitLabel ? submitLabel.textContent : "Book the review";

    const setStatus = (kind, text) => {
      if (!status) return;
      status.dataset.kind = kind;
      status.textContent = text || "";
    };

    const emailField = form.querySelector('[name="email"]');
    const messageField = form.querySelector('[name="message"]');

    const clearInvalid = (field) => {
      field.removeAttribute("aria-invalid");
      field.removeAttribute("aria-describedby");
    };

    const markInvalid = (field) => {
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
        if (emailField) markInvalid(emailField);
        return;
      }
      if (payload.message.length < 10) {
        setStatus("error", "Add a sentence or two of context (10+ characters).");
        if (messageField) markInvalid(messageField);
        return;
      }
      if (emailField) clearInvalid(emailField);
      if (messageField) clearInvalid(messageField);

      if (submit) submit.disabled = true;
      if (submitLabel) submitLabel.textContent = "Sending…";
      setStatus("pending", "");

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const detail = await response.json().catch(() => ({}));
          throw new Error(detail.error || "Could not send right now. Try again or email hello@inaisec.ai.");
        }

        form.reset();
        setStatus("success", "Thanks. I'll be in touch shortly.");
        if (submitLabel) submitLabel.textContent = "Sent";
      } catch (err) {
        setStatus("error", err.message || "Could not send right now. Try again or email hello@inaisec.ai.");
        if (submitLabel) submitLabel.textContent = defaultLabel;
        if (submit) submit.disabled = false;
      }
    });
  }
})();
