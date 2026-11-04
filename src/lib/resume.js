/**
 * Friendly download name such as 'Alex-Doe-Resume.pdf', using plain ASCII letters.
 * @param {string} ownerName
 */
export function resumeFileName(ownerName) {
  const words = ownerName
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^A-Za-z0-9\s-]/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  return `${[...words, 'Resume'].join('-')}.pdf`;
}

function isPdf(response) {
  return (
    response.ok &&
    (response.headers.get('Content-Type') ?? '').toLowerCase().includes('application/pdf')
  );
}

/**
 * Check that the résumé can really be downloaded as a PDF. Static hosts often answer a
 * missing file with an HTML page, so the content type is checked as well as the status.
 * @param {string} url
 * @param {typeof fetch} [fetchFile]
 * @returns {Promise<boolean>}
 */
export async function isResumeAvailable(url, fetchFile = fetch) {
  try {
    let response = await fetchFile(url, { method: 'HEAD', cache: 'no-store' });
    if (response.status === 405 || response.status === 501) {
      response = await fetchFile(url, { method: 'GET', cache: 'no-store' });
    }
    return isPdf(response);
  } catch {
    return false;
  }
}
