import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Projects from './Projects.jsx';

describe('Projects', () => {
  it('shows one card per project in data order', () => {
    render(
      <Projects
        projects={[
          { title: 'First', description: 'One.', technologies: [] },
          { title: 'Second', description: 'Two.', technologies: [] },
        ]}
      />,
    );

    expect(
      screen.getAllByRole('article').map((card) => card.querySelector('h3').textContent),
    ).toEqual(['First', 'Second']);
  });
});
