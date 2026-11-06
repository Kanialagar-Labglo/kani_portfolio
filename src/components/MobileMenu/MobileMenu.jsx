import { lazy, Suspense, useRef, useState } from 'react';
import { Menu } from 'lucide-react';
import { loadMenuDrawer } from '../../lib/extras.js';
import ExtraBoundary from '../ExtraBoundary/ExtraBoundary.jsx';

const MENU_ID = 'mobile-menu';
const MenuDrawer = lazy(loadMenuDrawer);

// Section links for small screens. The trigger is native; the drawer loads on first open
// (ADR-0006) and then stays mounted, so it can animate closed and hand focus back.
export default function MobileMenu({ sections, activeId, resume, theme, className = '' }) {
  const [open, setOpen] = useState(false);
  const [requested, setRequested] = useState(false);
  const buttonRef = useRef(null);
  const pendingSectionRef = useRef(null);

  const openMenu = () => {
    setRequested(true);
    setOpen(true);
  };

  // Scrolling is locked while the drawer is open, so the chosen section is shown after it closes.
  const handleNavigate = (id, event) => {
    event.preventDefault();
    pendingSectionRef.current = id;
    setOpen(false);
  };

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
      <button
        ref={buttonRef}
        type="button"
        className="icon-button"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls={MENU_ID}
        onClick={openMenu}
      >
        <Menu size={20} aria-hidden="true" />
      </button>
      {requested && (
        <ExtraBoundary>
          <Suspense fallback={null}>
            <MenuDrawer
              id={MENU_ID}
              open={open}
              theme={theme}
              sections={sections}
              activeId={activeId}
              resume={resume}
              onNavigate={handleNavigate}
              onClose={() => setOpen(false)}
              onAfterOpenChange={handleAfterOpenChange}
            />
          </Suspense>
        </ExtraBoundary>
      )}
    </div>
  );
}
