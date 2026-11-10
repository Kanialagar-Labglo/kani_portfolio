# Verification: trim-startup-javascript

Date: 2026-11-10. Every scenario in this change's delta spec mapped to the automated checks
that cover it.

Levels: **E2E** = Playwright (`e2e/`), **Unit** = Vitest (`src/`, `scripts/`),
**Script** = `npm run check:size` / `lhci`, **Manual** = run by hand.

## Results at verification time

| Check | Result |
| --- | --- |
| `npm run lint`, `npx prettier --check .` | Clean |
| `npm test` | 227 passed (38 files) |
| `npm run build` | Built: startup `index` 77.9 KB gzipped; on-demand chunks `antdTheme` (shared antd) 45.8 KB, `MenuDrawer` 22.0 KB, `ResumeNotice` 10.4 KB |
| `npm run e2e` | 443 passed, 53 skipped (the suite's existing per-device skips; none added) |
| `npm run check:size` | JS 75.3 KB / 100 KB (was 157.6 KB), CSS 15.7 KB / 40 KB gzipped; fonts 42.1 KB / 60 KB woff2 |
| `openspec validate trim-startup-javascript --type change --strict` | Valid |

`check:size` counts only what `index.html` loads, so it reports the startup chunk without the
shared Vite preload helper inlined in the build output above.

### Lighthouse, this branch against `main` (task 7.3)

Five mobile runs each with `lhci collect`, on a local laptop.

| Setting | `main` | This change |
| --- | --- | --- |
| Default mobile | Performance 100 ×5, TBT 0 ms | Performance 100 ×5, TBT 0 ms |
| CPU slowdown 12× (closer to a CI runner) | Performance 89–92 (median 91), TBT 355–456 ms (median 392), TTI 2.7 s | Performance 100 ×5, TBT 0 ms in 4 runs and 40 ms in 1, TTI 0.9 s |

LCP about 0.9 s and CLS 0 in both; Accessibility, Best Practices, and SEO 100 in both. The
idle prefetch adds no meaningful blocking time, so the fallbacks in design D2 (a minimum delay,
or a `<link rel="prefetch">` plugin) were not needed.

## site-quality

| Scenario | Covered by |
| --- | --- |
| Bundle stays within budget (MODIFIED: JS ≤ 100 KB) | Script `check:size` in CI with `BUDGETS.js = 100 * 1024`; Unit `checkBudgets` and `findInitialAssets` (only scripts `index.html` loads count) |
| First view loads without the extras | E2E no script requested before `load` contains the drawer or notification code (all four browsers); E2E theme toggle, menu button, and labels work while the extras are held back; Unit `Skills`, `ProjectCard`, `ThemeToggle`, `MobileMenu` render native elements with no antd |
| Extras are fetched when the browser is idle | E2E drawer and notice code arrive after `load` with no interaction (all four browsers); Unit `whenIdle` (load, then idle; timer fallback; cancel at each stage) and `useIdlePrefetch` (each loader once, failures ignored, cancel on unmount) |
| Extra used before its code has arrived: menu drawer | E2E extras held back, menu opened, then released: the drawer appears, Tab reaches a menu item, Escape closes it, and focus returns to the button; Unit `MobileMenu` loads the drawer only on first open; Unit `MenuDrawer` links, Escape, résumé action, Tab wrap |
| Extra used before its code has arrived: résumé notice | E2E extras held back, unavailable résumé chosen, then released: the notice appears, "Go to Contact" scrolls to Contact and closes it; Unit `App` loads the notice only when needed; Unit `ResumeNotice` text, link, and a single notice when asked again |

Supporting checks:

- The look is unchanged: one-off before/after screenshots of the header, Skills, and Projects
  in both themes at 375 px and 1280 px (task 4.4, approved by the owner). The header was
  pixel-identical; label text edges differed by at most 5 of 255 colour levels in dark and
  2 in light, from solid versus semi-transparent text. Hover and pressed colours matched.
- Accessibility: the existing axe scans (light and dark) and the keyboard-only journey pass.
  Unit `tokens.test.js` checks that label text on its background reaches 4.5:1 in both themes.
- A failed download leaves the page usable: Unit `ExtraBoundary` (render error and rejected
  lazy import both render nothing; siblings stay).

## Deviations from the design

- **`antdThemeConfig` lives in `src/lib/antdTheme.js`, not `src/lib/theme.js` (D1).**
  `theme.js` is part of the startup code through `useTheme`, so importing antd's theme
  algorithms there would have pulled antd back into the first load. `ACCENT_COLORS` stays in
  `theme.js`.
- **Keyboard focus ring on the theme toggle and menu button (D3).** antd's own focus ring was
  3 px at about 1.8:1 (dark) and 2.4:1 (light) contrast. With the owner's agreement the native
  buttons use the site's standard `:focus-visible` ring (3 px accent, about 8:1 and 6.5:1).
  This is the only visible difference, and only during keyboard use.
- **"The notice closes after Go to Contact" is checked end to end, not in a unit test (D5).**
  jsdom never finishes antd's closing animation, so the check runs in real browsers instead.
- **Unit tests load the extras before running.** `Header`, `MobileMenu`, and `App` tests call
  the loaders in `beforeAll`, as the idle prefetch does, so a first open stays within the
  default wait.
- **`ExtraBoundary` is a class component.** React has no hook for catching render errors; a
  comment in the file records this exception to the functional-components convention.
- **The budget stays at 100 KB** although startup came out at 75 KB rather than the expected
  85 KB; the owner chose to keep the approved spec value (task 7.1).

## Notes

- When the drawer opens, antd focuses the drawer's outer container (outside the element with
  `role="dialog"`), and the next Tab reaches the first menu item. `main` behaves the same; the
  E2E test checks the keyboard experience rather than the initial focus target.
- Rollup names the shared antd chunk after its first module (`antdTheme-*.js`). It holds the
  antd code that the drawer and the notice both use.

## Gaps

None. Task 9.4 (the owner checks a phone after deployment and confirms the CI Lighthouse job
passes on both the PR run and the push run) is manual and happens after merge.
