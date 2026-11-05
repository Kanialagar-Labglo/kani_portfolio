# ADR Review Manifest

- Status: completed
- Review date: 2026-11-05

## Review Summary

ADR review completed for this change. `design.md` decisions D1–D12 were
reviewed against the bar for durable architectural decisions. One decision sets
a long-term commitment that later changes must follow and was recorded as a
repository-level ADR: how web fonts are loaded (D8).

The other decisions are covered by `design.md` and the specs and do not need
their own ADRs:

- Data shapes, Education, grouped highlights, the WhatsApp link, palette, motion,
  branding assets, and résumé placeholder removal (D1–D5, D7, D9–D11) are
  content or implementation choices within the existing architecture.
- The dark-by-default theme (D6) is product behaviour defined in the
  `theme-toggle` spec. The theming mechanism (one resolved theme, boot script,
  saved choice) is unchanged.
- Test additions (D12) follow ADR-0003.

## In-Force ADRs Reviewed

All are Accepted with no supersession links, and this change stays within each:

- [ADR-0001](../../../adr/0001-static-single-page-app-without-router-or-backend.md): Static SPA without a router or backend. The WhatsApp button is a plain outbound link, with no backend.
- [ADR-0002](../../../adr/0002-bootstrap-for-layout-antd-for-interactive-components.md): Bootstrap for layout, antd for interactive components. Cards use the Bootstrap grid and custom CSS; antd keeps the drawer and notice, themed with the new accent.
- [ADR-0003](../../../adr/0003-testing-strategy-vitest-and-playwright.md): Vitest and Playwright with axe. New and changed scenarios are tested the same way.
- [ADR-0004](../../../adr/0004-host-on-github-pages-with-github-actions.md): GitHub Pages and Actions. Deployment is unchanged.

## New Durable ADRs Created

- [ADR-0005](../../../adr/0005-self-host-web-fonts-with-fontsource.md): Self-host web fonts through Fontsource packages (design D8)
