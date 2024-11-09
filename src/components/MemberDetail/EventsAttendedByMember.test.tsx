import React from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { EVENT_DETAILS } from 'GraphQl/Queries/Queries';
import EventsAttendedByMember from './EventsAttendedByMember';
import { BrowserRouter } from 'react-router-dom';

const mockEventData = {
  event: {
    _id: 'event123',
    title: 'Test Event',
    description: 'Test Description',
    startDate: '2023-01-01',
    endDate: '2023-01-02',
    startTime: '09:00',
    endTime: '17:00',
    allDay: false,
    location: 'Test Location',
    recurring: true,
    baseRecurringEvent: { _id: 'base123' },
    organization: {
      _id: 'org123',
      members: [
        { _id: 'user1', firstName: 'John', lastName: 'Doe' },
        { _id: 'user2', firstName: 'Jane', lastName: 'Smith' },
      ],
    },
    attendees: [
      { _id: 'user1', gender: 'MALE' },
      { _id: 'user2', gender: 'FEMALE' },
    ],
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
});
