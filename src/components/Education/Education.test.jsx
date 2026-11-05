import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import Education from './Education.jsx';

const education = [
  { qualification: 'B.Sc. Computer Science', institution: 'College A', year: 2021 },
  { qualification: 'MCA', institution: 'College B', year: 2024 },
];

describe('Education', () => {
  it('is a region named Education', () => {
    render(<Education education={education} />);

    expect(screen.getByRole('region', { name: 'Education' })).toBeInTheDocument();
  });

  it('lists qualifications newest first', () => {
    render(<Education education={education} />);

    expect(
      screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent),
    ).toEqual(['MCA', 'B.Sc. Computer Science']);
  });

  it('shows the institution and completion year of each qualification', () => {
    render(<Education education={education} />);

    const [newest, oldest] = screen.getAllByRole('listitem');
    expect(within(newest).getByText('College B')).toBeInTheDocument();
    expect(within(newest).getByText('2024')).toBeInTheDocument();
    expect(within(oldest).getByText('College A')).toBeInTheDocument();
    expect(within(oldest).getByText('2021')).toBeInTheDocument();
  });
});
