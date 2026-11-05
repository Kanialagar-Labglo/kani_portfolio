import PageSection from '../PageSection/PageSection.jsx';
import { formatPeriod, sortNewestFirst } from '../../lib/experience.js';

function HighlightList({ items }) {
  return (
    <ul className="timeline-highlights">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

// Roles as an ordered timeline, newest first. A role shows either named highlight groups or one list.
export default function Experience({ experience }) {
  return (
    <PageSection id="experience" heading="Experience">
      <ol className="timeline">
        {sortNewestFirst(experience).map((entry) => (
          <li key={`${entry.company}-${entry.start}`} className="timeline-item card-surface">
            <h3>{entry.role}</h3>
            <p className="timeline-company">{entry.company}</p>
            <p className="timeline-period">{formatPeriod(entry.start, entry.end)}</p>
            {entry.highlightGroups ? (
              entry.highlightGroups.map((group) => (
                <div key={group.name} className="timeline-group">
                  <h4>{group.name}</h4>
                  <HighlightList items={group.items} />
                </div>
              ))
            ) : (
              <HighlightList items={entry.highlights} />
            )}
          </li>
        ))}
      </ol>
    </PageSection>
  );
}
