import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';

const BLOCKING_IMPACTS = ['serious', 'critical'];

/**
 * Scan the whole page with axe and fail on serious or critical violations.
 * @param {import('@playwright/test').Page} page
 */
export async function expectNoSeriousA11yViolations(page) {
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
