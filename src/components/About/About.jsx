import PageSection from '../PageSection/PageSection.jsx';

export default function About({ bio }) {
  return (
    <PageSection id="about" heading="About">
      <div className="about-body">
        {bio.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </PageSection>
  );
}
