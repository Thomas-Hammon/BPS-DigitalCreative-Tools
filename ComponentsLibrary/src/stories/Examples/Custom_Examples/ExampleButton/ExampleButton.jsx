import "./ExampleButton.css";
import "./ExampleButton.vanilla.js";
import cssText from "./ExampleButton.css?raw";
import jsText from "./ExampleButton.vanilla.js?raw";
import { renderToStaticMarkup } from "react-dom/server";

// This is the single source of HTML markup for both the React preview and the export.
const ExampleButtonMarkup = () => {
  return (
    <button type="button" className="example-button">
      Example Button
    </button>
  );
};

const exportMarkup = () => {
  // The exported HTML needs plain text, so we turn the JSX above into a static HTML string.
  const safeJsText = jsText.replace(/<\/script>/gi, "<\\/script>");
  const html = renderToStaticMarkup(<ExampleButtonMarkup />);

  return `<style>
${cssText}
</style>
${html}
<script reactSafe>
${safeJsText}
</script>`;
};

export const ExampleButton = () => {
  return <ExampleButtonMarkup />;
};

// The Storybook story reads this helper to fill the HTML export panel.
ExampleButton.exportMarkup = exportMarkup;
