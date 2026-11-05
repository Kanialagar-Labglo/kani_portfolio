## ADDED Requirements

### Requirement: Lightweight self-hosted fonts
Web font files loaded by the page SHALL be served from the site itself, limited
to the Latin character set, and SHALL total no more than 60 KB. Loading fonts
SHALL NOT push the page past the existing Lighthouse, Largest Contentful Paint,
and Cumulative Layout Shift targets.

#### Scenario: Font files stay within budget
- **GIVEN** the site has been built for production
- **WHEN** the font files the page loads are measured
- **THEN** they total at most 60 KB
- **AND** none is requested from another site

#### Scenario: Fonts and motion keep the page stable
- **GIVEN** the production build is served
- **WHEN** a Lighthouse mobile audit runs against the page
- **THEN** Cumulative Layout Shift is under 0.1 and Largest Contentful Paint is under 2.5 seconds
