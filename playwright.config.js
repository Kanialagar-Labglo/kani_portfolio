import { defineConfig, devices } from '@playwright/test';
import { siteConfig } from './site.config.js';

const port = 4173;
const isCI = Boolean(process.env.CI);

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  // Locally, more parallel browsers starve each other on a typical 8 GB laptop and cause timeouts.
  workers: isCI ? undefined : 2,
  reporter: isCI
    ? [['github'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'never' }]],
  use: {
    // Trailing slash matters: tests navigate with relative paths such as './'.
    baseURL: `http://localhost:${port}${siteConfig.basePath}`,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'desktop-firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 7'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 15'] } },
  ],
  // Tests run against the production build, served under the GitHub Pages base path.
  webServer: {
    command: `npm run build && npm run preview -- --port ${port} --strictPort`,
    url: `http://localhost:${port}${siteConfig.basePath}`,
    reuseExistingServer: !isCI,
    timeout: 120_000,
  },
});
