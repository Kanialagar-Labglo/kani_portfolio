import { expect, test } from '@playwright/test';
import { profile } from '../src/data/profile.js';
import { skillGroups } from '../src/data/skills.js';
import { projects } from '../src/data/projects.js';
import { experience } from '../src/data/experience.js';
import { openPortfolio } from './support/page.js';
import { useShortViewport } from './support/navigation.js';

const region = (page, name) => page.getByRole('main').getByRole('region', { name });

test.describe('Sections appear in a fixed order', () => {
  test('sections run Hero to Contact with the footer last', async ({ page }) => {
    await openPortfolio(page);

    const ids = await page
      .locator('main > section')
      .evaluateAll((sections) => sections.map((section) => section.id));
    expect(ids).toEqual(['hero', 'about', 'skills', 'projects', 'experience', 'contact']);

    const footerIsLast = await page.evaluate(() => {
      const footer = document.querySelector('footer');
      const main = document.querySelector('main');
      return Boolean(main.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING);
    });
    expect(footerIsLast).toBe(true);
  });
});

test.describe('Hero introduces the owner', () => {
  test('hero shows the name, role headline, and tagline', async ({ page }) => {
    await openPortfolio(page);
    const hero = region(page, profile.name);

    await expect(hero.getByRole('heading', { level: 1 })).toHaveText(profile.name);
    await expect(hero.getByText(profile.role, { exact: true })).toBeVisible();
    await expect(hero.getByText(profile.tagline, { exact: true })).toBeVisible();
  });

  test('hero offers View projects and Contact actions', async ({ page }) => {
    await openPortfolio(page);
    const hero = region(page, profile.name);

    await expect(hero.getByRole('link', { name: 'View projects' })).toBeVisible();
    await expect(hero.getByRole('link', { name: 'Contact', exact: true })).toBeVisible();
  });

  test('View projects leads to the Projects section', async ({ page }) => {
    await openPortfolio(page);
    await useShortViewport(page);

    await region(page, profile.name).getByRole('link', { name: 'View projects' }).click();

    await expect(page.getByRole('heading', { level: 2, name: 'Projects' })).toBeInViewport();
  });

  test('hero shows no image when no photo is provided', async ({ page }) => {
    test.skip(Boolean(profile.photo), 'placeholder data has a photo');
    await openPortfolio(page);

    await expect(region(page, profile.name).getByRole('img')).toHaveCount(0);
  });
});

test.describe('About tells the owner story', () => {
  test('bio paragraphs are shown in data order', async ({ page }) => {
    await openPortfolio(page);

    await expect(region(page, 'About').locator('p')).toHaveText(profile.bio);
  });
});

test.describe('Skills are grouped', () => {
  test('each skill group shows its name and skills as labels', async ({ page }) => {
    await openPortfolio(page);
    const skills = region(page, 'Skills');

    for (const group of skillGroups) {
      const groupHeading = skills.getByRole('heading', { level: 3, name: group.name });
      await expect(groupHeading).toBeVisible();
      const list = skills.getByRole('list', { name: group.name });
      await expect(list.getByRole('listitem')).toHaveText(group.skills);
    }
  });

  test('no skill shows a rating or percentage', async ({ page }) => {
    await openPortfolio(page);
    const skills = region(page, 'Skills');

    await expect(skills.getByRole('progressbar')).toHaveCount(0);
    await expect(skills.getByRole('meter')).toHaveCount(0);
    await expect(skills).not.toContainText('%');
  });
});

test.describe('Projects are shown as cards', () => {
  test('each project card shows its title, description, and technologies', async ({ page }) => {
    await openPortfolio(page);
    const cards = region(page, 'Projects').getByRole('article');

    await expect(cards).toHaveCount(projects.length);
    for (const [index, project] of projects.entries()) {
      const card = cards.nth(index);
      await expect(card.getByRole('heading', { level: 3 })).toHaveText(project.title);
      await expect(card.getByText(project.description, { exact: true })).toBeVisible();
      await expect(
        card.getByRole('list', { name: 'Technologies' }).getByRole('listitem'),
      ).toHaveText(project.technologies);
    }
  });

  test('a card shows only the links that are provided', async ({ page }) => {
    await openPortfolio(page);
    const cards = region(page, 'Projects').getByRole('article');

    for (const [index, project] of projects.entries()) {
      const card = cards.nth(index);
      await expect(
        card.getByRole('link', { name: `Source code for ${project.title}` }),
      ).toHaveCount(project.sourceUrl ? 1 : 0);
      await expect(card.getByRole('link', { name: `Live demo of ${project.title}` })).toHaveCount(
        project.liveUrl ? 1 : 0,
      );
    }
  });

  test('a project link opens in a new tab and the portfolio stays open', async ({
    page,
    context,
  }) => {
    await context.route(/^https:\/\/(github\.com|example\.com)\//, (route) => route.abort());
    await openPortfolio(page);
    const project = projects.find((item) => item.sourceUrl);
    const portfolioUrl = page.url();

    const [popup] = await Promise.all([
      context.waitForEvent('page'),
      page.getByRole('link', { name: `Source code for ${project.title}` }).click(),
    ]);

    expect(popup).not.toBe(page);
    expect(page.url()).toBe(portfolioUrl);
    expect(await popup.evaluate(() => window.opener)).toBeNull();
  });
});

test.describe('Experience is a timeline', () => {
  test('roles are listed newest first with Present for the current role', async ({ page }) => {
    await openPortfolio(page);
    const entries = region(page, 'Experience')
      .getByRole('listitem')
      .filter({
        has: page.getByRole('heading', { level: 3 }),
      });
    const newestFirst = [...experience].sort((a, b) => b.start.localeCompare(a.start));

    await expect(entries.getByRole('heading', { level: 3 })).toHaveText(
      newestFirst.map((entry) => entry.role),
    );
    await expect(entries.first()).toContainText('Present');
  });

  test('each role shows its company and highlights', async ({ page }) => {
    await openPortfolio(page);
    const entries = region(page, 'Experience')
      .getByRole('listitem')
      .filter({
        has: page.getByRole('heading', { level: 3 }),
      });
    const newestFirst = [...experience].sort((a, b) => b.start.localeCompare(a.start));

    for (const [index, entry] of newestFirst.entries()) {
      await expect(entries.nth(index)).toContainText(entry.company);
      for (const highlight of entry.highlights) {
        await expect(entries.nth(index)).toContainText(highlight);
      }
    }
  });
});

test.describe('Footer', () => {
  test('footer shows the current year and the owner name', async ({ page }) => {
    await openPortfolio(page);

    await expect(page.getByRole('contentinfo')).toContainText(
      `© ${new Date().getFullYear()} ${profile.name}`,
    );
  });
});
