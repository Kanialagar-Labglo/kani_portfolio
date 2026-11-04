import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Contact from './Contact.jsx';

const socials = [{ platform: 'GitHub', url: 'https://github.com/alex' }];

describe('Contact', () => {
  it('links the email address to a new message', () => {
    render(<Contact contact={{ email: 'alex@example.com' }} socials={socials} />);

    expect(screen.getByRole('link', { name: 'alex@example.com' })).toHaveAttribute(
      'href',
      'mailto:alex@example.com',
    );
  });

  it('shows the social profile links', () => {
    render(<Contact contact={{ email: 'alex@example.com' }} socials={socials} />);

    expect(screen.getByRole('link', { name: /^GitHub\b/ })).toBeInTheDocument();
  });

  it('shows no email link when there is no email address', () => {
    render(<Contact contact={{ email: '' }} socials={socials} />);

    expect(screen.queryByRole('link', { name: /@/ })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^GitHub\b/ })).toBeInTheDocument();
  });

  it('offers no form to fill in', () => {
    render(<Contact contact={{ email: 'alex@example.com' }} socials={socials} />);

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Contact' }).querySelector('form')).toBeNull();
  });
});
