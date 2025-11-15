/**
 * Unit tests for ProfileOrganizations component
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import ProfileOrganizations from './ProfileOrganizations';
import type { InterfaceUserData } from '../types';
import { USER_DETAILS } from 'GraphQl/Queries/Queries';

describe('ProfileOrganizations Component', () => {
  const mockUser: InterfaceUserData = {
    id: '123',
    name: 'John Doe',
    emailAddress: 'john@example.com',
    createdAt: '2023-01-01T00:00:00Z',
  };

  test('renders loading state initially', () => {
    const mocks = [
      {
        request: {
          query: USER_DETAILS,
          variables: { input: { id: '123' } },
        },
        result: {
          data: {
            user: {
              id: '123',
              organizationsWhereMember: {
                edges: [],
              },
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ProfileOrganizations user={mockUser} isOwnProfile={true} />
      </MockedProvider>,
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('renders empty state when no organizations', async () => {
    const mocks = [
      {
        request: {
          query: USER_DETAILS,
          variables: { input: { id: '123' } },
        },
        result: {
          data: {
            user: {
              id: '123',
              organizationsWhereMember: {
                edges: [],
              },
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ProfileOrganizations user={mockUser} isOwnProfile={true} />
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('No Organizations')).toBeInTheDocument();
    });
  });

  test('renders organizations when data is available', async () => {
    const mocks = [
      {
        request: {
          query: USER_DETAILS,
          variables: { input: { id: '123' } },
        },
        result: {
          data: {
            user: {
              id: '123',
              organizationsWhereMember: {
                edges: [
                  { node: { id: 'org1', name: 'Organization 1' } },
                  { node: { id: 'org2', name: 'Organization 2' } },
                ],
              },
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ProfileOrganizations user={mockUser} isOwnProfile={true} />
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('Member Organizations')).toBeInTheDocument();
      expect(screen.getByText('2 organizations')).toBeInTheDocument();
      expect(screen.getByText('Organization 1')).toBeInTheDocument();
      expect(screen.getByText('Organization 2')).toBeInTheDocument();
    });
  });

  test('renders error state on query failure', async () => {
    const mocks = [
      {
        request: {
          query: USER_DETAILS,
          variables: { input: { id: '123' } },
        },
        error: new Error('Failed to fetch organizations'),
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ProfileOrganizations user={mockUser} isOwnProfile={true} />
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByText('Failed to load organizations'),
      ).toBeInTheDocument();
    });
  });
});
