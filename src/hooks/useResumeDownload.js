import { useCallback, useMemo } from 'react';
import { isResumeAvailable, resumeFileName } from '../lib/resume.js';

function saveFile(href, fileName) {
  const anchor = document.createElement('a');
  anchor.setAttribute('href', href);
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

/**
 * Download details for the résumé, or null when none is configured.
 * startDownload checks the file first and calls onUnavailable instead of saving a broken file.
 * @param {{ resumePath: string | null, ownerName: string, onUnavailable: () => void }} options
 */
export function useResumeDownload({ resumePath, ownerName, onUnavailable }) {
  const href = resumePath ? `${import.meta.env.BASE_URL}${resumePath}` : null;
  const fileName = resumeFileName(ownerName);

  const startDownload = useCallback(
    async (event) => {
      event.preventDefault();
      if (await isResumeAvailable(href)) {
        saveFile(href, fileName);
      } else {
        onUnavailable();
      }
    },
    [href, fileName, onUnavailable],
  );

  return useMemo(
    () => (href ? { href, fileName, startDownload } : null),
    [href, fileName, startDownload],
  );
}
