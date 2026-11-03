# ADR-0003: Test with Vitest and React Testing Library for units, and Playwright with axe for end-to-end

- Status: Accepted
- Date: 2026-11-03
- Supersedes: None
- Origin: OpenSpec change `create-portfolio-site` (design D10)

## Context and Problem Statement

The project uses strict test-driven development during apply, and every spec
scenario should map to at least one automated test. Playwright is already fixed
as the end-to-end tool. The project still needs a unit/component test runner, an
accessibility check, and a way to enforce the performance and bundle-size
targets. Which tools make up the testing strategy, and how is behaviour split
between them?

## Considered Options

- Vitest + React Testing Library (jsdom) for units; Playwright + `@axe-core/playwright` for end-to-end and accessibility; Lighthouse CI and a small gzip size script for quality budgets
- Jest + React Testing Library for units, with the same end-to-end tooling
- Playwright only (end-to-end and component testing), no separate unit runner

## Decision Outcome

Chosen option: "Vitest + React Testing Library for units; Playwright with axe for
end-to-end; Lighthouse CI and a size script for budgets", because Vitest shares
Vite's configuration and ES module handling with no extra transforms, gives fast
feedback for red-green-refactor, and Playwright covers what needs a real browser.

Split of responsibilities:

- Vitest: pure logic and hooks (section visibility, résumé availability check,
  metadata strings, theme resolution) and component rendering.
- Playwright: real-browser behaviour (scrolling, focus, viewport layout,
  downloads, metadata in built HTML) on desktop Chromium, desktop Firefox,
  mobile Chrome, and mobile WebKit, with axe scans in both themes.
- Lighthouse CI and `scripts/check-bundle-size.js`: performance and size budgets
  on the production build.

### Consequences

- Good, because unit tests run fast inside the same toolchain as the app.
- Good, because the quality targets in the `site-quality` spec are enforced
  automatically rather than checked by hand.
- Good, because the bundle-size check needs no extra dependency.
- Bad, because there are two test runners with separate configuration and
  conventions to learn.
- Bad, because Playwright browser downloads and Lighthouse runs make CI slower.
- Bad, because Playwright WebKit is not identical to real Safari; a manual
  check on a real iPhone is still needed before releases.
