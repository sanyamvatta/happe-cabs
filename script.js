const phoneDisplay = "6284430944";
const phoneDial = "+916284430944";
const whatsappNumber = "916284430944";
const defaultMessage = "Hello Happ E Cabs, I would like to book an outstation cab.";

const buildWhatsappUrl = (message = defaultMessage) =>
  `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

const setBookingLinks = () => {
  document.querySelectorAll(".book-link").forEach((link) => {
    link.setAttribute("href", buildWhatsappUrl());
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener");
  });

  document.querySelectorAll(".call-link").forEach((link) => {
    link.setAttribute("href", `tel:${phoneDial}`);
  });
};

const initLoader = () => {
  const loader = document.querySelector(".site-loader");
  if (!loader) return;

  window.addEventListener("load", () => {
    window.setTimeout(() => loader.classList.add("is-hidden"), 350);
  });
};

const initNavigation = () => {
  const header = document.querySelector("[data-header]");
  const nav = document.querySelector("[data-nav]");
  const toggle = document.querySelector("[data-nav-toggle]");

  const updateHeader = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 18);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  if (!nav || !toggle) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    document.body.classList.toggle("nav-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      nav.classList.remove("is-open");
      document.body.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
};

const toISODate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const isSameDate = (first, second) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

const setPickerOpen = (picker, isOpen) => {
  const trigger = picker?.querySelector(".picker-trigger");
  const bookingCard = picker?.closest(".booking-card");
  const parentLayer = picker?.closest("label, .booking-row");
  picker?.classList.toggle("is-open", isOpen);
  bookingCard?.classList.toggle("has-open-picker", isOpen);
  parentLayer?.classList.toggle("picker-parent-open", isOpen);
  trigger?.setAttribute("aria-expanded", String(isOpen));
};

const closePickers = (except) => {
  document.querySelectorAll(".premium-picker.is-open").forEach((picker) => {
    if (picker !== except) setPickerOpen(picker, false);
  });
};

const initPremiumDatePicker = () => {
  const picker = document.querySelector("[data-date-picker]");
  if (!picker) return;

  const trigger = picker.querySelector("[data-date-trigger]");
  const input = picker.querySelector("[data-date-input]");
  const label = picker.querySelector("[data-date-label]");
  const title = picker.querySelector("[data-calendar-title]");
  const grid = picker.querySelector("[data-calendar-grid]");
  const previous = picker.querySelector("[data-calendar-prev]");
  const next = picker.querySelector("[data-calendar-next]");
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  let selectedDate = null;
  let visibleMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const monthFormatter = new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" });
  const labelFormatter = new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  const render = () => {
    if (!title || !grid) return;
    title.textContent = monthFormatter.format(visibleMonth);
    grid.innerHTML = "";

    const firstDay = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
    const mondayOffset = (firstDay.getDay() + 6) % 7;
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - mondayOffset);

    if (previous) {
      previous.disabled =
        visibleMonth.getFullYear() === todayStart.getFullYear() && visibleMonth.getMonth() === todayStart.getMonth();
    }

    for (let index = 0; index < 42; index += 1) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + index);

      const button = document.createElement("button");
      button.type = "button";
      button.textContent = String(date.getDate());
      button.disabled = date < todayStart;
      button.classList.toggle("is-muted", date.getMonth() !== visibleMonth.getMonth());
      button.classList.toggle("is-selected", selectedDate ? isSameDate(date, selectedDate) : false);

      button.addEventListener("click", () => {
        selectedDate = new Date(date);
        input.value = toISODate(selectedDate);
        label.textContent = labelFormatter.format(selectedDate);
        render();
        setPickerOpen(picker, false);
      });

      grid.append(button);
    }
  };

  trigger?.addEventListener("click", () => {
    const isOpen = !picker.classList.contains("is-open");
    closePickers(picker);
    setPickerOpen(picker, isOpen);
  });

  previous?.addEventListener("click", () => {
    visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1);
    render();
  });

  next?.addEventListener("click", () => {
    visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1);
    render();
  });

  render();
};

const initPremiumTimePicker = () => {
  const picker = document.querySelector("[data-time-picker]");
  if (!picker) return;

  const trigger = picker.querySelector("[data-time-trigger]");
  const input = picker.querySelector("[data-time-input]");
  const label = picker.querySelector("[data-time-label]");
  const options = picker.querySelector("[data-time-options]");
  if (!options || options.dataset.ready) return;

  const formatter = new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });

  for (let minutes = 0; minutes < 24 * 60; minutes += 15) {
    const date = new Date(2026, 0, 1, Math.floor(minutes / 60), minutes % 60);
    const value = formatter.format(date).toUpperCase();
    const button = document.createElement("button");
    button.type = "button";
    button.role = "option";
    button.textContent = value;

    button.addEventListener("click", () => {
      options.querySelectorAll(".is-selected").forEach((node) => node.classList.remove("is-selected"));
      button.classList.add("is-selected");
      input.value = value;
      label.textContent = value;
      setPickerOpen(picker, false);
    });

    options.append(button);
  }

  options.dataset.ready = "true";

  trigger?.addEventListener("click", () => {
    const isOpen = !picker.classList.contains("is-open");
    closePickers(picker);
    setPickerOpen(picker, isOpen);
  });
};

const initPremiumCabPicker = () => {
  const picker = document.querySelector("[data-cab-picker]");
  if (!picker) return;

  const trigger = picker.querySelector("[data-cab-trigger]");
  const input = picker.querySelector("[data-cab-input]");
  const label = picker.querySelector("[data-cab-label]");
  const options = picker.querySelector("[data-cab-options]");
  if (!options) return;

  options.querySelectorAll("[data-cab-value]").forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.getAttribute("data-cab-value") || "";
      options.querySelectorAll(".is-selected").forEach((node) => node.classList.remove("is-selected"));
      button.classList.add("is-selected");
      input.value = value;
      label.textContent = value;
      setPickerOpen(picker, false);
    });
  });

  trigger?.addEventListener("click", () => {
    const isOpen = !picker.classList.contains("is-open");
    closePickers(picker);
    setPickerOpen(picker, isOpen);
  });
};

const initPremiumPickers = () => {
  initPremiumDatePicker();
  initPremiumTimePicker();
  initPremiumCabPicker();

  document.addEventListener("pointerdown", (event) => {
    if (!(event.target instanceof Element) || !event.target.closest(".premium-picker")) closePickers();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closePickers();
  });
};

const initBookingForm = () => {
  const form = document.querySelector("[data-booking-form]");

  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const from = String(data.get("from") || "").trim();
    const to = String(data.get("to") || "").trim();
    const cab = String(data.get("cab") || "").trim();
    const date = String(data.get("date") || "").trim();
    const time = String(data.get("time") || "").trim();

    const details = [
      defaultMessage,
      from ? `From: ${from}` : "",
      to ? `To: ${to}` : "",
      cab ? `Cab Type: ${cab}` : "",
      date ? `Date: ${date}` : "",
      time ? `Time: ${time}` : "",
      `Phone: ${phoneDisplay}`
    ].filter(Boolean);

    window.open(buildWhatsappUrl(details.join("\n")), "_blank", "noopener");
  });
};

const initReveal = () => {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  items.forEach((item) => revealObserver.observe(item));
};

const initCounters = () => {
  const counters = document.querySelectorAll("[data-counter]");
  if (!counters.length) return;

  const format = new Intl.NumberFormat("en-IN");

  const animateCounter = (counter) => {
    const target = Number(counter.dataset.target || 0);
    const suffix = counter.dataset.suffix || "";
    const start = performance.now();
    const duration = 1400;

    const tick = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      const valueText = counter.dataset.format === "plain" ? String(value) : format.format(value);
      counter.textContent = `${valueText}${suffix}`;

      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));
};

const initCalculator = () => {
  const distanceInput = document.querySelector("[data-distance-input]");
  const distanceRange = document.querySelector("[data-distance-range]");
  const co2Saved = document.querySelector("[data-co2-saved]");
  const treeEquivalent = document.querySelector("[data-tree-equivalent]");
  const fuelAvoided = document.querySelector("[data-fuel-avoided]");
  const cleanerScore = document.querySelector("[data-cleaner-score]");
  const savingMeter = document.querySelector("[data-saving-meter]");

  if (!distanceInput || !distanceRange || !co2Saved || !treeEquivalent || !fuelAvoided || !cleanerScore || !savingMeter) return;

  const update = (rawValue) => {
    const distance = Math.max(10, Math.min(1000, Number(rawValue) || 10));
    const saved = distance * 0.135;
    const trees = Math.round(saved * 1.65);

    distanceInput.value = String(distance);
    distanceRange.value = String(distance);
    co2Saved.textContent = saved >= 100 ? saved.toFixed(0) : saved.toFixed(1);
    treeEquivalent.textContent = String(trees);
    fuelAvoided.textContent = saved >= 100 ? saved.toFixed(0) : saved.toFixed(1);
    cleanerScore.textContent = String(Math.min(100, Math.round((distance / 1000) * 100)));
    savingMeter.style.width = `${Math.max(8, (distance / 1000) * 100)}%`;
  };

  distanceInput.addEventListener("input", () => update(distanceInput.value));
  distanceRange.addEventListener("input", () => update(distanceRange.value));
  update(distanceInput.value);
};

const initHeroMotion = () => {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  hero.addEventListener(
    "pointermove",
    (event) => {
      const rect = hero.getBoundingClientRect();
      const mx = (event.clientX - rect.left) / rect.width - 0.5;
      const my = (event.clientY - rect.top) / rect.height - 0.5;
      hero.style.setProperty("--mx", mx.toFixed(3));
      hero.style.setProperty("--my", my.toFixed(3));
    },
    { passive: true }
  );
};

const initSubscribeForm = () => {
  const form = document.querySelector("[data-subscribe-form]");
  const note = document.querySelector("[data-subscribe-note]");
  if (!form || !note) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = String(new FormData(form).get("email") || "").trim();
    if (!email) return;

    const saved = JSON.parse(localStorage.getItem("happ-e-partner-emails") || "[]");
    saved.push({ email, createdAt: new Date().toISOString() });
    localStorage.setItem("happ-e-partner-emails", JSON.stringify(saved));
    note.textContent = "You are on the early partner list. We will reach out soon.";
    form.reset();
  });
};

const initFooterYear = () => {
  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });
};

document.addEventListener("DOMContentLoaded", () => {
  setBookingLinks();
  initLoader();
  initNavigation();
  initPremiumPickers();
  initBookingForm();
  initReveal();
  initCounters();
  initCalculator();
  initHeroMotion();
  initSubscribeForm();
  initFooterYear();

  if (window.lucide) {
    window.lucide.createIcons();
  }
});
