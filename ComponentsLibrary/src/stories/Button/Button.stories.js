import { createElement, useEffect } from "react";
import { Button } from "./Button";
import { ButtonDependencies } from "./Button.dependencies";
import { loadDependencies } from "../../storybook-utils/loadDependencies";

const ExportPreview = (args) => {
  const markup = Button.exportMarkup(args);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.__buttonExportMarkup = markup;

    loadDependencies(ButtonDependencies).catch((error) => {
      console.error("Failed to load Button dependencies:", error);
    });
  }, [markup]);

  // Render the normal React component in the Storybook canvas.
  return createElement(Button, args);
};

export default {
  title: "Button",
  component: Button,
  args: {
    label: "Shop Now",
    variant: "light",
  },
  argTypes: {
    label: {
      control: "text",
    },
    variant: {
      control: "radio",
      options: ["light", "dark"],
    },
  },
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    controls: {
      disable: false,
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

        return window.__buttonExportMarkup || "";
      },
    },
  },
};
