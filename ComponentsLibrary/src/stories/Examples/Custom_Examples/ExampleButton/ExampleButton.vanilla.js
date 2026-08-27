(function () {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  if (window.__exampleButtonClickDelegationBound) {
    return;
  }

  window.__exampleButtonClickDelegationBound = true;

  document.addEventListener("click", function (event) {
    const target = event.target;
    if (!target || typeof target.closest !== "function") {
      return;
    }

    const btn = target.closest('[data-component="example-button"]');
    if (!btn) {
      return;
    }

    btn.textContent = "Clicked";
  });
})();
