(function () {
  const header = document.querySelector("[data-header]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navMenu = document.querySelector("[data-nav-menu]");
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const form = document.querySelector("[data-contact-form]");

  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 64);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const updateThemeControl = () => {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
    const themeMeta = document.getElementById("meta-theme-color");
    if (themeMeta) themeMeta.setAttribute("content", currentTheme === "light" ? "#eef4fa" : "#0e1118");
    if (!themeToggle) return;
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    themeToggle.setAttribute("aria-label", `Switch to ${nextTheme} theme`);
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
  }

  if (form) {
    const submit = form.querySelector("[data-submit]");
    const submitLabel = form.querySelector("[data-submit-label]");
    const status = form.querySelector("[data-form-status]");
    const defaultLabel = submitLabel ? submitLabel.textContent : "Contact us";

    const setStatus = (kind, text) => {
      if (!status) return;
      status.dataset.kind = kind;
      status.textContent = text || "";
    };

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
        return;
      }
      if (payload.message.length < 10) {
        setStatus("error", "Add a sentence or two of context (10+ characters).");
        return;
      }

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
