// Shared helpers for opening the portfolio in a known state.

const THEME_STORAGE_KEY = 'theme';

/**
 * Open the portfolio page.
 * @param {import('@playwright/test').Page} page
 * @param {{ theme?: 'light' | 'dark', systemTheme?: 'light' | 'dark' | 'no-preference', width?: number, reducedMotion?: boolean, path?: string }} [options]
 */
export async function openPortfolio(page, options = {}) {
  const { theme, systemTheme, width, reducedMotion, path = './' } = options;

  if (width) {
    await setViewportWidth(page, width);
  }
  if (systemTheme) {
    await page.emulateMedia({ colorScheme: systemTheme });
  }
  if (reducedMotion) {
    await emulateReducedMotion(page);
  }
  if (theme) {
    await saveThemeChoice(page, theme);
  }

  return page.goto(path);
}

/**
 * Store a theme choice before the page loads, as a returning visitor would have.
 * @param {import('@playwright/test').Page} page
 * @param {'light' | 'dark'} theme
 */
export async function saveThemeChoice(page, theme) {
  await page.addInitScript(
    ([key, value]) => {
      window.localStorage.setItem(key, value);
    },
    [THEME_STORAGE_KEY, theme],
  );
}

/**
 * Change the viewport width while keeping the current height.
 * @param {import('@playwright/test').Page} page
 * @param {number} width
 */
export async function setViewportWidth(page, width) {
  const height = page.viewportSize()?.height ?? 900;
  await page.setViewportSize({ width, height });
}

/**
 * Make the page see a reduced-motion preference.
 * @param {import('@playwright/test').Page} page
 */
export async function emulateReducedMotion(page) {
  await page.emulateMedia({ reducedMotion: 'reduce' });
}
