import PageSection from '../PageSection/PageSection.jsx';

const ACTIONS = [
  { sectionId: 'projects', label: 'View projects', className: 'btn-primary-action' },
  { sectionId: 'contact', label: 'Contact', className: 'btn-secondary-action' },
];

// First section: name as the page's only h1, role, tagline, optional photo, and actions.
export default function Hero({ profile, visibleSectionIds }) {
  const actions = ACTIONS.filter((action) => visibleSectionIds.includes(action.sectionId));

  return (
    <PageSection id="hero" heading={profile.name} headingLevel={1} className="hero">
      <div className="hero-body">
        <p className="hero-role">{profile.role}</p>
        <p className="hero-tagline">{profile.tagline}</p>
        {actions.length > 0 && (
          <div className="hero-actions">
            {actions.map((action) => (
              <a key={action.sectionId} className={action.className} href={`#${action.sectionId}`}>
                {action.label}
              </a>
            ))}
          </div>
        )}
      </div>
      {profile.photo && (
        <img
          className="hero-photo"
          src={`${import.meta.env.BASE_URL}${profile.photo.src}`}
          alt={profile.photo.alt}
          width="160"
          height="160"
        />
      )}
    </PageSection>
  );
}
