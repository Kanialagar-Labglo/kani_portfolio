import { expect, test } from '@playwright/test';
import { profile } from '../src/data/profile.js';
import { socials } from '../src/data/socials.js';
import { siteConfig } from '../site.config.js';

const EXPECTED_TITLE = `${profile.name} — ${profile.role} | Portfolio`;
const OG_IMAGE_URL = `${siteConfig.siteUrl}og-image.png`;

// Metadata is the same for every browser, so it is checked once.
test.skip(
  ({ browserName, isMobile }) => browserName !== 'chromium' || isMobile,
  'metadata is browser-independent; checked in desktop Chromium',
);

// Link-preview services and many crawlers read the HTML without running JavaScript.
test.use({ javaScriptEnabled: false });

const meta = (page, selector) => page.locator(selector).first().getAttribute('content');

test.describe('Metadata is present without running JavaScript', () => {
  test('title follows "Name — Role | Portfolio"', async ({ page }) => {
    await page.goto('./');

    await expect(page).toHaveTitle(EXPECTED_TITLE);
  });

  test('document declares English', async ({ page }) => {
    await page.goto('./');

    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });
});

test.describe('Search and sharing metadata', () => {
  test('description is the profile summary and 150-160 characters long', async ({ page }) => {
    await page.goto('./');

    const description = await meta(page, 'meta[name="description"]');
    expect(description).toBe(profile.description);
    expect(description.length).toBeGreaterThanOrEqual(150);
    expect(description.length).toBeLessThanOrEqual(160);
  });

  test('canonical URL is the configured site URL', async ({ page }) => {
    await page.goto('./');

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', siteConfig.siteUrl);
  });

  test('Open Graph tags describe the page for link previews', async ({ page }) => {
    await page.goto('./');

    expect(await meta(page, 'meta[property="og:title"]')).toBe(EXPECTED_TITLE);
    expect(await meta(page, 'meta[property="og:description"]')).toBe(profile.description);
    expect(await meta(page, 'meta[property="og:type"]')).toBe('website');
    expect(await meta(page, 'meta[property="og:url"]')).toBe(siteConfig.siteUrl);
    expect(await meta(page, 'meta[property="og:image"]')).toBe(OG_IMAGE_URL);
    expect(await meta(page, 'meta[property="og:image:width"]')).toBe('1200');
    expect(await meta(page, 'meta[property="og:image:height"]')).toBe('630');
  });

  test('Twitter/X card uses the large image summary', async ({ page }) => {
    await page.goto('./');

    expect(await meta(page, 'meta[name="twitter:card"]')).toBe('summary_large_image');
    expect(await meta(page, 'meta[name="twitter:title"]')).toBe(EXPECTED_TITLE);
    expect(await meta(page, 'meta[name="twitter:description"]')).toBe(profile.description);
    expect(await meta(page, 'meta[name="twitter:image"]')).toBe(OG_IMAGE_URL);
  });

  test('theme colour is set for light and dark schemes', async ({ page }) => {
    await page.goto('./');

    await expect(
      page.locator('meta[name="theme-color"][media="(prefers-color-scheme: light)"]'),
    ).toHaveCount(1);
    await expect(
      page.locator('meta[name="theme-color"][media="(prefers-color-scheme: dark)"]'),
    ).toHaveCount(1);
  });

  test('favicon and preview image are served', async ({ page, request }) => {
    await page.goto('./');
    const faviconHref = await page.locator('link[rel="icon"]').getAttribute('href');

    const favicon = await request.get(new URL(faviconHref, page.url()).href);
    expect(favicon.status()).toBe(200);

    const image = await request.get(new URL('og-image.png', page.url()).href);
    expect(image.status()).toBe(200);
    expect(image.headers()['content-type']).toContain('image/png');
  });
});

test.describe('Structured data about the owner', () => {
  test('JSON-LD describes the owner as a Person', async ({ page }) => {
    await page.goto('./');

    const json = await page.locator('script[type="application/ld+json"]').textContent();
    const person = JSON.parse(json);
    expect(person).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: profile.name,
      jobTitle: profile.role,
      url: siteConfig.siteUrl,
      sameAs: socials.map((social) => social.url),
    });
  });
});

test.describe('Crawler files', () => {
  test('robots.txt allows crawling and points to the sitemap', async ({ request }) => {
    const response = await request.get('robots.txt');

    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain('User-agent: *');
    expect(body).toContain('Allow: /');
    expect(body).toContain(`Sitemap: ${siteConfig.siteUrl}sitemap.xml`);
  });

  test('sitemap.xml lists the site URL', async ({ request }) => {
    const response = await request.get('sitemap.xml');

    expect(response.status()).toBe(200);
    expect(await response.text()).toContain(`<loc>${siteConfig.siteUrl}</loc>`);
  });
});
