import { expect, test } from '@playwright/test';
import { openPortfolio } from './support/page.js';
import { goToSection } from './support/navigation.js';

const SECTION_NAMES = ['About', 'Skills', 'Projects', 'Experience', 'Contact'];

test.describe('Single-page semantic structure', () => {
  test('page exposes banner, navigation, main, and content info landmarks', async ({ page }) => {
    await openPortfolio(page);

    await expect(page.getByRole('banner')).toHaveCount(1);
    await expect(page.getByRole('navigation', { name: 'Primary' })).toHaveCount(1);
    await expect(page.getByRole('main')).toHaveCount(1);
    await expect(page.getByRole('contentinfo')).toHaveCount(1);
  });

  test('each content area is its own labelled region inside main', async ({ page }) => {
    await openPortfolio(page);
    const main = page.getByRole('main');

    await expect(main.getByRole('region')).toHaveCount(SECTION_NAMES.length + 1);
    for (const name of SECTION_NAMES) {
      await expect(main.getByRole('region', { name })).toHaveCount(1);
    }
  });

  test('page has exactly one level-one heading', async ({ page }) => {
    await openPortfolio(page);

    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  });

  test('section headings are level two', async ({ page }) => {
    await openPortfolio(page);

    for (const name of SECTION_NAMES) {
      await expect(page.getByRole('heading', { level: 2, name })).toHaveCount(1);
    }
  });

  test('heading levels never skip a level', async ({ page }) => {
    await openPortfolio(page);

    const levels = await page
      .locator('h1, h2, h3, h4, h5, h6')
      .evaluateAll((headings) => headings.map((heading) => Number(heading.tagName[1])));

    expect(levels[0]).toBe(1);
    levels.slice(1).forEach((level, index) => {
      expect(level - levels[index], `heading ${index + 2} jumps a level`).toBeLessThanOrEqual(1);
    });
  });
});

test.describe('No route changes', () => {
  test('moving between sections keeps the same page', async ({ page }) => {
    await openPortfolio(page);
    const path = new URL(page.url()).pathname;
    await page.evaluate(() => {
      window.__samePageMarker = true;
    });

    for (const name of SECTION_NAMES) {
      await goToSection(page, name);
      await expect(page.getByRole('heading', { level: 2, name })).toBeInViewport();
    }

    expect(new URL(page.url()).pathname).toBe(path);
    expect(await page.evaluate(() => window.__samePageMarker)).toBe(true);
  });
});

test.describe('Mobile-first responsive layout', () => {
  for (const width of [360, 768, 1024, 1440, 1920]) {
    test(`layout fits a ${width}px viewport without horizontal scrolling`, async ({ page }) => {
      await openPortfolio(page, { width });

      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth);
    });

    test(`no visible element is cut off at ${width}px`, async ({ page }) => {
      await openPortfolio(page, { width });

      const clipped = await page.evaluate(() => {
        const viewportWidth = document.documentElement.clientWidth;
        return [...document.querySelectorAll('body *')]
          .filter((element) => {
            const rect = element.getBoundingClientRect();
            const style = getComputedStyle(element);
            const visible = rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden';
            const visuallyHidden = style.position === 'absolute' && rect.width <= 1;
            return visible && !visuallyHidden && (rect.left < -1 || rect.right > viewportWidth + 1);
          })
          .map((element) => element.tagName.toLowerCase() + (element.id ? `#${element.id}` : ''));
      });
      expect(clipped).toEqual([]);
    });
  }

  test('project cards stack in a single column at 360px', async ({ page }) => {
    await openPortfolio(page, { width: 360 });
    const cards = page.getByRole('region', { name: 'Projects' }).getByRole('article');

    const lefts = await cards.evaluateAll((elements) =>
      elements.map((element) => Math.round(element.getBoundingClientRect().left)),
    );
    expect(lefts.length).toBeGreaterThan(1);
    expect(new Set(lefts).size).toBe(1);
  });
});

test.describe('Skip to main content', () => {
  test.skip(({ isMobile }) => isMobile, 'keyboard navigation is checked on desktop browsers');

  test('first Tab press shows the skip link', async ({ page }) => {
    await openPortfolio(page);

    await page.keyboard.press('Tab');

    const skipLink = page.getByRole('link', { name: 'Skip to main content' });
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeVisible();
  });

  test('activating the skip link moves focus to main', async ({ page }) => {
    await openPortfolio(page);

    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    await expect(page.getByRole('main')).toBeFocused();
  });

  test('skip link is hidden until it receives focus', async ({ page }) => {
    await openPortfolio(page);

    const box = await page.getByRole('link', { name: 'Skip to main content' }).boundingBox();
    expect(box === null || box.width <= 1 || box.height <= 1).toBe(true);
  });
});

test.describe('Message when JavaScript is unavailable', () => {
  test.use({ javaScriptEnabled: false });

  test('visitor with JavaScript disabled sees a message', async ({ page }) => {
    await openPortfolio(page);

    // Playwright's text matchers ignore <noscript> content, so read the element's text directly.
    const message = page.locator('noscript');
    await expect(message).toBeVisible();
    expect(await message.textContent()).toContain('This portfolio needs JavaScript to display');
  });
});
