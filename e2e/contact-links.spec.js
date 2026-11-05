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

test.describe('WhatsApp chat button', () => {
  test('Chat on WhatsApp opens a chat with a greeting in a new tab', async ({ page, context }) => {
    // Stand in for WhatsApp so the test stays offline and the tab keeps its wa.me address.
    await context.route(/^https:\/\/wa\.me\//, (route) =>
      route.fulfill({ status: 200, contentType: 'text/html', body: '<title>Chat</title>' }),
    );
    await openPortfolio(page);
    const portfolioUrl = page.url();

    const [popup] = await Promise.all([
      context.waitForEvent('page'),
      contactRegion(page)
        .getByRole('link', { name: /^Chat on WhatsApp\b/ })
        .click(),
    ]);
    await popup.waitForURL(/^https:\/\/wa\.me\//);
    const chatUrl = new URL(popup.url());

    expect(chatUrl.host).toBe('wa.me');
    expect(chatUrl.pathname).toBe(`/${contact.whatsapp.number}`);
    expect(chatUrl.searchParams.get('text')).toBe(contact.whatsapp.message);
    expect(page.url()).toBe(portfolioUrl);
    expect(await popup.evaluate(() => window.opener)).toBeNull();
  });

  test('the phone number is not shown as text', async ({ page }) => {
    await openPortfolio(page);

    const digitsOnPage = (await page.locator('body').innerText()).replace(/\D/g, '');
    expect(digitsOnPage).not.toContain(contact.whatsapp.number.slice(-10));
  });
});

test.describe('No backend contact handling', () => {
  test('Contact offers email, WhatsApp, and social links and no form', async ({ page }) => {
    await openPortfolio(page);
    const region = contactRegion(page);

    await expect(region.locator('form')).toHaveCount(0);
    await expect(region.getByRole('textbox')).toHaveCount(0);
    await expect(region.getByRole('link', { name: contact.email })).toHaveCount(1);
    await expect(region.getByRole('link', { name: /^Chat on WhatsApp\b/ })).toHaveCount(1);
    await expect(region.getByRole('link')).toHaveCount(socials.length + 2);
  });
});
