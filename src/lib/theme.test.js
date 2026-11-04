import { describe, expect, it } from 'vitest';
import { readSavedTheme, resolveTheme, saveTheme } from './theme.js';

function memoryStorage(initial = {}) {
  const values = { ...initial };
  return {
    getItem: (key) => (key in values ? values[key] : null),
    setItem: (key, value) => {
      values[key] = String(value);
    },
  };
}

const blockedStorage = {
  getItem() {
    throw new DOMException('Storage is blocked', 'SecurityError');
  },
  setItem() {
    throw new DOMException('Storage is blocked', 'SecurityError');
  },
};

describe('resolveTheme', () => {
  it.each([
    [
      'saved dark beats a light system preference',
      { saved: 'dark', systemPrefersDark: false },
      'dark',
    ],
    [
      'saved light beats a dark system preference',
      { saved: 'light', systemPrefersDark: true },
      'light',
    ],
    ['dark system preference with nothing saved', { saved: null, systemPrefersDark: true }, 'dark'],
    ['no dark preference with nothing saved', { saved: null, systemPrefersDark: false }, 'light'],
    ['an unknown saved value is ignored', { saved: 'purple', systemPrefersDark: true }, 'dark'],
  ])('%s', (_case, input, expected) => {
    expect(resolveTheme(input)).toBe(expected);
  });
});

describe('saved theme choice', () => {
  it('reads back a choice that was saved', () => {
    const storage = memoryStorage();

    saveTheme(storage, 'dark');

    expect(readSavedTheme(storage)).toBe('dark');
  });

  it('reads nothing when no choice was saved', () => {
    expect(readSavedTheme(memoryStorage())).toBeNull();
  });

  it('reads nothing when storage is blocked', () => {
    expect(readSavedTheme(blockedStorage)).toBeNull();
  });

  it('ignores a failed save when storage is blocked', () => {
    expect(() => saveTheme(blockedStorage, 'dark')).not.toThrow();
  });

  it('reads nothing when storage is unavailable', () => {
    expect(readSavedTheme(undefined)).toBeNull();
  });
});
