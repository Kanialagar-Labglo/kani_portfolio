# visual-style Specification

## Purpose
The site's developer-style look: dark palette with blue and purple accents, a self-hosted monospace display font, subtle motion that respects reduced motion, and the AK brand mark.

## Requirements

### Requirement: Developer colour palette
The dark theme SHALL use a near-black background with blue and purple accent
colours, and the light theme SHALL use the same accent family. In both themes,
body text SHALL have a contrast ratio of at least 4.5:1 against its background,
and accent-coloured text, focus indicators, and control borders SHALL have at
least 3:1 for large text and non-text elements and 4.5:1 for normal text.

#### Scenario Outline: Accent colours stay readable
- **GIVEN** the page is shown in the `<theme>` theme
- **WHEN** an automated contrast check scans the whole page
- **THEN** no text or control fails its WCAG 2.2 AA contrast requirement

Examples: `<theme>` = dark, light

### Requirement: Monospace display typography
Headings, navigation links, and short labels (such as technology and skill
labels) SHALL use a monospace display font that is served from the site itself.
Body paragraphs SHALL use the device's system font. Text SHALL be readable in a
fallback font while the display font is still loading.

#### Scenario: Headings use the display font
- **GIVEN** the page has fully loaded
- **WHEN** a visitor views any section heading
- **THEN** the heading is set in the monospace display font
- **AND** the About paragraphs are set in the system font

#### Scenario: Text is shown while the font loads
- **GIVEN** the display font has not finished downloading
- **WHEN** the page is first painted
- **THEN** headings and navigation text are already visible in a fallback font

#### Scenario: No third-party font requests
- **GIVEN** a visitor opens the portfolio page
- **WHEN** the page has fully loaded
- **THEN** every font file was requested from the site's own address

### Requirement: Subtle motion that respects preferences
Project, experience, and education cards SHALL give visible feedback when
hovered or focused, and content blocks SHALL fade in subtly as they first
scroll into view. Motion SHALL NOT move surrounding content or cause layout shift. When the
visitor's device requests reduced motion, all content SHALL be shown at once
with no animated transitions.

#### Scenario: Card responds to hover and focus
- **GIVEN** a visitor is viewing the Projects section
- **WHEN** the visitor hovers over or focuses a project card
- **THEN** the card shows a visible highlight
- **AND** the cards around it do not move

#### Scenario: Reduced motion shows everything immediately
- **GIVEN** the visitor's device requests reduced motion
- **WHEN** the visitor scrolls through every section
- **THEN** all content is fully visible as soon as it enters the viewport
- **AND** no element animates

#### Scenario: Content is never left hidden
- **GIVEN** a visitor has scrolled to the bottom of the page
- **WHEN** the visitor looks back at any section
- **THEN** every section's content is fully visible

### Requirement: AK brand mark
The header SHALL show an "AK" logo mark as the site name link, with an accessible
name that includes the owner's full name. The site's favicon SHALL show "AK".

#### Scenario: Logo mark is named
- **GIVEN** a screen reader user is on the portfolio page
- **WHEN** the screen reader announces the logo link in the header
- **THEN** it is announced with a name that includes "Kani Alagar A"

#### Scenario: Browser tab shows the brand
- **GIVEN** a visitor has the portfolio open in a browser tab
- **WHEN** the visitor looks at the tab
- **THEN** the tab icon shows "AK"
