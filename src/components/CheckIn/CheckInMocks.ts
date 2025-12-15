import { EVENT_CHECKINS, EVENT_DETAILS } from 'GraphQl/Queries/Queries';
import { MARK_CHECKIN } from 'GraphQl/Mutations/mutations';
import type { InterfaceAttendeeQueryResponse } from 'types/CheckIn/interface';

const checkInQueryData = {
  event: {
    __typename: 'Event',
    id: 'event123',
    attendeesCheckInStatus: [
      {
        __typename: 'AttendeeCheckInStatus',
        id: 'eventAttendee1',
        user: {
          __typename: 'User',
          id: 'user1',
          name: 'John Doe',
          emailAddress: 'john@example.com',
        },
        checkInTime: null,
        checkOutTime: null,
        isCheckedIn: false,
        isCheckedOut: false,
      },
      {
        __typename: 'AttendeeCheckInStatus',
        id: 'eventAttendee2',
        user: {
          __typename: 'User',
          id: 'user2',
          name: 'John2 Doe2',
          emailAddress: 'john2@example.com',
        },
        checkInTime: '2023-01-01T08:00:00Z',
        checkOutTime: null,
        isCheckedIn: true,
        isCheckedOut: false,
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
          __typename: 'Event',
          id: 'event123',
          name: 'Test Event',
          description: 'Test Description',
          location: 'Test Location',
          allDay: false,
          isPublic: true,
          isRegisterable: true,
          startAt: '2023-01-01T10:00:00Z',
          endAt: '2023-01-01T12:00:00Z',
          createdAt: '2023-01-01T09:00:00Z',
          updatedAt: '2023-01-01T09:00:00Z',
          isRecurringEventTemplate: false,
          baseEvent: null,
          recurrenceRule: null,
          creator: {
            __typename: 'User',
            id: 'creator1',
            name: 'Creator',
            emailAddress: 'creator@example.com',
          },
          updater: {
            __typename: 'User',
            id: 'updater1',
            name: 'Updater',
            emailAddress: 'updater@example.com',
          },
          organization: {
            __typename: 'Organization',
            id: 'org1',
            name: 'Test Org',
          },
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
          id: '123',
          user: {
            id: 'user123',
          },
          checkinTime: '2023-01-01T08:00:00Z',
          checkoutTime: null,
          isCheckedIn: true,
          isCheckedOut: false,
          feedbackSubmitted: false,
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

export const checkInMutationSuccessRecurring = [
  {
    request: {
      query: MARK_CHECKIN,
      variables: {
        userId: 'user123',
        recurringEventInstanceId: 'recurring123',
      },
    },
    result: {
      data: {
        checkIn: {
          id: '123',
          user: {
            id: 'user123',
          },
          checkinTime: '2023-01-01T08:00:00Z',
          checkoutTime: null,
          isCheckedIn: true,
          isCheckedOut: false,
          feedbackSubmitted: false,
        },
      },
    },
  },
];
