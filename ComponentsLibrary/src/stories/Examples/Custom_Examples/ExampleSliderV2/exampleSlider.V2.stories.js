import { createElement, useEffect } from "react";

import { ExampleSliderV2 } from "./exampleSliderV2";

import { ExampleSliderV2Dependencies } from "./example.Slider.dependencies";

import { loadDependencies } from "../../../../storybook-utils/loadDependencies";

const ExportPreview = () => {
  const markup = ExampleSliderV2.exportMarkup();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.__exampleSliderV2ExportMarkup = markup;

    loadDependencies(ExampleSliderV2Dependencies)
      .then(() => {
        if (typeof window.initExampleSliderV2 === "function") {
          window.initExampleSliderV2();
        }
      })
      .catch((error) => {
        console.error("Failed to load Example Slider V2 dependencies:", error);
      });
  }, [markup]);

  return createElement(ExampleSliderV2);
};

export default {
  title: "Examples/Custom_Examples/Example Slider V2",

  component: ExampleSliderV2,

  tags: ["autodocs"],

  parameters: {
    layout: "fullscreen",

    controls: {
      disable: true,
    },
  },
};

export const Default = {
  render: ExportPreview,

  parameters: {
    html: {
      transform: () => {
        if (typeof window === "undefined") {
          return "";
        }

        return window.__exampleSliderV2ExportMarkup || "";
      },
    },
  },
};
