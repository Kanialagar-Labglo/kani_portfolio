import { useEffect, useRef, useState } from 'react';
import { Button, Drawer } from 'antd';
import { Menu } from 'lucide-react';
import NavLinks from '../NavLinks/NavLinks.jsx';
import ResumeButton from '../ResumeButton/ResumeButton.jsx';

const MENU_ID = 'mobile-menu';
const ROOT_CLASS = 'mobile-menu-root';

// Section links for small screens, in a drawer that keeps focus inside while open.
export default function MobileMenu({ sections, activeId, resume, className = '' }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const pendingSectionRef = useRef(null);

  // Scrolling is locked while the drawer is open, so the chosen section is shown after it closes.
  const handleNavigate = (id, event) => {
    event.preventDefault();
    pendingSectionRef.current = id;
    setOpen(false);
  };

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

  const handleAfterOpenChange = (isOpen) => {
    if (isOpen) return;
    buttonRef.current?.focus();
    const id = pendingSectionRef.current;
    pendingSectionRef.current = null;
    if (id) {
      window.history.pushState(null, '', `#${id}`);
      document.getElementById(id)?.scrollIntoView({ block: 'start' });
    }
  };

  return (
    <div className={className}>
      <Button
        ref={buttonRef}
        type="text"
        shape="circle"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls={MENU_ID}
        icon={<Menu size={20} aria-hidden="true" />}
        onClick={() => setOpen(true)}
      />
      <Drawer
        id={MENU_ID}
        rootClassName={ROOT_CLASS}
        title="Menu"
        placement="right"
        size={280}
        open={open}
        onClose={() => setOpen(false)}
        afterOpenChange={handleAfterOpenChange}
      >
        <NavLinks
          sections={sections}
          activeId={activeId}
          onNavigate={handleNavigate}
          className="d-flex flex-column gap-3"
        />
        {resume && (
          <ResumeButton
            resume={resume}
            className="btn-secondary-action mt-4"
            onChoose={() => setOpen(false)}
          />
        )}
      </Drawer>
    </div>
  );
}
