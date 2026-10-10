(function () {
  "use strict";

  var storageKey = "ml-theme";
  var preference = window.matchMedia("(prefers-color-scheme: dark)");
  var savedTheme = null;
  var toggle;

  function validTheme(value) {
    return value === "light" || value === "dark" ? value : null;
  }

  try {
    savedTheme = validTheme(window.localStorage.getItem(storageKey));
  } catch (error) {
    // Theme switching still works when browser storage is unavailable.
  }

  function applyTheme() {
    var theme = savedTheme || (preference.matches ? "dark" : "light");
    document.documentElement.dataset.theme = theme;

    if (toggle) {
      var nextTheme = theme === "dark" ? "light" : "dark";
      toggle.setAttribute("aria-label", "Switch to " + nextTheme + " theme");
      toggle.title = "Switch to " + nextTheme + " theme";
    }
  }

  // This script runs in the head so the saved theme applies before the page paints.
  applyTheme();

  preference.addEventListener("change", function () {
    if (!savedTheme) {
      applyTheme();
    }
  });

  window.addEventListener("storage", function (event) {
    if (event.key === storageKey || event.key === null) {
      savedTheme = validTheme(event.newValue);
      applyTheme();
    }
  });

  document.addEventListener("DOMContentLoaded", function () {
    var controls = document.querySelector(".site-header .header-inner");

    if (!controls) {
      return;
    }

    toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "theme-toggle";
    toggle.innerHTML =
      '<svg class="theme-icon theme-icon-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.9 13.1A9 9 0 0 1 10.9 3.1 9 9 0 1 0 20.9 13.1Z"/></svg>' +
      '<svg class="theme-icon theme-icon-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
    controls.classList.add("has-theme-toggle");
    controls.appendChild(toggle);
    applyTheme();

    toggle.addEventListener("click", function () {
      savedTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      try {
        window.localStorage.setItem(storageKey, savedTheme);
      } catch (error) {
        // Keep the user's choice for this page even if it cannot be saved.
      }
      applyTheme();
    });
  });
})();
