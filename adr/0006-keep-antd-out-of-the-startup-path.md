# ADR-0006: Keep antd out of the startup path

- Status: Accepted, supersedes ADR-0002
- Date: 2026-11-06
- Supersedes: ADR-0002
- Origin: OpenSpec change `trim-startup-javascript` (design D1–D4)

## Context and Problem Statement

ADR-0002 split the work between Bootstrap (layout) and antd (interactive
components), and set the startup budget at 200 KB of gzipped JavaScript. In
practice antd and its helper packages grew to 47% of the startup bundle. It was
loaded only for simple labels, two icon buttons, and two widgets that a visitor
may never open: the mobile menu drawer and the résumé notice. The startup cost
made the CI Lighthouse Performance gate (at least 90) flaky.

ADR-0002's rule, "interactive widgets go to antd", sends every button to antd,
so the problem would come back with each new control. Where should antd be used,
and when may it load?

## Considered Options

- Native HTML for labels and simple buttons; antd only for complex widgets, loaded on demand and prefetched when idle
- Keep ADR-0002 as it is, and tune Lighthouse (more runs, a lower threshold)
- Remove antd entirely, replacing the drawer and the notice with custom code
- Keep antd components in startup, and trim them with tree-shaking or manual chunks

## Decision Outcome

Chosen option: "Native HTML for labels and simple buttons; antd only for complex
widgets, loaded on demand". The rule for future work is:

- **Layout, grid, and spacing:** Bootstrap Sass partials. This part of ADR-0002
  is unchanged.
- **Labels, links, and simple buttons:** native HTML styled with the design
  tokens. This covers controls whose behaviour is one click with an accessible
  name, such as the theme toggle and the menu trigger.
- **Complex interactive widgets:** antd. These are widgets that need focus
  management, overlays, or animation, such as the drawer and notifications.
  - They are loaded with a dynamic `import()`, never a static one in startup
    code.
  - They are prefetched when the browser is idle.
  - Each wraps itself in an antd `ConfigProvider` built from one shared theme
    function.
- **Budget:** the startup JavaScript budget is 100 KB gzipped. `npm run
  check:size` enforces it in CI.

### Consequences

- Good, because antd's cost leaves startup, which gives the Lighthouse gate
  headroom and speeds up first load on slow phones.
- Good, because widgets that need it still get antd's accessible behaviour,
  such as focus management, Escape handling, and the dark algorithm.
- Good, because a future static antd import in startup code fails the size
  check instead of slowly eroding performance.
- Bad, because the codebase has two kinds of button: native buttons for simple
  actions, and antd inside lazy widgets. Contributors must apply the rule.
- Bad, because native controls must reproduce the look in CSS and stay
  pixel-matched with antd by hand, for example after an antd upgrade.
- Bad, because a lazily loaded widget can be used before its code arrives. Each
  one needs a `Suspense` boundary, an error boundary, and a test for the
  before-arrival path.
