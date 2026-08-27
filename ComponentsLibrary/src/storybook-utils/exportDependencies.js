export const exportDependencies = (dependencies = {}) => {
  const { stylesheets = [], scripts = [] } = dependencies;

  const stylesheetsMarkup = stylesheets
    .map(
      (href) => `<link
  rel="stylesheet"
  href="${href}"
/>`,
    )
    .join("\n\n");

  const scriptsMarkup = scripts
    .map(
      (src) => `<script
  reactSafe
  src="${src}"
></script>`,
    )
    .join("\n\n");

  return {
    stylesheets: stylesheetsMarkup,
    scripts: scriptsMarkup,
  };
};
