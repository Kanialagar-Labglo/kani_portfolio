// Anchor links to the visible sections. Plain anchors give shareable #section addresses.
export default function NavLinks({ sections, activeId, onNavigate, className = '' }) {
  return (
    <ul className={`nav-links list-unstyled m-0 ${className}`}>
      {sections.map((section) => (
        <li key={section.id}>
          <a
            href={`#${section.id}`}
            aria-current={section.id === activeId ? 'location' : undefined}
            onClick={onNavigate ? (event) => onNavigate(section.id, event) : undefined}
          >
            {section.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
