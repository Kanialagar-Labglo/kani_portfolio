import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import PageSection from './PageSection.jsx';

describe('PageSection', () => {
  it('is a region named by its heading', () => {
    render(<PageSection id="skills" heading="Skills" />);

    expect(screen.getByRole('region', { name: 'Skills' })).toBeInTheDocument();
  });

  it('decorates a section heading with a code comment marker hidden from assistive technology', () => {
    render(<PageSection id="skills" heading="Skills" />);

    const heading = screen.getByRole('heading', { level: 2, name: 'Skills' });
    const marker = heading.querySelector('[aria-hidden="true"]');
    expect(marker).toHaveTextContent('//');
  });

  it('leaves the level-one heading undecorated', () => {
    render(<PageSection id="hero" heading="Alex Doe" headingLevel={1} />);

    expect(screen.getByRole('heading', { level: 1 }).querySelector('[aria-hidden]')).toBeNull();
  });

  it('marks section content to fade in on scroll, but never the Hero', () => {
    const { container, rerender } = render(<PageSection id="skills" heading="Skills" />);
    expect(container.querySelector('[data-reveal]')).not.toBeNull();

    rerender(<PageSection id="hero" heading="Alex Doe" headingLevel={1} />);
    expect(container.querySelector('[data-reveal]')).toBeNull();
  });
});
