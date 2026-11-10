# site-quality Specification

## Purpose

Supported browsers, accessibility, Lighthouse targets, the bundle-size budget and lazy-loaded images.

## Requirements

### Requirement: Supported browsers
The site SHALL work in the latest two versions of Chrome, Edge, Firefox, and
Safari on desktop, and of Safari on iOS and Chrome on Android. Automated
end-to-end checks SHALL run in desktop Chromium, desktop Firefox, a mobile
Chrome profile, and a mobile Safari (WebKit) profile.

#### Scenario Outline: Core journey works in each browser profile
- **GIVEN** the visitor uses `<browser>`
- **WHEN** the visitor opens the page, navigates to Projects, and switches theme
- **THEN** each step behaves as specified

Examples: `<browser>` = desktop Chromium, desktop Firefox, mobile Chrome, mobile Safari

### Requirement: Accessibility
The site SHALL have no serious or critical violations reported by automated
accessibility checks (axe) in both the light and dark themes, and every
interactive element SHALL be reachable and operable with the keyboard alone,
with a visible focus indicator.

#### Scenario Outline: Automated accessibility check passes
- **GIVEN** the page is shown in the `<theme>` theme
- **WHEN** an automated accessibility check scans the whole page
- **THEN** it reports no serious or critical violations

Examples: `<theme>` = light, dark

#### Scenario: Keyboard-only visit
- **GIVEN** a visitor uses only the keyboard
- **WHEN** the visitor tabs through the page from top to bottom
- **THEN** every link and button receives focus in a logical order
- **AND** the focused element is always visibly indicated

### Requirement: Performance and page-experience targets
The production build SHALL score at least 90 for Performance, 95 for
Accessibility, 95 for Best Practices, and 100 for SEO in a Lighthouse mobile
audit, with Largest Contentful Paint under 2.5 seconds and Cumulative Layout
Shift under 0.1.

#### Scenario: Lighthouse mobile audit
- **GIVEN** the production build is served
- **WHEN** a Lighthouse mobile audit runs against the page
- **THEN** Performance is at least 90, Accessibility at least 95, Best Practices at least 95, and SEO is 100
- **AND** Largest Contentful Paint is under 2.5 seconds and Cumulative Layout Shift is under 0.1

### Requirement: Lightweight bundle
The JavaScript loaded for the initial page SHALL total no more than 100 KB
gzipped and the CSS no more than 40 KB gzipped. Code that loads later, such as
the interactive extras, SHALL NOT count towards the initial JavaScript.

#### Scenario: Bundle stays within budget
- **GIVEN** the site has been built for production
- **WHEN** the initial JavaScript and CSS sizes are measured gzipped
- **THEN** JavaScript is at most 100 KB and CSS is at most 40 KB

### Requirement: Below-the-fold images load lazily
Images outside the initial viewport SHALL NOT be downloaded until they approach
the viewport.

#### Scenario: Project screenshots wait until needed
- **GIVEN** the Projects section has screenshots and is below the initial viewport
- **WHEN** a visitor opens the page without scrolling
- **THEN** the project screenshots have not been downloaded

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

### Requirement: Interactive extras load after the first view
The code for the interactive extras (the mobile menu drawer and the résumé
"unavailable" notice) SHALL NOT be part of the initial page load. It SHALL be
fetched in the background once the browser is idle, and SHALL load on demand if
an extra is used before then.

#### Scenario: First view loads without the extras
- **GIVEN** the production build is served
- **WHEN** a visitor opens the page
- **THEN** the code for the menu drawer and the résumé notice is not among the scripts loaded for the initial page
- **AND** the theme toggle, the menu button, and the skill and technology labels are shown and usable

#### Scenario: Extras are fetched when the browser is idle
- **GIVEN** a visitor has opened the page
- **WHEN** the page has finished loading and the browser is idle, without any interaction
- **THEN** the code for the menu drawer and the résumé notice is downloaded in the background

#### Scenario Outline: Extra used before its code has arrived
- **GIVEN** the code for the extras has not been downloaded yet
- **WHEN** the visitor `<action>`
- **THEN** the `<extra>` appears and behaves as specified

Examples:

| action | extra |
| --- | --- |
| opens the menu on a mobile viewport | menu drawer |
| chooses to download the résumé while it is unavailable | résumé "unavailable" notice |
