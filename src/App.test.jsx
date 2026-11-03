import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import App from './App.jsx';

const content = {
  profile: { name: 'Alex Doe', bio: ['Hello.'] },
  skillGroups: [{ name: 'Frontend', skills: ['React'] }],
  projects: [{ title: 'Weather Dashboard' }],
  experience: [{ role: 'QA Engineer' }],
  contact: { email: 'alex@example.com' },
  socials: [],
};

describe('App', () => {
  it('renders the main content landmark', () => {
    render(<App />);

    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('starts with a skip link that targets the main content', () => {
    render(<App />);

    const [firstLink] = screen.getAllByRole('link');
    expect(firstLink).toHaveAccessibleName('Skip to main content');
    expect(firstLink).toHaveAttribute('href', `#${screen.getByRole('main').id}`);
  });

  it.each([
    ['banner', {}],
    ['navigation', { name: 'Primary' }],
    ['contentinfo', {}],
  ])('renders the %s landmark', (role, options) => {
    render(<App />);

    expect(screen.getByRole(role, options)).toBeInTheDocument();
  });

  it('renders a labelled region for each content section inside main', () => {
    render(<App content={content} />);

    const main = screen.getByRole('main');
    const names = within(main)
      .getAllByRole('region')
      .map((region) => region.getAttribute('aria-labelledby'))
      .map((id) => document.getElementById(id).textContent);
    expect(names).toEqual(['Alex Doe', 'About', 'Skills', 'Projects', 'Experience', 'Contact']);
  });

  it("shows the owner's name as the only level-one heading", () => {
    render(<App content={content} />);

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Alex Doe');
  });

  it('gives every other section a level-two heading', () => {
    render(<App content={content} />);

    const headings = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    expect(headings).toEqual(['About', 'Skills', 'Projects', 'Experience', 'Contact']);
  });

  it('leaves out a section whose data is empty', () => {
    render(<App content={{ ...content, projects: [] }} />);

    expect(screen.queryByRole('region', { name: 'Projects' })).not.toBeInTheDocument();
  });
});
