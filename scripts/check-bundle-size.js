// Fails when the JavaScript or CSS loaded for the first page view exceeds its gzipped budget,
// or the self-hosted web fonts exceed theirs (ADR-0005).
// Usage: npm run build && npm run check:size
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
import { siteConfig } from '../site.config.js';
import { checkBudgets, findFontFiles, findInitialAssets } from './bundle-size.js';

const DIST = 'dist';
// Budgets from the site-quality spec. Fonts are already compressed (woff2), so they are measured as-is.
const BUDGETS = { js: 100 * 1024, css: 40 * 1024, fonts: 60 * 1024 };

const gzippedSize = (file) => gzipSync(readFileSync(join(DIST, file))).length;
const kilobytes = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

const html = readFileSync(join(DIST, 'index.html'), 'utf8');
const assets = findInitialAssets(html, siteConfig.basePath);
const fontFiles = findFontFiles(readdirSync(join(DIST, 'assets'))).map((name) =>
  join('assets', name),
);
const sizes = {
  js: assets.js.reduce((total, file) => total + gzippedSize(file), 0),
  css: assets.css.reduce((total, file) => total + gzippedSize(file), 0),
  fonts: fontFiles.reduce((total, file) => total + statSync(join(DIST, file)).size, 0),
};
const result = checkBudgets(sizes, BUDGETS);

const LABELS = { js: 'JS    gzipped', css: 'CSS   gzipped', fonts: 'Fonts woff2' };
for (const kind of Object.keys(BUDGETS)) {
  const status = result.failures.includes(kind) ? 'OVER BUDGET' : 'ok';
  console.log(
    `${LABELS[kind]}  ${kilobytes(sizes[kind]).padStart(9)} / ${kilobytes(BUDGETS[kind])}  ${status}`,
  );
}

if (!result.ok) {
  process.exitCode = 1;
}
