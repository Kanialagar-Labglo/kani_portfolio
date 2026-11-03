# ADR-0002: Use Bootstrap for layout and utilities, and Ant Design for interactive components

- Status: Accepted
- Date: 2026-11-03
- Supersedes: None
- Origin: OpenSpec change `create-portfolio-site` (design D3, D4, D5)

## Context and Problem Statement

The project stack names both Bootstrap and Ant Design (antd) for styling and UI,
alongside plain HTML and CSS. Both libraries can do layout and components, so
using them without a boundary would duplicate features, cause style conflicts,
and push the page past its bundle budget (200 KB JS, 40 KB CSS gzipped). The
site also needs a light/dark theme applied consistently. How should the two
libraries divide the work?

## Considered Options

- Bootstrap (selected Sass partials: grid, containers, reboot, utilities; no Bootstrap JS) for layout, antd for interactive components
- Bootstrap for everything, antd not used
- antd for everything, Bootstrap not used
- Full Bootstrap CSS and JS alongside antd, chosen per component

## Decision Outcome

Chosen option: "Bootstrap for layout via selected Sass partials, antd for
interactive components", because each library is used for what it does best
without overlap: Bootstrap's mobile-first grid and spacing utilities for page
structure, and antd for accessible interactive components (for example the
`Drawer` mobile menu and notifications). Both follow one resolved theme
(`data-bs-theme` for Bootstrap, `ConfigProvider` algorithm for antd, CSS custom
properties for custom styles).

### Consequences

- Good, because CSS stays small: only the Bootstrap partials in use are compiled.
- Good, because antd components bring built-in focus management, keyboard
  handling, and a dark algorithm.
- Good, because there is one clear rule for future work: layout and spacing go
  to Bootstrap, interactive widgets go to antd, everything else is plain CSS.
- Bad, because antd is the largest dependency and its CSS-in-JS counts toward
  the JavaScript budget; components must be imported selectively and the bundle
  size checked in CI.
- Bad, because Bootstrap's reboot and antd's base styles can conflict; load
  order and theme tokens must be managed deliberately.
- Bad, because `sass` is needed as a build dependency.
