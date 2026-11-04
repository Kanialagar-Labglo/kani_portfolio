import PageSection from '../PageSection/PageSection.jsx';
import { formatPeriod, sortNewestFirst } from '../../lib/experience.js';

// Roles as an ordered timeline, newest first.
export default function Experience({ experience }) {
  return (
    <PageSection id="experience" heading="Experience">
      <ol className="timeline">
        {sortNewestFirst(experience).map((entry) => (
          <li key={`${entry.company}-${entry.start}`} className="timeline-item">
            <h3>{entry.role}</h3>
            <p className="timeline-company">{entry.company}</p>
            <p className="timeline-period">{formatPeriod(entry.start, entry.end)}</p>
            <ul className="timeline-highlights">
              {entry.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </PageSection>
  );
}
