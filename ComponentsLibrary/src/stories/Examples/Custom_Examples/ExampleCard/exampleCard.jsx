import { renderToStaticMarkup } from "react-dom/server";

import "./exampleCard.css";
import "./exampleCard.vanilla.js";

import cssText from "./exampleCard.css?raw";
import jsText from "./exampleCard.vanilla.js?raw";

import { ExampleCardDependencies } from "./exampleCard.dependencies";
import { createExportMarkup } from "../../../../storybook-utils/createExportMarkup";

const ExampleCardMarkup = () => {
  return (
    <div className="example-card" data-component="example-card">
      <img src="https://placehold.co/1200x400." alt="Example" />
      <h2>Example Card</h2>
      <p>This is an example card component.</p>
    </div>
  );
};

export const ExampleCard = () => {
  return <ExampleCardMarkup />;
};

ExampleCard.exportMarkup = () => {
  const html = renderToStaticMarkup(<ExampleCardMarkup />);

  return createExportMarkup({
    markup: html,
    cssText,
    jsText,
    scriptInit: "",
    dependencies: ExampleCardDependencies,
  });
};
