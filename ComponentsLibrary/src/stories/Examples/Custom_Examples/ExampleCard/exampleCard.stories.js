import { createElement, useEffect } from "react";
import { ExampleCard } from "./exampleCard";

const ExportPreview = () => {
  const markup = ExampleCard.exportMarkup();

  useEffect(() => {
    // Save the latest export string on window so the HTML addon can read it.
    if (typeof window !== "undefined") {
      window.__exampleCardExportMarkup = markup;
    }
  }, [markup]);

  // Render the normal React component in the Storybook canvas.
  return createElement(ExampleCard);
};

export default {
  title: "Examples/Custom_Examples/Example Card",
  component: ExampleCard,
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

        return window.__exampleCardExportMarkup || "";
      },
    },
  },
};
