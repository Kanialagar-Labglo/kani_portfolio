import { expect, test } from '@playwright/test';
import { openPortfolio } from './support/page.js';

const region = (page, name) => page.getByRole('main').getByRole('region', { name });
const fontFamily = (locator) => locator.evaluate((element) => getComputedStyle(element).fontFamily);

test.describe('Monospace display typography', () => {
  test('headings use the display font and body text uses the system font', async ({ page }) => {
    await openPortfolio(page);
    await page.evaluate(() => document.fonts.ready);

    const heading = page.getByRole('heading', { level: 2, name: 'Skills' });
    expect(await fontFamily(heading)).toMatch(/^"?JetBrains Mono"?/);
    expect(await page.evaluate(() => document.fonts.check('700 16px "JetBrains Mono"'))).toBe(true);

    const paragraph = region(page, 'About Me').locator('p').first();
    expect(await fontFamily(paragraph)).not.toMatch(/JetBrains Mono/);
  });

  test('every font file comes from the site itself', async ({ page }) => {
    const fontRequests = [];
    page.on('request', (request) => {
      if (request.resourceType() === 'font') fontRequests.push(request.url());
    });

    await openPortfolio(page);
    await page.evaluate(() => document.fonts.ready);

    const siteOrigin = new URL(page.url()).origin;
    expect(fontRequests.length).toBeGreaterThan(0);
    for (const url of fontRequests) {
      expect(new URL(url).origin).toBe(siteOrigin);
    }
  });

  test('headings are readable before the display font has loaded', async ({ page }) => {
    // Hold every font response so the page has to paint with the fallback font first.
    let releaseFonts;
    const fontsHeld = new Promise((resolve) => {
      releaseFonts = resolve;
    });
    await page.route(/\.woff2?$/, async (route) => {
      await fontsHeld;
      await route.continue();
    });

    // Some browsers hold the load event for fonts, so only wait for the HTML.
    await page.goto('./', { waitUntil: 'domcontentloaded' });

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const box = await page.getByRole('heading', { level: 1 }).boundingBox();
    expect(box.width).toBeGreaterThan(0);
    const displayFontLoaded = await page.evaluate(() =>
      [...document.fonts].some(
        (face) => face.family.includes('JetBrains Mono') && face.status === 'loaded',
      ),
    );
    expect(displayFontLoaded).toBe(false);
    releaseFonts();
  });
});
