import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThemeToggle from './ThemeToggle.jsx';

describe('ThemeToggle', () => {
  it.each([
    ['light', 'Switch to dark theme'],
    ['dark', 'Switch to light theme'],
  ])('in the %s theme it is named "%s"', (theme, name) => {
    render(<ThemeToggle theme={theme} onToggle={() => {}} />);

    expect(screen.getByRole('button', { name })).toBeInTheDocument();
  });

  it('asks to switch theme when chosen', async () => {
    const onToggle = vi.fn();
    render(<ThemeToggle theme="light" onToggle={onToggle} />);

    await userEvent.click(screen.getByRole('button', { name: 'Switch to dark theme' }));

    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
