import { describe, expect, it } from 'vitest';
import {
  buildHeadTags,
  buildRobotsTxt,
  buildSitemapXml,
  pageTitle,
  personJsonLd,
  siteWarnings,
} from './seo.js';

const profile = {
  name: 'Alex Doe',
  role: 'Software Developer',
  description: 'Builds reliable web apps & tests them "properly".',
};
const socials = [
  { platform: 'GitHub', url: 'https://github.com/alex' },
  { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/alex' },
];
const site = { siteUrl: 'https://alex.example.com/', basePath: '/' };

function parseHead(html) {
  const doc = document.implementation.createHTMLDocument('');
  doc.head.innerHTML = html;
  return doc.head;
}

const content = (head, selector) => head.querySelector(selector)?.getAttribute('content');

describe('pageTitle', () => {
  it('reads "Name — Role | Portfolio"', () => {
    expect(pageTitle(profile)).toBe('Alex Doe — Software Developer | Portfolio');
  });

  it('follows a change of role', () => {
    expect(pageTitle({ ...profile, role: 'Full-Stack Developer' })).toBe(
      'Alex Doe — Full-Stack Developer | Portfolio',
    );
  });
});

describe('personJsonLd', () => {
  it('describes the owner with their social profiles', () => {
    expect(personJsonLd({ profile, socials, siteUrl: site.siteUrl })).toEqual({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Alex Doe',
      jobTitle: 'Software Developer',
      url: 'https://alex.example.com/',
      sameAs: ['https://github.com/alex', 'https://www.linkedin.com/in/alex'],
    });
  });

  it('leaves out the site URL when it is not set', () => {
    expect(personJsonLd({ profile, socials, siteUrl: '' })).not.toHaveProperty('url');
  });
});

describe('buildHeadTags', () => {
  it('includes the description exactly, even with quotes and ampersands', () => {
    const head = parseHead(buildHeadTags({ profile, socials, site }));

    expect(content(head, 'meta[name="description"]')).toBe(profile.description);
  });

  it('points the canonical link and Open Graph URL at the site', () => {
    const head = parseHead(buildHeadTags({ profile, socials, site }));

    expect(head.querySelector('link[rel="canonical"]').getAttribute('href')).toBe(
      'https://alex.example.com/',
    );
    expect(content(head, 'meta[property="og:url"]')).toBe('https://alex.example.com/');
  });

  it('describes the page for Open Graph and Twitter/X previews', () => {
    const head = parseHead(buildHeadTags({ profile, socials, site }));

    expect(content(head, 'meta[property="og:title"]')).toBe(pageTitle(profile));
    expect(content(head, 'meta[property="og:type"]')).toBe('website');
    expect(content(head, 'meta[property="og:image"]')).toBe(
      'https://alex.example.com/og-image.png',
    );
    expect(content(head, 'meta[name="twitter:card"]')).toBe('summary_large_image');
    expect(content(head, 'meta[name="twitter:image"]')).toBe(
      'https://alex.example.com/og-image.png',
    );
  });

  it('sets one theme colour matching the dark default theme', () => {
    const head = parseHead(buildHeadTags({ profile, socials, site }));

    const themeColors = head.querySelectorAll('meta[name="theme-color"]');
    expect(themeColors).toHaveLength(1);
    expect(themeColors[0].hasAttribute('media')).toBe(false);
    expect(themeColors[0].getAttribute('content')).toBe('#0f1419');
  });

  it('links the favicon under the base path', () => {
    const head = parseHead(
      buildHeadTags({ profile, socials, site: { ...site, basePath: '/kani_portfolio/' } }),
    );

    expect(head.querySelector('link[rel="icon"]').getAttribute('href')).toBe(
      '/kani_portfolio/favicon.svg',
    );
  });

  it('embeds structured data that parses back to the Person', () => {
    const head = parseHead(buildHeadTags({ profile, socials, site }));

    const json = head.querySelector('script[type="application/ld+json"]').textContent;
    expect(JSON.parse(json)).toEqual(personJsonLd({ profile, socials, siteUrl: site.siteUrl }));
  });

  it('cannot close the structured-data script early', () => {
    const sneaky = { ...profile, name: 'Alex </script><script>alert(1)</script>' };

    const html = buildHeadTags({ profile: sneaky, socials, site });

    expect(html.match(/<\/script>/g)).toHaveLength(1);
  });

  it('leaves out site-URL tags when the site URL is not set', () => {
    const head = parseHead(buildHeadTags({ profile, socials, site: { ...site, siteUrl: '' } }));

    expect(head.querySelector('link[rel="canonical"]')).toBeNull();
    expect(head.querySelector('meta[property="og:url"]')).toBeNull();
    expect(head.querySelector('meta[property="og:image"]')).toBeNull();
  });
});

describe('crawler files', () => {
  it('robots.txt allows crawling and names the sitemap', () => {
    expect(buildRobotsTxt('https://alex.example.com/')).toBe(
      'User-agent: *\nAllow: /\n\nSitemap: https://alex.example.com/sitemap.xml\n',
    );
  });

  it('robots.txt names no sitemap when the site URL is not set', () => {
    expect(buildRobotsTxt('')).toBe('User-agent: *\nAllow: /\n');
  });

  it('sitemap.xml lists the site URL', () => {
    const doc = new DOMParser().parseFromString(
      buildSitemapXml('https://alex.example.com/'),
      'application/xml',
    );

    expect([...doc.getElementsByTagName('loc')].map((loc) => loc.textContent)).toEqual([
      'https://alex.example.com/',
    ]);
  });
});

describe('siteWarnings', () => {
  it('warns when the site URL is not set', () => {
    expect(siteWarnings({ siteUrl: '' })).toEqual([
      'siteUrl is not set in site.config.js: the canonical URL, Open Graph URL and image, and sitemap.xml are left out.',
    ]);
  });

  it('has nothing to warn about when the site URL is set', () => {
    expect(siteWarnings(site)).toEqual([]);
  });
});
