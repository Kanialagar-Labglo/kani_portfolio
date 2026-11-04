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
});
