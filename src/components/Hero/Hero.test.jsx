import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Hero from './Hero.jsx';

const profile = {
  name: 'Alex Doe',
  role: 'Software Developer',
  tagline: 'I build reliable web apps.',
  photo: null,
};
const allSections = ['hero', 'projects', 'contact'];

describe('Hero', () => {
  it("shows the owner's name as the level-one heading", () => {
    render(<Hero profile={profile} visibleSectionIds={allSections} />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Alex Doe');
  });

  it('shows the role headline and tagline', () => {
    render(<Hero profile={profile} visibleSectionIds={allSections} />);

    expect(screen.getByText('Software Developer')).toBeInTheDocument();
    expect(screen.getByText('I build reliable web apps.')).toBeInTheDocument();
  });

  it('shows the headline instead of the role when one is provided', () => {
    const withHeadline = { ...profile, headline: 'Software Developer | QA Automation' };
    render(<Hero profile={withHeadline} visibleSectionIds={allSections} />);

    expect(screen.getByText('Software Developer | QA Automation')).toBeInTheDocument();
    expect(screen.queryByText('Software Developer', { exact: true })).not.toBeInTheDocument();
  });

  it('offers actions that lead to Projects and Contact', () => {
    render(<Hero profile={profile} visibleSectionIds={allSections} />);

    expect(screen.getByRole('link', { name: 'View projects' })).toHaveAttribute(
      'href',
      '#projects',
    );
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '#contact');
  });

  it('leaves out an action whose section is hidden', () => {
    render(<Hero profile={profile} visibleSectionIds={['hero', 'contact']} />);

    expect(screen.queryByRole('link', { name: 'View projects' })).not.toBeInTheDocument();
  });

  it('shows the profile photo with its description', () => {
    const withPhoto = { ...profile, photo: { src: 'images/me.jpg', alt: 'Portrait of Alex Doe' } };
    render(<Hero profile={withPhoto} visibleSectionIds={allSections} />);

    expect(screen.getByRole('img', { name: 'Portrait of Alex Doe' })).toBeInTheDocument();
  });

  it('shows no image when there is no photo', () => {
    render(<Hero profile={profile} visibleSectionIds={allSections} />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
