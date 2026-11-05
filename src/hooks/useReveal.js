import { useEffect } from 'react';

const isOnScreen = (element) => {
  const { top, bottom } = element.getBoundingClientRect();
  return top < window.innerHeight && bottom > 0;
};

/**
 * Fade blocks marked with data-reveal in as they first scroll into view.
 * Content is visible by default: the fade only switches on (via the reveal-ready class on <html>)
 * when IntersectionObserver exists and the visitor has not asked for reduced motion, and blocks
 * already on screen are shown at once.
 */
export function useReveal() {
  useEffect(() => {
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (typeof window.IntersectionObserver !== 'function' || reduceMotion) {
      return undefined;
    }

    const blocks = [...document.querySelectorAll('[data-reveal]')];
    blocks.filter(isOnScreen).forEach((block) => block.classList.add('is-revealed'));

    const observer = new window.IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      }
    });
    blocks
      .filter((block) => !block.classList.contains('is-revealed'))
      .forEach((block) => observer.observe(block));
    document.documentElement.classList.add('reveal-ready');

    return () => {
      observer.disconnect();
      document.documentElement.classList.remove('reveal-ready');
    };
  }, []);
}
