<!--
Owner tags: [dev] = senior-dev (strict red-green-refactor with Vitest),
[qa] = senior-qa (Playwright end-to-end and accessibility tests),
[owner] = manual step for the site owner.
Within each group, [qa] writes the failing end-to-end tests first, then [dev]
implements test-first until they pass.
Run all npm commands under Node 24 (`nvm use`).
-->

## 1. Baseline (before any code change)

- [x] 1.1 [dev] Record antd's computed styles in both themes for a skill label (`.ant-tag`) and the header icon buttons (size, padding, border, radius, font, colours, background, and the hover and active fills) into a scratch note used by groups 3 and 4
- [x] 1.2 [qa] Take before screenshots of the header, Skills, and Projects in dark and light, at mobile (375 px) and desktop (1280 px) widths, outside the repo, for the one-off comparison in 4.4

## 2. Startup e2e tests (`site-quality`)

- [x] 2.1 [qa] Add `e2e/startup-javascript.spec.js` with a helper that records every JavaScript response and whether its body contains antd's drawer or notification code (class prefixes, not chunk names)
- [x] 2.2 [qa] Write failing e2e tests for "First view loads without the extras": by the `load` event, no recorded script contains the extras; the theme toggle switches theme, and the menu button (mobile) and skill and technology labels are visible
- [x] 2.3 [qa] Write e2e tests for "Extras are fetched when the browser is idle": with no interaction, a script containing the extras arrives after load
- [x] 2.4 [qa] Write e2e tests for "Extra used before its code has arrived": hold back extras scripts with `page.route`, open the mobile menu (or trigger the unavailable résumé), release the scripts, and check that the drawer (focus inside, Escape closes, focus returns) or the notice ("Go to Contact" works) appears

## 3. Native labels (`site-quality`, ADR-0006)

- [x] 3.1 [dev] TDD `Skills` and `ProjectCard`: each label is a `<span class="tag">` in the existing `tag-list` items, with no antd import; update their unit tests
- [x] 3.2 [dev] Add `.tag` styles to `global.css` from the 1.1 values, with any new colour tokens in `tokens.css` for both themes; switch the display-font selector from `.tag-list .ant-tag` to `.tag`; extend `tokens.test.js` so new text tokens keep 4.5:1 contrast

## 4. Native icon buttons (`site-quality`, ADR-0006)

- [x] 4.1 [dev] TDD `ThemeToggle` as a native `<button type="button" class="icon-button">` with the same accessible name and click behaviour, and no antd import
- [x] 4.2 [dev] TDD the `MobileMenu` trigger as a native `icon-button` keeping `aria-label`, `aria-expanded`, `aria-controls`, and focus return
- [x] 4.3 [dev] Add `.icon-button` styles from the 1.1 values (hover and active fills, transitions under the reduced-motion rules); the existing `:focus-visible` outline applies
- [x] 4.4 [qa] Take after screenshots matching 1.2 and compare them; the owner reviews any visible difference before continuing; the existing visual-style, theme-toggle, and axe e2e suites pass

## 5. Lazy extras (`site-quality`, ADR-0006)

- [x] 5.1 [dev] TDD `antdThemeConfig(theme)` in `src/lib/theme.js` (dark or default algorithm, `colorPrimary` from `ACCENT_COLORS`); move the accent test in `tokens.test.js` to it
- [x] 5.2 [dev] Add `src/lib/extras.js` with `loadMenuDrawer` and `loadResumeNotice` (each a plain dynamic `import()`)
- [x] 5.3 [dev] TDD `MenuDrawer` (antd `Drawer` in its own `ConfigProvider`, nav links, résumé button, the Tab-wrapping focus fix); `MobileMenu` renders it with `React.lazy` inside `Suspense` from the first open and keeps it mounted; unit tests await the dialog
- [x] 5.4 [dev] TDD `ResumeNotice` (antd notification in its own `ConfigProvider`, opened each time `requestId` changes, with the same key, role, placement, text, and "Go to Contact" link); `App` replaces `notification.useNotification` and the app-wide `ConfigProvider` with a notice request counter and the lazy `ResumeNotice`
- [x] 5.5 [dev] TDD a small error boundary around each lazy extra, so a failed load renders nothing and leaves the page usable
- [x] 5.6 [dev] Confirm no static `antd` import remains outside `MenuDrawer` and `ResumeNotice` (grep), and reword the antd load-order comment in `main.jsx`; 2.2 and 2.4 pass

## 6. Idle prefetch (`site-quality`)

- [x] 6.1 [dev] TDD `whenIdle(callback)` in `src/lib/idle.js`: waits for `load`, then `requestIdleCallback`, with a `setTimeout` fallback when it is missing; returns a cancel function (fake timers)
- [x] 6.2 [dev] TDD `useIdlePrefetch(loaders)`: runs each loader once when idle, ignores rejected loaders, cancels on unmount; call it in `App` with both loaders; 2.3 passes

## 7. Budget and performance (`site-quality`)

- [x] 7.1 [dev] Build and measure the startup JavaScript; if it is not close to the expected 85 KB gzipped, stop and ask the owner before setting the budget
- [x] 7.2 [dev] Lower the JavaScript budget in `scripts/check-bundle-size.js` to `100 * 1024`; `npm run check:size` passes for JS, CSS, and fonts
- [x] 7.3 [dev] Run `npm run lhci` and compare Total Blocking Time with the current `main`; all thresholds pass. If the idle prefetch adds blocking time, add a minimum delay in `whenIdle`, and ask the owner before considering a `<link rel="prefetch">` build plugin

## 8. Documentation

- [x] 8.1 [dev] Update `README.md`: the 100 KB JavaScript budget in the quality-targets table, and a short note on lazy-loaded extras
- [x] 8.2 [dev] Propose a one-line update to the CLAUDE.md styling rule to match ADR-0006, and apply it only after the owner approves the exact wording

## 9. Verification

- [x] 9.1 [dev] Run `npm run lint`, `npx prettier --check .`, `npm test`, `npm run build`, `npm run check:size`, and `npm run e2e`; all pass
- [x] 9.2 [qa] Confirm every scenario in this change's `specs/` maps to at least one passing unit or e2e test, and record the map and any gaps in `verification.md`
- [x] 9.3 [dev] Run `openspec validate trim-startup-javascript --type change --strict`
- [ ] 9.4 [owner] After deployment, check on a phone that the menu opens on the first tap and the labels and buttons look unchanged; confirm the CI Lighthouse job passes on both the PR and the push run
