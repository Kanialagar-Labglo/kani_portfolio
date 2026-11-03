const hasItems = (list) => Array.isArray(list) && list.length > 0;

// Page order. Each section is shown only when its data has content.
const SECTIONS = [
  { id: 'hero', label: 'Home', hasContent: () => true },
  { id: 'about', label: 'About', hasContent: ({ profile }) => hasItems(profile?.bio) },
  {
    id: 'skills',
    label: 'Skills',
    hasContent: ({ skillGroups }) =>
      hasItems(skillGroups) && skillGroups.some((group) => hasItems(group.skills)),
  },
  { id: 'projects', label: 'Projects', hasContent: ({ projects }) => hasItems(projects) },
  { id: 'experience', label: 'Experience', hasContent: ({ experience }) => hasItems(experience) },
  {
    id: 'contact',
    label: 'Contact',
    hasContent: ({ contact, socials }) => Boolean(contact?.email) || hasItems(socials),
  },
];

/**
 * List the sections to show, in page order, leaving out any whose data is empty.
 * @param {{ profile?: object, skillGroups?: object[], projects?: object[], experience?: object[], contact?: object, socials?: object[] }} content
 * @returns {{ id: string, label: string }[]}
 */
export function getVisibleSections(content) {
  return SECTIONS.filter((section) => section.hasContent(content)).map(({ id, label }) => ({
    id,
    label,
  }));
}
