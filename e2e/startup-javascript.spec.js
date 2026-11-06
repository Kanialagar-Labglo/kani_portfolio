import { expect, test } from '@playwright/test';
import { profile } from '../src/data/profile.js';
import { openPortfolio, setViewportWidth } from './support/page.js';
import { menuButton, menuDialog } from './support/navigation.js';
import { getVisibleTheme, themeToggle } from './support/theme.js';
import { holdBackExtras, recordScripts } from './support/scripts.js';

// Long enough for an idle prefetch on a slow CI runner, short enough to keep the suite quick.
const PREFETCH_TIMEOUT = 10_000;

const resumeAction = (page) =>
  page.getByRole('main').getByRole('region', { name: profile.name }).getByRole('link', {
    name: 'Download résumé (PDF)',
  });
const resumeNotice = (page) =>
  page.getByRole('alert').filter({ hasText: 'temporarily unavailable' });

test.describe('First view loads without the extras', () => {
  test('no script loaded for the first view contains the menu drawer or notice', async ({
    page,
  }) => {
    const scripts = recordScripts(page);

    await openPortfolio(page);

    const startup = await scripts.beforeLoad();
    expect(startup.length).toBeGreaterThan(0);
    expect(startup.filter((script) => script.drawer).map((script) => script.url)).toEqual([]);
    expect(startup.filter((script) => script.notice).map((script) => script.url)).toEqual([]);
  });

  test('the theme toggle, menu button, and labels work without the extras', async ({ page }) => {
    await setViewportWidth(page, 360);
    await holdBackExtras(page);
    await openPortfolio(page);

    await expect(menuButton(page)).toBeVisible();
    await expect(page.locator('#skills .tag-list li').first()).toBeVisible();
    await expect(
      page.getByRole('list', { name: 'Technologies' }).getByRole('listitem').first(),
    ).toBeVisible();

    const before = await getVisibleTheme(page);
    await themeToggle(page).click();
    await expect.poll(() => getVisibleTheme(page)).not.toBe(before);
  });
});

test.describe('Extras are fetched when the browser is idle', () => {
  test('the drawer and notice code arrive after load without any interaction', async ({ page }) => {
    const scripts = recordScripts(page);

    await openPortfolio(page);

    await expect
      .poll(async () => (await scripts.afterLoad()).some((script) => script.drawer), {
        timeout: PREFETCH_TIMEOUT,
      })
      .toBe(true);
    await expect
      .poll(async () => (await scripts.afterLoad()).some((script) => script.notice), {
        timeout: PREFETCH_TIMEOUT,
      })
      .toBe(true);
  });
});

test.describe('Extra used before its code has arrived', () => {
  test('the menu drawer opens once its code arrives and behaves as usual', async ({ page }) => {
    await setViewportWidth(page, 360);
    const extras = await holdBackExtras(page);
    await openPortfolio(page);

    await menuButton(page).click();

    await expect.poll(() => extras.held()).toBeGreaterThan(0);
    await expect(menuDialog(page)).toBeHidden();

    extras.release();

    const dialog = menuDialog(page);
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('link', { name: 'Contact', exact: true })).toBeVisible();
    // antd focuses the drawer's container; the next Tab reaches the first item in the menu.
    await page.keyboard.press('Tab');
    await expect(dialog.locator(':focus')).toHaveCount(1);

    await page.keyboard.press('Escape');

    await expect(dialog).toBeHidden();
    await expect(menuButton(page)).toBeFocused();
  });

  test('the résumé notice appears once its code arrives and leads to Contact', async ({ page }) => {
    test.skip(!profile.resumePath, 'no résumé is configured in the profile data');
    await page.route('**/resume.pdf', (route) => route.fulfill({ status: 404, body: '' }));
    const extras = await holdBackExtras(page);
    await openPortfolio(page);

    await resumeAction(page).click();

    await expect.poll(() => extras.held()).toBeGreaterThan(0);
    await expect(resumeNotice(page)).toBeHidden();

    extras.release();

    await expect(resumeNotice(page)).toBeVisible();
    await resumeNotice(page).getByRole('link', { name: 'Go to Contact' }).click();
    await expect(page.getByRole('heading', { level: 2, name: 'Contact' })).toBeInViewport();
    await expect(resumeNotice(page)).toBeHidden();
  });
});
