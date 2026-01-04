import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import EventsAttendedByMember from './EventsAttendedByMember';
import { BrowserRouter } from 'react-router';
import { EVENT_DETAILS_BASIC } from 'GraphQl/Queries/Queries';
import { mocks, errorMocks } from './MemberActivityMocks';

describe('EventsAttendedByMember', () => {
  test('renders loading state initially', () => {
    render(
      <BrowserRouter>
        <MockedProvider mocks={mocks}>
          <EventsAttendedByMember eventsId="event123" />
        </MockedProvider>
      </BrowserRouter>,
    );

    // LoadingState uses data-testid="loading-state" by default
    expect(screen.getByTestId('loading-state')).toBeInTheDocument();
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
              startAt: dayjs.utc().add(4, 'year').toISOString(), // Using startAt instead of startDate
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
});
