import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';

const BLOCKING_IMPACTS = ['serious', 'critical'];

/**
 * Scroll through the page so every scroll-in fade has run, then wait for the fades to finish,
 * so content is checked at full opacity as visitors see it.
 * @param {import('@playwright/test').Page} page
 */
async function revealWholePage(page) {
  await page.evaluate(async () => {
    while (window.scrollY + window.innerHeight < document.documentElement.scrollHeight - 1) {
      window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'instant' });
      await new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 50)));
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  await page.waitForFunction(() => document.getAnimations().length === 0);
}

/**
 * Scan the whole page with axe and fail on serious or critical violations.
 * @param {import('@playwright/test').Page} page
 */
export async function expectNoSeriousA11yViolations(page) {
  await revealWholePage(page);
  const results = await new AxeBuilder({ page }).analyze();

  const blocking = results.violations
    .filter((violation) => BLOCKING_IMPACTS.includes(violation.impact ?? ''))
    .map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      help: violation.help,
      targets: violation.nodes.map((node) => node.target.join(' ')),
    }));

  expect(blocking, 'serious or critical accessibility violations').toEqual([]);
}
