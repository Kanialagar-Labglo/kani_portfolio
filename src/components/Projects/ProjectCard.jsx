import { Tag } from 'antd';
import { CodeXml, ExternalLink } from 'lucide-react';

// A project card. Links open in a new tab without giving that page access to the portfolio.
export default function ProjectCard({ project }) {
  const { title, description, technologies, sourceUrl, liveUrl, screenshot } = project;

  return (
    <article className="project-card card-surface">
      {screenshot && (
        <img
          className="project-card-image"
          src={`${import.meta.env.BASE_URL}${screenshot.src}`}
          alt={screenshot.alt}
          loading="lazy"
          decoding="async"
          width="640"
          height="360"
        />
      )}
      <div className="project-card-body">
        <h3>{title}</h3>
        <p>{description}</p>
        {technologies.length > 0 && (
          <ul className="tag-list" aria-label="Technologies">
            {technologies.map((technology) => (
              <li key={technology}>
                <Tag>{technology}</Tag>
              </li>
            ))}
          </ul>
        )}
        {(sourceUrl || liveUrl) && (
          <div className="project-card-links">
            {sourceUrl && (
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Source code for ${title}`}
              >
                <CodeXml size={18} aria-hidden="true" /> Source code
              </a>
            )}
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Live demo of ${title}`}
              >
                <ExternalLink size={18} aria-hidden="true" /> Live demo
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
