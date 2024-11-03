import React from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { EVENT_DETAILS } from 'GraphQl/Queries/Queries';
import EventsAttendedByMember from './EventsAttendedByMember';

const mockEventData = {
  event: {
    _id: 'event123',
    title: 'Test Event',
    startDate: '2024-03-14',
    location: 'Test Location',
    organization: {
      _id: 'org123',
    },
  },
};

const mocks = [
  {
    request: {
      query: EVENT_DETAILS,
      variables: { id: 'event123' },
    },
    result: {
      data: mockEventData,
    },
  },
];

const errorMocks = [
  {
    request: {
      query: EVENT_DETAILS,
      variables: { id: 'event123' },
    },
    error: new Error('An error occurred'),
  },
];

describe('EventsAttendedByMember', () => {
  test('renders loading state initially', () => {
    render(
      <MockedProvider mocks={mocks}>
        <EventsAttendedByMember eventsId="event123" />
      </MockedProvider>,
    );

    expect(screen.getByTestId('loading')).toBeInTheDocument();
    expect(screen.getByText('Loading event details...')).toBeInTheDocument();
  });

  test('renders error state when query fails', async () => {
    render(
      <MockedProvider mocks={errorMocks}>
        <EventsAttendedByMember eventsId="event123" />
      </MockedProvider>,
    );

    const errorMessage = await screen.findByTestId('error');
    expect(errorMessage).toBeInTheDocument();
    expect(
      screen.getByText('Unable to load event details. Please try again later.'),
    ).toBeInTheDocument();
  });

  test('renders event card with correct data when query succeeds', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <EventsAttendedByMember eventsId="event123" />
      </MockedProvider>,
    );

    await screen.findByTestId('EventsAttendedCard');

    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(screen.getByText('Test Location')).toBeInTheDocument();
  });

  test('passes correct props to EventAttendedCard', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <EventsAttendedByMember eventsId="event123" />
      </MockedProvider>,
    );

    const eventCard = await screen.findByTestId('EventsAttendedCard');
    expect(eventCard).toHaveAttribute('type', 'Event');
    expect(eventCard).toHaveAttribute('orgId', 'org123');
    expect(eventCard).toHaveAttribute('eventId', 'event123');
    expect(eventCard).toHaveAttribute('startdate', '2024-03-14');
    expect(eventCard).toHaveAttribute('title', 'Test Event');
    expect(eventCard).toHaveAttribute('location', 'Test Location');
  });
});
