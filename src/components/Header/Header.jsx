import NavLinks from '../NavLinks/NavLinks.jsx';
import ThemeToggle from '../ThemeToggle/ThemeToggle.jsx';
import MobileMenu from '../MobileMenu/MobileMenu.jsx';
import ResumeButton from '../ResumeButton/ResumeButton.jsx';

// Sticky page header: logo mark and site name, section navigation, résumé download, and theme toggle.
// The mark is decorative; the link is always named after the owner, whose name is shown from 992 px.
export default function Header({
  siteName,
  brandInitials,
  sections,
  activeId,
  resume,
  theme,
  onToggleTheme,
}) {
  return (
    <header className="site-header">
      <div className="container d-flex align-items-center gap-3">
        <a className={`site-name me-auto${brandInitials ? ' has-mark' : ''}`} href="#hero">
          {brandInitials && (
            <span className="site-mark" aria-hidden="true">
              {brandInitials}
            </span>
          )}
          <span className="site-name-text">{siteName}</span>
        </a>
        <nav aria-label="Primary">
          <NavLinks
            sections={sections}
            activeId={activeId}
            className="d-none d-md-flex gap-2 gap-lg-3"
          />
        </nav>
        {resume && (
          <ResumeButton resume={resume} compact className="header-resume d-none d-md-inline-flex" />
        )}
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        <MobileMenu
          sections={sections}
          activeId={activeId}
          resume={resume}
          theme={theme}
          className="d-md-none"
        />
      </div>
    </header>
  );
}
