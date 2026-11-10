import { beforeAll, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { loadMenuDrawer } from '../../lib/extras.js';
import MobileMenu from './MobileMenu.jsx';

vi.mock('../../lib/extras.js', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, loadMenuDrawer: vi.fn(actual.loadMenuDrawer) };
});

const sections = [
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

const renderMenu = () => render(<MobileMenu sections={sections} activeId="about" />);
const trigger = () => screen.getByRole('button', { name: 'Open menu' });

// Load the drawer's code up front, as the idle prefetch does, so first opens are quick.
beforeAll(() => loadMenuDrawer());

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

  it('loads the drawer only when the menu is first opened (ADR-0006)', async () => {
    loadMenuDrawer.mockClear();
    renderMenu();

    expect(loadMenuDrawer).not.toHaveBeenCalled();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await userEvent.click(trigger());

    expect(await screen.findByRole('dialog', { name: 'Menu' })).toBeInTheDocument();
    expect(loadMenuDrawer).toHaveBeenCalled();
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
