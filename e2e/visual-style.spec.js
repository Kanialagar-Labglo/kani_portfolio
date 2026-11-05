import { expect, test } from '@playwright/test';
import { profile } from '../src/data/profile.js';
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

test.describe('Subtle motion that respects preferences', () => {
  const borderColor = (locator) =>
    locator.evaluate((element) => getComputedStyle(element).borderTopColor);
  const box = async (locator) => {
    const { x, y, width, height } = await locator.boundingBox();
    return {
      x: Math.round(x),
      y: Math.round(y),
      width: Math.round(width),
      height: Math.round(height),
    };
  };

  test('hovering a card highlights it and leaves the cards around it in place', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'hover is checked with a mouse on desktop browsers');
    await openPortfolio(page, { width: 1280 });
    const cards = region(page, 'Education').locator('.card-surface');
    await cards.first().scrollIntoViewIfNeeded();
    await page.mouse.move(0, 0);
    // Let the section's scroll-in fade finish so only the hover can move anything.
    await page.waitForFunction(() => document.getAnimations().length === 0);
    const restingBorder = await borderColor(cards.first());
    const neighbour = await box(cards.nth(1));

    await cards.first().hover();

    await expect.poll(() => borderColor(cards.first())).not.toBe(restingBorder);
    expect(await box(cards.nth(1))).toEqual(neighbour);
  });

  test('focusing a link inside a card highlights the card', async ({ page }) => {
    await openPortfolio(page);
    const card = region(page, 'Projects').locator('.card-surface').first();
    const restingBorder = await borderColor(card);

    await card.getByRole('link').first().focus();

    await expect.poll(() => borderColor(card)).not.toBe(restingBorder);
  });

  test('with reduced motion every section is fully visible as soon as it is reached', async ({
    page,
  }) => {
    await openPortfolio(page, { reducedMotion: true });
    const blocks = page.locator('[data-reveal]');
    expect(await blocks.count()).toBeGreaterThan(0);

    for (const block of await blocks.all()) {
      await block.evaluate((element) => element.scrollIntoView({ behavior: 'instant' }));
      const style = await block.evaluate((element) => {
        const computed = getComputedStyle(element);
        return { opacity: computed.opacity, transform: computed.transform };
      });
      expect(style).toEqual({ opacity: '1', transform: 'none' });
    }
  });

  test('after scrolling to the bottom every section is fully visible', async ({ page }) => {
    await openPortfolio(page);
    const blocks = page.locator('[data-reveal]');
    expect(await blocks.count()).toBeGreaterThan(0);

    // Scroll down a screen at a time, as a visitor would.
    await page.evaluate(async () => {
      while (window.scrollY + window.innerHeight < document.documentElement.scrollHeight - 1) {
        window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'instant' });
        await new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 50)));
      }
    });
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));

    for (const block of await blocks.all()) {
      await expect
        .poll(() => block.evaluate((element) => getComputedStyle(element).opacity))
        .toBe('1');
    }
  });
});

test.describe('AK brand mark', () => {
  for (const width of [360, 1280]) {
    test(`the logo link shows AK and is named after the owner at ${width}px`, async ({ page }) => {
      await openPortfolio(page, { width });
      const logo = page.getByRole('banner').getByRole('link', { name: profile.name });

      await expect(logo).toBeVisible();
      await expect(logo.getByText(profile.brandInitials, { exact: true })).toBeVisible();
      const nameShown = await logo
        .getByText(profile.name, { exact: true })
        .evaluate((element) => element.getBoundingClientRect().width > 1);
      expect(nameShown).toBe(width >= 992);
    });
  }

  test('the browser tab icon is the AK mark', async ({ page, request }) => {
    await openPortfolio(page);
    const href = await page.locator('link[rel="icon"]').getAttribute('href');

    const response = await request.get(new URL(href, page.url()).href);
    const svg = await response.text();

    expect(response.headers()['content-type']).toContain('image/svg+xml');
    expect(svg).toContain(`<title>${profile.brandInitials}</title>`);
    expect(svg).toContain('linearGradient');
    // Drawn as shapes, not text, so it looks the same without any font installed.
    expect(svg).not.toContain('<text');
  });
});
