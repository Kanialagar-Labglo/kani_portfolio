// Helpers for checking which JavaScript the page loads, and when.

// Built-in class prefixes of the components behind antd's Drawer and notification. They appear in
// any bundle that contains that code, whatever the chunk's hashed file name.
const EXTRAS_MARKERS = { drawer: 'rc-drawer', notice: 'rc-notification' };

const isScript = (url) => new URL(url).pathname.endsWith('.js');

/**
 * Which interactive extras a script's source contains.
 * @param {string} source
 * @returns {{ drawer: boolean, notice: boolean }}
 */
export function extrasIn(source) {
  return {
    drawer: source.includes(EXTRAS_MARKERS.drawer),
    notice: source.includes(EXTRAS_MARKERS.notice),
  };
}

/**
 * Track whether the page has fired its load event. Call before opening the page.
 * @param {import('@playwright/test').Page} page
 * @returns {{ loaded: () => boolean }}
 */
function trackLoad(page) {
  let loaded = false;
  // Firefox fires load for the initial blank page too, so start over on each page navigation.
  page.on('request', (request) => {
    if (request.isNavigationRequest() && request.frame() === page.mainFrame()) {
      loaded = false;
    }
  });
  page.on('load', () => {
    loaded = true;
  });
  return { loaded: () => loaded };
}

/**
 * Record every JavaScript file the page receives, whether it was requested after the load event,
 * and which extras it contains. Call before opening the page.
 * @param {import('@playwright/test').Page} page
 */
export function recordScripts(page) {
  const load = trackLoad(page);
  const requestedAfterLoad = new WeakMap();
  const received = [];

  page.on('request', (request) => {
    requestedAfterLoad.set(request, load.loaded());
  });
  page.on('response', (response) => {
    if (!isScript(response.url())) return;
    received.push(
      response
        .text()
        .catch(() => '')
        .then((source) => ({
          url: response.url(),
          afterLoad: requestedAfterLoad.get(response.request()) ?? true,
          ...extrasIn(source),
        })),
    );
  });

  return {
    /** Scripts received so far. */
    all: () => Promise.all(received),
    /** Scripts requested before the load event. */
    beforeLoad: async () => (await Promise.all(received)).filter((script) => !script.afterLoad),
    /** Scripts requested after the load event. */
    afterLoad: async () => (await Promise.all(received)).filter((script) => script.afterLoad),
  };
}

/**
 * Hold back any script requested after the load event that contains extras code, until released.
 * Startup scripts always pass through. Call before opening the page.
 * @param {import('@playwright/test').Page} page
 */
export async function holdBackExtras(page) {
  const load = trackLoad(page);
  let held = 0;
  let release;
  const released = new Promise((resolve) => {
    release = resolve;
  });

  await page.route(
    (url) => isScript(url.href),
    async (route) => {
      const response = await route.fetch();
      const body = await response.text();
      const extras = extrasIn(body);
      if (load.loaded() && (extras.drawer || extras.notice)) {
        held += 1;
        await released;
      }
      await route.fulfill({ response, body });
    },
  );

  return {
    /** How many extras scripts are being, or were, held back. */
    held: () => held,
    release: () => release(),
  };
}
