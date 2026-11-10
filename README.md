# Kani Portfolio

The personal portfolio of **Kani Alagar A**, Full-Stack Developer with a
background in software development and QA automation. A fast, accessible,
single-page site built with React and Vite, developed spec-first with OpenSpec.

**Live site:** https://kanialagar-labglo.github.io/kani_portfolio/

## Tech stack

- React + Vite, JavaScript only (no TypeScript), ES modules
- Bootstrap (layout and utilities) + Ant Design (interactive components)
- Lucide icons
- JetBrains Mono display font, self-hosted with Fontsource (ADR-0005); dark theme by default
- Vitest + React Testing Library (unit), Playwright + axe (end-to-end and accessibility)
- Lighthouse CI and a bundle-size budget
- Hosted on GitHub Pages, deployed by GitHub Actions
- No backend, no database, no router

## Quick start

Requires Node 24 (see `.nvmrc`).

```bash
nvm use
npm ci
npm run dev
```

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Build the production site into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Run unit tests once |
| `npm run test:watch` | Run unit tests in watch mode |
| `npm run lint` | Lint with ESLint |
| `npm run format` | Format with Prettier |
| `npm run e2e` | Run Playwright tests in four browser setups |
| `npm run e2e:ui` | Open the Playwright UI |
| `npm run check:size` | Check the JS/CSS (gzipped) and web font budgets (run after `build`) |
| `npm run lhci` | Build and run the Lighthouse CI audit |

First-time Playwright setup: `npx playwright install --with-deps chromium firefox webkit`

## Editing content

All content lives in `src/data/`. Change the data, not the components.

| File | Contains |
| --- | --- |
| `profile.js` | Name, short role, Hero headline, description, tagline, logo initials, photo, bio, résumé path |
| `skills.js` | Skill groups |
| `projects.js` | Projects with optional source/live links and screenshots |
| `experience.js` | Roles (`YYYY-MM` dates; `end: null` for a current role) with either `highlights` or named `highlightGroups` |
| `education.js` | Qualifications with institution and completion year (shown newest first) |
| `socials.js` | Email, WhatsApp number and greeting (shown as a button, never as text), and social profile links |

An empty list hides its section and its navigation link.

### Still to add

- [ ] **Résumé:** put your PDF at `public/resume.pdf`. Until then the download
      buttons show a friendly "unavailable" notice pointing to Contact. No code
      change is needed.
- [ ] **Profile photo (optional):** add a square image such as
      `public/images/profile.jpg`, then set
      `photo: { src: 'images/profile.jpg', alt: 'Portrait of Kani Alagar A' }`
      in `profile.js`.
- [ ] **Link-preview image:** `public/og-image.png` (1200×630) shows your name
      and role. Regenerate it if either changes.

Restart `npm run dev` after editing `profile.js` or `socials.js` so the page metadata updates.

## Deployment

Every push and pull request runs lint, unit tests, build, the size budget,
Playwright, and Lighthouse (`.github/workflows/ci-deploy.yml`). A push to `main`
that passes every check is deployed to GitHub Pages.

**One-time setup:** in the repository, go to **Settings → Pages** and set
**Source** to **GitHub Actions**.

**Custom domain:** change `siteUrl` and `basePath` in `site.config.js`.

## Quality targets

| Check | Target |
| --- | --- |
| Lighthouse (mobile) | Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO 100 |
| Core Web Vitals | LCP < 2.5 s, CLS < 0.1 |
| Bundle | Startup JS ≤ 100 KB and CSS ≤ 40 KB gzipped; web fonts ≤ 60 KB (woff2) |
| Accessibility | No serious or critical axe issues in light and dark themes |

The mobile menu drawer and the résumé notice use Ant Design and load on demand, so
they don't count towards the startup budget. Their code is downloaded in the
background once the page is idle (ADR-0006).

## How this project is built

Features are developed with the intent-driven OpenSpec workflow:
proposal → specs → design → ADRs → tasks → test-first implementation.

- Change proposals and specs: [`openspec/`](openspec/)
- Architecture decisions: [`adr/`](adr/)
- Rules for AI agents and contributors: [`CLAUDE.md`](CLAUDE.md)

The template's own documentation follows.

---

## Development workflow (Intent-Driven Template)

An [OpenSpec](https://github.com/Fission-AI/OpenSpec) and [OpenCode](https://opencode.ai/) template with the `proposal -> specs -> design -> adr -> tasks` workflow enabled, plus optional collaboration workflows for teams that choose to adopt them.

### Walkthrough

[![Spec-Driven Development with OpenSpec and OpenCode](https://img.youtube.com/vi/o1w3V3DElV4/maxresdefault.jpg)](https://www.youtube.com/watch?v=o1w3V3DElV4)

Read the full walkthrough:

[Spec-Driven Development with OpenSpec and OpenCode](https://intent-driven.dev/blog/2026/05/10/spec-driven-development-openspec-opencode/)

[SDD with Multi-Model Spec Review and Glossary](https://intent-driven.dev/blog/2026/06/27/sdd-adversarial-authoring-glossary/)

### How To Use This Template

#### Start A New Project From This Template

Clone this repository, open it with OpenCode, and start working from the bundled
OpenSpec configuration, commands, skills, and schema.

#### Add This Template To An Existing Project

Open your existing project with OpenCode and ask it to install the template:

```text
Read and understand https://raw.githubusercontent.com/intent-driven-dev/intent-driven-template/refs/heads/main/INSTALL_TEMPLATE.md and follow the instructions there.
```

### What This Template Uses

- OpenSpec for setup, proposal, specification, design, ADR, and task artifacts.
- Custom schemas from https://github.com/intent-driven-dev/openspec-schemas.
- A bundled local copy of the `intent-driven` custom schema from
  https://github.com/intent-driven-dev/openspec-schemas/tree/main/openspec/schemas/intent-driven
  for the full `proposal -> specs -> design -> adr -> tasks` lifecycle.
- OpenSpec git discipline so proposals land on `main` before apply, and
  implementation lands on `main` before archive.
- OpenCode skills for repeatable collaboration and implementation workflows,
  including C4 diagrams, ADR authoring, and OpenSpec lifecycle commands.
- A bundled `test-driven-development` skill plus `senior-dev` and `senior-qa`
  subagents in `.opencode/agent/` for test-first implementation and
  acceptance-test work, routed via the `context` block in `openspec/config.yaml`.
- A `grill-me` style of rigorous design interrogation, inspired by
  https://github.com/mattpocock/skills/blob/main/skills/productivity/grill-me/SKILL.md.
- ADRs for durable architectural decisions.
- C4 diagrams for communicating architecture boundaries and relationships.
- Gherkin-style requirements and scenarios for observable behaviour.

The bundled OpenSpec schema is a local copy of the `intent-driven` schema from
https://github.com/intent-driven-dev/openspec-schemas/tree/main/openspec/schemas/intent-driven.

### Optional: Enable Superpowers

[Superpowers](https://github.com/obra/superpowers) provides guided practices such
as brainstorming, planning, debugging, verification, worktrees, and
subagent-driven parallel work. It is not enabled by default in this template.

To enable it, add the plugin entry to `opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["superpowers@git+https://github.com/obra/superpowers.git"]
}
```

If your configuration already has a `plugin` array, append the entry while
preserving your existing plugins and other settings. Restart OpenCode to load it.

### Workflow

The intent-driven workflow moves through these artifacts in order:

```text
proposal -> specs -> design -> adr -> tasks
```

- `proposal` captures why the change matters.
- `specs` describe observable behaviour with Gherkin-style scenarios.
- `design` explains the implementation approach and trade-offs.
- `adr` records durable architectural decisions.
- `tasks` turn the accepted intent, behaviour, design, and decisions into work.

### Schema

`openspec/config.yaml` already selects the bundled [`intent-driven` schema](openspec/schemas/intent-driven/schema.yaml). Learn how to tailor artifact workflows in [OpenSpec Custom Schemas](https://intent-driven.dev/blog/2026/02/12/openspec-custom-schemas/).

### Skills

Standard OpenSpec lifecycle skills in `.opencode/skills/` — names are self-explanatory:
`openspec-new-change`, `openspec-propose`, `openspec-continue-change`, `openspec-explore`,
`openspec-apply-change`, `openspec-verify-change`, `openspec-sync-specs`, `openspec-archive-change`

| Skill | Location | Purpose | Enabled Or Updated By |
|-------|----------|---------|-----------------------|
| `openspec-bulk-apply-change` | `.opencode/skills/` | Applies multiple active changes concurrently in isolated worktrees with parallel verification. | Invoke directly with `/opsx:bulk-apply` command when applying multiple active openspec changes. |
| `adversarial-authoring` | `.opencode/skills/` | Runs author and reviewer agents in sequence to reduce model bias in drafts. | Refer to the skill under rule in the rules section of `openspec/config.yaml`. |
| `grill-me` | `.agents/skills/` | Interrogates plans and designs with probing questions to surface hidden assumptions. | Refer to this skill under rules section in `openspec/config.yaml`. |
| `c4-diagrams` | `.agents/skills/` | Visualises system architecture using C4 model levels in ASCII or Mermaid. | Refer to this skill under `design` rule in `openspec/config.yaml`. |
| `architectural-decision-records` | `.agents/skills/` | Captures architectural decisions with rationale, tradeoffs, and supersession chains. | Automatically invoked or can be explicilty referred to under `adr` rule in `openspec/config.yaml`. |
| `gherkin-authoring` | `.agents/skills/` | Drafts and improves Gherkin scenarios for observable, domain-language behaviour. | Required by `spec-as-source` during the `specs` phase. |
| `glossary` | `.agents/skills/` | Maintains business and technical terminology and companion glossary references for specification artifacts. | Can be referred to under `proposal` and/or `design` rule in `openspec/config.yaml`. |
| `openspec-git-discipline` | `.agents/skills/` | Enforces that proposals reach `main` before apply, and implementation merges before archive. | Enabled through `AGENTS.md`. |
| `spec-as-source` | `.agents/skills/` | Adds executable acceptance specifications to the intent-driven workflow. | Explicitly opt in by uncommenting both the `specs` and `tasks` rules in `openspec/config.yaml`. |
| `acceptance-test-authoring` | `.agents/skills/` | Configures the acceptance runner, extraction, linting, and step definitions for `spec-as-source`. | Required by `spec-as-source` when configuring or changing acceptance-test infrastructure. |
| `test-driven-development` | `.agents/skills/` | Guides strict red-green-refactor TDD: one behaviour per test, minimal implementation to pass, refactoring on green, with best-practice patterns and collaborator mocking guidance. | Loaded by the `senior-dev` agent in `.opencode/agent/senior-dev.md`; enable by uncommenting the `context` lines in `openspec/config.yaml` that route src work to `senior-dev`. |

Example configurations are available in `openspec/config.yaml` and `AGENTS.md`. You can comment/uncomment the skill references to enable them.

### Experimental: Spec As Source

The `spec-as-source` skill is an opt-in layer on the intent-driven schema that uses fenced Gherkin in OpenSpec specifications as the source for generating acceptance tests. To enable `spec-as-source` capability add the skill reference under both the `specs` and `tasks` rules in `openspec/config.yaml`.

During `specs`, `spec-as-source` requires `gherkin-authoring` to author the fenced Gherkin scenarios. During `tasks`, it replaces the standard task template with acceptance-test-first work: configure and run the acceptance suite, then implement application work. Use `acceptance-test-authoring` to configure the runner, extraction, linting, and step definitions that execute the specifications. See [Behavior-Driven Development and Spec-Driven Development with OpenSpec](https://intent-driven.dev/blog/2026/07/17/behavior-driven-development-sdd-openspec/).

### Further Reading

- Template overview: [Spec-Driven Development with OpenSpec and OpenCode](https://intent-driven.dev/blog/2026/05/10/spec-driven-development-openspec-opencode/)
- Schema customization: [OpenSpec Custom Schemas](https://intent-driven.dev/blog/2026/02/12/openspec-custom-schemas/)
- Durable architecture: [Architectural Decision Records with Spec-Driven Development using OpenSpec](https://intent-driven.dev/blog/2026/04/29/spec-driven-development-with-adr/)
- Multi-model review and glossary: [SDD with Multi-Model Spec Review and Glossary](https://intent-driven.dev/blog/2026/06/27/sdd-adversarial-authoring-glossary/)
- Parallel implementation: [OpenSpec, Git WorkTrees and OpenCode](https://intent-driven.dev/blog/2026/04/01/openspec-git-worktrees-opencode/)
- Spec-As-Source Spec-Driven Development: [Behavior-Driven Development and Spec-Driven Development with OpenSpec](https://intent-driven.dev/blog/2026/07/17/behavior-driven-development-sdd-openspec/)
- Brownfield adoption: [Spec-Driven Development with Brownfield Projects](https://intent-driven.dev/blog/2026/03/10/spec-driven-development-brownfield/)
- SDD + BDD + TDD: [How TDD and BDD Actually Fit Into Spec-Driven Development](https://intent-driven.dev/blog/2026/08/23/tdd-bdd-spec-driven-development/)

### Agents

Specialist agents used within skills, in `.opencode/agent/`:

| Agent | Purpose |
|-------|---------|
| `adversarial-author` | Writes an initial draft of a specification artifact or design document. |
| `adversarial-reviewer` | Reviews the author's draft with challenges and improvement suggestions. |
| `senior-dev` | Implements src work test-first through strict red-green-refactor, following the `test-driven-development` skill. |
| `senior-qa` | Authors acceptance tests, step definitions, and runner configuration, following the `acceptance-test-authoring` skill. |
