import { expect, test } from '@playwright/test';
import { openPortfolio, setViewportWidth } from './support/page.js';
import { getVisibleTheme, themeToggle } from './support/theme.js';

test.describe('Dark theme by default', () => {
  for (const systemTheme of ['dark', 'light', 'no-preference']) {
    test(`first visit with ${systemTheme} system preference shows the dark theme`, async ({
      page,
    }) => {
      await openPortfolio(page, { systemTheme });

      await expect.poll(() => getVisibleTheme(page)).toBe('dark');
    });
  }
});

test.describe('Visitor can switch theme', () => {
  test('switching from light to dark restyles the page without reloading', async ({ page }) => {
    await openPortfolio(page, { theme: 'light' });
    await page.evaluate(() => {
      window.__samePageMarker = true;
    });

    await themeToggle(page).click();

    await expect.poll(() => getVisibleTheme(page)).toBe('dark');
    expect(await page.evaluate(() => window.__samePageMarker)).toBe(true);
  });

  test('switching from dark back to light', async ({ page }) => {
    await openPortfolio(page);

    await themeToggle(page).click();

    await expect.poll(() => getVisibleTheme(page)).toBe('light');
  });

  test('interactive components follow the theme', async ({ page }) => {
    await openPortfolio(page);
    const toggle = themeToggle(page);
    const darkColor = await toggle.evaluate((element) => getComputedStyle(element).color);

    await toggle.click();

    await expect
      .poll(() => toggle.evaluate((element) => getComputedStyle(element).color))
      .not.toBe(darkColor);
  });

  for (const width of [360, 768, 1440]) {
    test(`theme toggle is visible at ${width}px`, async ({ page }) => {
      await setViewportWidth(page, width);
      await openPortfolio(page);

      await expect(themeToggle(page)).toBeVisible();
    });
  }
});

test.describe('Theme choice is remembered', () => {
  test('a saved light choice wins over the dark default', async ({ page }) => {
    await openPortfolio(page, { systemTheme: 'dark', theme: 'light' });

    await expect.poll(() => getVisibleTheme(page)).toBe('light');
  });

  test('a choice made on one visit is used on the next', async ({ page }) => {
    await openPortfolio(page);
    await themeToggle(page).click();
    await expect.poll(() => getVisibleTheme(page)).toBe('light');

    await page.reload();

    await expect.poll(() => getVisibleTheme(page)).toBe('light');
  });

  test('theme still switches when the browser blocks site storage', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', {
        get() {
          throw new DOMException('Storage is blocked', 'SecurityError');
        },
      });
    });
    await openPortfolio(page);

    await themeToggle(page).click();

    await expect.poll(() => getVisibleTheme(page)).toBe('light');
    expect(errors).toEqual([]);
  });
});

test.describe('No flash of the wrong theme', () => {
  // Each test blocks the app bundle: anything visible came from the HTML and CSS alone.
  for (const [situation, options, expected] of [
    ['a first visit with a light device', { systemTheme: 'light' }, 'dark'],
    ['a saved dark choice', { systemTheme: 'light', theme: 'dark' }, 'dark'],
    ['a saved light choice', { systemTheme: 'dark', theme: 'light' }, 'light'],
  ]) {
    test(`${situation} is painted ${expected} before the app script runs`, async ({ page }) => {
      await page.route('**/assets/*.js', (route) => route.abort());

      await openPortfolio(page, options);

      expect(await getVisibleTheme(page)).toBe(expected);
    });
  }
});

test.describe('Accessible theme toggle', () => {
  for (const [theme, label] of [
    ['light', 'Switch to dark theme'],
    ['dark', 'Switch to light theme'],
  ]) {
    test(`in the ${theme} theme the toggle is named "${label}"`, async ({ page }) => {
      await openPortfolio(page, { theme });

      await expect(page.getByRole('button', { name: label })).toBeVisible();
    });
  }

  test('keyboard visitor switches theme with Enter', async ({ page }) => {
    await openPortfolio(page);
    await themeToggle(page).focus();

    await page.keyboard.press('Enter');

    await expect.poll(() => getVisibleTheme(page)).toBe('light');
  });

  test('colours change without animation when reduced motion is requested', async ({ page }) => {
    await openPortfolio(page, { reducedMotion: true });

    const durations = await page.evaluate(() =>
      [document.body, document.querySelector('header button')]
        .filter(Boolean)
        .map((element) => getComputedStyle(element).transitionDuration),
    );

    expect(durations.length).toBe(2);
    for (const duration of durations) {
      expect(duration.split(',').every((value) => parseFloat(value) === 0)).toBe(true);
    }
  });
});
