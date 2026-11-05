## Why

The live portfolio still shows placeholder content and a generic look, so it
cannot yet support Full-Stack Developer job applications. This change replaces
every placeholder with the owner's real details, positions the owner primarily
as a Full-Stack Developer while keeping their QA and automation strength
visible, and gives the site a dark, developer-style identity that fits that
positioning. Content and look ship together in one change.

## What Changes

- Replace all placeholder content with the owner's details (data only):
  - Profile: name "Kani Alagar A", role "Full-Stack Developer", headline
    "Full-Stack Developer | Software Development | QA Automation", tagline, and
    a 158-character search/link-preview description.
  - About: two paragraphs (wording below). No separate Career Objective.
  - Skills: Frontend, Backend, Testing & QA, and Tools, each skill listed once.
  - Projects: only the Personal Portfolio Website, with source and live links.
  - Contact: email, GitHub, and LinkedIn.
  - Remove the placeholder `resume.pdf`, so the download buttons show the
    existing "unavailable" notice until the real résumé is added. The profile
    photo stays empty until provided. No Certifications section.
- The Hero shows the headline in place of the role line. The page title and
  link previews keep the short role.
- Experience supports grouped highlights: a role can have named groups
  (Development, Quality Assurance, Collaboration), each with two to four bullets.
- Add an Education section after Experience, listing each qualification with its
  institution and completion year, newest first, with an "Education" nav link.
- Add a "Home" nav link to the Hero. Nav order: Home, About, Skills, Projects,
  Experience, Education, Contact.
- Add a "Chat on WhatsApp" button to Contact that opens a `wa.me` chat with a
  pre-filled greeting in a new tab. The number is not shown as visible text.
- **BREAKING** (behaviour): every first visit starts in the dark theme instead
  of following the device setting. The toggle still offers the light theme and
  remembers the choice.
- New visual design:
  - Near-black background with blue and purple accents meeting WCAG AA
    contrast in both themes, in a code-inspired style.
  - Self-hosted JetBrains Mono (Latin subset) for headings, navigation, and
    labels. Body text stays in the system font.
  - Clean project, experience, and education cards with subtle hover and
    appear-on-scroll animations, disabled under reduced motion.
- Branding: an "AK" logo mark in the header and as the favicon, and a
  regenerated link-preview image with the owner's name and role.

### Content wording

About:

> I'm Kani Alagar A, a Software Developer at Labglo with 3+ years of experience
> across development and quality assurance. I build features with HTML, CSS,
> JavaScript, React, Python and Odoo, and test them thoroughly: functional and
> regression testing, API testing with Postman, and automation with Playwright.
> My work includes HRMS applications, where I validate business logic and work
> closely with development teams to deliver reliable software.

> I'm now growing into Full-Stack Development, exploring modern web technologies,
> Python, Playwright automation and application development. I enjoy learning new
> technologies, solving problems and building reliable, user-friendly
> applications.

Experience: Software Developer, Labglo, July 2022 to Present.

- Development: Frontend development with HTML, CSS, JavaScript and React.
  Backend development with Python and Odoo. REST API development and
  integration. Debugging applications and solving problems across the stack.
- Quality Assurance: Manual, functional, regression and smoke testing. API
  testing with Postman and automation testing with Playwright. Designing and
  executing test cases. Identifying, documenting and tracking defects, and
  validating fixes.
- Collaboration: Working with development and QA teams to understand business
  requirements, including HRMS workflows. Validating features and verifying
  deployments.

Education: Master of Computer Applications (MCA), S. Veerasamy Chettiar College
of Engineering and Technology, 2024. Bachelor of Science in Computer Science
(B.Sc.), Rajapalayam Raju's College, 2021.

Skills:

- Frontend: HTML, CSS, JavaScript, React, Bootstrap.
- Backend: Python, REST API, Odoo.
- Testing & QA: Manual Testing, Playwright, Postman, API Testing, Regression
  Testing, Functional Testing, Smoke Testing, Test Case Design, Bug Tracking,
  Automation Testing, End-to-End Testing.
- Tools: Git, GitHub, GitHub Actions, VS Code, JIRA, Linux, Chrome DevTools,
  OpenSpec.

## Capabilities

### New Capabilities

- `education`: Education section rendered from data, its nav link, and hiding it when there is no education data.
- `visual-style`: Dark developer look, accent colour contrast, self-hosted monospace font, animations that respect reduced motion, and the AK logo mark and favicon.

### Modified Capabilities

- `portfolio-sections`: Section order gains Education; the Hero shows a headline; Experience highlights can be grouped; the requirement to ship placeholder content is replaced by real content.
- `site-navigation`: Adds a Home link and the new navigation order.
- `contact-links`: Contact offers a WhatsApp chat button in addition to email and social links, still with no form.
- `theme-toggle`: First visits default to the dark theme instead of following the system preference.
- `site-quality`: The web font must stay within the existing bundle-size and Lighthouse budgets, and animations must not cause layout shift.

## Impact

- **Data:** every module in `src/data/` gets new content, plus a new
  `education.js`. The content shape gains a profile headline and grouped
  experience highlights.
- **Components:** Hero, Experience, Header (logo mark and Home link), NavLinks,
  Contact, and a new Education component. The theme default and styles are
  reworked (tokens, cards, animations).
- **Assets:** new `public/favicon.svg` (AK) and regenerated
  `public/og-image.png`; `public/resume.pdf` removed; a new self-hosted font file.
- **Dependencies:** possibly `@fontsource/jetbrains-mono`, or the font files
  copied in. The choice is recorded in an ADR.
- **Tests:** unit and e2e tests updated for the Hero headline, grouped
  experience, dark default, contact options, and navigation and section order.
  New tests for Education and WhatsApp. The résumé-download e2e supplies its own
  test PDF while the real file is absent.
