# ADR-0004: Host on GitHub Pages and deploy with GitHub Actions

- Status: Accepted
- Date: 2026-11-03
- Supersedes: None
- Origin: OpenSpec change `create-portfolio-site` (design D9, D11)

## Context and Problem Statement

The portfolio builds to static files (ADR-0001) and must be publicly reachable,
with a stable URL for canonical links, Open Graph tags, and the sitemap. The
repository is hosted on GitHub as `Kanialagar-Labglo/kani_portfolio`. The
quality checks (tests, accessibility, bundle size, Lighthouse) should gate every
release. Where should the site be hosted, and how should it be deployed?

## Considered Options

- GitHub Pages, deployed by a GitHub Actions workflow
- Netlify
- Vercel
- Keep the build host-agnostic and decide later

## Decision Outcome

Chosen option: "GitHub Pages, deployed by GitHub Actions", because it is free,
lives with the repository, needs no additional platform account, and lets one
workflow run every quality check before publishing.

- The default site URL is `https://kanialagar-labglo.github.io/kani_portfolio/`,
  served under the `/kani_portfolio/` base path.
- The site URL and base path are kept in a single configuration file; all asset
  and metadata URLs derive from them.
- One workflow runs lint, unit tests, build, bundle-size check, Playwright, and
  Lighthouse CI on every push and pull request, and deploys to Pages only on
  pushes to `main` after all checks pass.

### Consequences

- Good, because hosting is free and deployment is automatic on merge to `main`.
- Good, because broken builds or failed quality checks never reach the live site.
- Good, because rollback is reverting a commit or re-running an earlier
  successful deployment.
- Bad, because the app runs under a sub-path, so every asset URL must respect
  the base path.
- Bad, because GitHub Pages has no per-branch preview deployments and limited
  control over headers and redirects.
- Follow-up: the owner must enable Pages with "GitHub Actions" as the source in
  the repository settings. A custom domain later requires a new ADR only if it
  changes hosting; otherwise it is a configuration change.
