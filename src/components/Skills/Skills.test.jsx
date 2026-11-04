import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import Skills from './Skills.jsx';

const skillGroups = [
  { name: 'Frontend', skills: ['React', 'CSS'] },
  { name: 'Testing & QA', skills: ['Playwright'] },
];

describe('Skills', () => {
  it('shows each group name as a level-three heading', () => {
    render(<Skills skillGroups={skillGroups} />);

    expect(
      screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent),
    ).toEqual(['Frontend', 'Testing & QA']);
  });

  it('lists each group’s skills as labels', () => {
    render(<Skills skillGroups={skillGroups} />);

    const frontend = screen.getByRole('list', { name: 'Frontend' });
    expect(
      within(frontend)
        .getAllByRole('listitem')
        .map((item) => item.textContent),
    ).toEqual(['React', 'CSS']);
  });

  it('shows no ratings or percentages', () => {
    render(<Skills skillGroups={skillGroups} />);

    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Skills' })).not.toHaveTextContent('%');
  });
});
