# resume-download Specification

## Purpose

A named PDF résumé download, with a friendly fallback when the file is missing.

## Requirements

### Requirement: Résumé download actions
When a résumé is configured, the site SHALL offer a "Download résumé (PDF)"
action in the Hero and in the header navigation (inside the menu on small
screens). The action SHALL show a download icon and SHALL be named for
assistive technology as a résumé download.

#### Scenario: Download actions are offered
- **GIVEN** a résumé is configured
- **WHEN** a visitor views the Hero and the header
- **THEN** both offer a "Download résumé (PDF)" action

#### Scenario: Download action on small screens
- **GIVEN** a résumé is configured
- **AND** the visitor's viewport is 360 pixels wide
- **WHEN** the visitor opens the navigation menu
- **THEN** the menu includes the "Download résumé (PDF)" action

### Requirement: Résumé downloads as a named PDF
Choosing a download action SHALL save the configured résumé PDF to the
visitor's device under a friendly file name based on the owner's name, without
navigating away from the portfolio.

#### Scenario: Visitor downloads the résumé
- **GIVEN** a résumé is configured and the PDF is available
- **AND** the owner's name is "Alex Doe"
- **WHEN** a visitor chooses "Download résumé (PDF)"
- **THEN** a PDF named "Alex-Doe-Resume.pdf" is downloaded
- **AND** the portfolio page stays open

### Requirement: Hidden when not configured
When no résumé is configured in the profile data, the site SHALL NOT show any
résumé download action.

#### Scenario: Owner has not added a résumé
- **GIVEN** the profile data has no résumé configured
- **WHEN** a visitor views the Hero and the header
- **THEN** no résumé download action is shown

### Requirement: Friendly fallback when the file is unavailable
When a résumé is configured but the file cannot be retrieved as a PDF, choosing
a download action SHALL NOT download anything and SHALL show a notice saying
the résumé is temporarily unavailable, with a way to reach the Contact section.
The notice SHALL be announced to assistive technology.

#### Scenario: Résumé file is missing
- **GIVEN** a résumé is configured but the file is missing from the site
- **WHEN** a visitor chooses "Download résumé (PDF)"
- **THEN** no file is downloaded
- **AND** a notice says the résumé is temporarily unavailable
- **AND** the notice offers a way to go to the Contact section

#### Scenario: Server returns a page instead of the PDF
- **GIVEN** a résumé is configured
- **AND** requesting the résumé returns a web page instead of a PDF
- **WHEN** a visitor chooses "Download résumé (PDF)"
- **THEN** no file is downloaded
- **AND** the unavailable notice is shown

#### Scenario: Visitor follows the fallback to Contact
- **GIVEN** the résumé unavailable notice is shown
- **WHEN** the visitor chooses the Contact option in the notice
- **THEN** the Contact section is in view
