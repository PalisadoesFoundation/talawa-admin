import { EVENT_CHECKINS, EVENT_DETAILS } from 'GraphQl/Queries/Queries';
import { MARK_CHECKIN } from 'GraphQl/Mutations/mutations';
import type { InterfaceAttendeeQueryResponse } from 'types/CheckIn/interface';

const checkInQueryData: InterfaceAttendeeQueryResponse = {
  event: {
    id: 'event123',
    attendeesCheckInStatus: [
      {
        id: 'eventAttendee1',
        user: {
          id: 'user1',
          name: 'John Doe',
          emailAddress: 'john@example.com',
        },
        checkIn: null,
      },
      {
        id: 'eventAttendee2',
        user: {
          id: 'user2',
          name: 'John2 Doe2',
          emailAddress: 'john2@example.com',
        },
        checkIn: {
          id: 'checkin1',
          time: '08:00:00',
          feedbackSubmitted: false,
        },
      },
    ],
  },
};

export const checkInQueryMock = [
  {
    request: {
      query: EVENT_DETAILS,
      variables: { eventId: 'event123' },
    },
    result: {
      data: {
        event: {
          id: 'event123',
          recurrenceRule: null,
        },
      },
    },
  },
  {
    request: {
      query: EVENT_CHECKINS,
      variables: { eventId: 'event123' },
    },
    result: {
      data: checkInQueryData,
    },
  },
];

export const checkInMutationSuccess = [
  {
    request: {
      query: MARK_CHECKIN,
      variables: {
        userId: 'user123',
        eventId: 'event123',
      },
    },
    result: {
      data: {
        checkIn: {
          _id: '123',
        },
      },
    },
  },
];

export const checkInMutationUnsuccess = [
  {
    request: {
      query: MARK_CHECKIN,
      variables: {
        userId: 'user123',
        eventId: 'event123',
      },
    },
    error: new Error('Oops'),
  },
];
