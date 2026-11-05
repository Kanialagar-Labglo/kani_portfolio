## MODIFIED Requirements

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
