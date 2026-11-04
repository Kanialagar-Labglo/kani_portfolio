import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useResumeDownload } from './useResumeDownload.js';

const BASE = import.meta.env.BASE_URL;

function stubFetch(status, contentType) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: status >= 200 && status < 300,
      status,
      headers: new Headers({ 'Content-Type': contentType }),
    }),
  );
}

const fakeEvent = () => ({ preventDefault: vi.fn() });

describe('useResumeDownload', () => {
  let clickedAnchors;

  beforeEach(() => {
    clickedAnchors = [];
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function click() {
      clickedAnchors.push({ href: this.getAttribute('href'), download: this.download });
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('offers nothing when no résumé is configured', () => {
    const { result } = renderHook(() =>
      useResumeDownload({ resumePath: null, ownerName: 'Alex Doe', onUnavailable: vi.fn() }),
    );

    expect(result.current).toBeNull();
  });

  it('points at the résumé under the site base path with a friendly file name', () => {
    const { result } = renderHook(() =>
      useResumeDownload({
        resumePath: 'resume.pdf',
        ownerName: 'Alex Doe',
        onUnavailable: vi.fn(),
      }),
    );

    expect(result.current.href).toBe(`${BASE}resume.pdf`);
    expect(result.current.fileName).toBe('Alex-Doe-Resume.pdf');
  });

  it('downloads the PDF when it is available', async () => {
    stubFetch(200, 'application/pdf');
    const onUnavailable = vi.fn();
    const { result } = renderHook(() =>
      useResumeDownload({ resumePath: 'resume.pdf', ownerName: 'Alex Doe', onUnavailable }),
    );

    await act(() => result.current.startDownload(fakeEvent()));

    expect(clickedAnchors).toEqual([
      { href: `${BASE}resume.pdf`, download: 'Alex-Doe-Resume.pdf' },
    ]);
    expect(onUnavailable).not.toHaveBeenCalled();
  });

  it('reports the résumé as unavailable instead of downloading', async () => {
    stubFetch(404, 'text/html');
    const onUnavailable = vi.fn();
    const { result } = renderHook(() =>
      useResumeDownload({ resumePath: 'resume.pdf', ownerName: 'Alex Doe', onUnavailable }),
    );

    await act(() => result.current.startDownload(fakeEvent()));

    expect(clickedAnchors).toEqual([]);
    expect(onUnavailable).toHaveBeenCalledTimes(1);
  });

  it("stops the link's own navigation while it checks the file", async () => {
    stubFetch(200, 'application/pdf');
    const event = fakeEvent();
    const { result } = renderHook(() =>
      useResumeDownload({
        resumePath: 'resume.pdf',
        ownerName: 'Alex Doe',
        onUnavailable: vi.fn(),
      }),
    );

    await act(() => result.current.startDownload(event));

    expect(event.preventDefault).toHaveBeenCalled();
  });
});
