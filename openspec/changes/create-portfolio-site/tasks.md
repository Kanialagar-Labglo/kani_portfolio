<!--
Owner tags: [dev] = senior-dev (strict red-green-refactor with Vitest),
[qa] = senior-qa (Playwright end-to-end and accessibility tests),
[owner] = manual step for the site owner.
Within each capability group, [qa] writes the failing end-to-end tests first,
then [dev] implements test-first until they pass.
Run all npm commands under Node 24 (`nvm use`).
-->

## 1. Project setup

- [x] 1.1 [dev] Add `.nvmrc` (`24`) and fill `package.json`: `"type": "module"`, `"private": true`, `engines.node >=24 <25`, and scripts `dev`, `build`, `preview`, `test`, `test:watch`, `lint`, `format`, `e2e`, `check:size`, `lhci`
- [x] 1.2 [dev] Install runtime dependencies (`react`, `react-dom`, `bootstrap`, `antd`, `lucide-react`) and dev dependencies (`vite`, `@vitejs/plugin-react`, `sass`, `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `eslint` with `react`, `react-hooks`, `jsx-a11y` plugins, `prettier`, `@playwright/test`, `@axe-core/playwright`, `@lhci/cli`); confirm no TypeScript packages or files are added
- [x] 1.3 [dev] Add `site.config.js` with `siteUrl` (`https://kanialagar-labglo.github.io/kani_portfolio/`) and `basePath` (`/kani_portfolio/`), and `vite.config.js` with the React plugin, `base` from `basePath`, and Vitest settings (jsdom, setup file with `jest-dom`)
- [x] 1.4 [dev] Add `index.html` skeleton (`lang="en"`, viewport meta, metadata placeholders, `<div id="root">`, `<noscript>` message), `src/main.jsx`, and an empty `src/App.jsx`; write one passing smoke test so `npm test` runs green
- [x] 1.5 [dev] Add ESLint flat config and Prettier config; `npm run lint` passes
- [x] 1.6 [dev] Add `src/styles/bootstrap.scss` importing only functions, variables, maps, mixins, root, reboot, containers, grid, and utilities; add `src/styles/tokens.css` (light/dark custom properties, header height) and `global.css`; import them in `main.jsx` before antd
- [x] 1.7 [dev] Confirm `npm run build` and `npm run preview` serve the app under `/kani_portfolio/`

## 2. End-to-end test harness

- [ ] 2.1 [qa] Add `playwright.config.js` with projects desktop Chromium, desktop Firefox, Pixel (mobile Chrome), and iPhone (mobile WebKit), using `webServer` to build and run `vite preview` with the production base path
- [ ] 2.2 [qa] Add shared helpers in `e2e/support/`: open the page, set theme, set viewport width, emulate reduced motion, and run an axe scan that fails on serious or critical violations
- [ ] 2.3 [qa] Add a smoke test that the page loads with a 200 response in all four projects; `npm run e2e` passes

## 3. Content data and section visibility

- [ ] 3.1 [dev] Add placeholder data modules in `src/data/`: `profile.js` (name, role, tagline, optional photo, bio paragraphs, optional résumé path), `skills.js`, `projects.js`, `experience.js`, `socials.js` (email and social profiles), each clearly marked as placeholder content
- [ ] 3.2 [dev] TDD `src/lib/sections.js`: derive the ordered list of visible sections (Hero, About, Skills, Projects, Experience, Contact) and hide any section whose data is empty

## 4. Page layout (`page-layout`)

- [ ] 4.1 [qa] Write failing e2e tests: landmarks (banner, navigation, main, contentinfo, labelled regions), exactly one `h1` and no skipped heading levels, path unchanged when moving between sections, no horizontal scroll and no clipping at 360/768/1024/1440/1920 px, single-column project cards at 360 px, skip link is first focus and moves focus to `main`, and the no-JavaScript message
- [ ] 4.2 [dev] TDD the page shell in `App.jsx`: `SkipLink`, `header`, `main` containing one labelled `section` per visible section (from 3.2), and `footer`
- [ ] 4.3 [dev] Apply the mobile-first Bootstrap grid and container layout so the 4.1 tests pass

## 5. Theme toggle (`theme-toggle`)

- [ ] 5.1 [qa] Write failing e2e tests: initial theme for dark/light/no system preference, toggle switches the whole page without reload, choice remembered across visits, works when storage is blocked, first painted frame uses the saved theme, toggle visible at every width, accessible names "Switch to dark theme"/"Switch to light theme", Enter key toggles, no colour transition under reduced motion
- [ ] 5.2 [dev] TDD `src/lib/theme.js`: resolve the theme from saved choice, then system preference, then light; read and write the saved choice safely when storage throws
- [ ] 5.3 [dev] Add the inline theme boot script to `index.html` that sets `data-bs-theme` and `data-theme` on `<html>` before first paint, using the same resolution order as 5.2
- [ ] 5.4 [dev] TDD the `useTheme` hook and `ThemeToggle` component (Lucide sun/moon icon, action-based accessible name), and wire antd `ConfigProvider` to `darkAlgorithm`/`defaultAlgorithm`
- [ ] 5.5 [dev] Make custom styles use the theme tokens and wrap colour transitions in `prefers-reduced-motion: no-preference`; 5.1 tests pass

## 6. Site navigation (`site-navigation`)

- [ ] 6.1 [qa] Write failing e2e tests: sticky header while scrolling, one link per visible section in page order, section heading not covered after a jump, smooth vs instant scrolling by motion preference, active link highlighted with `aria-current` and only one marked, address updates to `#section` on click, deep link `#projects` opens at Projects, scrolling leaves the address unchanged, site name returns to top, mobile menu below 768 px (closes on link, Escape, outside tap; focus contained; focus returns to menu button), inline links at 1024 px
- [ ] 6.2 [dev] TDD the `Header` and `NavLinks` components rendering anchor links from the visible sections, the site-name link to top, and the sticky header styles with `scroll-margin-top` and CSS smooth scrolling under `prefers-reduced-motion: no-preference`
- [ ] 6.3 [dev] TDD the `useActiveSection` hook (one `IntersectionObserver`, returns the current section id) and mark the active link with `aria-current="location"`
- [ ] 6.4 [dev] TDD the mobile menu: menu button below 768 px opening an antd `Drawer` with the nav links, closing on link choice, and returning focus to the menu button on close; theme toggle stays outside the drawer
- [ ] 6.5 [dev] Make all 6.1 tests pass in all four browser projects

## 7. Portfolio sections (`portfolio-sections`)

- [ ] 7.1 [qa] Write failing e2e tests: section order with footer last, Hero name as `h1` with role and tagline, "View projects" and "Contact" actions scroll to their sections, profile photo alt text, no image when no photo, About paragraphs in order, Skills groups as labels without ratings, project cards with optional links opening in a new tab, Experience newest first with "Present", footer copyright with current year, a section with empty data and its nav link hidden
- [ ] 7.2 [dev] TDD the `Hero` component (name, role, tagline, optional photo, actions)
- [ ] 7.3 [dev] TDD the `About` component (one to three bio paragraphs)
- [ ] 7.4 [dev] TDD the `Skills` component (named groups, antd `Tag` per skill, no ratings)
- [ ] 7.5 [dev] TDD the `Projects` and `ProjectCard` components (antd `Card`, technology tags, optional source/live links with `target="_blank"` and `rel="noopener noreferrer"`, lazy-loaded screenshot with alt text)
- [ ] 7.6 [dev] TDD the `Experience` component (antd `Timeline`, newest first, "Present" for no end date, two to four highlights)
- [ ] 7.7 [dev] TDD the `Footer` component (owner name, current year, social links)
- [ ] 7.8 [dev] TDD that changing a data entry changes the rendered content without component changes; 7.1 tests pass

## 8. Contact links (`contact-links`)

- [ ] 8.1 [qa] Write failing e2e tests: email link has a `mailto:` address, social links open in a new tab with no opener access, icon-only links have platform names, no form in the Contact section
- [ ] 8.2 [dev] TDD the `Contact` and `SocialLinks` components (Lucide icons, accessible platform labels, `mailto:` email link); reuse `SocialLinks` in the footer; 8.1 tests pass

## 9. Résumé download (`resume-download`)

- [ ] 9.1 [dev] Add a placeholder `public/resume.pdf` and set the résumé path in `profile.js`
- [ ] 9.2 [qa] Write failing e2e tests: download action in Hero and header and inside the mobile menu, download saves `<Firstname>-<Lastname>-Resume.pdf` and the page stays open, no action when no résumé is configured, missing file shows the unavailable notice and downloads nothing, HTML response instead of PDF shows the notice, notice's Contact option scrolls to Contact, notice is announced
- [ ] 9.3 [dev] TDD `src/lib/resume.js`: build the download file name from the owner's name; check availability with `HEAD` (falling back to `GET` on 405) and accept only an OK response with a PDF content type (mock `fetch` at the boundary)
- [ ] 9.4 [dev] TDD the `useResumeDownload` hook and `ResumeButton` component (real `<a download>` with Lucide download icon; hidden when not configured; antd notification with a Contact action on failure, in a live region)
- [ ] 9.5 [dev] Place `ResumeButton` in the Hero, header, and mobile menu, with URLs built from `import.meta.env.BASE_URL`; 9.2 tests pass

## 10. SEO metadata (`seo-metadata`)

- [ ] 10.1 [qa] Write failing e2e tests against the built `index.html` fetched without JavaScript: title format, `lang="en"`, description length 150–160, canonical, Open Graph and Twitter/X tags, theme colours, favicon, JSON-LD `Person`, `robots.txt` pointing to the sitemap, `sitemap.xml` listing the site URL
- [ ] 10.2 [dev] TDD `src/lib/seo.js`: build title, description, meta tags, JSON-LD, `robots.txt`, and `sitemap.xml` strings from profile, socials, and site config; report missing `siteUrl`
- [ ] 10.3 [dev] Add the Vite plugin in `vite.config.js` that injects the metadata with `transformIndexHtml`, emits `robots.txt` and `sitemap.xml`, and logs a warning without failing when `siteUrl` is empty
- [ ] 10.4 [dev] Add placeholder `public/og-image.png` (1200×630) and favicon; 10.1 tests pass

## 11. Site quality (`site-quality`)

- [ ] 11.1 [qa] Add e2e tests: full-page axe scan in light and dark themes with no serious or critical violations, keyboard-only pass reaching every link and button in logical order with visible focus, project screenshots not requested before scrolling, and the core journey (open, go to Projects, switch theme) in all four projects
- [ ] 11.2 [dev] Fix any accessibility, focus-visibility, or lazy-loading issues found by 11.1
- [ ] 11.3 [dev] Add `scripts/check-bundle-size.js` (gzip initial JS and CSS in `dist/` with Node `zlib`; fail above 200 KB JS or 40 KB CSS) and wire it to `npm run check:size`
- [ ] 11.4 [dev] Add `lighthouserc.cjs` (mobile preset, three runs, assertions: Performance ≥ 0.90, Accessibility ≥ 0.95, Best Practices ≥ 0.95, SEO = 1.00, LCP < 2500 ms, CLS < 0.1) and wire it to `npm run lhci`
- [ ] 11.5 [dev] Run `npm run build`, `npm run check:size`, and `npm run lhci` locally; reduce imports or assets until every budget passes, recording any budget change as a new decision

## 12. CI and deployment

- [ ] 12.1 [dev] Add `.github/workflows/ci-deploy.yml`: on push and pull request, Node 24, `npm ci`, lint, unit tests, build, size check, Playwright (with browser install), Lighthouse CI; on push to `main` after all pass, upload `dist/` and deploy with `actions/deploy-pages`
- [ ] 12.2 [dev] Update `README.md` with a project section: Node 24, setup and scripts, where to edit content (`src/data/`), where to replace `resume.pdf` and `og-image.png`, and how to change `siteUrl`/`basePath`
- [ ] 12.3 [owner] Enable GitHub Pages for the repository with "GitHub Actions" as the source (Settings → Pages)

## 13. Verification

- [ ] 13.1 [dev] Run `npm run lint`, `npm test`, `npm run build`, `npm run check:size`, and `npm run e2e`; all pass
- [ ] 13.2 [qa] Confirm every spec scenario in `specs/` maps to at least one passing unit or e2e test, and list any gaps
- [ ] 13.3 [dev] Run `openspec validate create-portfolio-site --type change --strict`
- [ ] 13.4 [owner] After the first deployment, check the live site, a social link preview, and a manual pass on a real iPhone
