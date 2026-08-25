import { useEffect } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import "./exampleSliderV2.css";
import "./exampleSliderV2.vanilla.js";

import cssText from "./exampleSliderV2.css?raw";
import jsText from "./exampleSliderV2.vanilla.js?raw";

import { ExampleSliderV2Dependencies } from "./example.Slider.dependencies";
import { createExportMarkup } from "../../../../storybook-utils/createExportMarkup";

const defaultSlides = [
  {
    title: "Insulated",
    url: "/l/hunting-pants-insulated",
    image:
      "https://assets.basspro.com/image/upload/v1773865101/ProductImages/475/truetimbervsx_101888733_main.png?$bpssite_plpslider$",
    alt: "",
    fetchPriority: "low",
  },
  {
    title: "Uninsulated",
    url: "/l/hunting-pants-uninsulated",
    image:
      "https://assets.basspro.com/image/upload/v1660211248/ProductImages/475/ttstrata_100100251_main.png?$bpssite_plpslider$",
    alt: "",
    fetchPriority: "low",
  },
  {
    title: "Hunting Pants",
    url: "/l/hunting-pants",
    image:
      "https://assets.basspro.com/image/upload/v1660211248/ProductImages/475/ttstrata_100100251_main.png?$bpssite_plpslider$",
    alt: "",
    fetchPriority: "low",
  },
  {
    title: "Camo Pants",
    url: "/l/hunting-pants-camo",
    image:
      "https://assets.basspro.com/image/upload/v1660211248/ProductImages/475/ttstrata_100100251_main.png?$bpssite_plpslider$",
    alt: "",
    fetchPriority: "low",
  },
];

const ExampleSliderV2Markup = ({ slides = defaultSlides }) => {
  return (
    <>
      <div className="sPLPHeroContainer"></div>

      <div className="full-width plpHeroCont">
        <section className="plp-hero-container" style={{ paddingTop: "48px" }}>
          <div className="plp-hero-header-wrapper">
            <span className="plp-hero-header">Hunting Pants</span>

            <a className="white-cta sBtn" href="/l/hunting-pants">
              SHOP ALL
            </a>
          </div>
        </section>
      </div>

      <div className="full-width plpSliderCont">
        <section className="splide" aria-label="Hunting Pants Carousel">
          <div className="splide__track">
            <ul className="splide__list">
              {slides.map((slide, index) => (
                <li className="splide__slide" key={`${slide.url}-${index}`}>
                  <a href={slide.url}>
                    <img
                      className="splide__slide-image"
                      src={slide.image}
                      alt={slide.alt}
                      fetchPriority={slide.fetchPriority}
                    />

                    <p className="splide__slide-text">{slide.title}</p>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="splide__arrows">
            <button
              className="splide__arrow splide__arrow--prev"
              type="button"
              aria-label="Previous slide"
            >
              <img
                className="rotate"
                src="https://assets.basspro.com/image/upload/v1682096238/UX/Experience/Ammo%20Key%20Category/icon_24px_arrow-right.png"
                alt=""
                fetchPriority="low"
              />
            </button>

            <button
              className="splide__arrow splide__arrow--next"
              type="button"
              aria-label="Next slide"
            >
              <img
                src="https://assets.basspro.com/image/upload/v1682096238/UX/Experience/Ammo%20Key%20Category/icon_24px_arrow-right.png"
                alt=""
                fetchPriority="low"
              />
            </button>
          </div>
        </section>
      </div>
    </>
  );
};

export const ExampleSliderV2 = ({ slides = defaultSlides }) => {
  useEffect(() => {
    window.initExampleSliderV2?.();
  }, [slides]);

  return <ExampleSliderV2Markup slides={slides} />;
};

ExampleSliderV2.exportMarkup = (args = {}) => {
  const slides = args.slides || defaultSlides;
  const html = renderToStaticMarkup(<ExampleSliderV2Markup slides={slides} />);

  return createExportMarkup({
    markup: html,
    cssText,
    jsText,
    scriptInit: "initExampleSliderV2();",
    dependencies: ExampleSliderV2Dependencies,
  });
};
