import { describe, expect, it, vi } from 'vitest';
import { isResumeAvailable, resumeFileName } from './resume.js';

function response(status, contentType) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: new Headers(contentType ? { 'Content-Type': contentType } : {}),
  };
}

describe('resumeFileName', () => {
  it.each([
    ['Alex Doe', 'Alex-Doe-Resume.pdf'],
    ['  Mary   Jane  Watson ', 'Mary-Jane-Watson-Resume.pdf'],
    ['José Núñez', 'Jose-Nunez-Resume.pdf'],
    ["Sam O'Brien", 'Sam-OBrien-Resume.pdf'],
  ])('builds a file name from "%s"', (name, expected) => {
    expect(resumeFileName(name)).toBe(expected);
  });
});

describe('isResumeAvailable', () => {
  it('accepts an OK response that is a PDF', async () => {
    const fetchFile = vi.fn().mockResolvedValue(response(200, 'application/pdf'));

    await expect(isResumeAvailable('/resume.pdf', fetchFile)).resolves.toBe(true);
  });

  it('checks with a HEAD request first', async () => {
    const fetchFile = vi.fn().mockResolvedValue(response(200, 'application/pdf'));

    await isResumeAvailable('/resume.pdf', fetchFile);

    expect(fetchFile).toHaveBeenCalledWith(
      '/resume.pdf',
      expect.objectContaining({ method: 'HEAD' }),
    );
  });

  it('rejects a missing file', async () => {
    const fetchFile = vi.fn().mockResolvedValue(response(404, 'text/html'));

    await expect(isResumeAvailable('/resume.pdf', fetchFile)).resolves.toBe(false);
  });

  it('rejects a web page served in place of the PDF', async () => {
    const fetchFile = vi.fn().mockResolvedValue(response(200, 'text/html; charset=utf-8'));

    await expect(isResumeAvailable('/resume.pdf', fetchFile)).resolves.toBe(false);
  });

  it('falls back to GET when the host does not allow HEAD', async () => {
    const fetchFile = vi
      .fn()
      .mockResolvedValueOnce(response(405))
      .mockResolvedValueOnce(response(200, 'application/pdf'));

    await expect(isResumeAvailable('/resume.pdf', fetchFile)).resolves.toBe(true);
    expect(fetchFile).toHaveBeenLastCalledWith(
      '/resume.pdf',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('rejects when the request fails', async () => {
    const fetchFile = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));

    await expect(isResumeAvailable('/resume.pdf', fetchFile)).resolves.toBe(false);
  });
});
