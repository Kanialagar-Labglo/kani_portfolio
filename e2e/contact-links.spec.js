import { expect, test } from '@playwright/test';
import { contact, socials } from '../src/data/socials.js';
import { openPortfolio } from './support/page.js';

const contactRegion = (page) => page.getByRole('main').getByRole('region', { name: 'Contact' });

test.describe('Email opens a new message', () => {
  test('email link addresses a new message to the owner', async ({ page }) => {
    await openPortfolio(page);

    const emailLink = contactRegion(page).getByRole('link', { name: contact.email });
    await expect(emailLink).toBeVisible();
    await expect(emailLink).toHaveAttribute('href', `mailto:${contact.email}`);
  });
});

test.describe('Social links open in a new tab', () => {
  for (const place of ['Contact section', 'footer']) {
    test(`every social profile is linked in the ${place} with its platform name`, async ({
      page,
    }) => {
      await openPortfolio(page);
      const container = place === 'footer' ? page.getByRole('contentinfo') : contactRegion(page);

      for (const social of socials) {
        const link = container.getByRole('link', { name: new RegExp(`^${social.platform}\\b`) });
        await expect(link).toBeVisible();
        await expect(link).toHaveAttribute('href', social.url);
      }
    });
  }

  test('a social link opens in a new tab and the portfolio stays open', async ({
    page,
    context,
  }) => {
    await context.route(/^https:\/\/(github\.com|www\.linkedin\.com)\//, (route) => route.abort());
    await openPortfolio(page);
    const [social] = socials;
    const portfolioUrl = page.url();

    const [popup] = await Promise.all([
      context.waitForEvent('page'),
      contactRegion(page)
        .getByRole('link', { name: new RegExp(`^${social.platform}\\b`) })
        .click(),
    ]);

    expect(popup).not.toBe(page);
    expect(page.url()).toBe(portfolioUrl);
    expect(await popup.evaluate(() => window.opener)).toBeNull();
  });
});

test.describe('No backend contact handling', () => {
  test('the Contact section has no form to fill in', async ({ page }) => {
    await openPortfolio(page);
    const region = contactRegion(page);

    await expect(region.locator('form')).toHaveCount(0);
    await expect(region.getByRole('textbox')).toHaveCount(0);
    await expect(region.getByRole('link')).toHaveCount(socials.length + 1);
  });
});
