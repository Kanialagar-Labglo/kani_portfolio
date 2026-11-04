import { expect, test } from '@playwright/test';
import { profile } from '../src/data/profile.js';
import { openPortfolio, setViewportWidth } from './support/page.js';
import { menuButton, menuDialog, useShortViewport } from './support/navigation.js';

const ACTION_NAME = 'Download résumé (PDF)';
const EXPECTED_FILE_NAME = `${profile.name.trim().split(/\s+/).join('-')}-Resume.pdf`;

const heroAction = (page) =>
  page.getByRole('main').getByRole('region', { name: profile.name }).getByRole('link', {
    name: ACTION_NAME,
  });

const notice = (page) => page.getByRole('alert').filter({ hasText: 'temporarily unavailable' });

test.skip(!profile.resumePath, 'no résumé is configured in the profile data');

test.describe('Résumé download actions', () => {
  test('hero and header both offer the download action', async ({ page }) => {
    await openPortfolio(page);

    await expect(heroAction(page)).toBeVisible();
    if (await menuButton(page).isVisible()) {
      await menuButton(page).click();
      await expect(menuDialog(page).getByRole('link', { name: ACTION_NAME })).toBeVisible();
    } else {
      await expect(page.getByRole('banner').getByRole('link', { name: ACTION_NAME })).toBeVisible();
    }
  });

  test('the mobile menu includes the download action on a 360px screen', async ({ page }) => {
    await setViewportWidth(page, 360);
    await openPortfolio(page);

    await menuButton(page).click();

    await expect(menuDialog(page).getByRole('link', { name: ACTION_NAME })).toBeVisible();
  });
});

test.describe('Résumé downloads as a named PDF', () => {
  test('choosing the action downloads the PDF and keeps the portfolio open', async ({ page }) => {
    await openPortfolio(page);
    const portfolioUrl = page.url();

    const [download] = await Promise.all([page.waitForEvent('download'), heroAction(page).click()]);

    expect(download.suggestedFilename()).toBe(EXPECTED_FILE_NAME);
    expect(page.url()).toBe(portfolioUrl);
  });
});

test.describe('Friendly fallback when the file is unavailable', () => {
  async function expectNoDownload(page, action) {
    let downloaded = false;
    page.on('download', () => {
      downloaded = true;
    });
    await action();
    await expect(notice(page)).toBeVisible();
    await page.waitForTimeout(500);
    expect(downloaded).toBe(false);
  }

  test('a missing file shows the unavailable notice instead of downloading', async ({ page }) => {
    await page.route('**/resume.pdf', (route) =>
      route.fulfill({ status: 404, contentType: 'text/html', body: '<h1>Not found</h1>' }),
    );
    await openPortfolio(page);

    await expectNoDownload(page, () => heroAction(page).click());
    await expect(notice(page).getByRole('link', { name: 'Go to Contact' })).toBeVisible();
  });

  test('a web page served instead of the PDF shows the unavailable notice', async ({ page }) => {
    await page.route('**/resume.pdf', (route) =>
      route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><p>App</p>' }),
    );
    await openPortfolio(page);

    await expectNoDownload(page, () => heroAction(page).click());
  });

  test('following the notice leads to the Contact section', async ({ page }) => {
    await page.route('**/resume.pdf', (route) => route.fulfill({ status: 404, body: '' }));
    await openPortfolio(page);
    await useShortViewport(page);
    await heroAction(page).click();

    await notice(page).getByRole('link', { name: 'Go to Contact' }).click();

    await expect(page.getByRole('heading', { level: 2, name: 'Contact' })).toBeInViewport();
  });
});
