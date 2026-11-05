import { useCallback, useState } from 'react';
import { readSavedTheme, resolveTheme, saveTheme, THEMES } from '../lib/theme.js';

function getStorage() {
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

// The boot script in index.html has normally set the theme already; fall back to resolving it.
function getInitialTheme() {
  const applied = document.documentElement.getAttribute('data-theme');
  if (THEMES.includes(applied)) {
    return applied;
  }
  return resolveTheme({ saved: readSavedTheme(getStorage()) });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.setAttribute('data-bs-theme', theme);
}

/**
 * The current theme and a function to switch it, remembering the visitor's choice.
 * @returns {{ theme: 'light' | 'dark', toggleTheme: () => void }}
 */
export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme);

  const toggleTheme = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    saveTheme(getStorage(), next);
    setTheme(next);
  }, [theme]);

  return { theme, toggleTheme };
}
