/**
 * Unit tests for ProfileEvents component
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import ProfileEvents from './ProfileEvents';
import type { InterfaceUserData } from '../types';

describe('ProfileEvents Component', () => {
  const mockUser: InterfaceUserData = {
    id: '123',
    name: 'John Doe',
    emailAddress: 'john@example.com',
    createdAt: '2023-01-01T00:00:00Z',
  };

  const mockOnSave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders empty state with user events heading', () => {
    render(
      <ProfileEvents
        user={mockUser}
        isOwnProfile={true}
        isEditing={false}
        onSave={mockOnSave}
      />,
    );

    expect(screen.getByText('User Events')).toBeInTheDocument();
  });

  test('renders under development message', () => {
    render(
      <ProfileEvents
        user={mockUser}
        isOwnProfile={true}
        isEditing={false}
        onSave={mockOnSave}
      />,
    );

    expect(
      screen.getByText(/This feature is currently under development/i),
    ).toBeInTheDocument();
  });

  test('shows message about backend API not existing', () => {
    render(
      <ProfileEvents
        user={mockUser}
        isOwnProfile={true}
        isEditing={false}
        onSave={mockOnSave}
      />,
    );

    expect(
      screen.getByText(
        /The backend API for fetching user events does not exist yet/i,
      ),
    ).toBeInTheDocument();
  });
});
