import { describe, expect, it } from 'vitest';
import { content } from './index.js';

const PLACEHOLDER_TEXT = ['Your Name', 'Placeholder', 'example.com', 'your-username'];

// Every string anywhere in the content, so no placeholder can hide in a nested field.
function allStrings(value) {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(allStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(allStrings);
  return [];
}

describe('shipped content', () => {
  it.each(PLACEHOLDER_TEXT)('contains no placeholder text "%s"', (placeholder) => {
    const matches = allStrings(content).filter((text) =>
      text.toLowerCase().includes(placeholder.toLowerCase()),
    );
    expect(matches).toEqual([]);
  });

  it('has a search description of 150 to 160 characters', () => {
    const { length } = content.profile.description;
    expect(length).toBeGreaterThanOrEqual(150);
    expect(length).toBeLessThanOrEqual(160);
  });

  it('gives each role two to four highlights or two to four groups of two to four', () => {
    for (const role of content.experience) {
      if (role.highlightGroups) {
        expect(role.highlightGroups.length).toBeGreaterThanOrEqual(2);
        expect(role.highlightGroups.length).toBeLessThanOrEqual(4);
        for (const group of role.highlightGroups) {
          expect(group.name).toBeTruthy();
          expect(group.items.length).toBeGreaterThanOrEqual(2);
          expect(group.items.length).toBeLessThanOrEqual(4);
        }
      } else {
        expect(role.highlights.length).toBeGreaterThanOrEqual(2);
        expect(role.highlights.length).toBeLessThanOrEqual(4);
      }
    }
  });

  it('describes each qualification with a name, institution, and numeric year', () => {
    expect(content.education.length).toBeGreaterThan(0);
    for (const entry of content.education) {
      expect(entry.qualification).toBeTruthy();
      expect(entry.institution).toBeTruthy();
      expect(Number.isInteger(entry.year)).toBe(true);
    }
  });
});
