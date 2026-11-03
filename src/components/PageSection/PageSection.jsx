// A labelled region of the page. The heading names the region for assistive technology.
export default function PageSection({ id, heading, headingLevel = 2, children }) {
  const HeadingTag = `h${headingLevel}`;
  const headingId = `${id}-heading`;

  return (
    <section id={id} aria-labelledby={headingId} className="page-section">
      <div className="container">
        <HeadingTag id={headingId}>{heading}</HeadingTag>
        {children}
      </div>
    </section>
  );
}
