/**
 * Unit tests for ProfileEvents component
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { vi } from 'vitest';
import ProfileEvents from './ProfileEvents';
import type { InterfaceUserData } from '../types';
import { CURRENT_USER } from 'GraphQl/Queries/Queries';

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

  test('renders loading state initially', () => {
    const mocks = [
      {
        request: {
          query: CURRENT_USER,
        },
        result: {
          data: {
            currentUser: {
              id: '123',
              eventsAttended: [],
            },
          },
        },
        delay: 100,
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ProfileEvents
          user={mockUser}
          isOwnProfile={true}
          isEditing={false}
          onSave={mockOnSave}
        />
      </MockedProvider>,
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders empty state when no events attended', async () => {
    const mocks = [
      {
        request: {
          query: CURRENT_USER,
        },
        result: {
          data: {
            currentUser: {
              id: '123',
              eventsAttended: [],
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ProfileEvents
          user={mockUser}
          isOwnProfile={true}
          isEditing={false}
          onSave={mockOnSave}
        />
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('No Events Attended')).toBeInTheDocument();
    });
  });

  test('renders events when data is available', async () => {
    const mocks = [
      {
        request: {
          query: CURRENT_USER,
        },
        result: {
          data: {
            currentUser: {
              id: '123',
              eventsAttended: [{ id: 'event1' }, { id: 'event2' }],
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ProfileEvents
          user={mockUser}
          isOwnProfile={true}
          isEditing={false}
          onSave={mockOnSave}
        />
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('Events Attended')).toBeInTheDocument();
      expect(screen.getByText('2 events')).toBeInTheDocument();
    });
  });

  test('renders error state on query failure', async () => {
    const mocks = [
      {
        request: {
          query: CURRENT_USER,
        },
        error: new Error('Failed to fetch events'),
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ProfileEvents
          user={mockUser}
          isOwnProfile={true}
          isEditing={false}
          onSave={mockOnSave}
        />
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to load events')).toBeInTheDocument();
    });
  });

  test('shows unavailable message when not own profile', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <ProfileEvents
          user={mockUser}
          isOwnProfile={false}
          isEditing={false}
          onSave={mockOnSave}
        />
      </MockedProvider>,
    );

    // Should show unavailable message when not own profile (admin view)
    expect(
      screen.getByTestId('events-unavailable-message'),
    ).toBeInTheDocument();
  });
});
