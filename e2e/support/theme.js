// Helpers for checking which theme the visitor actually sees.

/**
 * Return 'dark' or 'light' based on the page's rendered background colour.
 * @param {import('@playwright/test').Page} page
 */
export async function getVisibleTheme(page) {
  const luminance = await page.evaluate(() => {
    const [r, g, b] = getComputedStyle(document.body)
      .backgroundColor.match(/\d+(\.\d+)?/g)
      .slice(0, 3)
      .map(Number);
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  });
  return luminance < 0.5 ? 'dark' : 'light';
}

/**
 * The theme toggle, whichever action it currently offers.
 * @param {import('@playwright/test').Page} page
 */
export function themeToggle(page) {
  return page.getByRole('button', { name: /^Switch to (dark|light) theme$/ });
}
