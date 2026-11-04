import { expect, test } from '@playwright/test';
import { openPortfolio } from './support/page.js';
import { expectNoSeriousA11yViolations } from './support/a11y.js';
import { getVisibleTheme, themeToggle } from './support/theme.js';
import { goToSection } from './support/navigation.js';

test.describe('Supported browsers', () => {
  test('core journey: open, go to Projects, switch theme', async ({ page }) => {
    await openPortfolio(page, { systemTheme: 'light' });

    await goToSection(page, 'Projects');
    await expect(page.getByRole('heading', { level: 2, name: 'Projects' })).toBeInViewport();

    await themeToggle(page).click();
    await expect.poll(() => getVisibleTheme(page)).toBe('dark');
  });
});

test.describe('Accessibility', () => {
  for (const theme of ['light', 'dark']) {
    test(`automated check finds no serious issues in the ${theme} theme`, async ({ page }) => {
      await openPortfolio(page, { systemTheme: theme });
      await expect.poll(() => getVisibleTheme(page)).toBe(theme);

      await expectNoSeriousA11yViolations(page);
    });
  }

  test('keyboard-only visit reaches every control in order with visible focus', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'keyboard navigation is checked on desktop browsers');
    await openPortfolio(page, { reducedMotion: true });

    // Number the visible controls in document order, then Tab through them.
    const expectedCount = await page.evaluate(() => {
      const controls = [...document.querySelectorAll('a[href], button:not([disabled])')].filter(
        (element) => element.getClientRects().length > 0 || element.classList.contains('skip-link'),
      );
      controls.forEach((element, index) => element.setAttribute('data-tab-order', index));
      return controls.length;
    });
    expect(expectedCount).toBeGreaterThan(10);

    const visited = [];
    for (let press = 0; press < expectedCount; press += 1) {
      await page.keyboard.press('Tab');
      const focus = await page.evaluate(() => {
        const element = document.activeElement;
        const style = getComputedStyle(element);
        const box = element.getBoundingClientRect();
        return {
          order: Number(element.getAttribute('data-tab-order')),
          label: (element.getAttribute('aria-label') || element.textContent).trim().slice(0, 40),
          indicated: style.outlineStyle !== 'none' || style.boxShadow !== 'none',
          onScreen: box.width > 1 && box.height > 1,
        };
      });
      visited.push(focus);
      expect(focus.indicated, `no visible focus on "${focus.label}"`).toBe(true);
      expect(focus.onScreen, `focused "${focus.label}" is not visible`).toBe(true);
    }

    expect(visited.map((focus) => focus.order)).toEqual([...Array(expectedCount).keys()]);
  });
});

test.describe('Below-the-fold images load lazily', () => {
  test('images below the first screen are not downloaded before scrolling', async ({ page }) => {
    const requested = [];
    page.on('request', (request) => {
      if (request.resourceType() === 'image') requested.push(request.url());
    });
    await openPortfolio(page);

    const belowFold = await page.evaluate(() =>
      [...document.querySelectorAll('main img')]
        .filter((image) => image.getBoundingClientRect().top > window.innerHeight * 2)
        .map((image) => ({ src: image.currentSrc || image.src, loading: image.loading })),
    );
    test.skip(
      belowFold.length === 0,
      'placeholder content has no images below the fold; ProjectCard unit tests cover loading="lazy"',
    );

    for (const image of belowFold) {
      expect(image.loading).toBe('lazy');
      expect(requested).not.toContain(image.src);
    }
  });
});
