// Pure helpers for scripts/check-bundle-size.js.

const attributeValues = (html, pattern) => [...html.matchAll(pattern)].map((match) => match[1]);

/**
 * Scripts and stylesheets index.html loads up front, as paths inside the build folder.
 * @param {string} html built index.html
 * @param {string} basePath the site base path, e.g. '/kani_portfolio/'
 * @returns {{ js: string[], css: string[] }}
 */
export function findInitialAssets(html, basePath) {
  const toBuildPath = (url) => (url.startsWith(basePath) ? url.slice(basePath.length) : url);
  const js = [
    ...attributeValues(html, /<script[^>]*type="module"[^>]*\ssrc="([^"]+)"/g),
    ...attributeValues(html, /<link[^>]*rel="modulepreload"[^>]*\shref="([^"]+)"/g),
  ];
  const css = attributeValues(html, /<link[^>]*rel="stylesheet"[^>]*\shref="([^"]+)"/g);
  return { js: js.map(toBuildPath), css: css.map(toBuildPath) };
}

/**
 * The web font files a modern browser downloads: the woff2 files in the build.
 * Older woff fallbacks are emitted too but never requested by supported browsers.
 * @param {string[]} fileNames names of the files in the build's assets folder
 * @returns {string[]}
 */
export function findFontFiles(fileNames) {
  return fileNames.filter((name) => name.endsWith('.woff2'));
}

/**
 * Compare sizes with their budgets, for every kind that has a budget.
 * @param {Record<string, number>} sizes bytes, e.g. { js, css, fonts }
 * @param {Record<string, number>} budgets bytes for the same kinds
 * @returns {{ ok: boolean, failures: string[] }}
 */
export function checkBudgets(sizes, budgets) {
  const failures = Object.keys(budgets).filter((kind) => sizes[kind] > budgets[kind]);
  return { ok: failures.length === 0, failures };
}
