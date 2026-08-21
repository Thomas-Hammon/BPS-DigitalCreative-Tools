import { createElement, useEffect } from "react";
import { ExampleButton } from "./ExampleButton";

const ExportPreview = () => {
  const markup = ExampleButton.exportMarkup();

  useEffect(() => {
    // Save the latest export string on window so the HTML addon can read it.
    if (typeof window !== "undefined") {
      window.__exampleButtonExportMarkup = markup;
    }
  }, [markup]);

  // Render the normal React component in the Storybook canvas.
  return createElement(ExampleButton);
};

export default {
  title: "Custom_Examples/Custom_Examples/Example Button",
  component: ExampleButton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    controls: {
      disable: true,
    },
  },
};

export const Default = {
  render: ExportPreview,
  parameters: {
    html: {
      // Show the exported HTML snippet instead of Storybook's internal wrapper markup.
      transform: () => {
        if (typeof window === "undefined") {
          return "";
        }

        return window.__exampleButtonExportMarkup || "";
      },
    },
  },
};
