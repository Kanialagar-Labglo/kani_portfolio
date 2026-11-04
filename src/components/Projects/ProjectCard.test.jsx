import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import ProjectCard from './ProjectCard.jsx';

const project = {
  title: 'Weather Dashboard',
  description: 'Shows the forecast.',
  technologies: ['React', 'Vite'],
  sourceUrl: 'https://github.com/alex/weather',
  liveUrl: 'https://weather.example.com',
  screenshot: { src: 'images/weather.png', alt: 'Forecast for the week' },
};

describe('ProjectCard', () => {
  it('shows the title as a level-three heading in an article', () => {
    render(<ProjectCard project={project} />);

    const card = screen.getByRole('article');
    expect(within(card).getByRole('heading', { level: 3 })).toHaveTextContent('Weather Dashboard');
  });

  it('shows the description', () => {
    render(<ProjectCard project={project} />);

    expect(screen.getByText('Shows the forecast.')).toBeInTheDocument();
  });

  it('lists the technologies as labels', () => {
    render(<ProjectCard project={project} />);

    const list = screen.getByRole('list', { name: 'Technologies' });
    expect(
      within(list)
        .getAllByRole('listitem')
        .map((item) => item.textContent),
    ).toEqual(['React', 'Vite']);
  });

  it('opens the source code in a new tab without access to the portfolio', () => {
    render(<ProjectCard project={project} />);

    const link = screen.getByRole('link', { name: 'Source code for Weather Dashboard' });
    expect(link).toHaveAttribute('href', 'https://github.com/alex/weather');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('opens the live demo in a new tab', () => {
    render(<ProjectCard project={project} />);

    const link = screen.getByRole('link', { name: 'Live demo of Weather Dashboard' });
    expect(link).toHaveAttribute('href', 'https://weather.example.com');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('shows no live-demo link when none is provided', () => {
    render(<ProjectCard project={{ ...project, liveUrl: null }} />);

    expect(screen.queryByRole('link', { name: /Live demo/ })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Source code/ })).toBeInTheDocument();
  });

  it('shows the screenshot with its description and loads it lazily', () => {
    render(<ProjectCard project={project} />);

    const image = screen.getByRole('img', { name: 'Forecast for the week' });
    expect(image).toHaveAttribute('loading', 'lazy');
  });

  it('shows no image when there is no screenshot', () => {
    render(<ProjectCard project={{ ...project, screenshot: null }} />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
