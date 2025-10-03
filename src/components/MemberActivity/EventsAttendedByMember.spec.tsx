import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import EventsAttendedByMember from './EventsAttendedByMember';
import { BrowserRouter } from 'react-router';
import { EVENT_DETAILS } from 'GraphQl/Queries/Queries';
import { mocks, errorMocks, mockEventData } from './MemberActivityMocks';

describe('EventsAttendedByMember', () => {
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

  test('uses organization fallback _id when id is missing', async () => {
    const fallbackOrgMock = [
      {
        request: {
          query: EVENT_DETAILS,
          variables: { eventId: 'event123' },
        },
        result: {
          data: {
            event: {
              ...mockEventData.event,
              organization: {
                ...mockEventData.event.organization,
                id: undefined,
                _id: 'orgFallback',
              },
            },
          },
        },
      },
    ];

    render(
      <BrowserRouter>
        <MockedProvider mocks={fallbackOrgMock}>
          <EventsAttendedByMember eventsId="event123" />
        </MockedProvider>
      </BrowserRouter>,
    );

    const card = await screen.findByTestId('EventsAttendedCard');
    const link = within(card).getByRole('link');
    expect(link).toHaveAttribute('href', '/event/orgFallback/event123');
  });
});
