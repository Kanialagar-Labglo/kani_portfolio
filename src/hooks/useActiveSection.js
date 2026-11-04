import { useEffect, useState } from 'react';
import { pickActiveSection } from '../lib/activeSection.js';

// The reading line sits 30% down the viewport, below the sticky header.
const READING_LINE_RATIO = 0.3;

function measure(ids) {
  const sections = ids
    .map((id) => document.getElementById(id))
    .filter(Boolean)
    .map((element) => ({ id: element.id, top: element.getBoundingClientRect().top }));
  const root = document.documentElement;
  const atBottom =
    root.scrollHeight > window.innerHeight &&
    window.scrollY + window.innerHeight >= root.scrollHeight - 2;

  return pickActiveSection({
    sections,
    readingLine: window.innerHeight * READING_LINE_RATIO,
    atBottom,
  });
}

/**
 * The id of the section the visitor is currently reading.
 * Recalculated at most once per animation frame while scrolling or resizing.
 * @param {string[]} ids section ids in page order
 * @returns {string | null}
 */
export function useActiveSection(ids) {
  const key = ids.join(',');
  const [activeId, setActiveId] = useState(() => measure(ids));

  useEffect(() => {
    const sectionIds = key.split(',');
    let frame = 0;
    const update = () => {
      frame = 0;
      setActiveId(measure(sectionIds));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [key]);

  return activeId;
}
