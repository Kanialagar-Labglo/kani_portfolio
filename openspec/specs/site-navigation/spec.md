# site-navigation Specification

## Purpose

A sticky header with in-page links, active-section highlighting, shareable section links and a mobile menu.

## Requirements

### Requirement: Sticky header
The header SHALL remain visible at the top of the viewport while the visitor
scrolls the page.

#### Scenario: Header stays reachable while scrolling
- **GIVEN** a visitor is at the top of the page
- **WHEN** the visitor scrolls down to the Contact section
- **THEN** the header with its navigation is still visible at the top of the viewport

### Requirement: In-page section navigation
The header navigation SHALL start with a "Home" link to the Hero, followed by
one link for each other visible content section, in page order and labelled
Home, About Me, Skills, Projects, Experience, Education, and Contact. Activating
a link SHALL bring that section into view with its heading fully visible below
the sticky header.

#### Scenario: Visitor jumps to a section
- **GIVEN** a visitor is at the top of the page
- **WHEN** the visitor chooses "Projects" in the navigation
- **THEN** the Projects section is in view
- **AND** the Projects heading is not covered by the header

#### Scenario: Navigation lists only visible sections
- **GIVEN** the Experience data has no entries
- **WHEN** the page has loaded
- **THEN** the navigation has no "Experience" link

#### Scenario: Navigation order
- **GIVEN** every section has content
- **WHEN** the page has loaded
- **THEN** the navigation links read Home, About Me, Skills, Projects, Experience, Education, Contact in that order

#### Scenario: Home returns to the introduction
- **GIVEN** a visitor has scrolled to the Contact section
- **WHEN** the visitor chooses "Home" in the navigation
- **THEN** the Hero section is in view
- **AND** the "Home" link is marked as the current location

### Requirement: Scrolling respects motion preferences
Section navigation SHALL scroll smoothly by default and SHALL jump instantly
when the visitor has asked their device to reduce motion.

#### Scenario: Default smooth scrolling
- **GIVEN** the visitor has no reduced-motion preference
- **WHEN** the visitor chooses a navigation link
- **THEN** the page scrolls smoothly to the section

#### Scenario: Reduced motion jumps instantly
- **GIVEN** the visitor's device requests reduced motion
- **WHEN** the visitor chooses a navigation link
- **THEN** the section is shown immediately without an animated scroll

### Requirement: Active section highlighting
The navigation SHALL highlight the link of the section currently in view and
SHALL mark that link as the current location for assistive technology. Only one
link SHALL be marked at a time.

#### Scenario: Highlight follows scrolling
- **GIVEN** a visitor is viewing the Hero section
- **WHEN** the visitor scrolls until the Skills section is in view
- **THEN** the "Skills" link is highlighted and announced as the current location
- **AND** no other navigation link is marked current

### Requirement: Shareable section links
Choosing a navigation link SHALL update the page address to that section's
fragment (for example `/#projects`). Opening an address with a section fragment
SHALL show that section. Scrolling alone SHALL NOT change the address.

#### Scenario: Address reflects the chosen section
- **GIVEN** a visitor is on the portfolio page
- **WHEN** the visitor chooses "Contact" in the navigation
- **THEN** the page address ends with `#contact`

#### Scenario: Visitor opens a shared section link
- **GIVEN** a visitor has a link to the portfolio ending with `#projects`
- **WHEN** the visitor opens the link
- **THEN** the Projects section is in view after the page loads

#### Scenario: Scrolling does not change the address
- **GIVEN** the page address has no section fragment
- **WHEN** the visitor scrolls through every section without using the navigation
- **THEN** the page address is unchanged

### Requirement: Return to top from the site name
The site name or logo in the header SHALL take the visitor back to the top of
the page.

#### Scenario: Visitor returns to the top
- **GIVEN** a visitor has scrolled to the Experience section
- **WHEN** the visitor chooses the site name in the header
- **THEN** the Hero section is in view

### Requirement: Mobile navigation menu
Below the tablet breakpoint (768 px), the navigation links SHALL collapse behind
a menu button. The theme toggle SHALL stay outside the menu. The open menu SHALL
keep keyboard focus within it, and SHALL close when the visitor chooses a link,
presses Escape, or taps outside it; focus SHALL then return to the menu button.

#### Scenario: Links collapse on small screens
- **GIVEN** the visitor's viewport is 360 pixels wide
- **WHEN** the page has loaded
- **THEN** the section links are hidden behind a menu button
- **AND** the theme toggle is visible in the header

#### Scenario: Choosing a link closes the menu
- **GIVEN** a mobile visitor has opened the navigation menu
- **WHEN** the visitor chooses "About"
- **THEN** the menu closes
- **AND** the About section is in view

#### Scenario: Escape closes the menu and restores focus
- **GIVEN** a keyboard visitor on a small screen has opened the navigation menu
- **WHEN** the visitor presses Escape
- **THEN** the menu closes
- **AND** focus is on the menu button

#### Scenario: Tapping outside closes the menu
- **GIVEN** a mobile visitor has opened the navigation menu
- **WHEN** the visitor taps outside the menu
- **THEN** the menu closes

#### Scenario: Focus stays inside the open menu
- **GIVEN** a keyboard visitor on a small screen has opened the navigation menu
- **WHEN** the visitor tabs past the last item in the menu
- **THEN** focus moves to the first item in the menu rather than the page behind it

#### Scenario: Links are shown inline on larger screens
- **GIVEN** the visitor's viewport is 1024 pixels wide
- **WHEN** the page has loaded
- **THEN** all section links are visible in the header without a menu button
