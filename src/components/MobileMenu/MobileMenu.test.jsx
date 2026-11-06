import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MobileMenu from './MobileMenu.jsx';

const sections = [
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

const renderMenu = () => render(<MobileMenu sections={sections} activeId="about" />);
const trigger = () => screen.getByRole('button', { name: 'Open menu' });

describe('MobileMenu trigger', () => {
  it('is a native icon button, without antd (ADR-0006)', () => {
    renderMenu();

    expect(trigger()).toHaveAttribute('type', 'button');
    expect(trigger()).toHaveClass('icon-button', { exact: true });
    expect(trigger().querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('names the menu it controls and starts collapsed', () => {
    renderMenu();

    expect(trigger()).toHaveAttribute('aria-controls', 'mobile-menu');
    expect(trigger()).toHaveAttribute('aria-expanded', 'false');
  });

  it('returns focus to the trigger when the menu closes', async () => {
    renderMenu();
    await userEvent.click(trigger());
    await screen.findByRole('dialog', { name: 'Menu' });

    await userEvent.keyboard('{Escape}');

    await waitFor(() => expect(trigger()).toHaveAttribute('aria-expanded', 'false'));
    await waitFor(() => expect(trigger()).toHaveFocus());
  });
});
