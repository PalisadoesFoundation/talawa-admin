import { EVENT_CHECKINS } from 'GraphQl/Queries/Queries';
import { MARK_CHECKIN } from 'GraphQl/Mutations/mutations';
import type { InterfaceAttendeeQueryResponse } from './types';

const checkInQueryData: InterfaceAttendeeQueryResponse = {
  event: {
    _id: 'event123',
    attendeesCheckInStatus: [
      {
        _id: 'eventAttendee1',
        user: {
          _id: 'user1',
          firstName: 'John',
          lastName: 'Doe',
        },
        checkIn: null,
      },
      {
        _id: 'eventAttendee2',
        user: {
          _id: 'user2',
          firstName: 'John2',
          lastName: 'Doe2',
        },
        checkIn: {
          _id: 'checkin1',
          time: '08:00:00',
          allotedRoom: 'Room 1',
          allotedSeat: 'Seat 1',
        },
      },
    ],
  },
};

export const checkInQueryMock = [
  {
    request: {
      query: EVENT_CHECKINS,
      variables: { id: 'event123' },
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
        allotedSeat: '',
        allotedRoom: '',
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
        allotedSeat: '',
        allotedRoom: '',
      },
    },
    error: new Error('Oops'),
  },
];
