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

  test('renders placeholder empty state with all required messages', () => {
    render(<ProfileOrganizations user={mockUser} isOwnProfile={true} />);

    expect(screen.getByText('User Organizations')).toBeInTheDocument();
    expect(
      screen.getByText(/This feature is currently under development/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /The backend API for fetching user organizations does not exist yet/i,
      ),
    ).toBeInTheDocument();
  });
});
