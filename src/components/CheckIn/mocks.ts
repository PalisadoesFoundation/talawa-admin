import { EVENT_CHECKINS } from 'GraphQl/Queries/Queries';
import { AttendeeQueryResponseInterface } from './types';

const checkInQueryData: AttendeeQueryResponseInterface = {
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
