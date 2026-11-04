/**
 * Decide which section the visitor is reading.
 * The active section is the last one whose top has scrolled up to the reading line;
 * at the very bottom of the page the last section is active, even if it is short.
 * @param {{ sections: { id: string, top: number }[], readingLine: number, atBottom: boolean }} input
 * @returns {string | null}
 */
export function pickActiveSection({ sections, readingLine, atBottom }) {
  if (sections.length === 0) {
    return null;
  }
  if (atBottom) {
    return sections[sections.length - 1].id;
  }
  const reached = sections.filter((section) => section.top <= readingLine);
  return (reached.length > 0 ? reached[reached.length - 1] : sections[0]).id;
}
