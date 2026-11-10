// Run work after the page has loaded and the browser is idle, so it never competes with the first
// view (ADR-0006).

// Used where requestIdleCallback is missing (Safari, jsdom).
export const IDLE_FALLBACK_DELAY = 500;

/**
 * Call `callback` once, after the window's load event and then an idle period.
 * @param {() => void} callback
 * @param {Window} [win] the window to watch; tests pass a stand-in
 * @returns {() => void} cancels the callback if it has not run yet
 */
export function whenIdle(callback, win = window) {
  let cancelWait = () => {};

  const waitForIdle = () => {
    if (typeof win.requestIdleCallback === 'function') {
      const id = win.requestIdleCallback(() => callback());
      cancelWait = () => win.cancelIdleCallback(id);
    } else {
      const id = win.setTimeout(() => callback(), IDLE_FALLBACK_DELAY);
      cancelWait = () => win.clearTimeout(id);
    }
  };

  if (win.document.readyState === 'complete') {
    waitForIdle();
  } else {
    win.addEventListener('load', waitForIdle, { once: true });
    cancelWait = () => win.removeEventListener('load', waitForIdle);
  }

  return () => cancelWait();
}
