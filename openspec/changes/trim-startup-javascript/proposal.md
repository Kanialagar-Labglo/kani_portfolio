## Why

The CI Lighthouse gate has become flaky: the same commit scored Performance 84
on one runner and passed on another. The cause is main-thread time spent
starting up JavaScript. Ant Design and its helper packages make up 47% of the
startup bundle (about 224 KB of 477 KB minified), yet the page only needs them
for two things a visitor may never open: the mobile menu drawer and the résumé
"unavailable" notice. Taking antd out of the first load gives the performance
gate real headroom and makes the site faster for visitors on slower phones.

## What Changes

- Skill and technology labels become plain HTML and CSS instead of antd `Tag`,
  pixel-matched to today's look in both themes.
- The theme toggle and the mobile-menu trigger become native `<button>`
  elements with the same look, accessible names, focus rings, and keyboard
  behaviour.
- The mobile menu drawer and the résumé "unavailable" notice, together with the
  `ConfigProvider` that themes them, load on demand. They stay antd components
  (ADR-0002).
  - Once the page has loaded and the browser is idle, their code is prefetched
    in the background, so the first use is normally instant.
  - If a visitor uses them before the prefetch finishes, the code loads at that
    moment and the menu or notice still works.
- The startup JavaScript budget drops from 200 KB to the new measured size plus
  about 15% headroom (expected around 90–100 KB gzipped). The exact number is
  set in the specs.
- An end-to-end check confirms that no antd code loads before the menu or
  notice is used.
- No visual or content changes. Lighthouse thresholds stay as they are.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `site-quality`: The lightweight-bundle requirement gets the lower startup
  JavaScript budget, and a new requirement says interactive extras (the menu
  drawer and the résumé notice) load after the first view without delaying
  their first use.

## Impact

- **Components:** `Skills` and `ProjectCard` (labels), `ThemeToggle`,
  `MobileMenu` (native trigger, lazy drawer), and `App` (lazy notice, with
  `ConfigProvider` moved into the lazy part).
- **Code:** a small idle-prefetch helper and a CSS label style that replaces
  `Tag`.
- **Scripts:** the `check:size` JavaScript budget is lowered.
- **Tests:**
  - Component unit tests are updated where antd elements become native ones.
  - New end-to-end checks: no antd before interaction, and a first menu tap
    that arrives before the prefetch finishes.
  - The existing end-to-end and axe suites guard against visual and
    accessibility regressions.
- **Docs:** the README quality-targets table.
- **ADRs:** ADR-0002 (antd for interactive components) stays in force. The ADR
  step decides whether "keep heavy UI libraries out of the startup path"
  deserves its own ADR.
