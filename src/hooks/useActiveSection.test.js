import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { useActiveSection } from './useActiveSection.js';

const tops = { hero: 0, about: 300, skills: 600 };

function addSection(id) {
  const element = document.createElement('section');
  element.id = id;
  element.getBoundingClientRect = () => ({ top: tops[id] });
  document.body.appendChild(element);
}

describe('useActiveSection', () => {
  beforeEach(() => {
    Object.keys(tops).forEach(addSection);
    window.innerHeight = 400;
  });

  afterEach(() => {
    document.body.innerHTML = '';
    tops.hero = 0;
    tops.about = 300;
    tops.skills = 600;
  });

  it('starts with the section at the top of the page', () => {
    const { result } = renderHook(() => useActiveSection(['hero', 'about', 'skills']));

    expect(result.current).toBe('hero');
  });

  it('follows the visitor as they scroll', async () => {
    const { result } = renderHook(() => useActiveSection(['hero', 'about', 'skills']));

    tops.hero = -300;
    tops.about = 0;
    tops.skills = 300;
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    await waitFor(() => expect(result.current).toBe('about'));
  });
});
