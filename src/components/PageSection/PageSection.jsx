// A labelled region of the page. The heading names the region for assistive technology; section
// headings get a decorative code-comment marker that is hidden from it, and their content fades in
// on scroll (see useReveal). The Hero, the level-one section, never fades.
export default function PageSection({ id, heading, headingLevel = 2, className = '', children }) {
  const HeadingTag = `h${headingLevel}`;
  const headingId = `${id}-heading`;

  return (
    <section id={id} aria-labelledby={headingId} className={`page-section ${className}`.trim()}>
      <div className="container" data-reveal={headingLevel === 2 ? '' : undefined}>
        <HeadingTag id={headingId}>
          {headingLevel === 2 && (
            <span className="heading-marker" aria-hidden="true">
              {'// '}
            </span>
          )}
          {heading}
        </HeadingTag>
        {children}
      </div>
    </section>
  );
}
