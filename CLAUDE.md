# CLAUDE.md

Instructions for Claude Code and any other AI agent working in this repository.
`AGENTS.md` points here; this file is the source of truth for project rules.

## Project

A personal developer portfolio website. Portfolio content (sections, copy,
projects) is defined through OpenSpec proposals and specs, not in this file.

The portfolio itself is part of the showcase: clean code, meaningful tests,
and a visible spec-driven process matter as much as the UI.

## Tech Stack (fixed unless changed by an approved ADR)

- Frontend: React with JavaScript, built with Vite
- Backend: none initially (adding one requires an ADR)
- Database: none initially (static/JSON data is fine; adding a DB requires an ADR)
- Language: JavaScript only. No TypeScript: no `.ts`/`.tsx` files, no `tsconfig`,
  no TS-only dependencies. JSDoc type hints are allowed.
- Module system: ES modules (`"type": "module"`)
- Styling and UI: Bootstrap and Ant Design (antd), alongside plain HTML and CSS
- Icons: Lucide (`lucide-react`)
- E2E testing: Playwright

Tooling choices not listed here (unit test runner, linting, folder layout,
deployment) are decided through the OpenSpec `design` and `adr` phases, not ad hoc.

## Application Constraints

- Single-page application with no routing: one page, sections reached by
  in-page anchors/scrolling. Do not add a router library.
- Mobile-first: write base styles for small screens, then scale up with
  breakpoints so the layout works on all screen sizes (phone, tablet, desktop,
  large displays).
- Lightweight: keep dependencies and bundle size minimal.
  - Use Bootstrap mainly for grid, layout, and utilities; use antd for
    interactive components. Do not use both for the same job.
  - Import only what is needed (per-component antd imports, individual
    Lucide icons, only the Bootstrap CSS/JS that is used).
  - Optimize images and lazy-load below-the-fold media.
- Semantic HTML for SEO and accessibility: use `header`, `nav`, `main`,
  `section`, `article`, `footer`, a logical heading order (one `h1`),
  descriptive `alt` text, and proper meta tags (title, description,
  Open Graph) in `index.html`.

## Approval Rules (mandatory)

- Do not create, modify, or delete files, install packages, or run commands
  that change state without the user's explicit approval.
- Before acting, present what you intend to do (files, content summary,
  commands) and wait for a clear "yes".
- Approval covers only the action that was approved. Ask again for the next one.
- Never commit, branch, merge, push, or open PRs unless the user asks.
- Read-only exploration (reading files, `git status`, `openspec list`) is fine
  without approval.

## Workflow: Intent-Driven Development with OpenSpec

All feature work goes through OpenSpec using the bundled `intent-driven` schema
(`openspec/config.yaml` → `openspec/schemas/intent-driven/`):

    proposal -> specs -> design -> adr -> tasks -> apply -> verify -> archive

- proposal: why the change matters. Must use the `grill-me` skill.
- specs: observable behaviour as Gherkin-style scenarios.
- design: approach and trade-offs. Must use the `c4-diagrams` skill.
- adr: durable decisions. Must use the `architectural-decision-records` skill.
- tasks: small, ordered, checkable work items.
- apply: implement tasks test-first using the `test-driven-development` skill.
- archive: run OpenSpec sync before archiving.

Create one artifact at a time and get the user's approval on each before
starting the next. No application code is written before the change's
proposal, specs, design, ADRs, and tasks are approved.

### Git discipline

Always follow `.agents/skills/openspec-git-discipline/SKILL.md`:
- Proposal artifacts must be committed to `main` before apply starts.
- Implementation must be merged to `main` before archive, and archive runs from `main`.
- Ask the user to commit at each checkpoint; never commit on your own.

## Where Skills and Commands Live

Claude Code does not auto-discover these; read the SKILL.md file when a step needs it.

- OpenSpec lifecycle skills: `.opencode/skills/openspec-*/SKILL.md`
  (new-change, propose, continue-change, explore, apply-change,
  verify-change, sync-specs, archive-change, bulk-apply/bulk-archive)
- OpenSpec command definitions: `.opencode/commands/opsx-*.md`
- Supporting skills: `.agents/skills/`
  (grill-me, c4-diagrams, architectural-decision-records, gherkin-authoring,
  glossary, test-driven-development, openspec-git-discipline,
  spec-as-source, acceptance-test-authoring)
- Specialist agent roles: `.opencode/agent/` (senior-dev, senior-qa,
  adversarial-author, adversarial-reviewer)

## Coding Conventions

- Functional React components with hooks; one component per file, PascalCase
  file names (`ProjectCard.jsx`).
- Keep content data (projects, skills, experience) in plain JS/JSON modules,
  separate from presentation components.
- Prefer small, readable functions over clever abstractions; no speculative features.
- Keep secrets out of the repo; use `.env` files (gitignored) with a committed `.env.example`.
- Accessibility and responsive layout are requirements, not polish.
- Conventional Commits for commit messages (`feat:`, `fix:`, `docs:`, `test:`, `chore:`).

## Testing

- Strict red-green-refactor TDD during apply.
- Every spec scenario should map to at least one automated test.
- End-to-end tests use Playwright and cover key flows on both mobile and
  desktop viewports.
- The unit/component test runner is chosen in an ADR during the first
  change's design phase.
