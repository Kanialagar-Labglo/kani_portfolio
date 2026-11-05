import { describe, expect, it } from 'vitest';
import { checkBudgets, findFontFiles, findInitialAssets } from './bundle-size.js';

const html = `<!doctype html>
<html><head>
  <script type="module" crossorigin src="/kani_portfolio/assets/index-abc.js"></script>
  <link rel="modulepreload" crossorigin href="/kani_portfolio/assets/vendor-def.js">
  <link rel="stylesheet" crossorigin href="/kani_portfolio/assets/index-ghi.css">
  <link rel="icon" href="/kani_portfolio/favicon.svg">
  <script type="application/ld+json">{"@type":"Person"}</script>
</head><body></body></html>`;

describe('findInitialAssets', () => {
  it('finds the scripts and stylesheets the page loads first, relative to the build folder', () => {
    expect(findInitialAssets(html, '/kani_portfolio/')).toEqual({
      js: ['assets/index-abc.js', 'assets/vendor-def.js'],
      css: ['assets/index-ghi.css'],
    });
  });
});

describe('findFontFiles', () => {
  it('lists the woff2 fonts in the build, ignoring older woff fallbacks and other files', () => {
    expect(
      findFontFiles([
        'index-abc.js',
        'mono-latin-400-normal-x1.woff2',
        'mono-latin-400-normal-x2.woff',
        'mono-latin-700-normal-y1.woff2',
        'index-ghi.css',
      ]),
    ).toEqual(['mono-latin-400-normal-x1.woff2', 'mono-latin-700-normal-y1.woff2']);
  });
});

describe('checkBudgets', () => {
  const budgets = { js: 200 * 1024, css: 40 * 1024 };

  it('passes when both sizes are within budget', () => {
    expect(checkBudgets({ js: 150 * 1024, css: 15 * 1024 }, budgets).ok).toBe(true);
  });

  it('passes at exactly the budget', () => {
    expect(checkBudgets({ js: 200 * 1024, css: 40 * 1024 }, budgets).ok).toBe(true);
  });

  it('fails when JavaScript is over budget', () => {
    const result = checkBudgets({ js: 200 * 1024 + 1, css: 15 * 1024 }, budgets);

    expect(result.ok).toBe(false);
    expect(result.failures).toEqual(['js']);
  });

  it('fails when CSS is over budget', () => {
    expect(checkBudgets({ js: 1024, css: 41 * 1024 }, budgets).failures).toEqual(['css']);
  });

  it('fails when fonts are over their budget', () => {
    const result = checkBudgets(
      { js: 1024, css: 1024, fonts: 61 * 1024 },
      { ...budgets, fonts: 60 * 1024 },
    );

    expect(result.failures).toEqual(['fonts']);
  });
});
