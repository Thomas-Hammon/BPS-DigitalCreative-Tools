(function () {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  function initExampleSlider() {
    const sliderRoot = document.querySelector(
      '[data-component="example-slider"]',
    );
    const slider = sliderRoot ? sliderRoot.querySelector("#slider") : null;

    if (!slider || !window.Splide) {
      return;
    }

    if (slider.dataset.splideMounted === "true") {
      return;
    }

    new window.Splide(slider, {
      type: "slide",
      rewind: true,
      perPage: 1,
      perMove: 1,
      drag: true,
      pagination: false,
    }).mount();

    slider.dataset.splideMounted = "true";
  }

  window.initExampleSlider = initExampleSlider;

  initExampleSlider();
})();
