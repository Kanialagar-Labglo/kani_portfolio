import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App.jsx';

const content = {
  profile: {
    name: 'Alex Doe',
    role: 'Software Developer',
    tagline: 'I build reliable web apps.',
    photo: null,
    bio: ['Hello.'],
  },
  skillGroups: [{ name: 'Frontend', skills: ['React'] }],
  projects: [{ title: 'Inventory Tracker', description: 'Tracks stock.', technologies: ['React'] }],
  experience: [
    {
      role: 'QA Engineer',
      company: 'Acme Inc',
      start: '2021-06',
      end: null,
      highlights: ['Tested.'],
    },
  ],
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

  it('offers a theme toggle in the header', () => {
    render(<App content={content} />);

    expect(
      within(screen.getByRole('banner')).getByRole('button', { name: /^Switch to .* theme$/ }),
    ).toBeInTheDocument();
  });

  it('switches theme when the header toggle is chosen', async () => {
    document.documentElement.setAttribute('data-theme', 'light');
    render(<App content={content} />);

    await userEvent.click(screen.getByRole('button', { name: 'Switch to dark theme' }));

    expect(screen.getByRole('button', { name: 'Switch to light theme' })).toBeInTheDocument();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('data-bs-theme');
  });

  it('scrolls to the section named in the address when the page opens', () => {
    const scrolledTo = [];
    const original = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = function scrollIntoView() {
      scrolledTo.push(this.id);
    };
    window.history.replaceState(null, '', '#projects');

    render(<App content={content} />);

    expect(scrolledTo).toEqual(['projects']);
    Element.prototype.scrollIntoView = original;
    window.history.replaceState(null, '', window.location.pathname);
  });

  it('leaves a section with no data out of the navigation', () => {
    render(<App content={{ ...content, experience: [] }} />);

    const nav = screen.getByRole('navigation', { name: 'Primary' });
    expect(within(nav).queryByRole('link', { name: 'Experience' })).not.toBeInTheDocument();
    expect(within(nav).getByRole('link', { name: 'Projects' })).toBeInTheDocument();
  });

  it('shows whatever the content data says, without component changes', () => {
    const renamed = {
      ...content,
      projects: [{ title: 'Weather Dashboard', description: 'Forecasts.', technologies: [] }],
    };

    render(<App content={renamed} />);

    expect(
      within(screen.getByRole('region', { name: 'Projects' })).getByRole('heading', { level: 3 }),
    ).toHaveTextContent('Weather Dashboard');
  });

  describe('résumé download', () => {
    const withResume = { ...content, profile: { ...content.profile, resumePath: 'resume.pdf' } };

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('is offered in the hero and the header when a résumé is configured', () => {
      render(<App content={withResume} />);

      expect(
        within(screen.getByRole('region', { name: 'Alex Doe' })).getByRole('link', {
          name: 'Download résumé (PDF)',
        }),
      ).toBeInTheDocument();
      expect(
        within(screen.getByRole('banner')).getByRole('link', { name: 'Download résumé (PDF)' }),
      ).toBeInTheDocument();
    });

    it('is not offered when no résumé is configured', () => {
      render(<App content={{ ...content, profile: { ...content.profile, resumePath: null } }} />);

      expect(screen.queryByRole('link', { name: 'Download résumé (PDF)' })).not.toBeInTheDocument();
    });

    it('shows an unavailable notice pointing to Contact when the file is missing', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({ ok: false, status: 404, headers: new Headers() }),
      );
      render(<App content={withResume} />);

      await userEvent.click(
        within(screen.getByRole('region', { name: 'Alex Doe' })).getByRole('link', {
          name: 'Download résumé (PDF)',
        }),
      );

      const notice = await screen.findByRole('alert');
      expect(notice).toHaveTextContent('temporarily unavailable');
      expect(within(notice).getByRole('link', { name: 'Go to Contact' })).toHaveAttribute(
        'href',
        '#contact',
      );
    });
  });

  it('leaves out a section whose data is empty', () => {
    render(<App content={{ ...content, projects: [] }} />);

    expect(screen.queryByRole('region', { name: 'Projects' })).not.toBeInTheDocument();
  });
});
