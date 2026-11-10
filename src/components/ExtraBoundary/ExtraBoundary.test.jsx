import { lazy, Suspense } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ExtraBoundary from './ExtraBoundary.jsx';

function Broken() {
  throw new Error('render failed');
}

describe('ExtraBoundary', () => {
  // React logs caught errors; keep the test output readable.
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows its content when nothing goes wrong', () => {
    render(
      <ExtraBoundary>
        <p>Menu</p>
      </ExtraBoundary>,
    );

    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  it('renders nothing, and leaves the page usable, when its content fails', () => {
    render(
      <main>
        <button type="button">Open menu</button>
        <ExtraBoundary>
          <Broken />
        </ExtraBoundary>
      </main>,
    );

    expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument();
    expect(screen.getByRole('main').childElementCount).toBe(1);
  });

  it('renders nothing when the extra’s code cannot be downloaded', async () => {
    const Unloadable = lazy(() => Promise.reject(new Error('offline')));
    render(
      <main>
        <button type="button">Open menu</button>
        <ExtraBoundary>
          <Suspense fallback={null}>
            <Unloadable />
          </Suspense>
        </ExtraBoundary>
      </main>,
    );

    await vi.waitFor(() => expect(console.error).toHaveBeenCalled());
    expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument();
    expect(screen.getByRole('main').childElementCount).toBe(1);
  });
});
