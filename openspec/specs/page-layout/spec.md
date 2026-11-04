# page-layout Specification

## Purpose

One semantic, mobile-first page with no routes, a skip link and a no-JavaScript message.

## Requirements

### Requirement: Single-page semantic structure
The site SHALL be a single page whose content is organised into semantic
landmarks: one `header`, one `nav` for primary navigation, one `main`, one
`section` per content area, and one `footer`. The page SHALL contain exactly one
level-one heading and headings SHALL NOT skip levels.

#### Scenario: Visitor using assistive technology lists page landmarks
- **GIVEN** the portfolio page has loaded
- **WHEN** a visitor's screen reader lists the page landmarks
- **THEN** it reports a banner, a primary navigation, a main region, and a content info region
- **AND** each content area appears as its own labelled region inside the main region

#### Scenario: Heading outline is logical
- **GIVEN** the portfolio page has loaded
- **WHEN** a visitor reviews the heading outline
- **THEN** there is exactly one level-one heading, containing the owner's name
- **AND** every section heading is level two, with no skipped levels beneath it

### Requirement: No route changes
The site SHALL serve all content from a single page and SHALL NOT change the
page path when the visitor moves between sections.

#### Scenario: Moving between sections keeps the same page
- **GIVEN** a visitor is on the portfolio page
- **WHEN** the visitor moves to any section
- **THEN** the page path stays the same and no new page is loaded

### Requirement: Mobile-first responsive layout
The layout SHALL adapt to every supported viewport width from 360 px to 1920 px
without horizontal scrolling and without content overlapping or being clipped.

#### Scenario Outline: Layout fits the viewport
- **GIVEN** the visitor's viewport is `<width>` pixels wide
- **WHEN** the portfolio page has loaded
- **THEN** the page does not scroll horizontally
- **AND** no text, image, or control overlaps another or is cut off

Examples: `<width>` = 360, 768, 1024, 1440, 1920

#### Scenario: Small screens show content in a single column
- **GIVEN** the visitor's viewport is 360 pixels wide
- **WHEN** the visitor views the Projects section
- **THEN** project cards are stacked in a single column

### Requirement: Skip to main content
The page SHALL provide a "Skip to main content" link as the first focusable
element. It SHALL be visually hidden until it receives keyboard focus.

#### Scenario: Keyboard visitor skips the navigation
- **GIVEN** a keyboard visitor has just loaded the page
- **WHEN** the visitor presses Tab once
- **THEN** a visible "Skip to main content" link has focus
- **WHEN** the visitor activates it
- **THEN** focus moves to the main region, past the header navigation

### Requirement: Message when JavaScript is unavailable
The page SHALL show a short message explaining that the site needs JavaScript
when JavaScript is disabled.

#### Scenario: Visitor has JavaScript disabled
- **GIVEN** a visitor's browser has JavaScript disabled
- **WHEN** the visitor opens the portfolio page
- **THEN** a message explains that JavaScript is required to view the site
