import React from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import EventsAttendedByMember from './EventsAttendedByMember';
import { BrowserRouter } from 'react-router';
import { EVENT_DETAILS_BASIC } from 'GraphQl/Queries/Queries';
import { mocks, errorMocks } from './MemberActivityMocks';
import { vi } from 'vitest';

const mockIsInviteOnlyEnabled = vi.hoisted(() => vi.fn(() => false));

vi.mock('utils/featureFlags', () => ({
  isInviteOnlyEnabled: mockIsInviteOnlyEnabled,
}));

describe('EventsAttendedByMember', () => {
  beforeEach(() => {
    mockIsInviteOnlyEnabled.mockReturnValue(false);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders loading state initially', () => {
    render(
      <BrowserRouter>
        <MockedProvider mocks={mocks}>
          <EventsAttendedByMember eventsId="event123" />
        </MockedProvider>
      </BrowserRouter>,
    );

    expect(screen.getByTestId('loading')).toBeInTheDocument();
    expect(screen.getByText('Loading event details...')).toBeInTheDocument();
  });

  test('renders error state when query fails', async () => {
    render(
      <BrowserRouter>
        <MockedProvider mocks={errorMocks}>
          <EventsAttendedByMember eventsId="event123" />
        </MockedProvider>
      </BrowserRouter>,
    );

    const errorMessage = await screen.findByTestId('error');
    expect(errorMessage).toBeInTheDocument();
    expect(
      screen.getByText('Unable to load event details. Please try again later.'),
    ).toBeInTheDocument();
  });

  test('renders event card with correct data when query succeeds', async () => {
    render(
      <BrowserRouter>
        <MockedProvider mocks={mocks}>
          <EventsAttendedByMember eventsId="event123" />
        </MockedProvider>
      </BrowserRouter>,
    );

    await screen.findByTestId('EventsAttendedCard');

    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(screen.getByText('Test Location')).toBeInTheDocument();
  });

  test('renders event card with fallback fields when legacy schema is used', async () => {
    const fallbackMocks = [
      {
        request: {
          query: EVENT_DETAILS_BASIC,
          variables: { eventId: 'event123' },
        },
        result: {
          data: {
            event: {
              id: 'event123', // Using id instead of _id
              name: 'Fallback Event', // Using name instead of title
              startAt: '2030-01-01T09:00:00.000Z', // Using startAt instead of startDate
              location: 'Fallback Location',
              organization: {
                id: 'org123', // Using id instead of _id
              },
            },
          },
        },
      },
    ];

    render(
      <BrowserRouter>
        <MockedProvider mocks={fallbackMocks}>
          <EventsAttendedByMember eventsId="event123" />
        </MockedProvider>
      </BrowserRouter>,
    );

    await screen.findByTestId('EventsAttendedCard');

    expect(screen.getByText('Fallback Event')).toBeInTheDocument();
    expect(screen.getByText('Fallback Location')).toBeInTheDocument();
  });

  test('renders event correctly when feature flag is enabled', async () => {
    mockIsInviteOnlyEnabled.mockReturnValue(true);

    // Note: EVENT_DETAILS_BASIC doesn't include isInviteOnly field,
    // so this test verifies the component works when the flag is enabled
    // but the query doesn't request invite-only data
    const featureFlagEnabledMocks = [
      {
        request: {
          query: EVENT_DETAILS_BASIC,
          variables: { eventId: 'event123' },
        },
        result: {
          data: {
            event: {
              id: 'event123',
              name: 'Test Event with Flag Enabled',
              startAt: '2030-01-01T09:00:00.000Z',
              location: 'Test Location',
              organization: {
                id: 'org123',
                name: 'Test Organization',
              },
            },
          },
        },
      },
    ];

    render(
      <BrowserRouter>
        <MockedProvider mocks={featureFlagEnabledMocks}>
          <EventsAttendedByMember eventsId="event123" />
        </MockedProvider>
      </BrowserRouter>,
    );

    await screen.findByTestId('EventsAttendedCard');
    expect(
      screen.getByText('Test Event with Flag Enabled'),
    ).toBeInTheDocument();
    expect(screen.getByText('Test Location')).toBeInTheDocument();
  });
});
