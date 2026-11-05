## MODIFIED Requirements

### Requirement: Sections appear in a fixed order
The main region SHALL present content sections in this order: Hero, About,
Skills, Projects, Experience, Education, Contact. The footer SHALL follow the
main region.

#### Scenario: Visitor scrolls through the whole page
- **GIVEN** every section has content
- **WHEN** a visitor scrolls from the top to the bottom of the page
- **THEN** the sections appear in the order Hero, About, Skills, Projects, Experience, Education, Contact
- **AND** the footer comes last

### Requirement: Content comes from editable data
All portfolio content (profile, skills, projects, experience, education, contact
and social details) SHALL be read from data modules kept separate from
presentation, so that changing an entry in the data changes what the page shows
without changing any component. The site SHALL ship with the owner's real
content and SHALL NOT show placeholder text such as "Your Name", "Placeholder",
or example addresses.

#### Scenario: Owner updates a project title
- **GIVEN** the projects data contains a project titled "Project One"
- **WHEN** the owner changes that title to "Weather Dashboard" in the data and rebuilds the site
- **THEN** the Projects section shows a project titled "Weather Dashboard"

#### Scenario: No placeholder content is published
- **GIVEN** the site has been built with the shipped data
- **WHEN** a visitor reads the whole page
- **THEN** no text contains "Your Name", "Placeholder", "example.com", or "your-username"

### Requirement: Hero introduces the owner
The Hero section SHALL show the owner's name as the page's level-one heading, a
headline, and a short tagline. The headline SHALL be the profile's headline when
one is provided, and the role otherwise. It SHALL offer actions to view projects
and to get in touch, and SHALL show a profile photo with descriptive alternative
text when one is provided.

#### Scenario: Visitor lands on the page
- **GIVEN** the profile data has a name, headline, and tagline
- **WHEN** a visitor opens the portfolio page
- **THEN** the Hero shows the name as the main heading, the headline, and the tagline
- **AND** the Hero offers "View projects" and "Contact" actions

#### Scenario Outline: Headline falls back to the role
- **GIVEN** the profile role is "Full-Stack Developer"
- **AND** the profile headline is `<headline>`
- **WHEN** a visitor views the Hero
- **THEN** the Hero shows "`<shown>`" under the name

Examples:
| headline                                                      | shown                                                         |
| "Full-Stack Developer \| Software Development \| QA Automation" | Full-Stack Developer \| Software Development \| QA Automation |
| not provided                                                  | Full-Stack Developer                                          |

#### Scenario: Hero actions lead to their sections
- **GIVEN** a visitor is viewing the Hero
- **WHEN** the visitor chooses "View projects"
- **THEN** the Projects section is in view

#### Scenario: Profile photo is described
- **GIVEN** the profile data includes a photo
- **WHEN** a visitor views the Hero
- **THEN** the photo is shown with alternative text naming the owner

#### Scenario: No photo provided
- **GIVEN** the profile data has no photo
- **WHEN** a visitor views the Hero
- **THEN** the Hero shows no image and no empty image placeholder

### Requirement: Experience is a timeline
The Experience section SHALL list roles newest first. Each entry SHALL show the
role, company, start date, and end date or "Present". An entry SHALL show either
a list of two to four highlights or two to four named highlight groups, each
group with a visible name and two to four highlights.

#### Scenario: Current and past roles
- **GIVEN** the experience data has a current role started in 2023 and a past role from 2020 to 2023
- **WHEN** a visitor views the Experience section
- **THEN** the current role is listed first with an end date of "Present"
- **AND** the past role is listed second with its dates

#### Scenario: Role with grouped highlights
- **GIVEN** a role has the highlight groups "Development", "Quality Assurance", and "Collaboration"
- **WHEN** a visitor views that role in the Experience section
- **THEN** each group is shown with its name followed by its highlights, in data order
