import React from 'react';
import { render, screen } from '@testing-library/react';
import { EventsAttendedByUser } from './EventsAttendedByUser';
import { MockedProvider } from '@apollo/client/testing';
import { EVENT_DETAILS } from 'GraphQl/Queries/Queries';

/**
 * Unit tests for EventsAttendedByUser component:
 *
 * 1. **Rendering with events**: Verifies that the component renders properly when the user has attended events.
 *    - It checks for the presence of a title ('eventAttended') and ensures the correct number of event cards are rendered (2 events in this case).
 * 2. **Rendering without events**: Ensures that when the user has not attended any events, a message indicating no events attended is displayed.
 *    - It checks for the presence of a 'noeventsAttended' message and ensures no event cards are rendered.
 *
 * Mock GraphQL queries (using `MockedProvider`) simulate the fetching of event details.
 * The tests check the proper handling of different user event attendance scenarios.
 */

const mockT = (key: string, params?: Record<string, string>): string => {
  if (params) {
    return Object.entries(params).reduce(
      (acc, [key, value]) => acc.replace(`{{${key}}}`, value),
      key,
    );
  }
  return key;
};

const mocks = [
  {
    request: {
      query: EVENT_DETAILS,
      variables: { id: '1' },
    },
    result: {
      data: {
        event: {
          _id: '1',
          title: 'Event 1',
          startDate: '2023-01-01',
          recurring: false,
          attendees: [],
          organization: { _id: 'org1' },
        },
      },
    },
  },
  {
    request: {
      query: EVENT_DETAILS,
      variables: { id: '2' },
    },
    result: {
      data: {
        event: {
          _id: '2',
          title: 'Event 2',
          startDate: '2023-01-01',
          recurring: false,
          attendees: [],
          organization: { _id: 'org1' },
        },
      },
    },
  },
];

describe('EventsAttendedByUser Component', () => {
  const mockUserWithEvents = {
    userDetails: {
      firstName: 'John',
      lastName: 'Doe',
      createdAt: '2023-01-01',
      gender: 'Male',
      email: 'john@example.com',
      phoneNumber: '1234567890',
      birthDate: '1990-01-01',
      grade: 'A',
      empStatus: 'Employed',
      maritalStatus: 'Single',
      address: '123 Street',
      state: 'State',
      country: 'Country',
      image: 'image.jpg',
      eventsAttended: [{ _id: '1' }, { _id: '2' }],
    },
    t: mockT,
  };

  const mockUserWithoutEvents = {
    userDetails: {
      firstName: 'Jane',
      lastName: 'Doe',
      createdAt: '2023-01-01',
      gender: 'Female',
      email: 'jane@example.com',
      phoneNumber: '0987654321',
      birthDate: '1990-01-01',
      grade: 'B',
      empStatus: 'Unemployed',
      maritalStatus: 'Single',
      address: '456 Street',
      state: 'State',
      country: 'Country',
      image: 'image.jpg',
      eventsAttended: [],
    },
    t: mockT,
  };

  it('renders the component with events', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <EventsAttendedByUser {...mockUserWithEvents} />
      </MockedProvider>,
    );

    expect(screen.getByText('eventAttended')).toBeInTheDocument();
    expect(screen.getAllByTestId('usereventsCard')).toHaveLength(2);
  });

  it('renders no events message when user has no events', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <EventsAttendedByUser {...mockUserWithoutEvents} />
      </MockedProvider>,
    );

    expect(screen.getByText('noeventsAttended')).toBeInTheDocument();
    expect(screen.queryByTestId('usereventsCard')).not.toBeInTheDocument();
  });
});
