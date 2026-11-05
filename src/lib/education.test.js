import { describe, expect, it } from 'vitest';
import { sortByYearDesc } from './education.js';

const bsc = { qualification: 'B.Sc.', institution: 'College A', year: 2021 };
const mca = { qualification: 'MCA', institution: 'College B', year: 2024 };

describe('sortByYearDesc', () => {
  it('lists the newest qualification first', () => {
    expect(sortByYearDesc([mca, bsc])).toEqual([mca, bsc]);
  });

  it('does not depend on the data order', () => {
    expect(sortByYearDesc([bsc, mca])).toEqual([mca, bsc]);
  });

  it('does not change the given list', () => {
    const entries = [bsc, mca];
    sortByYearDesc(entries);
    expect(entries).toEqual([bsc, mca]);
  });
});
