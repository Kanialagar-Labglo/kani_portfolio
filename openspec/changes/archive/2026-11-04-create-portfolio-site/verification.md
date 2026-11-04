# Verification: create-portfolio-site

Date: 2026-11-04. Every spec scenario mapped to the automated checks that cover it.

Levels: **E2E** = Playwright (`e2e/`), **Unit** = Vitest (`src/`, `scripts/`),
**Script** = `npm run check:size` / `npm run lhci`, **Manual** = run by hand.

## Results at verification time

| Check | Result |
| --- | --- |
| `npm run lint`, `npx prettier --check .` | Clean |
| `npm test` | 134 passed (24 files) |
| `npm run e2e` | 337 passed, 51 skipped (all skips intentional, listed below) |
| `npm run check:size` | JS 156.2 KB / 200 KB, CSS 14.6 KB / 40 KB gzipped |
| `npm run lhci` (3 mobile runs) | Performance 99–100, Accessibility 100, Best Practices 100, SEO 100, LCP 0.90 s, CLS 0 |
| `openspec validate create-portfolio-site --type change --strict` | Valid |

Intentional skips: SEO tests run in desktop Chromium only (browser-independent HTML);
keyboard and scroll-behaviour tests run on desktop browsers only; the lazy-image test
skips while placeholder content has no images.

## page-layout

| Scenario | Covered by |
| --- | --- |
| Visitor using assistive technology lists page landmarks | E2E `page-layout` landmarks + labelled regions; Unit `App` landmarks + regions |
| Heading outline is logical | E2E one `h1`, `h2` sections, no skipped levels; Unit `App` heading tests |
| Moving between sections keeps the same page | E2E `page-layout` "keeps the same page" |
| Layout fits the viewport (360–1920 px) | E2E no horizontal scroll + nothing cut off, 5 widths × 4 browsers |
| Small screens show content in a single column | E2E project cards single column at 360 px |
| Keyboard visitor skips the navigation | E2E skip link first focus, visible, moves focus to `main`; Unit `App` skip link |
| Visitor has JavaScript disabled | E2E `noscript` message visible with JavaScript off |

## site-navigation

| Scenario | Covered by |
| --- | --- |
| Header stays reachable while scrolling | E2E sticky header at Contact |
| Visitor jumps to a section | E2E heading below the header after choosing Projects |
| Navigation lists only visible sections | E2E order of links; Unit `App` leaves an empty section out of the nav |
| Default smooth scrolling | E2E per-frame scroll sampling (desktop) |
| Reduced motion jumps instantly | E2E per-frame scroll sampling with reduced motion (desktop) |
| Highlight follows scrolling | E2E `aria-current` on Skills, only one marked; Contact at bottom; Unit `pickActiveSection`, `useActiveSection`, `NavLinks` |
| Address reflects the chosen section | E2E `#contact` in the address |
| Visitor opens a shared section link | E2E `/#projects` opens at Projects; Unit `App` scrolls to the hash |
| Scrolling does not change the address | E2E address unchanged after scrolling |
| Visitor returns to the top | E2E site name shows the Hero; Unit `Header` site-name link |
| Links collapse on small screens | E2E menu button at 360 px, theme toggle still visible |
| Choosing a link closes the menu | E2E menu closes, About in view; Unit `Header` menu closes |
| Escape closes the menu and restores focus | E2E Escape closes, focus on menu button |
| Tapping outside closes the menu | E2E outside tap closes the menu |
| Focus stays inside the open menu | E2E 12 Tab presses stay inside (desktop browsers at 360 px) |
| Links are shown inline on larger screens | E2E inline links at 1024 px, no menu button |

## theme-toggle

| Scenario | Covered by |
| --- | --- |
| First visit matches the device setting (dark / light / none) | E2E rendered background per preference; Unit `resolveTheme` |
| Switching to dark | E2E page background and toggle colour change, no reload |
| Switching back to light | E2E |
| Choice survives a return visit | E2E saved dark beats light system; reload keeps choice; Unit `useTheme`, storage helpers |
| Site still works when the choice cannot be saved | E2E blocked storage, no page errors; Unit blocked storage helpers |
| Returning dark-theme visitor sees no light flash | E2E dark with the app bundle blocked |
| Toggle announces the action it will take | E2E both labels; Unit `ThemeToggle` labels |
| Keyboard visitor switches theme | E2E Enter on the toggle |
| Reduced motion switches instantly | E2E zero transition durations |

## portfolio-sections

| Scenario | Covered by |
| --- | --- |
| Visitor scrolls through the whole page | E2E section order, footer last |
| Owner updates a project title | Unit `App` renders changed data |
| Visitor lands on the page | E2E name, role, tagline, actions; Unit `Hero` |
| Hero actions lead to their sections | E2E View projects → Projects; Unit `Hero` hrefs and hidden-section rule |
| Profile photo is described | Unit `Hero` photo alt text (placeholder data has no photo) |
| No photo provided | E2E and Unit no image |
| Bio paragraphs are shown | E2E and Unit `About` |
| Visitor scans skill groups | E2E group headings and labels, no ratings; Unit `Skills` |
| Project with all details | E2E title, description, technologies; Unit `ProjectCard` incl. screenshot |
| Project without a live demo | E2E only provided links; Unit `ProjectCard` |
| Project links open separately | E2E new tab, portfolio unchanged, no opener; Unit `target`/`rel` |
| Current and past roles | E2E newest first, "Present"; Unit `sortNewestFirst`, `formatPeriod`, `Experience` |
| Copyright year is current | E2E current year; Unit `Footer` with fixed date |
| No projects yet | Unit `App` hides the section and its nav link; Unit `getVisibleSections` |

## contact-links

| Scenario | Covered by |
| --- | --- |
| Visitor emails the owner | E2E `mailto:` link; Unit `Contact` |
| Visitor opens a social profile | E2E new tab, portfolio unchanged; Contact and footer |
| Opened page cannot control the portfolio | E2E `window.opener` is `null`; Unit `rel="noopener noreferrer"` |
| Icon-only links are named | E2E names start with the platform; Unit "(opens in a new tab)" |
| Contact section has no form | E2E no form or text box; Unit `Contact` |

## resume-download

| Scenario | Covered by |
| --- | --- |
| Download actions are offered | E2E hero and header (or menu); Unit `App`, `ResumeButton` |
| Download action on small screens | E2E menu includes the action at 360 px |
| Visitor downloads the résumé | E2E real download named `Your-Name-Resume.pdf`, page stays; Unit `resumeFileName`, hook |
| Owner has not added a résumé | Unit `App` and `useResumeDownload` with no résumé path |
| Résumé file is missing | E2E 404 → notice, no download; Unit `isResumeAvailable`, `App` notice |
| Server returns a page instead of the PDF | E2E HTML response → notice; Unit content-type check |
| Visitor follows the fallback to Contact | E2E Go to Contact → Contact in view |

## seo-metadata

| Scenario | Covered by |
| --- | --- |
| Link-preview service reads the page | E2E title and `lang` with JavaScript off |
| Profile change updates metadata | Unit `pageTitle` follows a role change (the build plugin uses it) |
| Link shared on a social platform shows a preview | E2E Open Graph and Twitter/X tags; preview image served |
| Description length | E2E 150–160 characters |
| Search engine reads structured data | E2E JSON-LD `Person`; Unit `personJsonLd`, script-escaping |
| Crawler discovers the sitemap | E2E `robots.txt` and `sitemap.xml`; Unit builders |
| Building without a site URL | Unit `siteWarnings` and tag omission; Manual empty-`siteUrl` build (warned, completed, no sitemap) |

## site-quality

| Scenario | Covered by |
| --- | --- |
| Core journey works in each browser profile | E2E all four browser setups |
| Automated accessibility check passes (light / dark) | E2E axe, zero violations at any level in both themes |
| Keyboard-only visit | E2E every control in order with visible focus (desktop browsers) |
| Lighthouse mobile audit | Script `npm run lhci` (also in CI) |
| Bundle stays within budget | Script `npm run check:size` (also in CI); Unit budget helpers |
| Project screenshots wait until needed | Unit `ProjectCard` `loading="lazy"`; E2E check skips until content has images |

## Gaps

1. **Dark theme on the mobile menu and the résumé notice is not asserted.** Both are antd
   components themed through `ConfigProvider`; tests check the page and the toggle only.
2. **Lazy loading is not exercised in a real browser** while placeholder content has no
   screenshots. The browser test activates once project screenshots are added.
3. **The missing-`siteUrl` build warning is not an automated test.** The logic is
   unit-tested and the build was checked by hand.
4. **Profile photo alt text is unit-tested only**, because the placeholder data has no photo.
