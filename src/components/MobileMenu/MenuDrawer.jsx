import { useEffect } from 'react';
import { ConfigProvider, Drawer } from 'antd';
import { antdThemeConfig } from '../../lib/antdTheme.js';
import NavLinks from '../NavLinks/NavLinks.jsx';
import ResumeButton from '../ResumeButton/ResumeButton.jsx';

const ROOT_CLASS = 'mobile-menu-root';

// The mobile menu's drawer. Loaded only when the menu is first opened (ADR-0006), so it brings its
// own antd theme.
export default function MenuDrawer({
  id,
  open,
  theme,
  sections,
  activeId,
  resume,
  onNavigate,
  onClose,
  onAfterOpenChange,
}) {
  // Wrap Tab at the ends of the menu. antd's own trap briefly drops focus on <body> in Chromium.
  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event) => {
      if (event.key !== 'Tab') return;
      const dialog = document.querySelector(`.${ROOT_CLASS} [role="dialog"]`);
      const focusable = dialog
        ? [...dialog.querySelectorAll('a[href], button:not([disabled])')]
        : [];
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  return (
    <ConfigProvider theme={antdThemeConfig(theme)}>
      <Drawer
        id={id}
        rootClassName={ROOT_CLASS}
        title="Menu"
        placement="right"
        size={280}
        open={open}
        onClose={onClose}
        afterOpenChange={onAfterOpenChange}
      >
        <NavLinks
          sections={sections}
          activeId={activeId}
          onNavigate={onNavigate}
          className="d-flex flex-column gap-3"
        />
        {resume && (
          <ResumeButton resume={resume} className="btn-secondary-action mt-4" onChoose={onClose} />
        )}
      </Drawer>
    </ConfigProvider>
  );
}
