(function () {
  "use strict";

  var landscape = document.querySelector(".research-landscape");
  if (!landscape) {
    return;
  }

  var nodes = Array.from(landscape.querySelectorAll(".landscape-node"));
  var edges = Array.from(landscape.querySelectorAll(".landscape-edge"));
  var preview = landscape.querySelector(".landscape-preview");
  var meta = preview.querySelector(".landscape-preview-meta");
  var title = preview.querySelector(".landscape-preview-title");
  var summary = preview.querySelector(".landscape-preview-summary");
  var link = preview.querySelector(".landscape-preview-link");
  var resources = preview.querySelector(".landscape-preview-resources");
  var close = preview.querySelector(".landscape-preview-close");
  var previewLayout = window.matchMedia("(max-width: 760px), (hover: none)");
  var activeNode = null;
  var restoringFocus = false;
  var lastPointerType = null;
  var initial = { meta: meta.textContent, title: title.textContent, summary: summary.textContent };

  function updateNodeControls() {
    nodes.forEach(function (node) {
      if (previewLayout.matches) {
        node.setAttribute("role", "button");
        node.setAttribute("aria-controls", preview.id);
        node.setAttribute("aria-expanded", String(activeNode === node && !preview.hidden));
      } else {
        node.removeAttribute("role");
        node.removeAttribute("aria-controls");
        node.removeAttribute("aria-expanded");
      }
    });
  }

  function showPreview(node) {
    activeNode = node;
    var id = node.dataset.node;
    var related = new Set([id]);

    edges.forEach(function (edge) {
      var connected = edge.dataset.from === id || edge.dataset.to === id;
      edge.classList.toggle("is-connected", connected);
      if (connected) {
        related.add(edge.dataset.from);
        related.add(edge.dataset.to);
      }
    });

    nodes.forEach(function (other) {
      other.classList.toggle("is-active", other === node);
      other.classList.toggle("is-related", other !== node && related.has(other.dataset.node));
    });

    preview.dataset.group = node.dataset.group;
    meta.textContent = node.dataset.meta;
    title.textContent = node.dataset.title;
    summary.textContent = node.dataset.summary;
    link.href = node.href;
    link.textContent = node.dataset.linkLabel ||
      (node.classList.contains("landscape-topic") ? "Explore this area" : "Open page");
    link.target = node.target;
    link.rel = node.rel;
    link.hidden = false;
    resources.replaceChildren();
    var template = node.dataset.resources &&
      landscape.querySelector("#" + node.dataset.resources);
    resources.hidden = !template;
    if (template) {
      resources.appendChild(template.content.cloneNode(true));
    }
    preview.hidden = false;
    updateNodeControls();
  }

  function resetPreview() {
    var focusNode = preview.contains(document.activeElement) && activeNode;
    nodes.forEach(function (node) {
      node.classList.remove("is-active", "is-related");
    });
    edges.forEach(function (edge) {
      edge.classList.remove("is-connected");
    });
    delete preview.dataset.group;
    meta.textContent = initial.meta;
    title.textContent = initial.title;
    summary.textContent = initial.summary;
    link.hidden = true;
    link.removeAttribute("href");
    resources.replaceChildren();
    resources.hidden = true;
    preview.hidden = true;
    activeNode = null;
    updateNodeControls();
    if (focusNode) {
      restoringFocus = true;
      focusNode.focus();
      restoringFocus = false;
    }
  }

  updateNodeControls();
  previewLayout.addEventListener("change", updateNodeControls);
  close.addEventListener("click", resetPreview);

  nodes.forEach(function (node) {
    node.addEventListener("pointerenter", function (event) {
      if (event.pointerType !== "touch") {
        showPreview(node);
      }
    });
    node.addEventListener("focus", function () {
      if (!restoringFocus) {
        showPreview(node);
      }
    });
    node.addEventListener("pointerdown", function (event) {
      lastPointerType = event.pointerType;
    });
    node.addEventListener("click", function (event) {
      var isTouch = event.pointerType === "touch" || lastPointerType === "touch";
      lastPointerType = null;
      if (event.button > 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey ||
          (!previewLayout.matches && !isTouch)) {
        return;
      }
      event.preventDefault();
      showPreview(node);
      preview.scrollIntoView({ block: "nearest" });
      if (event.detail === 0) {
        close.focus({ preventScroll: true });
      }
    });
    node.addEventListener("keydown", function (event) {
      if (previewLayout.matches && event.key === " ") {
        event.preventDefault();
        node.click();
      }
    });
  });

  landscape.addEventListener("click", function (event) {
    if (event.defaultPrevented) {
      return;
    }
    var anchor = event.target.closest("a[href]");
    if (!anchor || !anchor.hash || anchor.hash.indexOf("#project-") !== 0) {
      return;
    }
    var project = document.getElementById(anchor.hash.slice(1));
    var details = project && project.querySelector("details");
    if (details) {
      details.open = true;
    }
  });

  landscape.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !preview.hidden) {
      event.preventDefault();
      resetPreview();
    }
  });
})();
