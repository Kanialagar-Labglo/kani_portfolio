import { expect, test } from '@playwright/test';
import { profile } from '../src/data/profile.js';
import { openPortfolio, setViewportWidth } from './support/page.js';
import {
  goToSection,
  menuButton,
  menuDialog,
  scrollSectionToTop,
  sectionLinks,
  useShortViewport,
} from './support/navigation.js';

const SECTION_LINK_NAMES = [
  'Home',
  'About Me',
  'Skills',
  'Projects',
  'Experience',
  'Education',
  'Contact',
];

test.describe('Sticky header', () => {
  test('header stays at the top while scrolling to Contact', async ({ page }) => {
    await openPortfolio(page);
    await useShortViewport(page);

    await scrollSectionToTop(page, 'contact');

    const header = page.getByRole('banner');
    await expect(header).toBeInViewport();
    expect((await header.boundingBox()).y).toBeLessThanOrEqual(1);
  });
});

test.describe('In-page section navigation', () => {
  test('navigation lists every visible section in page order', async ({ page }) => {
    await openPortfolio(page);

    const links = await sectionLinks(page);

    // Only the section list: the menu also holds the résumé download.
    await expect(links.getByRole('listitem').getByRole('link')).toHaveText(SECTION_LINK_NAMES);
  });

  test('choosing Projects shows its heading below the header', async ({ page }) => {
    await openPortfolio(page);
    await useShortViewport(page);

    await goToSection(page, 'Projects');

    const heading = page.getByRole('heading', { level: 2, name: 'Projects' });
    await expect(heading).toBeInViewport();
    await expect
      .poll(async () => {
        const headerBox = await page.getByRole('banner').boundingBox();
        const headingBox = await heading.boundingBox();
        return headingBox.y >= headerBox.y + headerBox.height - 1;
      })
      .toBe(true);
  });
});

test.describe('Scrolling respects motion preferences', () => {
  test.skip(({ isMobile }) => isMobile, 'scroll behaviour is checked with inline desktop links');

  async function scrollPositionsAfterChoosing(page, name) {
    await page.evaluate(() => {
      window.__scrollPositions = [];
      const start = performance.now();
      const sample = () => {
        window.__scrollPositions.push(Math.round(window.scrollY));
        if (performance.now() - start < 900) requestAnimationFrame(sample);
      };
      requestAnimationFrame(sample);
    });
    await goToSection(page, name);
    await page.waitForTimeout(1000);
    const positions = await page.evaluate(() => window.__scrollPositions);
    return [...new Set(positions.filter((position) => position > 0))];
  }

  test('scrolls smoothly by default', async ({ page }) => {
    await openPortfolio(page);
    await useShortViewport(page);

    const distinctPositions = await scrollPositionsAfterChoosing(page, 'Contact');

    expect(distinctPositions.length).toBeGreaterThan(2);
  });

  test('jumps instantly when reduced motion is requested', async ({ page }) => {
    await openPortfolio(page, { reducedMotion: true });
    await useShortViewport(page);

    const distinctPositions = await scrollPositionsAfterChoosing(page, 'Contact');

    expect(distinctPositions.length).toBe(1);
  });
});

test.describe('Active section highlighting', () => {
  test('the link for the section in view is marked current', async ({ page }) => {
    await openPortfolio(page);
    await useShortViewport(page);

    await scrollSectionToTop(page, 'skills');
    const links = await sectionLinks(page);

    await expect(links.getByRole('link', { name: 'Skills', exact: true })).toHaveAttribute(
      'aria-current',
      'location',
    );
    await expect(links.locator('[aria-current]')).toHaveCount(1);
  });

  test('Contact is current at the bottom of the page', async ({ page }) => {
    await openPortfolio(page);
    await useShortViewport(page);

    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    const links = await sectionLinks(page);

    await expect(links.getByRole('link', { name: 'Contact', exact: true })).toHaveAttribute(
      'aria-current',
      'location',
    );
  });
});

test.describe('Shareable section links', () => {
  test('choosing Contact updates the address to #contact', async ({ page }) => {
    await openPortfolio(page);

    await goToSection(page, 'Contact');

    await expect(page).toHaveURL(/#contact$/);
  });

  test('opening a link to #projects shows Projects', async ({ page }) => {
    await useShortViewport(page);

    await openPortfolio(page, { path: './#projects' });

    await expect(page.getByRole('heading', { level: 2, name: 'Projects' })).toBeInViewport();
  });

  test('scrolling without navigation leaves the address unchanged', async ({ page }) => {
    await openPortfolio(page);
    await useShortViewport(page);
    const before = page.url();

    for (const id of ['about', 'skills', 'projects', 'experience', 'contact']) {
      await scrollSectionToTop(page, id);
    }
    await page.waitForTimeout(300);

    expect(page.url()).toBe(before);
  });
});

test.describe('Return to top from the site name', () => {
  test('choosing the site name shows the Hero again', async ({ page }) => {
    await openPortfolio(page);
    await useShortViewport(page);
    await scrollSectionToTop(page, 'experience');

    await page.getByRole('banner').getByRole('link', { name: profile.name }).click();

    await expect(page.getByRole('heading', { level: 1 })).toBeInViewport();
  });
});

test.describe('Mobile navigation menu', () => {
  test('section links are behind a menu button on a 360px screen', async ({ page }) => {
    await setViewportWidth(page, 360);
    await openPortfolio(page);

    const nav = page.getByRole('navigation', { name: 'Primary' });
    await expect(nav.getByRole('link', { name: 'About Me', exact: true })).toBeHidden();
    await expect(menuButton(page)).toBeVisible();
    await expect(page.getByRole('button', { name: /^Switch to .* theme$/ })).toBeVisible();
  });

  test('choosing a link closes the menu and shows the section', async ({ page }) => {
    await setViewportWidth(page, 360);
    await openPortfolio(page);
    await useShortViewport(page);
    await menuButton(page).click();

    await menuDialog(page).getByRole('link', { name: 'About Me', exact: true }).click();

    await expect(menuDialog(page)).toBeHidden();
    await expect(page.getByRole('heading', { level: 2, name: 'About Me' })).toBeInViewport();
  });

  test('Escape closes the menu and returns focus to the menu button', async ({ page }) => {
    await setViewportWidth(page, 360);
    await openPortfolio(page);
    await menuButton(page).click();
    await expect(menuDialog(page)).toBeVisible();

    await page.keyboard.press('Escape');

    await expect(menuDialog(page)).toBeHidden();
    await expect(menuButton(page)).toBeFocused();
  });

  test('tapping outside the menu closes it', async ({ page }) => {
    await setViewportWidth(page, 360);
    await openPortfolio(page);
    await menuButton(page).click();
    await expect(menuDialog(page)).toBeVisible();

    await page.mouse.click(10, 300);

    await expect(menuDialog(page)).toBeHidden();
  });

  test('focus stays inside the open menu', async ({ page, isMobile }) => {
    test.skip(isMobile, 'keyboard focus is checked on desktop browsers at a small width');
    await setViewportWidth(page, 360);
    await openPortfolio(page);
    await menuButton(page).click();
    const dialog = menuDialog(page);
    await expect(dialog).toBeVisible();

    for (let press = 0; press < 12; press += 1) {
      await page.keyboard.press('Tab');
      const insideMenu = await dialog.evaluate((element) =>
        element.contains(document.activeElement),
      );
      expect(insideMenu, `focus left the menu after ${press + 1} Tab presses`).toBe(true);
    }
  });

  test('links are shown inline on a 1024px screen', async ({ page }) => {
    await setViewportWidth(page, 1024);
    await openPortfolio(page);

    const nav = page.getByRole('navigation', { name: 'Primary' });
    for (const name of SECTION_LINK_NAMES) {
      await expect(nav.getByRole('link', { name, exact: true })).toBeVisible();
    }
    await expect(menuButton(page)).toBeHidden();
  });
});
