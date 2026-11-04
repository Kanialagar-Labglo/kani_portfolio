const monthFormat = new Intl.DateTimeFormat('en', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

/**
 * Roles ordered by start date, newest first. Does not change the given list.
 * @param {{ start: string }[]} entries start dates as 'YYYY-MM'
 */
export function sortNewestFirst(entries) {
  return [...entries].sort((a, b) => b.start.localeCompare(a.start));
}

function formatMonth(yearMonth) {
  const [year, month] = yearMonth.split('-').map(Number);
  return monthFormat.format(new Date(Date.UTC(year, month - 1, 1)));
}

/**
 * Human-readable period such as 'Jun 2021 – Dec 2022' or 'Jan 2023 – Present'.
 * @param {string} start 'YYYY-MM'
 * @param {string | null} end 'YYYY-MM', or null for a current role
 */
export function formatPeriod(start, end) {
  return `${formatMonth(start)} – ${end ? formatMonth(end) : 'Present'}`;
}
