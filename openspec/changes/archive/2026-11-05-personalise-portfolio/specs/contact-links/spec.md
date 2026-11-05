## ADDED Requirements

### Requirement: WhatsApp chat button
When the contact data has a WhatsApp number, the Contact section SHALL show a
"Chat on WhatsApp" button that opens a WhatsApp chat with that number and a
short pre-filled greeting in a new tab, without giving the opened page access to
the portfolio window. The number itself SHALL NOT be shown as visible text. When
no WhatsApp number is configured, the button SHALL NOT be shown.

#### Scenario: Visitor starts a WhatsApp chat
- **GIVEN** the contact data has a WhatsApp number
- **WHEN** a visitor chooses "Chat on WhatsApp" in the Contact section
- **THEN** a WhatsApp chat with that number opens in a new tab with a greeting ready to send
- **AND** the portfolio stays open in the original tab

#### Scenario: Number is not printed on the page
- **GIVEN** the contact data has a WhatsApp number
- **WHEN** a visitor reads the Contact section
- **THEN** the phone number does not appear as visible text

#### Scenario: No WhatsApp number configured
- **GIVEN** the contact data has no WhatsApp number
- **WHEN** a visitor views the Contact section
- **THEN** there is no WhatsApp button

## MODIFIED Requirements

### Requirement: No backend contact handling
The site SHALL NOT include a contact form or send visitor data to any server.

#### Scenario: Contact section has no form
- **GIVEN** a visitor is viewing the Contact section
- **WHEN** the visitor looks for a way to get in touch
- **THEN** only the email link, the WhatsApp button, and social links are offered
- **AND** there is no form to fill in
