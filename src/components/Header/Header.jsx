import ThemeToggle from '../ThemeToggle/ThemeToggle.jsx';

// Page header. Navigation links and the résumé action are added in task groups 6 and 9.
export default function Header({ theme, onToggleTheme }) {
  return (
    <header className="site-header">
      <div className="container d-flex align-items-center justify-content-between">
        <nav aria-label="Primary"></nav>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </header>
  );
}
