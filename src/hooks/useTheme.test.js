import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useTheme } from './useTheme.js';

const html = document.documentElement;

describe('useTheme', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    html.removeAttribute('data-theme');
    html.removeAttribute('data-bs-theme');
  });

  it('starts with the theme the boot script applied', () => {
    html.setAttribute('data-theme', 'dark');

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('dark');
  });

  it('switches to the other theme', () => {
    html.setAttribute('data-theme', 'light');
    const { result } = renderHook(() => useTheme());

    act(() => result.current.toggleTheme());

    expect(result.current.theme).toBe('dark');
  });

  it('applies the new theme to the page', () => {
    html.setAttribute('data-theme', 'light');
    const { result } = renderHook(() => useTheme());

    act(() => result.current.toggleTheme());

    expect(html).toHaveAttribute('data-theme', 'dark');
    expect(html).toHaveAttribute('data-bs-theme', 'dark');
  });

  it('remembers the new theme for the next visit', () => {
    html.setAttribute('data-theme', 'light');
    const { result } = renderHook(() => useTheme());

    act(() => result.current.toggleTheme());

    expect(window.localStorage.getItem('theme')).toBe('dark');
  });
});
