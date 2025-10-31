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
      name: 'John Doe',
      emailAddress: 'john@example.com',
      natalSex: 'Male',
      createdAt: '2023-01-01',
      birthDate: '1990-01-01',
      educationGrade: 'A',
      employmentStatus: 'Employed',
      maritalStatus: 'Single',
      addressLine1: '123 Street',
      addressLine2: '',
      state: 'State',
      countryCode: 'Country',
      avatarURL: 'image.jpg',
      city: 'City',
      description: 'Description',
      homePhoneNumber: '1234567890',
      mobilePhoneNumber: '1234567890',
      workPhoneNumber: '1234567890',
      naturalLanguageCode: 'en',
      postalCode: '12345',
      eventsAttended: [{ id: '1' }, { id: '2' }],
    },
    t: mockT,
  };

  const mockUserWithoutEvents = {
    userDetails: {
      name: 'Jane Doe',
      emailAddress: 'jane@example.com',
      natalSex: 'Female',
      createdAt: '2023-01-01',
      birthDate: '1990-01-01',
      educationGrade: 'B',
      employmentStatus: 'Unemployed',
      maritalStatus: 'Single',
      addressLine1: '456 Street',
      addressLine2: '',
      state: 'State',
      countryCode: 'Country',
      avatarURL: 'image.jpg',
      city: 'City',
      description: 'Description',
      homePhoneNumber: '0987654321',
      mobilePhoneNumber: '0987654321',
      workPhoneNumber: '0987654321',
      naturalLanguageCode: 'en',
      postalCode: '12345',
      eventsAttended: [],
    },
    t: mockT,
  };

  it('renders the component with events', () => {
    render(
      <MockedProvider mocks={mocks}>
        <EventsAttendedByUser {...mockUserWithEvents} />
      </MockedProvider>,
    );

    expect(screen.getByText('eventAttended')).toBeInTheDocument();
    expect(screen.getAllByTestId('usereventsCard')).toHaveLength(2);
  });

  it('renders no events message when user has no events', () => {
    render(
      <MockedProvider mocks={mocks}>
        <EventsAttendedByUser {...mockUserWithoutEvents} />
      </MockedProvider>,
    );

    expect(screen.getByText('noeventsAttended')).toBeInTheDocument();
    expect(screen.queryByTestId('usereventsCard')).not.toBeInTheDocument();
  });
});
