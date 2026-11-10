import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { IDLE_FALLBACK_DELAY, whenIdle } from './idle.js';

// A stand-in window whose load state and idle callbacks the tests control.
function fakeWindow({ readyState = 'loading', idleCallbacks = true } = {}) {
  const listeners = new Map();
  const idle = [];
  const win = {
    document: { readyState },
    addEventListener: vi.fn((type, listener) => listeners.set(type, listener)),
    removeEventListener: vi.fn((type) => listeners.delete(type)),
    setTimeout: (...args) => setTimeout(...args),
    clearTimeout: (id) => clearTimeout(id),
    fireLoad() {
      win.document.readyState = 'complete';
      listeners.get('load')?.();
    },
    runIdle() {
      idle.splice(0).forEach((callback) => callback?.());
    },
  };
  if (idleCallbacks) {
    win.requestIdleCallback = vi.fn((callback) => idle.push(callback));
    win.cancelIdleCallback = vi.fn((id) => {
      idle[id - 1] = undefined;
    });
  }
  return win;
}

describe('whenIdle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('waits for the page to load, then for the browser to be idle', () => {
    const win = fakeWindow();
    const callback = vi.fn();

    whenIdle(callback, win);
    expect(win.requestIdleCallback).not.toHaveBeenCalled();

    win.fireLoad();
    expect(callback).not.toHaveBeenCalled();

    win.runIdle();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('waits only for idle when the page has already loaded', () => {
    const win = fakeWindow({ readyState: 'complete' });
    const callback = vi.fn();

    whenIdle(callback, win);
    win.runIdle();

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('falls back to a short timer where idle callbacks are not supported', () => {
    const win = fakeWindow({ readyState: 'complete', idleCallbacks: false });
    const callback = vi.fn();

    whenIdle(callback, win);
    vi.advanceTimersByTime(IDLE_FALLBACK_DELAY - 1);
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('never runs when cancelled before the page loads', () => {
    const win = fakeWindow();
    const callback = vi.fn();

    const cancel = whenIdle(callback, win);
    cancel();
    win.fireLoad();
    win.runIdle();

    expect(callback).not.toHaveBeenCalled();
    expect(win.removeEventListener).toHaveBeenCalledWith('load', expect.any(Function));
  });

  it('never runs when cancelled while waiting for idle', () => {
    const win = fakeWindow({ readyState: 'complete' });
    const callback = vi.fn();

    const cancel = whenIdle(callback, win);
    cancel();
    win.runIdle();

    expect(callback).not.toHaveBeenCalled();
    expect(win.cancelIdleCallback).toHaveBeenCalled();
  });

  it('never runs when cancelled while the fallback timer is pending', () => {
    const win = fakeWindow({ readyState: 'complete', idleCallbacks: false });
    const callback = vi.fn();

    const cancel = whenIdle(callback, win);
    cancel();
    vi.runAllTimers();

    expect(callback).not.toHaveBeenCalled();
  });
});
