<!--
Owner tags: [dev] = senior-dev (strict red-green-refactor with Vitest),
[qa] = senior-qa (Playwright end-to-end and accessibility tests),
[owner] = manual step for the site owner.
Within each group, [qa] writes the failing end-to-end tests first, then [dev]
implements test-first until they pass.
Run all npm commands under Node 24 (`nvm use`).
-->

## 1. Owner content (`portfolio-sections`)

- [x] 1.1 [dev] Write a failing data-validation unit test over `src/data`: no "Your Name", "Placeholder", "example.com", or "your-username" in any string; description 150–160 characters; each highlight group has 2–4 items and each role has 2–4 groups; education entries have qualification, institution, and a numeric year
- [x] 1.2 [dev] Fill `profile.js` (name, role "Full-Stack Developer", headline, tagline, description, the two approved About paragraphs, `brandInitials: 'AK'`, `photo: null`, `resumePath: 'resume.pdf'`), `skills.js` (four groups, each skill once), `projects.js` (Personal Portfolio Website only), and `socials.js` (email, GitHub, LinkedIn, `contact.whatsapp` number and greeting) exactly as approved in the proposal; remove the placeholder comments
- [x] 1.3 [dev] Fill `experience.js` with the Labglo role (July 2022, current) using `highlightGroups` Development, Quality Assurance, and Collaboration as approved, and add `src/data/education.js` (MCA 2024, B.Sc. 2021) to `content` in `src/data/index.js`; 1.1 passes
- [x] 1.4 [qa] Add an e2e scan that the rendered page contains none of the placeholder strings

## 2. Hero headline and grouped experience (`portfolio-sections`)

- [x] 2.1 [qa] Update e2e: the Hero shows the name, headline, and tagline; the Labglo role shows its three group names, each followed by its highlights in data order
- [x] 2.2 [dev] TDD `Hero`: show `profile.headline`, falling back to `profile.role` when it is absent
- [x] 2.3 [dev] TDD `Experience`: render `highlightGroups` as an `h4` per group followed by its list, and keep the flat `highlights` list working; heading order stays h2 → h3 → h4

## 3. Education (`education`)

- [x] 3.1 [qa] Write failing e2e tests: Education comes after Experience and before Contact; the MCA (2024) is listed before the B.Sc. (2021) with institutions and years; there is an "Education" nav link
- [x] 3.2 [dev] TDD `src/lib/education.js` `sortByYearDesc` (data order does not decide display order; input unchanged)
- [x] 3.3 [dev] TDD the `Education` component (ordered list of cards; qualification as `h3`, institution, year) using `PageSection`
- [x] 3.4 [dev] TDD `src/lib/sections.js`: add Education between Experience and Contact, hidden when the data is empty; rename the About label to "About Me"; render `Education` in `App.jsx`; 3.1 passes

## 4. Navigation (`site-navigation`)

- [x] 4.1 [qa] Update e2e: nav links read Home, About Me, Skills, Projects, Experience, Education, Contact in order (inline and in the mobile menu); choosing Home from Contact brings the Hero into view and marks Home current; update section-name lists in the existing navigation and layout tests
- [x] 4.2 [dev] Make the About section heading "About Me" to match its nav label; update the affected unit tests; 4.1 passes

## 5. WhatsApp contact (`contact-links`)

- [x] 5.1 [qa] Write failing e2e tests: "Chat on WhatsApp" opens a `wa.me` chat with the number and greeting in a new tab, the portfolio stays open, and the opened page has no `window.opener`; the number is not visible text; Contact offers email, WhatsApp, and social links and no form
- [x] 5.2 [dev] TDD `src/lib/contact.js` `whatsappUrl({ number, message })`: `https://wa.me/<digits>?text=<encoded>`, non-digits stripped
- [x] 5.3 [dev] TDD the WhatsApp link in `Contact` (Lucide `MessageCircle` icon, visually hidden "(opens in a new tab)", `target="_blank"`, `rel="noopener noreferrer"`, hidden when no number); Contact counts as having content when only WhatsApp is set; 5.1 passes

## 6. Dark theme by default (`theme-toggle`)

- [x] 6.1 [qa] Update e2e: first visit is dark for dark, light, and no system preference, from the first painted frame; a saved light choice survives a return visit and reload with no dark flash; keep the existing dark-choice, blocked-storage, label, keyboard, and reduced-motion tests
- [x] 6.2 [dev] TDD `resolveTheme`: a saved valid theme wins, otherwise dark; drop the system-preference input
- [x] 6.3 [dev] Update the `index.html` boot script to the same rule (saved, then dark) and its comment; update the SEO plugin to emit one dark `theme-color` tag and its unit tests; 6.1 passes

## 7. Visual style (`visual-style`)

- [x] 7.1 [dev] Write a failing unit test for the theme tokens: body and muted text reach 4.5:1 and accents reach 4.5:1 for normal text against background and surface in both themes
- [x] 7.2 [dev] Update `tokens.css` with the dark and light palettes from design D7 (adding `--color-accent-2` and `--font-display`), pass `colorPrimary` to antd `ConfigProvider` per theme, and keep `seo.js` theme colours in step with `--color-bg`; 7.1 passes
- [x] 7.3 [dev] Install `@fontsource/jetbrains-mono` (exact version), add `src/styles/fonts.css` importing only `latin-400.css` and `latin-700.css`, and apply `--font-display` to headings, nav links, the Hero headline, and skill and technology labels; body stays on the system stack
- [x] 7.4 [qa] Write e2e tests: a section heading's computed font is JetBrains Mono and an About paragraph's is not; every font request is same-origin; headings are visible before the font finishes loading (font request delayed)
- [x] 7.5 [dev] Add the shared `.card-surface` style to project, experience, and education cards, the decorative `aria-hidden` `//` heading prefix in `PageSection`, the `>` tagline prompt, and the Hero grid background, all within contrast and without gradient behind body text
- [x] 7.6 [qa] Write e2e tests: hovering or focusing a project card shows a highlight and neighbouring cards keep their positions; with reduced motion every section's content is fully visible on scroll with no animation; after scrolling to the bottom every section is fully visible
- [x] 7.7 [dev] TDD the `useReveal` hook (adds `reveal-ready` to `<html>` only when `IntersectionObserver` exists and reduced motion is off; reveals each `data-reveal` element once; reveals elements already in view at once), add card hover/focus styles and the reveal CSS, and mark section bodies and cards with `data-reveal`; 7.4 and 7.6 pass
- [x] 7.8 [dev] Replace `public/favicon.svg` with the AK mark (gradient tile, outlined paths); TDD the `Header` logo: visible AK mark, full name visible from 768 px and visually hidden below, accessible name includes "Kani Alagar A"
- [x] 7.9 [qa] Write e2e tests: the logo link's accessible name includes "Kani Alagar A" and choosing it returns to the Hero; the page links the AK favicon
- [x] 7.10 [dev] Regenerate `public/og-image.png` (1200×630) with the owner's name, role, and new palette

## 8. Résumé placeholder removal (`resume-download`)

- [x] 8.1 [qa] Change the download e2e test to serve its own small PDF through `page.route`, so it does not depend on `public/resume.pdf`
- [x] 8.2 [dev] Delete `public/resume.pdf`; confirm the production preview shows the "unavailable" notice and all résumé e2e tests pass

## 9. Quality gates (`site-quality`)

- [x] 9.1 [dev] TDD a font budget in `scripts/bundle-size.js` and `check-bundle-size.js`: sum the bundled `.woff2` files in `dist/` and fail above 60 KB; `npm run check:size` passes for JS, CSS, and fonts
- [x] 9.2 [qa] Make the axe scans scroll to the bottom first so revealed content is checked at full opacity; scans pass with no serious or critical violations in dark and light themes
- [x] 9.3 [dev] Run `npm run lhci`; Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO 100, LCP < 2.5 s, CLS < 0.1; fix regressions without changing budgets

## 10. Documentation

- [ ] 10.1 [dev] Update `README.md`: content now real, how to add `public/resume.pdf` and a profile photo later, where the WhatsApp number and education live, and the font budget

## 11. Verification

- [ ] 11.1 [dev] Run `npm run lint`, `npx prettier --check .`, `npm test`, `npm run build`, `npm run check:size`, and `npm run e2e`; all pass
- [ ] 11.2 [qa] Confirm every scenario in this change's `specs/` maps to at least one passing unit or e2e test, and record the map and any gaps in `verification.md`
- [ ] 11.3 [dev] Run `openspec validate personalise-portfolio --type change --strict`
- [ ] 11.4 [owner] After deployment, check the live site on a phone and a desktop, and a link preview showing the new image
