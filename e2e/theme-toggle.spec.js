import { expect, test } from '@playwright/test';
import { openPortfolio, setViewportWidth } from './support/page.js';
import { getVisibleTheme, themeToggle } from './support/theme.js';

test.describe('Initial theme follows the system preference', () => {
  for (const [systemTheme, expected] of [
    ['dark', 'dark'],
    ['light', 'light'],
    ['no-preference', 'light'],
  ]) {
    test(`first visit with ${systemTheme} system preference shows the ${expected} theme`, async ({
      page,
    }) => {
      await openPortfolio(page, { systemTheme });

      await expect.poll(() => getVisibleTheme(page)).toBe(expected);
    });
  }
});

test.describe('Visitor can switch theme', () => {
  test('switching from light to dark restyles the page without reloading', async ({ page }) => {
    await openPortfolio(page, { systemTheme: 'light' });
    await page.evaluate(() => {
      window.__samePageMarker = true;
    });

    await themeToggle(page).click();

    await expect.poll(() => getVisibleTheme(page)).toBe('dark');
    expect(await page.evaluate(() => window.__samePageMarker)).toBe(true);
  });

  test('switching from dark back to light', async ({ page }) => {
    await openPortfolio(page, { systemTheme: 'dark' });

    await themeToggle(page).click();

    await expect.poll(() => getVisibleTheme(page)).toBe('light');
  });

  test('interactive components follow the theme', async ({ page }) => {
    await openPortfolio(page, { systemTheme: 'light' });
    const toggle = themeToggle(page);
    const lightColor = await toggle.evaluate((element) => getComputedStyle(element).color);

    await toggle.click();

    await expect
      .poll(() => toggle.evaluate((element) => getComputedStyle(element).color))
      .not.toBe(lightColor);
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
  test('a saved dark choice wins over a light system preference', async ({ page }) => {
    await openPortfolio(page, { systemTheme: 'light', theme: 'dark' });

    await expect.poll(() => getVisibleTheme(page)).toBe('dark');
  });

  test('a choice made on one visit is used on the next', async ({ page }) => {
    await openPortfolio(page, { systemTheme: 'light' });
    await themeToggle(page).click();
    await expect.poll(() => getVisibleTheme(page)).toBe('dark');

    await page.reload();

    await expect.poll(() => getVisibleTheme(page)).toBe('dark');
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
    await openPortfolio(page, { systemTheme: 'light' });

    await themeToggle(page).click();

    await expect.poll(() => getVisibleTheme(page)).toBe('dark');
    expect(errors).toEqual([]);
  });
});

test.describe('No flash of the wrong theme', () => {
  test('saved dark theme is applied before the app script runs', async ({ page }) => {
    // Block the app bundle: anything visible now came from the HTML and CSS alone.
    await page.route('**/assets/*.js', (route) => route.abort());

    await openPortfolio(page, { systemTheme: 'light', theme: 'dark' });

    expect(await getVisibleTheme(page)).toBe('dark');
  });
});

test.describe('Accessible theme toggle', () => {
  for (const [systemTheme, label] of [
    ['light', 'Switch to dark theme'],
    ['dark', 'Switch to light theme'],
  ]) {
    test(`in the ${systemTheme} theme the toggle is named "${label}"`, async ({ page }) => {
      await openPortfolio(page, { systemTheme });

      await expect(page.getByRole('button', { name: label })).toBeVisible();
    });
  }

  test('keyboard visitor switches theme with Enter', async ({ page }) => {
    await openPortfolio(page, { systemTheme: 'light' });
    await themeToggle(page).focus();

    await page.keyboard.press('Enter');

    await expect.poll(() => getVisibleTheme(page)).toBe('dark');
  });

  test('colours change without animation when reduced motion is requested', async ({ page }) => {
    await openPortfolio(page, { systemTheme: 'light', reducedMotion: true });

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
