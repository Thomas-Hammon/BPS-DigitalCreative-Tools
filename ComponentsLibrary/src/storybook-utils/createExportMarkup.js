import { exportDependencies } from "./exportDependencies";

export const createExportMarkup = ({
  markup = "",
  cssText = "",
  jsText = "",
  scriptInit = "",
  dependencies = {},
} = {}) => {
  const dependencyMarkup = exportDependencies(dependencies);

  const cssBlock =
    cssText && cssText.trim()
      ? `
<style>
${cssText}
</style>
`
      : "";

  const safeJsText =
    jsText && jsText.trim()
      ? jsText.replace(/<\/script>/gi, "<\\/script>")
      : "";

  const scriptBlock = safeJsText
    ? `
<script reactSafe>
${safeJsText}
${scriptInit}
</script>
`
    : "";

  return `${dependencyMarkup.stylesheets}

${cssBlock}${markup}

${dependencyMarkup.scripts}
${scriptBlock}`.trim();
};
