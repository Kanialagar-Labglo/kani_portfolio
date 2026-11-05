import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Experience from './Experience.jsx';

const experience = [
  {
    role: 'QA Engineer',
    company: 'Beta Ltd',
    start: '2020-01',
    end: '2022-12',
    highlights: ['Automated regression tests.', 'Mentored testers.'],
  },
  {
    role: 'Test Lead',
    company: 'Acme Inc',
    start: '2023-01',
    end: null,
    highlights: ['Led the QA team.', 'Introduced Playwright.'],
  },
];

describe('Experience', () => {
  it('lists roles newest first', () => {
    render(<Experience experience={experience} />);

    expect(
      screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent),
    ).toEqual(['Test Lead', 'QA Engineer']);
  });

  it('shows the company and period of each role', () => {
    render(<Experience experience={experience} />);

    expect(screen.getByText('Acme Inc')).toBeInTheDocument();
    expect(screen.getByText('Jan 2023 – Present')).toBeInTheDocument();
    expect(screen.getByText('Jan 2020 – Dec 2022')).toBeInTheDocument();
  });

  it('shows the highlights of each role', () => {
    render(<Experience experience={experience} />);

    expect(screen.getByText('Introduced Playwright.')).toBeInTheDocument();
    expect(screen.getByText('Mentored testers.')).toBeInTheDocument();
  });

  describe('with grouped highlights', () => {
    const groupedRole = {
      role: 'Software Developer',
      company: 'Labglo',
      start: '2022-07',
      end: null,
      highlightGroups: [
        { name: 'Development', items: ['Built React features.', 'Wrote Python services.'] },
        { name: 'Quality Assurance', items: ['Ran regression tests.', 'Tracked defects.'] },
      ],
    };

    it('names each group under the role, in data order', () => {
      render(<Experience experience={[groupedRole]} />);

      expect(
        screen.getAllByRole('heading', { level: 4 }).map((heading) => heading.textContent),
      ).toEqual(['Development', 'Quality Assurance']);
    });

    it('lists each group’s highlights in data order', () => {
      render(<Experience experience={[groupedRole]} />);

      const lists = screen.getAllByRole('list').filter((list) => list.tagName === 'UL');
      expect(
        lists.map((list) => [...list.querySelectorAll('li')].map((item) => item.textContent)),
      ).toEqual([
        ['Built React features.', 'Wrote Python services.'],
        ['Ran regression tests.', 'Tracked defects.'],
      ]);
    });
  });
});
