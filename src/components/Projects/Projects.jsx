import PageSection from '../PageSection/PageSection.jsx';
import ProjectCard from './ProjectCard.jsx';

// Project cards: one column on phones, two from tablets, three on large screens.
export default function Projects({ projects }) {
  return (
    <PageSection id="projects" heading="Projects">
      <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
        {projects.map((project) => (
          <div key={project.title} className="col">
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </PageSection>
  );
}
