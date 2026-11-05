// Theme rules. The inline boot script in index.html repeats resolveTheme's rule
// (saved choice, otherwise dark); keep the two in sync.

export const THEMES = ['light', 'dark'];
export const THEME_STORAGE_KEY = 'theme';

/**
 * Read the visitor's saved theme choice. Blocked or missing storage counts as no choice.
 * @param {Storage | undefined} storage
 * @returns {string | null}
 */
export function readSavedTheme(storage) {
  try {
    return storage?.getItem(THEME_STORAGE_KEY) ?? null;
  } catch {
    return null;
  }
}

/**
 * Save the visitor's theme choice. If storage is blocked, the choice lasts only for this visit.
 * @param {Storage | undefined} storage
 * @param {'light' | 'dark'} theme
 */
export function saveTheme(storage, theme) {
  try {
    storage?.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage is blocked; nothing to do.
  }
}

/**
 * Pick the theme to show: a saved choice wins, otherwise the dark default.
 * The device colour-scheme preference is deliberately not used.
 * @param {{ saved: string | null }} input
 * @returns {'light' | 'dark'}
 */
export function resolveTheme({ saved }) {
  return THEMES.includes(saved) ? saved : 'dark';
}
