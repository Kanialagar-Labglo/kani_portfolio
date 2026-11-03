# ADR Review Manifest

- Status: completed
- Review date: 2026-11-03

## Review Summary

ADR review completed for this change. `design.md` decisions D1–D11 were
reviewed against the bar for durable architectural decisions. Four decisions
set long-term commitments that later changes must follow and were recorded as
repository-level ADRs. The remaining decisions (project layout details,
theming mechanics, anchor-based navigation, résumé availability check,
build-time metadata plugin) are implementation choices covered by `design.md`
and do not need their own ADRs.

## In-Force ADRs Reviewed

- None - `adr/` had no ADRs before this change.

## New Durable ADRs Created

- [ADR-0001](../../../adr/0001-static-single-page-app-without-router-or-backend.md): Static single-page React app without a router or backend (design D1, D2)
- [ADR-0002](../../../adr/0002-bootstrap-for-layout-antd-for-interactive-components.md): Bootstrap for layout and utilities, Ant Design for interactive components (design D3–D5)
- [ADR-0003](../../../adr/0003-testing-strategy-vitest-and-playwright.md): Vitest and React Testing Library for units, Playwright with axe for end-to-end (design D10)
- [ADR-0004](../../../adr/0004-host-on-github-pages-with-github-actions.md): GitHub Pages hosting with GitHub Actions deployment (design D9, D11)
