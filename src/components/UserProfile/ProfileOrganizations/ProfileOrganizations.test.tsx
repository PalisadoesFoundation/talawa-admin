/**
 * Unit tests for ProfileOrganizations component
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import ProfileOrganizations from './ProfileOrganizations';
import type { InterfaceUserData } from '../types';

describe('ProfileOrganizations Component', () => {
  const mockUser: InterfaceUserData = {
    id: '123',
    name: 'John Doe',
    emailAddress: 'john@example.com',
    createdAt: '2023-01-01T00:00:00Z',
  };

  test('renders empty state with user organizations heading', () => {
    render(<ProfileOrganizations user={mockUser} isOwnProfile={true} />);

    expect(screen.getByText('User Organizations')).toBeInTheDocument();
  });

  test('renders under development message', () => {
    render(<ProfileOrganizations user={mockUser} isOwnProfile={true} />);

    expect(
      screen.getByText(/This feature is currently under development/i),
    ).toBeInTheDocument();
  });

  test('shows message about backend API not existing', () => {
    render(<ProfileOrganizations user={mockUser} isOwnProfile={true} />);

    expect(
      screen.getByText(
        /The backend API for fetching user organizations does not exist yet/i,
      ),
    ).toBeInTheDocument();
  });
});
