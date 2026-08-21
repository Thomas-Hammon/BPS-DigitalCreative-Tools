import { createElement, useEffect } from "react";
import { ExampleSlider } from "./exampleSlider";

const ExportPreview = () => {
  const markup = ExampleSlider.exportMarkup();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.__exampleSliderExportMarkup = markup;

    if (typeof window.initExampleSlider === "function") {
      window.initExampleSlider();
    }
  }, [markup]);

  return createElement(ExampleSlider);
};

export default {
  title: "Examples/Custom_Examples/Custom_Examples/Example Slider",
  component: ExampleSlider,
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

        return window.__exampleSliderExportMarkup || "";
      },
    },
  },
};
