import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NavLinks from './NavLinks.jsx';

const sections = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
];

describe('NavLinks', () => {
  it('links to each section in page order', () => {
    render(<NavLinks sections={sections} />);

    const links = screen.getAllByRole('link');
    expect(links.map((link) => link.textContent)).toEqual(['Home', 'About', 'Projects']);
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '#hero',
      '#about',
      '#projects',
    ]);
  });

  it('marks only the active section as the current location', () => {
    render(<NavLinks sections={sections} activeId="about" />);

    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('aria-current', 'location');
    expect(
      screen.getAllByRole('link').filter((link) => link.hasAttribute('aria-current')),
    ).toHaveLength(1);
  });

  it('reports which section was chosen', async () => {
    const onNavigate = vi.fn();
    render(<NavLinks sections={sections} onNavigate={onNavigate} />);

    await userEvent.click(screen.getByRole('link', { name: 'Projects' }));

    expect(onNavigate).toHaveBeenCalledWith('projects', expect.anything());
  });
});
