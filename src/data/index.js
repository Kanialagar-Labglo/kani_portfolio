import { profile } from './profile.js';
import { skillGroups } from './skills.js';
import { projects } from './projects.js';
import { experience } from './experience.js';
import { education } from './education.js';
import { contact, socials } from './socials.js';

// All portfolio content in one object, as the components and section rules expect it.
export const content = { profile, skillGroups, projects, experience, education, contact, socials };
