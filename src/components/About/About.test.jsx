import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import About from './About.jsx';

describe('About', () => {
  it('shows the bio paragraphs in data order', () => {
    render(<About bio={['First paragraph.', 'Second paragraph.']} />);

    const region = screen.getByRole('region', { name: 'About Me' });
    expect([...region.querySelectorAll('p')].map((p) => p.textContent)).toEqual([
      'First paragraph.',
      'Second paragraph.',
    ]);
  });
});
