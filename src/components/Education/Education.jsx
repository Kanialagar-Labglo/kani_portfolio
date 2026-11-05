import PageSection from '../PageSection/PageSection.jsx';
import { sortByYearDesc } from '../../lib/education.js';

// Qualifications as cards, newest first.
export default function Education({ education }) {
  return (
    <PageSection id="education" heading="Education">
      <ol className="education-list row g-4">
        {sortByYearDesc(education).map((entry) => (
          <li key={`${entry.qualification}-${entry.year}`} className="col-12 col-md-6">
            <div className="education-card card-surface">
              <h3>{entry.qualification}</h3>
              <p className="education-institution">{entry.institution}</p>
              <p className="education-year">{entry.year}</p>
            </div>
          </li>
        ))}
      </ol>
    </PageSection>
  );
}
