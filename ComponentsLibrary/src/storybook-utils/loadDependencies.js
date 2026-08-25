const loadStylesheet = (href) => {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(
      `link[rel="stylesheet"][href="${href}"]`,
    );

    if (existing) {
      resolve();
      return;
    }

    const link = document.createElement("link");

    link.rel = "stylesheet";
    link.href = href;

    link.onload = resolve;
    link.onerror = () => {
      reject(new Error(`Failed to load stylesheet: ${href}`));
    };

    document.head.appendChild(link);
  });
};

const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);

    if (existing) {
      resolve();
      return;
    }

    const script = document.createElement("script");

    script.src = src;

    script.onload = resolve;
    script.onerror = () => {
      reject(new Error(`Failed to load script: ${src}`));
    };

    document.body.appendChild(script);
  });
};

export const loadDependencies = async (dependencies = {}) => {
  const { stylesheets = [], scripts = [] } = dependencies;

  await Promise.all(stylesheets.map((href) => loadStylesheet(href)));

  for (const src of scripts) {
    await loadScript(src);
  }
};
