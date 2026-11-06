# Verification: personalise-portfolio

Date: 2026-11-05. Every scenario in this change's delta specs mapped to the automated checks
that cover it.

Levels: **E2E** = Playwright (`e2e/`), **Unit** = Vitest (`src/`, `scripts/`),
**Script** = `npm run check:size` / `npm run lhci`, **Manual** = run by hand.

## Results at verification time

| Check | Result |
| --- | --- |
| `npm run lint`, `npx prettier --check .` | Clean |
| `npm test` | 196 passed (31 files) |
| `npm run build` | Built |
| `npm run e2e` | 423 passed, 53 skipped (all skips intentional, listed below) |
| `npm run check:size` | JS 157.6 KB / 200 KB, CSS 15.5 KB / 40 KB gzipped; fonts 42.1 KB / 60 KB woff2 |
| `npm run lhci` (3 mobile runs) | Performance 99, Accessibility 100, Best Practices 100, SEO 100, LCP 0.90 s, CLS 0 |
| `openspec validate personalise-portfolio --type change --strict` | Valid |

Intentional skips: SEO tests run in desktop Chromium only (browser-independent HTML);
keyboard, scroll-behaviour, and card-hover tests run on desktop browsers only; the
lazy-image test skips while no project has a screenshot.

## portfolio-sections

| Scenario | Covered by |
| --- | --- |
| Visitor scrolls through the whole page | E2E section order Hero → Contact including Education, footer last; Unit `App` regions and headings in order |
| Owner updates a project title | Unit `App` renders changed data |
| No placeholder content is published | Unit `content` scans every data string; E2E scans page text and link targets |
| Visitor lands on the page | E2E name, headline, tagline, actions; Unit `Hero` |
| Headline falls back to the role | Unit `Hero` with and without a headline; E2E shows the shipped headline |
| Hero actions lead to their sections | E2E View projects → Projects; Unit `Hero` |
| Profile photo is described | Unit `Hero` photo alt text (no photo in the shipped data yet) |
| No photo provided | E2E and Unit no image |
| Current and past roles | Unit `Experience` order and "Present"; E2E roles newest first |
| Role with grouped highlights | Unit `Experience` group headings and lists in data order; E2E group names and items |

## education

| Scenario | Covered by |
| --- | --- |
| Visitor reviews qualifications | E2E MCA (2024) before B.Sc. (2021) with institutions and years; Unit `Education` |
| Data order does not decide the display order | Unit `sortByYearDesc`, `Education` with reversed data |
| No qualifications yet | Unit `getVisibleSections` hides Education and its nav link when empty or missing |

## site-navigation

| Scenario | Covered by |
| --- | --- |
| Visitor jumps to a section | E2E heading below the header after choosing Projects; E2E Education link |
| Navigation lists only visible sections | Unit `getVisibleSections`; Unit `App` leaves an empty section out |
| Navigation order | E2E links read Home → Contact at 360 px (menu) and 1024 px (inline), all browsers |
| Home returns to the introduction | E2E Home from Contact shows the Hero and marks Home current |

## contact-links

| Scenario | Covered by |
| --- | --- |
| Visitor starts a WhatsApp chat | E2E `wa.me` number and greeting in a new tab, portfolio stays, no `window.opener`; Unit `whatsappUrl`, `Contact` link attributes |
| Number is not printed on the page | E2E page text has no number; Unit `Contact` |
| No WhatsApp number configured | Unit `Contact` hides the button; Unit `getVisibleSections` keeps Contact when WhatsApp is the only option |
| Contact section has no form | E2E email, WhatsApp, and social links only, no form or text box; Unit `Contact` |

## theme-toggle

| Scenario | Covered by |
| --- | --- |
| First visit is dark (dark / light / no preference) | E2E rendered background for each device preference; Unit `resolveTheme` ignores the device setting |
| Choice survives a return visit | E2E saved light beats the dark default; choice kept after reload; Unit `useTheme` |
| Site still works when the choice cannot be saved | E2E blocked storage, no page errors; Unit storage helpers |
| Returning dark-theme visitor sees no light flash | E2E painted dark with the app bundle blocked |
| Returning light-theme visitor sees no dark flash | E2E painted light with the app bundle blocked; first visit painted dark the same way |

## visual-style

| Scenario | Covered by |
| --- | --- |
| Accent colours stay readable (dark / light) | Unit token contrast ≥ 4.5:1 for text, muted, both accents, and button text in both themes; E2E axe after revealing the page, both themes |
| Headings use the display font | E2E heading in JetBrains Mono, About paragraph not |
| Text is shown while the font loads | E2E fonts held back: heading visible, display font not loaded |
| No third-party font requests | E2E every font request is same-origin |
| Card responds to hover and focus | E2E hover highlights an Education card and its neighbour keeps its position; focus inside the project card highlights it |
| Reduced motion shows everything immediately | E2E every reveal block at full opacity with no transform as soon as it is reached; Unit `useReveal` does nothing with reduced motion |
| Content is never left hidden | E2E after scrolling to the bottom every block is fully visible; Unit `useReveal` reveals on-screen blocks at once |
| Logo mark is named | E2E logo link named "Kani Alagar A" at 360 and 1280 px; Unit `Header` mark is `aria-hidden` |
| Browser tab shows the brand | E2E favicon is an SVG titled "AK" with the gradient and no text |

## site-quality

| Scenario | Covered by |
| --- | --- |
| Font files stay within budget | Script `check:size` (42.1 KB / 60 KB, also in CI); Unit `findFontFiles`, `checkBudgets`; E2E fonts are same-origin |
| Fonts and motion keep the page stable | Script `npm run lhci`: CLS 0, LCP 0.90 s (also in CI) |

## Gaps

1. **Hover is checked on Education cards, not project cards.** The shipped data has one
   project, so there is no neighbouring project card to watch. All cards share the same
   `.card-surface` style, and focus is checked on the project card.
2. **"No element animates" under reduced motion is checked on the reveal blocks only.**
   Other motion (card lift, colour transitions) is switched off by the global
   reduced-motion rule, which the theme tests check on the page and the toggle.
3. **Profile photo alt text is unit-tested only**, because the shipped data has no photo
   yet (carried over from `create-portfolio-site`).
4. **The empty-education and missing-WhatsApp cases are unit-tested only.** The shipped
   data has both, so a browser test would need test-only data.
5. **The link-preview image is checked by eye.** It was generated once and reviewed. E2E
   checks that it is served and tagged, not what it shows.
