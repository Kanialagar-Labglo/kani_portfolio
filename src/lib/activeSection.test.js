import { describe, expect, it } from 'vitest';
import { pickActiveSection } from './activeSection.js';

// Section tops are distances from the top of the viewport, in page order.
const sections = [
  { id: 'hero', top: -900 },
  { id: 'about', top: -400 },
  { id: 'skills', top: 50 },
  { id: 'projects', top: 600 },
];

describe('pickActiveSection', () => {
  it('picks the last section whose top has reached the reading line', () => {
    expect(pickActiveSection({ sections, readingLine: 120, atBottom: false })).toBe('skills');
  });

  it('picks the first section when no section has reached the reading line', () => {
    const below = sections.map((section) => ({ ...section, top: section.top + 2000 }));

    expect(pickActiveSection({ sections: below, readingLine: 120, atBottom: false })).toBe('hero');
  });

  it('picks the last section at the bottom of the page', () => {
    expect(pickActiveSection({ sections, readingLine: 120, atBottom: true })).toBe('projects');
  });

  it('picks nothing when there are no sections', () => {
    expect(pickActiveSection({ sections: [], readingLine: 120, atBottom: false })).toBeNull();
  });
});
