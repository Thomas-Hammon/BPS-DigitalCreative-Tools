import { renderToStaticMarkup } from "react-dom/server";

import "./exampleSlider.css";
import "./exampleSlider.vanilla.js";

import cssText from "./exampleSlider.css?raw";
import jsText from "./exampleSlider.vanilla.js?raw";

import { ExampleSliderDependencies } from "./exampleSlider.dependencies";
import { createExportMarkup } from "../../../../storybook-utils/createExportMarkup";

const defaultSlides = [
  "Slide 1",
  "Slide 2",
  "Slide 3",
  "Slide 4",
  "Slide 5",
  "Slide 6",
];

const ExampleSliderMarkup = ({ slides = defaultSlides }) => {
  return (
    <div
      className="example-slider slider-container"
      data-component="example-slider"
    >
      <div className="splide slider slider--grid" id="slider">
        <div className="splide__track slider-track">
          <ul className="splide__list slider-list">
            {slides.map((slide, index) => (
              <li
                className="splide__slide slider-item"
                key={`${slide}-${index}`}
              >
                <div className="slider-card">{slide}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export const ExampleSlider = ({ slides = defaultSlides }) => {
  return <ExampleSliderMarkup slides={slides} />;
};

ExampleSlider.exportMarkup = (args = {}) => {
  const slides = args.slides || defaultSlides;
  const html = renderToStaticMarkup(<ExampleSliderMarkup slides={slides} />);

  return createExportMarkup({
    markup: html,
    cssText,
    jsText,
    scriptInit: "initExampleSlider();",
    dependencies: ExampleSliderDependencies,
  });
};
