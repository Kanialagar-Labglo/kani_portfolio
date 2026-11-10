## MODIFIED Requirements

### Requirement: Lightweight bundle
The JavaScript loaded for the initial page SHALL total no more than 100 KB
gzipped and the CSS no more than 40 KB gzipped. Code that loads later, such as
the interactive extras, SHALL NOT count towards the initial JavaScript.

#### Scenario: Bundle stays within budget
- **GIVEN** the site has been built for production
- **WHEN** the initial JavaScript and CSS sizes are measured gzipped
- **THEN** JavaScript is at most 100 KB and CSS is at most 40 KB

## ADDED Requirements

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
