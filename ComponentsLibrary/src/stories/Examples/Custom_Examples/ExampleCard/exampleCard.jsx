import "./exampleCard.css";
import "./exampleCard.vanilla.js";
import cssText from "./exampleCard.css?raw";
import jsText from "./exampleCard.vanilla.js?raw";
import { renderToStaticMarkup } from "react-dom/server";

// This is the single source of markup for both the React preview and the export.
const ExampleCardMarkup = () => {
  return (
    <div className="example-card">
      <img src="https://placehold.co/1200x400." alt="Example" />
      <h2>Example Card</h2>
      <p>This is an example card component.</p>
    </div>
  );
};

const exportMarkup = () => {
  // The exported HTML needs plain text, so we turn the JSX above into a static HTML string.
  const safeJsText = jsText.replace(/<\/script>/gi, "<\\/script>");
  const html = renderToStaticMarkup(<ExampleCardMarkup />);

  return `<style>
${cssText}
</style>
${html}
<script reactSafe>
${safeJsText}
</script>`;
};

export const ExampleCard = () => {
  return <ExampleCardMarkup />;
};

// The Storybook story reads this helper to fill the HTML export panel.
ExampleCard.exportMarkup = exportMarkup;
