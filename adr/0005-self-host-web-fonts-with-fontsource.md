# ADR-0005: Self-host web fonts through Fontsource packages

- Status: Accepted
- Date: 2026-11-05
- Supersedes: None
- Origin: OpenSpec change `personalise-portfolio` (design D8)

## Context and Problem Statement

The developer-style redesign needs a monospace display font (JetBrains Mono)
that looks the same on every device. Until now the site used only system fonts.
Loading a web font affects privacy (third-party requests), performance (LCP,
layout shift, page weight), and dependencies, and the same question will come
up for any future font. How should the site load web fonts?

## Considered Options

- Fontsource npm packages, importing only the needed subsets and weights, bundled by Vite
- Font files copied by hand into `public/` with a hand-written `@font-face`
- Google Fonts (or another font CDN) linked from `index.html`
- System font stacks only, no web fonts

## Decision Outcome

Chosen option: "Fontsource npm packages, bundled by Vite". Fonts are installed
as versioned packages, and only the Latin subset CSS for the weights in use is
imported (for JetBrains Mono, `latin-400.css` and `latin-700.css`). Vite emits
the woff2 files with hashed names on the site's own origin, and
`font-display: swap` keeps text visible while fonts load. Web fonts are used
only for display text (headings, navigation, labels); body text stays in the
system font stack. Fonts loaded by the page must total no more than 60 KB, as
checked by `npm run check:size`.

### Consequences

- Good, because there are no third-party requests: visitor IP addresses are not
  shared with a font CDN, and there is no extra DNS or TLS setup on first load.
- Good, because fonts are versioned through `package-lock.json`, carry their
  licence in the package, and get cache-busting hashed file names.
- Good, because Fontsource ships only CSS and font files, adding no runtime
  JavaScript.
- Bad, because it adds a dependency per font family, and each one must be
  limited to the needed subsets and weights to stay within the 60 KB budget.
- Bad, because hashed font URLs are not known in `index.html`, so fonts are not
  preloaded. `font-display: swap` and a monospace fallback stack limit the
  visual impact, and Lighthouse CLS and LCP stay as CI gates.
- Bad, because any new font family or weight must be weighed against the
  budget, and a family that does not fit must use system fonts instead.
