import { renderToStaticMarkup } from "react-dom/server";

import "./ExampleButton.css";
import "./ExampleButton.vanilla.js";

import cssText from "./ExampleButton.css?raw";
import jsText from "./ExampleButton.vanilla.js?raw";

import { ExampleButtonDependencies } from "./ExampleButton.dependencies";
import { createExportMarkup } from "../../../../storybook-utils/createExportMarkup";

const ExampleButtonMarkup = () => {
  return (
    <button
      type="button"
      className="example-button"
      data-component="example-button"
    >
      Example Button
    </button>
  );
};

export const ExampleButton = () => {
  return <ExampleButtonMarkup />;
};

ExampleButton.exportMarkup = () => {
  const html = renderToStaticMarkup(<ExampleButtonMarkup />);

  return createExportMarkup({
    markup: html,
    cssText,
    jsText,
    scriptInit: "",
    dependencies: ExampleButtonDependencies,
  });
};
