## Why

The repository has an intent-driven OpenSpec setup but no application yet.
A developer needs a single, fast, accessible portfolio page that presents who
they are, what they have built, and how to reach them — and that can be shared
as a link (LinkedIn, chat apps) with a correct preview. Building the foundation
and every content section in one change gives a complete, deployable first
version and settles the tooling decisions every later change will reuse.

## What Changes

- Scaffold a React + Vite single-page application in JavaScript (no TypeScript,
  no router, no backend, no database), pinned to Node 24.
- Add a semantic, mobile-first page shell: skip link, sticky header, `main`
  with one `section` per content area, footer, and a `<noscript>` message.
- Add header navigation: in-page anchor links with smooth scrolling (instant
  under reduced motion), headings kept clear of the sticky header, active-section
  highlighting, shareable `/#section` links, and an accessible collapsible
  mobile menu.
- Add a light/dark theme toggle that defaults to the visitor's system
  preference, remembers an explicit choice, applies before first paint, and
  themes Bootstrap, Ant Design, and custom CSS together.
- Add content sections in this order: Hero, About, Skills, Projects,
  Experience, Contact, Footer. All content is read from plain JS data modules
  and ships as clearly marked placeholder content; a section with no data is
  hidden along with its nav link.
- Add a contact section where the email opens the visitor's mail client
  (`mailto:`) and social links open in a new tab safely.
- Add a résumé download (hero and header) of a static PDF with a friendly file
  name; the button is hidden when no résumé is configured, and a friendly
  "unavailable" notice pointing to Contact is shown when the file is missing.
- Add SEO and link-preview metadata generated into the built `index.html` from
  the profile data: title, description, canonical URL, Open Graph, Twitter/X
  card, theme colors, favicon, JSON-LD `Person`, `robots.txt`, `sitemap.xml`.
- Add end-to-end tests with Playwright across desktop and mobile browsers,
  including automated accessibility checks in both themes.
- Set quality targets: no horizontal scroll at 360–1920 px, zero serious or
  critical axe violations, Lighthouse mobile Performance ≥ 90, Accessibility
  ≥ 95, Best Practices ≥ 95, SEO 100, LCP < 2.5 s, CLS < 0.1, initial
  JS ≤ 200 KB and CSS ≤ 40 KB gzipped.

## Capabilities

### New Capabilities
- `page-layout`: Single-page semantic shell, mobile-first responsive layout across screen sizes, skip link, and no-JavaScript message.
- `site-navigation`: Sticky header, in-page anchor navigation, smooth/instant scrolling, active-section highlighting, shareable section links, and the mobile menu.
- `theme-toggle`: Light/dark theme selection, system-preference default, persisted choice, no flash of the wrong theme, and accessible toggle labelling.
- `portfolio-sections`: Hero, About, Skills, Projects, Experience, and Footer content rendered from data modules, including hiding sections that have no data.
- `contact-links`: Email link that opens a new message in the visitor's mail client and social links that open in a new tab.
- `resume-download`: Résumé download from hero and header, hidden when not configured, with a friendly fallback notice when the file is unavailable.
- `seo-metadata`: Static page metadata, link-preview tags, structured data, and crawler files generated from profile data.
- `site-quality`: Supported browsers, responsive, accessibility, performance, and bundle-size targets the site must meet.

### Modified Capabilities
<!-- None: there are no existing specs in openspec/specs/. -->

## Impact

- **New code:** `src/` (components, data modules, styles), `public/`
  (placeholder `resume.pdf`, `og-image.png`, favicon, `robots.txt`), `index.html`,
  Vite configuration, Playwright configuration and `e2e/` tests.
- **Project files:** `package.json` (currently empty) gains scripts and
  dependencies; `package-lock.json` is regenerated; new `.nvmrc` pinning Node 24.
- **New dependencies:** `react`, `react-dom`, `vite`, `@vitejs/plugin-react`,
  `bootstrap`, `antd`, `lucide-react`, `@playwright/test`, `@axe-core/playwright`.
  The unit/component test runner, linting, and any Lighthouse/bundle-size
  tooling are decided in the design and ADR phases.
- **Open dependency:** the hosting domain is not yet decided; the site URL is a
  configuration value, and canonical URL and sitemap are only correct once it
  is set.
- **Out of scope:** backend, database, routing, contact form, blog,
  testimonials, analytics, and real (non-placeholder) content.
