import { useEffect, useRef } from 'react';
import { whenIdle } from '../lib/idle.js';

/**
 * Once the page has loaded and the browser is idle, run each loader once to fetch code ahead of
 * its first use (ADR-0006). A failed loader is ignored: that code then loads on first use.
 * @param {Array<() => Promise<unknown>>} loaders
 */
export function useIdlePrefetch(loaders) {
  // Only the loaders given on first render are prefetched.
  const loadersRef = useRef(loaders);

  useEffect(
    () =>
      whenIdle(() => {
        loadersRef.current.forEach((load) => load().catch(() => {}));
      }),
    [],
  );
}
