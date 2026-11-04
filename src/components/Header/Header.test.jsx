import { describe, expect, it } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from './Header.jsx';

const sections = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
];

function renderHeader(props = {}) {
  return render(
    <Header
      siteName="Alex Doe"
      sections={sections}
      theme="light"
      onToggleTheme={() => {}}
      {...props}
    />,
  );
}

describe('Header', () => {
  it('links the site name back to the top of the page', () => {
    renderHeader();

    expect(screen.getByRole('link', { name: 'Alex Doe' })).toHaveAttribute('href', '#hero');
  });

  it('lists the section links in the primary navigation', () => {
    renderHeader();

    const nav = screen.getByRole('navigation', { name: 'Primary' });
    expect(within(nav).getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(within(nav).getByRole('link', { name: 'About' })).toBeInTheDocument();
  });

  it('offers a collapsed menu button', () => {
    renderHeader();

    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('opens a menu with the section links', async () => {
    renderHeader();

    await userEvent.click(screen.getByRole('button', { name: 'Open menu' }));

    const menu = await screen.findByRole('dialog', { name: 'Menu' });
    expect(within(menu).getByRole('link', { name: 'About' })).toHaveAttribute('href', '#about');
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('closes the menu when a section is chosen', async () => {
    renderHeader();
    await userEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    const menu = await screen.findByRole('dialog', { name: 'Menu' });

    await userEvent.click(within(menu).getByRole('link', { name: 'About' }));

    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
        'aria-expanded',
        'false',
      ),
    );
  });
});
