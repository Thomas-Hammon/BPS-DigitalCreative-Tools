import "./exampleSlider.css";
import "./exampleSlider.vanilla.js";
import cssText from "./exampleSlider.css?raw";
import jsText from "./exampleSlider.vanilla.js?raw";
import { renderToStaticMarkup } from "react-dom/server";

// This is the single source of markup for both the React preview and the export.
const ExampleSliderMarkup = () => {
  return (
    <div className="slider-container">
      <div className="splide slider slider--grid" id="slider">
        <div className="splide__track slider-track">
          <ul className="splide__list slider-list">
            <li className="splide__slide slider-item">
              <div className="slider-card">Slide 1</div>
            </li>

            <li className="splide__slide slider-item">
              <div className="slider-card">Slide 2</div>
            </li>

            <li className="splide__slide slider-item">
              <div className="slider-card">Slide 3</div>
            </li>
            <li className="splide__slide slider-item">
              <div className="slider-card">Slide 1</div>
            </li>

            <li className="splide__slide slider-item">
              <div className="slider-card">Slide 2</div>
            </li>

            <li className="splide__slide slider-item">
              <div className="slider-card">Slide 3</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const exportMarkup = () => {
  // The exported HTML needs plain text, so we turn the JSX above into a static HTML string.
  const safeJsText = jsText.replace(/<\/script>/gi, "<\\/script>");
  const html = renderToStaticMarkup(<ExampleSliderMarkup />);

  return `
<style>
${cssText}
</style>
${html}
<script reactSafe>
${safeJsText}
</script>`;
};

export const ExampleSlider = () => {
  return <ExampleSliderMarkup />;
};

// The Storybook story reads this helper to fill the HTML export panel.
ExampleSlider.exportMarkup = exportMarkup;
