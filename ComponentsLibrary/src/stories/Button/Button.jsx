import { renderToStaticMarkup } from "react-dom/server";

import "./button.css";
import "./Button.vanilla.js";

import cssText from "./button.css?raw";
import jsText from "./Button.vanilla.js?raw";

import { ButtonDependencies } from "./Button.dependencies.js";
import { createExportMarkup } from "../../storybook-utils/createExportMarkup";

const ButtonMarkup = ({ label = "Shop Now", variant = "light" }) => {
  const variantClass = variant === "dark" ? "shop__black" : "";

  return <p className={`shop__btn ${variantClass}`.trim()}>{label}</p>;
};

export const Button = ({ label = "Shop Now", variant = "light" }) => {
  return <ButtonMarkup label={label} variant={variant} />;
};

Button.exportMarkup = ({ label = "Shop Now", variant = "light" } = {}) => {
  const html = renderToStaticMarkup(
    <ButtonMarkup label={label} variant={variant} />,
  );

  return createExportMarkup({
    markup: html,
    cssText,
    jsText,
    scriptInit: "",
    dependencies: ButtonDependencies,
  });
};
