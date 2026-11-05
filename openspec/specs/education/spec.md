# education Specification

## Purpose
The Education section: the owner's qualifications rendered from data, newest first, hidden when there are none.

## Requirements

### Requirement: Education lists qualifications
The Education section SHALL list each qualification from the education data,
newest first, showing the qualification name, the institution, and the
completion year. Education content SHALL be read from a data module separate
from presentation.

#### Scenario: Visitor reviews qualifications
- **GIVEN** the education data has an MCA completed in 2024 and a B.Sc. completed in 2021
- **WHEN** a visitor views the Education section
- **THEN** the MCA is listed first with its institution and the year 2024
- **AND** the B.Sc. is listed second with its institution and the year 2021

#### Scenario: Data order does not decide the display order
- **GIVEN** the education data lists the 2021 qualification before the 2024 one
- **WHEN** a visitor views the Education section
- **THEN** the 2024 qualification is listed first

### Requirement: Education is hidden without data
When the education data is empty, the page SHALL NOT show an Education section
or an "Education" navigation link.

#### Scenario: No qualifications yet
- **GIVEN** the education data is empty
- **WHEN** a visitor opens the portfolio page
- **THEN** there is no Education section and no "Education" navigation link
