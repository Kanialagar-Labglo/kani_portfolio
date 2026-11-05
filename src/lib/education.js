/**
 * Qualifications ordered by completion year, newest first. Does not change the given list.
 * @param {{ year: number }[]} entries
 */
export function sortByYearDesc(entries) {
  return [...entries].sort((a, b) => b.year - a.year);
}
