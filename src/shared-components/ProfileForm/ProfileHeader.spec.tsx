/* global HTMLElement */
import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import ProfileHeader from './ProfileHeader';

// vi.mock('components/ProfileDropdown/ProfileDropdown', () => ({
//   default: () => (
//     <div data-testid="profile-dropdown">Profile Dropdown Mock</div>
//   ),
// }));

describe('ProfileHeader', () => {
  const defaultProps = {
    title: 'Test Profile Title',
  };

  it('renders without crashing', () => {
    render(<ProfileHeader {...defaultProps} />);
    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
  });

  it('displays the provided title', () => {
    render(<ProfileHeader title="Custom Profile Title" />);
    expect(screen.getByText('Custom Profile Title')).toBeInTheDocument();
  });

  // it('renders the ProfileDropdown component', () => {
  //   render(<ProfileHeader {...defaultProps} />);
  //   expect(screen.getByTestId('profile-dropdown')).toBeInTheDocument();
  // });

  it('has correct layout classes', () => {
    const { container } = render(<ProfileHeader {...defaultProps} />);
    const mainDiv = container.firstChild as HTMLElement;

    expect(mainDiv.className).toContain('d-flex');
    expect(mainDiv.className).toContain('justify-content-between');
    expect(mainDiv.className).toContain('align-items-center');
    expect(mainDiv.className).toContain('mb-4');
  });

  it('renders title in h1 tag', () => {
    render(<ProfileHeader {...defaultProps} />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading.textContent).toBe(defaultProps.title);
  });
});
