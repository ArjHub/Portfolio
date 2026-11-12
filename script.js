(function () {
  "use strict";
  const root = document.documentElement;
  const menuButton = document.querySelector(".menu-button");
  const nav = document.querySelector("#nav-links");
  const themeButton = document.querySelector(".theme-button");

  function closeMenu() {
    if (!menuButton || !nav) return;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    nav.classList.remove("open");
  }

  if (menuButton && nav) {
    menuButton.addEventListener("click", function () {
      const open = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!open));
      menuButton.setAttribute("aria-label", open ? "Open navigation" : "Close navigation");
      nav.classList.toggle("open", !open);
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("open")) {
        closeMenu();
        menuButton.focus();
      }
    });
  }

  function updateThemeLabel() {
    if (!themeButton) return;
    const dark = root.dataset.theme !== "light";
    themeButton.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    themeButton.setAttribute("title", dark ? "Switch to light theme" : "Switch to dark theme");
  }
  if (themeButton) {
    themeButton.addEventListener("click", function () {
      const next = root.dataset.theme === "light" ? "dark" : "light";
      root.dataset.theme = next;
      try { localStorage.setItem("ap-theme", next); } catch (error) {}
      updateThemeLabel();
    });
    updateThemeLabel();
  }

  const architectureDetails = {
    airflow: "Airflow orchestrates four monitored workflows: orders_ingest, customers_dim, payments_etl and daily_revenue_agg. Successful runs establish the baseline for anomaly detection.",
    stream: "Redpanda provides Kafka-compatible event transport. The Lander service and supporting collectors feed pipeline events and metric context into the platform for downstream analysis.",
    detect: "Python detection services evaluate failed jobs, late-arriving data, schema changes and volume anomalies. Correlation groups related findings into primary and downstream incidents.",
    api: "The Sentinel API exposes incident and evidence information. Four evidence-gathering tools support investigation; Prometheus and Grafana provide operational visibility."
  };
  const archButtons = Array.from(document.querySelectorAll("[data-arch]"));
  const detail = document.querySelector("#arch-detail");
  archButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      archButtons.forEach(function (candidate) {
        const active = candidate === button;
        candidate.classList.toggle("active", active);
        candidate.setAttribute("aria-pressed", String(active));
      });
      if (detail) detail.textContent = architectureDetails[button.dataset.arch];
    });
  });

  const copyButton = document.querySelector("[data-copy]");
  const copyStatus = document.querySelector(".copy-status");
  if (copyButton && copyStatus) {
    copyButton.addEventListener("click", async function () {
      const email = copyButton.dataset.copy;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
          copyStatus.textContent = "Email address copied.";
        } else {
          const field = document.createElement("textarea");
          field.value = email;
          field.setAttribute("readonly", "");
          field.style.position = "absolute";
          field.style.left = "-9999px";
          document.body.appendChild(field);
          field.select();
          const copied = document.execCommand("copy");
          field.remove();
          copyStatus.textContent = copied ? "Email address copied." : email;
        }
      } catch (error) {
        copyStatus.textContent = email;
      }
    });
  }

  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const navLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  if ("IntersectionObserver" in window && navLinks.length) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          const active = link.getAttribute("href") === "#" + entry.target.id;
          if (active) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-35% 0px -58% 0px" });
    sections.forEach(function (section) { observer.observe(section); });
  }
})();