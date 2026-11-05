import { describe, expect, it } from 'vitest';
import { getVisibleSections } from './sections.js';

const fullContent = {
  profile: { name: 'Alex Doe', bio: ['Hello.'] },
  skillGroups: [{ name: 'Frontend', skills: ['React'] }],
  projects: [{ title: 'Weather Dashboard' }],
  experience: [{ role: 'QA Engineer' }],
  education: [{ qualification: 'MCA', institution: 'College', year: 2024 }],
  contact: { email: 'alex@example.com' },
  socials: [{ platform: 'GitHub', url: 'https://github.com/alex' }],
};

describe('getVisibleSections', () => {
  it('lists every section in page order when all have content', () => {
    expect(getVisibleSections(fullContent)).toEqual([
      { id: 'hero', label: 'Home' },
      { id: 'about', label: 'About Me' },
      { id: 'skills', label: 'Skills' },
      { id: 'projects', label: 'Projects' },
      { id: 'experience', label: 'Experience' },
      { id: 'education', label: 'Education' },
      { id: 'contact', label: 'Contact' },
    ]);
  });

  it.each([
    ['about', 'the bio is empty', { profile: { name: 'Alex Doe', bio: [] } }],
    ['skills', 'there are no skill groups', { skillGroups: [] }],
    ['skills', 'every skill group is empty', { skillGroups: [{ name: 'Frontend', skills: [] }] }],
    ['projects', 'there are no projects', { projects: [] }],
    ['experience', 'there is no experience', { experience: [] }],
    ['education', 'there is no education', { education: [] }],
    ['education', 'education data is missing', { education: undefined }],
    ['contact', 'there is no email or social link', { contact: { email: '' }, socials: [] }],
  ])('hides %s when %s', (hiddenId, _reason, overrides) => {
    const ids = getVisibleSections({ ...fullContent, ...overrides }).map((section) => section.id);

    expect(ids).not.toContain(hiddenId);
  });

  it('shows contact when there are social links but no email', () => {
    const ids = getVisibleSections({ ...fullContent, contact: { email: '' } }).map(
      (section) => section.id,
    );

    expect(ids).toContain('contact');
  });
});
