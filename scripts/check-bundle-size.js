// Fails when the JavaScript or CSS loaded for the first page view exceeds its gzipped budget.
// Usage: npm run build && npm run check:size
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
import { siteConfig } from '../site.config.js';
import { checkBudgets, findInitialAssets } from './bundle-size.js';

const DIST = 'dist';
// Budgets from the site-quality spec.
const BUDGETS = { js: 200 * 1024, css: 40 * 1024 };

const gzippedSize = (file) => gzipSync(readFileSync(join(DIST, file))).length;
const kilobytes = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

const html = readFileSync(join(DIST, 'index.html'), 'utf8');
const assets = findInitialAssets(html, siteConfig.basePath);
const sizes = {
  js: assets.js.reduce((total, file) => total + gzippedSize(file), 0),
  css: assets.css.reduce((total, file) => total + gzippedSize(file), 0),
};
const result = checkBudgets(sizes, BUDGETS);

for (const kind of ['js', 'css']) {
  const status = result.failures.includes(kind) ? 'OVER BUDGET' : 'ok';
  console.log(
    `${kind.toUpperCase().padEnd(3)} ${kilobytes(sizes[kind]).padStart(9)} / ${kilobytes(BUDGETS[kind])} gzipped  ${status}`,
  );
}

if (!result.ok) {
  process.exitCode = 1;
}
