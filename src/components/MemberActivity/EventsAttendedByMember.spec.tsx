import React from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import EventsAttendedByMember from './EventsAttendedByMember';
import { BrowserRouter } from 'react-router';
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
