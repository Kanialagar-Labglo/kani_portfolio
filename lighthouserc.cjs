// Lighthouse CI: audits the production build with Lighthouse's default mobile settings.
// Targets come from the site-quality spec. Reports are kept locally in .lighthouseci/.
const PORT = 4174;

module.exports = {
  ci: {
    collect: {
      startServerCommand: `npx vite preview --port ${PORT} --strictPort`,
      startServerReadyPattern: 'Local',
      url: [`http://localhost:${PORT}/kani_portfolio/`],
      // The median of three runs smooths out run-to-run variation.
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9, aggregationMethod: 'median-run' }],
        'categories:accessibility': ['error', { minScore: 0.95, aggregationMethod: 'median-run' }],
        'categories:best-practices': ['error', { minScore: 0.95, aggregationMethod: 'median-run' }],
        'categories:seo': ['error', { minScore: 1, aggregationMethod: 'median-run' }],
        'largest-contentful-paint': [
          'error',
          { maxNumericValue: 2500, aggregationMethod: 'median-run' },
        ],
        'cumulative-layout-shift': [
          'error',
          { maxNumericValue: 0.1, aggregationMethod: 'median-run' },
        ],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: '.lighthouseci',
    },
  },
};
