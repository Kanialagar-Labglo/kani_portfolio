import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import SocialLinks from './SocialLinks.jsx';

const socials = [
  { platform: 'GitHub', url: 'https://github.com/alex' },
  { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/alex' },
];

describe('SocialLinks', () => {
  it('names each link after its platform', () => {
    render(<SocialLinks socials={socials} />);

    expect(screen.getByRole('link', { name: /^GitHub\b/ })).toHaveAttribute(
      'href',
      'https://github.com/alex',
    );
    expect(screen.getByRole('link', { name: /^LinkedIn\b/ })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/alex',
    );
  });

  it('tells assistive technology that links open in a new tab', () => {
    render(<SocialLinks socials={socials} />);

    expect(screen.getByRole('link', { name: 'GitHub (opens in a new tab)' })).toBeInTheDocument();
  });

  it('opens links in a new tab without access to the portfolio', () => {
    render(<SocialLinks socials={socials} />);

    for (const link of screen.getAllByRole('link')) {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
  });

  it('shows a decorative icon for each platform', () => {
    const { container } = render(<SocialLinks socials={socials} />);

    const icons = container.querySelectorAll('a svg');
    expect(icons).toHaveLength(2);
    icons.forEach((icon) => expect(icon).toHaveAttribute('aria-hidden', 'true'));
  });

  it('shows an icon for platforms it does not recognise', () => {
    const { container } = render(
      <SocialLinks socials={[{ platform: 'Mastodon', url: 'https://example.social/@alex' }]} />,
    );

    expect(container.querySelector('a svg')).toBeInTheDocument();
  });
});
