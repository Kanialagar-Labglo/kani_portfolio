// Metadata built at build time from the content data, so it is in the delivered HTML
// for crawlers and link-preview services that do not run JavaScript.

const OG_IMAGE = { path: 'og-image.png', width: 1200, height: 630 };
const FAVICON_PATH = 'favicon.svg';
// Same values as --color-bg in src/styles/tokens.css.
const THEME_COLORS = { light: '#ffffff', dark: '#0f1419' };

const escapeAttribute = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const escapeXml = (value) => escapeAttribute(value).replace(/'/g, '&apos;');

const metaName = (name, content) => `<meta name="${name}" content="${escapeAttribute(content)}" />`;
const metaProperty = (property, content) =>
  `<meta property="${property}" content="${escapeAttribute(content)}" />`;

/** @param {{ name: string, role: string }} profile */
export function pageTitle(profile) {
  return `${profile.name} — ${profile.role} | Portfolio`;
}

/**
 * schema.org Person describing the owner.
 * @param {{ profile: object, socials: { url: string }[], siteUrl: string }} input
 */
export function personJsonLd({ profile, socials, siteUrl }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.role,
    ...(siteUrl ? { url: siteUrl } : {}),
    sameAs: socials.map((social) => social.url),
  };
}

/**
 * Tags for <head>: description, canonical link, Open Graph, Twitter/X card, theme colours,
 * favicon, and JSON-LD. Tags that need an absolute URL are left out when siteUrl is empty.
 * @param {{ profile: object, socials: object[], site: { siteUrl: string, basePath: string } }} input
 */
export function buildHeadTags({ profile, socials, site }) {
  const title = pageTitle(profile);
  const { siteUrl, basePath } = site;
  const imageUrl = siteUrl ? `${siteUrl}${OG_IMAGE.path}` : '';
  // "<" is escaped so content can never close the script element early.
  const jsonLd = JSON.stringify(personJsonLd({ profile, socials, siteUrl })).replace(
    /</g,
    '\\u003c',
  );

  return [
    metaName('description', profile.description),
    siteUrl && `<link rel="canonical" href="${escapeAttribute(siteUrl)}" />`,
    `<link rel="icon" type="image/svg+xml" href="${escapeAttribute(`${basePath}${FAVICON_PATH}`)}" />`,
    `<meta name="theme-color" media="(prefers-color-scheme: light)" content="${THEME_COLORS.light}" />`,
    `<meta name="theme-color" media="(prefers-color-scheme: dark)" content="${THEME_COLORS.dark}" />`,
    metaProperty('og:type', 'website'),
    metaProperty('og:title', title),
    metaProperty('og:description', profile.description),
    siteUrl && metaProperty('og:url', siteUrl),
    imageUrl && metaProperty('og:image', imageUrl),
    imageUrl && metaProperty('og:image:width', OG_IMAGE.width),
    imageUrl && metaProperty('og:image:height', OG_IMAGE.height),
    metaName('twitter:card', 'summary_large_image'),
    metaName('twitter:title', title),
    metaName('twitter:description', profile.description),
    imageUrl && metaName('twitter:image', imageUrl),
    `<script type="application/ld+json">${jsonLd}</script>`,
  ]
    .filter(Boolean)
    .join('\n    ');
}

/** @param {string} siteUrl */
export function buildRobotsTxt(siteUrl) {
  const rules = 'User-agent: *\nAllow: /\n';
  return siteUrl ? `${rules}\nSitemap: ${siteUrl}sitemap.xml\n` : rules;
}

/** @param {string} siteUrl */
export function buildSitemapXml(siteUrl) {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    `  <url><loc>${escapeXml(siteUrl)}</loc></url>`,
    '</urlset>',
    '',
  ].join('\n');
}

/**
 * Problems with the site configuration that leave metadata incomplete.
 * @param {{ siteUrl: string }} site
 * @returns {string[]}
 */
export function siteWarnings(site) {
  return site.siteUrl
    ? []
    : [
        'siteUrl is not set in site.config.js: the canonical URL, Open Graph URL and image, and sitemap.xml are left out.',
      ];
}
