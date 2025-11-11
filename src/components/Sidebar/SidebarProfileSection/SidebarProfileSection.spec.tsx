/**
 * Unit tests for SidebarProfileSection component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import SidebarProfileSection from './SidebarProfileSection';

vi.mock('components/ProfileCard/ProfileCard', () => ({
  default: () => <div data-testid="profile-card">Profile Card</div>,
}));

vi.mock('components/SignOut/SignOut', () => ({
  default: ({ hideDrawer }: { hideDrawer: boolean }) => (
    <div data-testid="sign-out">
      Sign Out {hideDrawer ? 'Hidden' : 'Visible'}
    </div>
  ),
}));

describe('SidebarProfileSection Component', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should render ProfileCard and SignOut when expanded', () => {
    renderWithRouter(<SidebarProfileSection hideDrawer={false} />);

    expect(screen.getByTestId('profile-card')).toBeInTheDocument();
    expect(screen.getByTestId('sign-out')).toBeInTheDocument();
    expect(screen.getByText(/Visible/)).toBeInTheDocument();
  });

  it('should hide ProfileCard when collapsed', () => {
    renderWithRouter(<SidebarProfileSection hideDrawer={true} />);

    // ProfileCard should not be rendered when collapsed
    const profileCard = screen.queryByTestId('profile-card');
    expect(profileCard).not.toBeInTheDocument();
  });

  it('should pass hideDrawer prop to SignOut component', () => {
    renderWithRouter(<SidebarProfileSection hideDrawer={true} />);

    expect(screen.getByText(/Hidden/)).toBeInTheDocument();
  });

  it('should render with correct structure', () => {
    renderWithRouter(<SidebarProfileSection hideDrawer={false} />);

    // Check that both ProfileCard and SignOut are rendered
    expect(screen.getByTestId('profile-card')).toBeInTheDocument();
    expect(screen.getByTestId('sign-out')).toBeInTheDocument();
  });
});
