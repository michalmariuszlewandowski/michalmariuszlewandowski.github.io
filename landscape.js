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
  var initial = { meta: meta.textContent, title: title.textContent, summary: summary.textContent };

  function showPreview(node) {
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
  }

  function resetPreview() {
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
  }

  nodes.forEach(function (node) {
    node.addEventListener("pointerenter", function () {
      showPreview(node);
    });
    node.addEventListener("focus", function () {
      showPreview(node);
    });
  });

  landscape.addEventListener("click", function (event) {
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
    if (event.key === "Escape") {
      resetPreview();
    }
  });
})();
