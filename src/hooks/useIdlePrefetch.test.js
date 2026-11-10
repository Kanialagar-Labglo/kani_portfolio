import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { whenIdle } from '../lib/idle.js';
import { useIdlePrefetch } from './useIdlePrefetch.js';

vi.mock('../lib/idle.js', () => ({ whenIdle: vi.fn() }));

describe('useIdlePrefetch', () => {
  let runWhenIdle;
  let cancel;

  beforeEach(() => {
    cancel = vi.fn();
    whenIdle.mockReset();
    whenIdle.mockImplementation((callback) => {
      runWhenIdle = callback;
      return cancel;
    });
  });

  it('runs nothing until the browser is idle', () => {
    const loader = vi.fn(() => Promise.resolve());

    renderHook(() => useIdlePrefetch([loader]));

    expect(whenIdle).toHaveBeenCalledTimes(1);
    expect(loader).not.toHaveBeenCalled();
  });

  it('runs each loader once when idle', () => {
    const loaders = [vi.fn(() => Promise.resolve()), vi.fn(() => Promise.resolve())];
    const { rerender } = renderHook(() => useIdlePrefetch(loaders));

    runWhenIdle();
    rerender();

    expect(whenIdle).toHaveBeenCalledTimes(1);
    loaders.forEach((loader) => expect(loader).toHaveBeenCalledTimes(1));
  });

  it('ignores a loader that fails, so it loads again on first use', async () => {
    const failing = vi.fn(() => Promise.reject(new Error('offline')));
    const working = vi.fn(() => Promise.resolve());
    renderHook(() => useIdlePrefetch([failing, working]));

    expect(() => runWhenIdle()).not.toThrow();
    await Promise.resolve();

    expect(working).toHaveBeenCalledTimes(1);
  });

  it('cancels the wait when the page goes away first', () => {
    const { unmount } = renderHook(() => useIdlePrefetch([vi.fn()]));

    unmount();

    expect(cancel).toHaveBeenCalledTimes(1);
  });
});
