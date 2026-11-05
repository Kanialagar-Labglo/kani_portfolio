import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useReveal } from './useReveal.js';

// A stand-in IntersectionObserver the test can drive by hand.
class FakeObserver {
  static instances = [];

  constructor(callback) {
    this.callback = callback;
    this.observed = new Set();
    FakeObserver.instances.push(this);
  }

  observe(element) {
    this.observed.add(element);
  }

  unobserve(element) {
    this.observed.delete(element);
  }

  disconnect() {
    this.observed.clear();
  }

  enter(element) {
    this.callback([{ target: element, isIntersecting: true }]);
  }
}

function addBlock(top) {
  const element = document.createElement('div');
  element.setAttribute('data-reveal', '');
  element.getBoundingClientRect = () => ({ top, bottom: top + 100 });
  document.body.appendChild(element);
  return element;
}

function preferReducedMotion(reduce) {
  window.matchMedia = vi.fn((query) => ({
    matches: reduce && query.includes('reduce'),
    media: query,
  }));
}

const html = document.documentElement;

describe('useReveal', () => {
  beforeEach(() => {
    window.innerHeight = 800;
    window.IntersectionObserver = FakeObserver;
    FakeObserver.instances = [];
    preferReducedMotion(false);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    html.classList.remove('reveal-ready');
    delete window.IntersectionObserver;
  });

  it('turns on reveal styling and watches blocks below the first screen', () => {
    const below = addBlock(1200);

    renderHook(() => useReveal());

    expect(html).toHaveClass('reveal-ready');
    expect(FakeObserver.instances[0].observed.has(below)).toBe(true);
    expect(below).not.toHaveClass('is-revealed');
  });

  it('shows blocks already on screen at once', () => {
    const onScreen = addBlock(200);

    renderHook(() => useReveal());

    expect(onScreen).toHaveClass('is-revealed');
    expect(FakeObserver.instances[0].observed.has(onScreen)).toBe(false);
  });

  it('reveals a block once it scrolls into view and stops watching it', () => {
    const below = addBlock(1200);
    renderHook(() => useReveal());
    const [observer] = FakeObserver.instances;

    act(() => observer.enter(below));

    expect(below).toHaveClass('is-revealed');
    expect(observer.observed.has(below)).toBe(false);
  });

  it('does nothing when the visitor asks for reduced motion', () => {
    addBlock(1200);
    preferReducedMotion(true);

    renderHook(() => useReveal());

    expect(html).not.toHaveClass('reveal-ready');
    expect(FakeObserver.instances).toHaveLength(0);
  });

  it('does nothing when the browser has no IntersectionObserver', () => {
    addBlock(1200);
    delete window.IntersectionObserver;

    renderHook(() => useReveal());

    expect(html).not.toHaveClass('reveal-ready');
  });

  it('turns reveal styling off again when unmounted', () => {
    addBlock(1200);
    const { unmount } = renderHook(() => useReveal());

    unmount();

    expect(html).not.toHaveClass('reveal-ready');
  });
});
