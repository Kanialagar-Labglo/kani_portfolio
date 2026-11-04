## ADDED Requirements

### Requirement: Email opens a new message
The Contact section SHALL show the owner's email address as a link that opens a
new message addressed to it in the visitor's default mail client. No message
SHALL be sent by the site itself.

#### Scenario: Visitor emails the owner
- **GIVEN** the contact data has the email address "hello@example.com"
- **WHEN** a visitor chooses the email link in the Contact section
- **THEN** the visitor's mail client opens a new message addressed to "hello@example.com"

### Requirement: Social links open in a new tab
The Contact section and the footer SHALL show each social profile from the data
with its platform icon and an accessible label naming the platform. Each link
SHALL open in a new tab and SHALL NOT give the opened page access to the
portfolio window.

#### Scenario: Visitor opens a social profile
- **GIVEN** the social data includes a GitHub profile
- **WHEN** a visitor chooses the GitHub link
- **THEN** the GitHub profile opens in a new tab
- **AND** the portfolio stays open in the original tab

#### Scenario: Opened page cannot control the portfolio
- **GIVEN** a visitor has opened a social profile from the portfolio
- **WHEN** the opened page tries to reach the window that opened it
- **THEN** it has no access to the portfolio window

#### Scenario: Icon-only links are named
- **GIVEN** the social links are shown as icons
- **WHEN** a screen reader announces the LinkedIn link
- **THEN** it is announced with a name that includes "LinkedIn"

### Requirement: No backend contact handling
The site SHALL NOT include a contact form or send visitor data to any server.

#### Scenario: Contact section has no form
- **GIVEN** a visitor is viewing the Contact section
- **WHEN** the visitor looks for a way to get in touch
- **THEN** only the email link and social links are offered
- **AND** there is no form to fill in
