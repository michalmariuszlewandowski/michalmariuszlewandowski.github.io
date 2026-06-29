document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("a[href]").forEach(function (link) {
    var href = link.getAttribute("href");

    if (!href || href.charAt(0) === "#" || href.indexOf("mailto:") === 0) {
      return;
    }

    var url = new URL(href, window.location.href);
    var isHttp = url.protocol === "http:" || url.protocol === "https:";
    var isExternal = isHttp && url.origin !== window.location.origin;
    var isPdf = url.pathname.toLowerCase().endsWith(".pdf");

    if (isExternal || isPdf) {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    }
  });

  document.querySelectorAll(".education-toggle").forEach(function (toggle) {
    toggle.addEventListener("click", function () {
      var row = toggle.closest(".education-detail-row");
      var panel = document.getElementById(toggle.getAttribute("aria-controls"));
      var shouldOpen = toggle.getAttribute("aria-expanded") !== "true";

      if (!row || !panel) {
        return;
      }

      row.querySelectorAll(".education-toggle").forEach(function (rowToggle) {
        rowToggle.setAttribute("aria-expanded", "false");
      });

      row.querySelectorAll(".education-detail-panel").forEach(function (rowPanel) {
        rowPanel.hidden = true;
      });

      if (shouldOpen) {
        toggle.setAttribute("aria-expanded", "true");
        panel.hidden = false;
      }
    });
  });

  if (window.renderMathInElement) {
    renderMathInElement(document.body, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false },
        { left: "\\(", right: "\\)", display: false },
        { left: "\\[", right: "\\]", display: true }
      ],
      throwOnError: false
    });
  }
});
