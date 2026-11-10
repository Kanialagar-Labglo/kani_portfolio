# ADR Review Manifest

- Status: completed
- Review date: 2026-11-06

## Review Summary

ADR review completed for this change. `design.md` decisions D1–D6 were reviewed
against the bar for durable architectural decisions.

One decision intentionally diverges from an in-force ADR: native HTML for
labels and simple buttons, with antd loaded only on demand for complex widgets
(D1–D4). It is recorded as a new repository-level ADR that supersedes ADR-0002.
ADR-0002's file is unchanged.

The other decisions are covered by `design.md` and the specs:

- The shape of the idle-prefetch helper and the loader module (D2) is an
  implementation choice under the new ADR.
- Tests (D5) follow ADR-0003.
- Docs and leftover clean-up (D6) are not architectural.

## In-Force ADRs Reviewed

All were Accepted with no supersession links before this change:

- [ADR-0001](../../../adr/0001-static-single-page-app-without-router-or-backend.md): Static SPA without a router or backend. Unchanged: lazy chunks are static files on the same site.
- [ADR-0002](../../../adr/0002-bootstrap-for-layout-antd-for-interactive-components.md): Bootstrap for layout, antd for interactive components. Superseded by ADR-0006, which keeps the Bootstrap layout rule, refines when antd is used and loaded, and lowers the startup budget.
- [ADR-0003](../../../adr/0003-testing-strategy-vitest-and-playwright.md): Vitest and Playwright with axe. New and changed scenarios are tested the same way.
- [ADR-0004](../../../adr/0004-host-on-github-pages-with-github-actions.md): GitHub Pages and Actions. Deployment is unchanged.
- [ADR-0005](../../../adr/0005-self-host-web-fonts-with-fontsource.md): Self-hosted fonts through Fontsource. Unchanged.

## New Durable ADRs Created

- [ADR-0006](../../../adr/0006-keep-antd-out-of-the-startup-path.md): Keep antd out of the startup path (design D1–D4). Supersedes ADR-0002.
