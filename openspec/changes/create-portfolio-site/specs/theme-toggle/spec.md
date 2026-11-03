## ADDED Requirements

### Requirement: Initial theme follows the system preference
On a visit with no saved theme choice, the site SHALL use the theme that matches
the visitor's system colour-scheme preference, and SHALL use the light theme when
no preference is available.

#### Scenario Outline: First visit matches the device setting
- **GIVEN** the visitor has never chosen a theme on this site
- **AND** the visitor's device prefers `<preference>`
- **WHEN** the visitor opens the portfolio page
- **THEN** the page is shown in the `<theme>` theme

Examples:
| preference    | theme |
| dark          | dark  |
| light         | light |
| no preference | light |

### Requirement: Visitor can switch theme
The header SHALL contain a theme toggle, always visible at every viewport width,
that switches between the light and dark themes. Switching SHALL restyle the
whole page, including layout, interactive components, and custom styles,
without reloading it.

#### Scenario: Switching to dark
- **GIVEN** the page is shown in the light theme
- **WHEN** the visitor uses the theme toggle
- **THEN** the whole page, including buttons, cards, menus, and notices, is shown in the dark theme
- **AND** the page does not reload

#### Scenario: Switching back to light
- **GIVEN** the page is shown in the dark theme
- **WHEN** the visitor uses the theme toggle
- **THEN** the whole page is shown in the light theme

### Requirement: Theme choice is remembered
An explicit theme choice SHALL be remembered in the visitor's browser and SHALL
take precedence over the system preference on later visits.

#### Scenario: Choice survives a return visit
- **GIVEN** the visitor's device prefers light
- **AND** the visitor switched the site to the dark theme on a previous visit
- **WHEN** the visitor opens the portfolio page again
- **THEN** the page is shown in the dark theme

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

### Requirement: Accessible theme toggle
The theme toggle SHALL have an accessible name that states the action it will
perform, SHALL be operable by keyboard, and SHALL switch themes without
animated transitions when the visitor requests reduced motion. Both themes SHALL
meet WCAG 2.2 AA colour-contrast requirements.

#### Scenario Outline: Toggle announces the action it will take
- **GIVEN** the page is shown in the `<current>` theme
- **WHEN** a screen reader announces the theme toggle
- **THEN** it is announced as "`<label>`"

Examples:
| current | label                 |
| light   | Switch to dark theme  |
| dark    | Switch to light theme |

#### Scenario: Keyboard visitor switches theme
- **GIVEN** a keyboard visitor has focused the theme toggle
- **WHEN** the visitor presses Enter
- **THEN** the theme switches

#### Scenario: Reduced motion switches instantly
- **GIVEN** the visitor's device requests reduced motion
- **WHEN** the visitor uses the theme toggle
- **THEN** the colours change without an animated transition
