## ADDED Requirements

### Requirement: Dark theme by default
On a visit with no saved theme choice, the site SHALL use the dark theme,
whatever the visitor's system colour-scheme preference.

#### Scenario Outline: First visit is dark
- **GIVEN** the visitor has never chosen a theme on this site
- **AND** the visitor's device prefers `<preference>`
- **WHEN** the visitor opens the portfolio page
- **THEN** the page is shown in the dark theme from its first painted frame

Examples:
| preference    |
| dark          |
| light         |
| no preference |

## MODIFIED Requirements

### Requirement: Theme choice is remembered
An explicit theme choice SHALL be remembered in the visitor's browser and SHALL
take precedence over the dark default on later visits.

#### Scenario: Choice survives a return visit
- **GIVEN** the visitor switched the site to the light theme on a previous visit
- **WHEN** the visitor opens the portfolio page again
- **THEN** the page is shown in the light theme

#### Scenario: Site still works when the choice cannot be saved
- **GIVEN** the visitor's browser blocks site storage
- **WHEN** the visitor uses the theme toggle
- **THEN** the theme switches for the current visit
- **AND** no error is shown

### Requirement: No flash of the wrong theme
The page SHALL be painted in the resolved theme from its first frame.

#### Scenario: Returning dark-theme visitor sees no light flash
- **GIVEN** the visitor previously chose the dark theme
- **WHEN** the visitor reloads the portfolio page
- **THEN** the first painted frame uses the dark theme's background colour

#### Scenario: Returning light-theme visitor sees no dark flash
- **GIVEN** the visitor previously chose the light theme
- **WHEN** the visitor reloads the portfolio page
- **THEN** the first painted frame uses the light theme's background colour

## REMOVED Requirements

### Requirement: Initial theme follows the system preference
**Reason**: The portfolio now has a dark developer identity, so every first visit starts in the dark theme.

**Migration**: Replaced by "Dark theme by default". Visitors who prefer light can still switch with the toggle, and that choice is remembered.
