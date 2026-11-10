import { describe, expect, it } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import ResumeNotice from './ResumeNotice.jsx';

describe('ResumeNotice', () => {
  it('announces that the résumé is unavailable and links to Contact', async () => {
    render(<ResumeNotice requestId={1} theme="dark" />);

    const notice = await screen.findByRole('alert');
    expect(notice).toHaveTextContent('Résumé unavailable');
    expect(notice).toHaveTextContent('temporarily unavailable');
    expect(within(notice).getByRole('link', { name: 'Go to Contact' })).toHaveAttribute(
      'href',
      '#contact',
    );
  });

  it('shows a single notice when asked again', async () => {
    const { rerender } = render(<ResumeNotice requestId={1} theme="dark" />);
    await screen.findByRole('alert');

    rerender(<ResumeNotice requestId={2} theme="dark" />);

    await waitFor(() => expect(screen.getAllByRole('alert')).toHaveLength(1));
  });
});
