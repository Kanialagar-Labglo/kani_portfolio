import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { THEME_COLOR } from '../lib/seo.js';
import { ACCENT_COLORS } from '../lib/theme.js';

// Read from disk: Vitest's CSS handling does not hand stylesheets to tests as text.
const css = readFileSync(resolve(process.cwd(), 'src/styles/tokens.css'), 'utf8');

// The custom properties declared in the first rule whose selector matches exactly.
function tokensFor(selector) {
  const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const rules = [...withoutComments.matchAll(/([^{}]+)\{([^}]*)\}/g)];
  const rule = rules.find(([, selectors]) =>
    selectors.split(',').some((part) => part.trim() === selector),
  );
  if (!rule) throw new Error(`No rule for ${selector}`);
  return Object.fromEntries(
    [...rule[2].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map(([, name, value]) => [
      name,
      value.trim(),
    ]),
  );
}

// WCAG 2.2 relative luminance and contrast ratio for #rrggbb colours.
function luminance(hex) {
  const channels = hex
    .slice(1)
    .match(/../g)
    .map((pair) => parseInt(pair, 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(a, b) {
  const [lighter, darker] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (lighter + 0.05) / (darker + 0.05);
}

const THEMES = {
  // Dark is the default, so it lives on :root and applies even before any script runs.
  dark: tokensFor(':root'),
  light: { ...tokensFor(':root'), ...tokensFor(":root[data-theme='light']") },
};

describe('theme tokens', () => {
  it('makes dark the default palette', () => {
    expect(luminance(THEMES.dark['--color-bg'])).toBeLessThan(0.02);
    expect(luminance(THEMES.light['--color-bg'])).toBeGreaterThan(0.9);
  });

  for (const [theme, tokens] of Object.entries(THEMES)) {
    describe(`${theme} theme`, () => {
      for (const foreground of [
        '--color-text',
        '--color-text-muted',
        '--color-accent',
        '--color-accent-2',
      ]) {
        for (const background of ['--color-bg', '--color-surface']) {
          it(`${foreground} on ${background} reaches 4.5:1`, () => {
            expect(contrast(tokens[foreground], tokens[background])).toBeGreaterThanOrEqual(4.5);
          });
        }
      }

      it('button text on the accent colour reaches 4.5:1', () => {
        expect(contrast(tokens['--color-bg'], tokens['--color-accent'])).toBeGreaterThanOrEqual(
          4.5,
        );
      });
    });
  }

  it('gives the browser bar the dark default background', () => {
    expect(THEME_COLOR).toBe(THEMES.dark['--color-bg']);
  });

  it.each(['dark', 'light'])('gives antd the %s accent colour', (theme) => {
    expect(ACCENT_COLORS[theme]).toBe(THEMES[theme]['--color-accent']);
  });
});
