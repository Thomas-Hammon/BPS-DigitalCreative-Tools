(function () {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  if (window.__exampleCardClickBound) {
    return;
  }

  window.__exampleCardClickBound = true;

  document.addEventListener("click", function (event) {
    const target = event.target;
    if (!target || typeof target.closest !== "function") {
      return;
    }

    const card = target.closest('[data-component="example-card"]');
    if (!card) {
      return;
    }

    card.classList.toggle("is-active");
  });
})();
