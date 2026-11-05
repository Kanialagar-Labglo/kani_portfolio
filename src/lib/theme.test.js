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
    ['a saved dark choice is used', { saved: 'dark' }, 'dark'],
    ['a saved light choice is used', { saved: 'light' }, 'light'],
    ['nothing saved means dark', { saved: null }, 'dark'],
    ['an unknown saved value is ignored', { saved: 'purple' }, 'dark'],
  ])('%s', (_case, input, expected) => {
    expect(resolveTheme(input)).toBe(expected);
  });

  it('ignores the device colour-scheme preference', () => {
    expect(resolveTheme({ saved: null, systemPrefersDark: false })).toBe('dark');
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
