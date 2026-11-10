import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MenuDrawer from './MenuDrawer.jsx';

const sections = [
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

function renderDrawer(props = {}) {
  return render(
    <MenuDrawer
      id="mobile-menu"
      open
      theme="dark"
      sections={sections}
      activeId="about"
      onNavigate={() => {}}
      onClose={() => {}}
      onAfterOpenChange={() => {}}
      {...props}
    />,
  );
}

describe('MenuDrawer', () => {
  it('shows the section links in a dialog named Menu', async () => {
    renderDrawer();

    const menu = await screen.findByRole('dialog', { name: 'Menu' });
    expect(within(menu).getByRole('link', { name: 'About' })).toHaveAttribute('href', '#about');
    expect(within(menu).getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '#contact');
  });

  it('passes the chosen section on', async () => {
    const onNavigate = vi.fn();
    renderDrawer({ onNavigate });
    const menu = await screen.findByRole('dialog', { name: 'Menu' });

    await userEvent.click(within(menu).getByRole('link', { name: 'Contact' }));

    expect(onNavigate).toHaveBeenCalledWith('contact', expect.anything());
  });

  it('asks to close on Escape', async () => {
    const onClose = vi.fn();
    renderDrawer({ onClose });
    await screen.findByRole('dialog', { name: 'Menu' });

    await userEvent.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalled();
  });

  it('offers the résumé download and closes when it is chosen', async () => {
    const onClose = vi.fn();
    const resume = { href: 'resume.pdf', fileName: 'Alex-Doe-Resume.pdf', startDownload: vi.fn() };
    renderDrawer({ onClose, resume });
    const menu = await screen.findByRole('dialog', { name: 'Menu' });

    await userEvent.click(within(menu).getByRole('link', { name: 'Download résumé (PDF)' }));

    expect(onClose).toHaveBeenCalled();
    expect(resume.startDownload).toHaveBeenCalled();
  });

  it('keeps Tab inside the menu by wrapping from the last item to the first', async () => {
    renderDrawer();
    const menu = await screen.findByRole('dialog', { name: 'Menu' });
    const focusable = [...menu.querySelectorAll('a[href], button:not([disabled])')];
    focusable.at(-1).focus();

    await userEvent.tab();

    expect(focusable[0]).toHaveFocus();
  });
});
