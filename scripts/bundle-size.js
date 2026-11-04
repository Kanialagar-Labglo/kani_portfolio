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
 * Compare gzipped sizes with their budgets.
 * @param {{ js: number, css: number }} sizes bytes
 * @param {{ js: number, css: number }} budgets bytes
 * @returns {{ ok: boolean, failures: ('js' | 'css')[] }}
 */
export function checkBudgets(sizes, budgets) {
  const failures = ['js', 'css'].filter((kind) => sizes[kind] > budgets[kind]);
  return { ok: failures.length === 0, failures };
}
