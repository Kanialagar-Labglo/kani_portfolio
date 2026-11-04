import NavLinks from '../NavLinks/NavLinks.jsx';
import ThemeToggle from '../ThemeToggle/ThemeToggle.jsx';
import MobileMenu from '../MobileMenu/MobileMenu.jsx';

// Sticky page header: site name, section navigation, and theme toggle.
export default function Header({ siteName, sections, activeId, theme, onToggleTheme }) {
  return (
    <header className="site-header">
      <div className="container d-flex align-items-center gap-3">
        <a className="site-name me-auto" href="#hero">
          {siteName}
        </a>
        <nav aria-label="Primary">
          <NavLinks sections={sections} activeId={activeId} className="d-none d-md-flex gap-3" />
        </nav>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        <MobileMenu sections={sections} activeId={activeId} className="d-md-none" />
      </div>
    </header>
  );
}
