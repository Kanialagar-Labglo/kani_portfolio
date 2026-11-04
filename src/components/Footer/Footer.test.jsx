import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from './Footer.jsx';

describe('Footer', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows the copyright with the current year and the owner name', () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2027-03-15T12:00:00Z'));

    render(<Footer ownerName="Alex Doe" />);

    expect(screen.getByRole('contentinfo')).toHaveTextContent('© 2027 Alex Doe');
  });

  it("shows the owner's social links", () => {
    render(
      <Footer
        ownerName="Alex Doe"
        socials={[{ platform: 'LinkedIn', url: 'https://www.linkedin.com/in/alex' }]}
      />,
    );

    expect(screen.getByRole('link', { name: /^LinkedIn\b/ })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/alex',
    );
  });
});
