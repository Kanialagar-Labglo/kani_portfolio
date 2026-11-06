# portfolio-sections Specification

## Purpose

The Hero, About, Skills, Projects, Experience and Footer content, driven by editable data.

## Requirements

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

### Requirement: About tells the owner's story
The About section SHALL show one to three short bio paragraphs from the profile
data.

#### Scenario: Bio paragraphs are shown
- **GIVEN** the profile data has two bio paragraphs
- **WHEN** a visitor views the About section
- **THEN** both paragraphs are shown in their data order

### Requirement: Skills are grouped
The Skills section SHALL show skills grouped under named categories, each skill
shown as a label. Skills SHALL NOT be shown with ratings, percentages, or
proficiency bars.

#### Scenario: Visitor scans skill groups
- **GIVEN** the skills data has the groups "Frontend" and "Testing & QA"
- **WHEN** a visitor views the Skills section
- **THEN** each group is shown with its name and its skills as labels
- **AND** no skill shows a rating or percentage

### Requirement: Projects are shown as cards
The Projects section SHALL show one card per project with its title, short
description, and technology labels. A card SHALL show a source-code link and a
live-demo link only when each is provided, and links SHALL open in a new tab. A
project screenshot, when provided, SHALL have descriptive alternative text and
SHALL load only as it approaches the viewport.

#### Scenario: Project with all details
- **GIVEN** a project has a title, description, technologies, source link, live link, and screenshot
- **WHEN** a visitor views the Projects section
- **THEN** that project's card shows the title, description, technology labels, screenshot, and both links

#### Scenario: Project without a live demo
- **GIVEN** a project has a source link but no live link
- **WHEN** a visitor views its card
- **THEN** the card shows the source link and no live-demo link

#### Scenario: Project links open separately
- **GIVEN** a visitor is viewing a project card
- **WHEN** the visitor chooses its source link
- **THEN** the project's repository opens in a new tab
- **AND** the portfolio stays open in the original tab

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

### Requirement: Footer
The footer SHALL show a copyright notice with the owner's name and the current
year, and the owner's social links.

#### Scenario: Copyright year is current
- **GIVEN** the current year is 2027
- **WHEN** a visitor views the footer
- **THEN** the copyright notice shows 2027 and the owner's name

### Requirement: Sections without content are hidden
A section whose data is empty SHALL NOT be shown, and its navigation link SHALL
NOT be shown.

#### Scenario: No projects yet
- **GIVEN** the projects data is empty
- **WHEN** a visitor opens the portfolio page
- **THEN** there is no Projects section and no "Projects" navigation link
- **AND** the other sections are shown as usual
