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

  describe('WhatsApp', () => {
    const whatsapp = { number: '918248570855', message: 'Hi there!' };

    it('offers a chat that opens safely in a new tab', () => {
      render(<Contact contact={{ email: 'alex@example.com', whatsapp }} socials={socials} />);

      const link = screen.getByRole('link', { name: 'Chat on WhatsApp (opens in a new tab)' });
      expect(link).toHaveAttribute('href', 'https://wa.me/918248570855?text=Hi%20there!');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('does not show the number as text', () => {
      render(<Contact contact={{ email: 'alex@example.com', whatsapp }} socials={socials} />);

      expect(screen.getByRole('region', { name: 'Contact' })).not.toHaveTextContent(/8248570855/);
    });

    it('is not offered when there is no number', () => {
      render(<Contact contact={{ email: 'alex@example.com' }} socials={socials} />);

      expect(screen.queryByRole('link', { name: /WhatsApp/ })).not.toBeInTheDocument();
    });
  });

  it('offers no form to fill in', () => {
    render(<Contact contact={{ email: 'alex@example.com' }} socials={socials} />);

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Contact' }).querySelector('form')).toBeNull();
  });
});
