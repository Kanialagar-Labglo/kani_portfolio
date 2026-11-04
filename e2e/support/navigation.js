// Helpers for reaching the section navigation on any screen size.

/**
 * The menu button shown on small screens.
 * @param {import('@playwright/test').Page} page
 */
export function menuButton(page) {
  return page.getByRole('button', { name: 'Open menu' });
}

/**
 * The open mobile menu.
 * @param {import('@playwright/test').Page} page
 */
export function menuDialog(page) {
  return page.getByRole('dialog', { name: 'Menu' });
}

/**
 * Where the section links currently live: the open mobile menu on small screens,
 * the header navigation otherwise. Opens the menu when needed.
 * @param {import('@playwright/test').Page} page
 */
export async function sectionLinks(page) {
  if (await menuButton(page).isVisible()) {
    await menuButton(page).click();
    return menuDialog(page);
  }
  return page.getByRole('navigation', { name: 'Primary' });
}

/**
 * Choose a section in the navigation, as a visitor would on this screen size.
 * @param {import('@playwright/test').Page} page
 * @param {string} name
 */
export async function goToSection(page, name) {
  const links = await sectionLinks(page);
  await links.getByRole('link', { name, exact: true }).click();
}

/**
 * Shrink the viewport height so the short placeholder page can scroll.
 * @param {import('@playwright/test').Page} page
 * @param {number} [height]
 */
export async function useShortViewport(page, height = 400) {
  const width = page.viewportSize()?.width ?? 1280;
  await page.setViewportSize({ width, height });
}

/**
 * Scroll so the given section starts at the top of the viewport, without using navigation.
 * @param {import('@playwright/test').Page} page
 * @param {string} id
 */
export async function scrollSectionToTop(page, id) {
  await page.evaluate((sectionId) => {
    document.getElementById(sectionId).scrollIntoView({ block: 'start', behavior: 'instant' });
  }, id);
}
