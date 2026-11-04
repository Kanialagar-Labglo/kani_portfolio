# seo-metadata Specification

## Purpose

Build-time search, sharing and structured-data metadata, plus robots.txt and sitemap.xml.

## Requirements

### Requirement: Metadata is present without running JavaScript
The page's metadata SHALL be present in the HTML document as delivered, so that
crawlers and link-preview services that do not run JavaScript can read it. Its
values SHALL come from the profile data and site configuration rather than being
written by hand in more than one place.

#### Scenario: Link-preview service reads the page
- **GIVEN** the site has been built with the owner's name "Alex Doe" and role "Software Developer"
- **WHEN** a service fetches the page without running JavaScript
- **THEN** the document title is "Alex Doe — Software Developer | Portfolio"
- **AND** the document declares its language as English

#### Scenario: Profile change updates metadata
- **GIVEN** the owner changes their role in the profile data to "Full-Stack Developer"
- **WHEN** the site is rebuilt
- **THEN** the document title and description reflect "Full-Stack Developer"

### Requirement: Search and sharing metadata
The page SHALL provide a meta description of 150 to 160 characters, a canonical
URL, Open Graph title, description, image, URL and type `website`, a Twitter/X
`summary_large_image` card, a favicon, and a theme colour for both light and
dark colour schemes.

#### Scenario: Link shared on a social platform shows a preview
- **GIVEN** the site URL is configured
- **WHEN** the portfolio link is shared on a platform that reads Open Graph tags
- **THEN** the preview shows the portfolio title, description, and the 1200×630 preview image

#### Scenario: Description length
- **GIVEN** the site has been built
- **WHEN** a crawler reads the meta description
- **THEN** it is between 150 and 160 characters long

### Requirement: Structured data about the owner
The page SHALL include JSON-LD structured data describing the owner as a
`Person` with name, job title, site URL, and social profile URLs.

#### Scenario: Search engine reads structured data
- **GIVEN** the profile and social data are filled in
- **WHEN** a search engine parses the page's structured data
- **THEN** it finds a Person with the owner's name, job title, and social profile links

### Requirement: Crawler files
The site SHALL publish a `robots.txt` that allows all crawlers and references
the sitemap, and a `sitemap.xml` listing the site URL.

#### Scenario: Crawler discovers the sitemap
- **GIVEN** the site URL is configured
- **WHEN** a crawler requests `/robots.txt`
- **THEN** it allows crawling and points to `/sitemap.xml`
- **AND** `/sitemap.xml` lists the configured site URL

### Requirement: Site URL is configurable
The site URL used for the canonical link, Open Graph URL, structured data, and
sitemap SHALL come from a single configuration value. When it is not set, the
build SHALL warn that these values are incomplete.

#### Scenario: Building without a site URL
- **GIVEN** the site URL is not configured
- **WHEN** the owner builds the site
- **THEN** the build completes
- **AND** it warns that canonical URL, Open Graph URL, and sitemap need the site URL
