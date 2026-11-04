import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResumeButton from './ResumeButton.jsx';

const resume = {
  href: '/kani_portfolio/resume.pdf',
  fileName: 'Alex-Doe-Resume.pdf',
  startDownload: vi.fn((event) => event.preventDefault()),
};

describe('ResumeButton', () => {
  it('is a download link for the résumé PDF', () => {
    render(<ResumeButton resume={resume} />);

    const link = screen.getByRole('link', { name: 'Download résumé (PDF)' });
    expect(link).toHaveAttribute('href', '/kani_portfolio/resume.pdf');
    expect(link).toHaveAttribute('download', 'Alex-Doe-Resume.pdf');
  });

  it('keeps the same name in its compact form', () => {
    render(<ResumeButton resume={resume} compact />);

    const link = screen.getByRole('link', { name: 'Download résumé (PDF)' });
    expect(link).toHaveTextContent('Résumé');
  });

  it('starts the download when chosen', async () => {
    render(<ResumeButton resume={resume} />);

    await userEvent.click(screen.getByRole('link', { name: 'Download résumé (PDF)' }));

    expect(resume.startDownload).toHaveBeenCalledTimes(1);
  });

  it('shows a decorative download icon', () => {
    const { container } = render(<ResumeButton resume={resume} />);

    expect(container.querySelector('a svg')).toHaveAttribute('aria-hidden', 'true');
  });
});
