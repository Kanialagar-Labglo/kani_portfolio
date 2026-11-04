import { Tag } from 'antd';
import PageSection from '../PageSection/PageSection.jsx';

const toId = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-');

// Skills grouped by category, shown as plain labels (no ratings or percentages).
export default function Skills({ skillGroups }) {
  const groups = skillGroups.filter((group) => group.skills.length > 0);

  return (
    <PageSection id="skills" heading="Skills">
      <div className="row g-4">
        {groups.map((group) => {
          const headingId = `skills-${toId(group.name)}`;
          return (
            <div key={group.name} className="col-12 col-md-6">
              <h3 id={headingId}>{group.name}</h3>
              <ul className="tag-list" aria-labelledby={headingId}>
                {group.skills.map((skill) => (
                  <li key={skill}>
                    <Tag>{skill}</Tag>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </PageSection>
  );
}
