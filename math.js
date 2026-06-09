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
