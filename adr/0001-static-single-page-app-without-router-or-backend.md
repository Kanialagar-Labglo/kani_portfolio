# ADR-0001: Build the portfolio as a static single-page React app without a router or backend

- Status: Accepted
- Date: 2026-11-03
- Supersedes: None
- Origin: OpenSpec change `create-portfolio-site` (design D1, D2)

## Context and Problem Statement

The portfolio is one page of mostly static content: a profile, skills,
projects, experience, and contact links. It must be lightweight, fast on mobile,
cheap to host, and readable by search engines and link-preview services. The
stack is fixed to React with JavaScript and Vite, and no backend or database is
needed for the first version. How should the application be structured and
delivered?

## Considered Options

- Static Vite + React single-page app, no router, no backend, built to plain files
- Vite + React with a client-side router (hash or history routes)
- A pre-rendering framework (Next.js or Astro static export)
- React front end with a Node/Express backend

## Decision Outcome

Chosen option: "Static Vite + React single-page app, no router, no backend",
because it matches the agreed stack and the one-page scope with the fewest
moving parts: native anchor links cover navigation, all content lives in data
modules, and the build output can be served by any static host.

### Consequences

- Good, because there is no server to run, secure, or pay for, and deployment is
  a copy of static files.
- Good, because navigation uses native `#section` links, which are shareable
  and work without extra libraries.
- Good, because content is edited in plain data modules, separate from
  presentation.
- Bad, because content is rendered by JavaScript; search and link-preview
  metadata must be generated into `index.html` at build time, and visitors
  without JavaScript see only a notice.
- Bad, because features that need a server (contact form, analytics endpoint,
  CMS) require a new ADR that supersedes this one.
- Follow-up: revisit if the site grows beyond one page or needs pre-rendered
  content for search.
