import PageSection from '../PageSection/PageSection.jsx';
import ResumeButton from '../ResumeButton/ResumeButton.jsx';

const ACTIONS = [
  { sectionId: 'projects', label: 'View projects', className: 'btn-primary-action' },
  { sectionId: 'contact', label: 'Contact', className: 'btn-secondary-action' },
];

// First section: name as the page's only h1, headline (or role), tagline, optional photo, and actions.
export default function Hero({ profile, visibleSectionIds, resume }) {
  const actions = ACTIONS.filter((action) => visibleSectionIds.includes(action.sectionId));

  return (
    <PageSection id="hero" heading={profile.name} headingLevel={1} className="hero">
      <div className="hero-body">
        <p className="hero-role">{profile.headline ?? profile.role}</p>
        <p className="hero-tagline">
          <span className="hero-prompt" aria-hidden="true">
            {'> '}
          </span>
          {profile.tagline}
        </p>
        {(actions.length > 0 || resume) && (
          <div className="hero-actions">
            {actions.map((action) => (
              <a key={action.sectionId} className={action.className} href={`#${action.sectionId}`}>
                {action.label}
              </a>
            ))}
            {resume && <ResumeButton resume={resume} className="btn-secondary-action" />}
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
