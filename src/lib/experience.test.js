import { describe, expect, it } from 'vitest';
import { formatPeriod, sortNewestFirst } from './experience.js';

describe('sortNewestFirst', () => {
  it('orders roles by start date, newest first', () => {
    const roles = [
      { role: 'Oldest', start: '2018-03' },
      { role: 'Newest', start: '2023-01' },
      { role: 'Middle', start: '2021-06' },
    ];

    expect(sortNewestFirst(roles).map((entry) => entry.role)).toEqual([
      'Newest',
      'Middle',
      'Oldest',
    ]);
  });

  it('leaves the original list unchanged', () => {
    const roles = [
      { role: 'Old', start: '2018-03' },
      { role: 'New', start: '2023-01' },
    ];

    sortNewestFirst(roles);

    expect(roles.map((entry) => entry.role)).toEqual(['Old', 'New']);
  });
});

describe('formatPeriod', () => {
  it('shows a finished role with both months', () => {
    expect(formatPeriod('2021-06', '2022-12')).toBe('Jun 2021 – Dec 2022');
  });

  it('shows a current role as ending at Present', () => {
    expect(formatPeriod('2023-01', null)).toBe('Jan 2023 – Present');
  });
});
