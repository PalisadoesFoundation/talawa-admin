import { EVENT_REGISTRANTS, EVENT_ATTENDEES } from 'GraphQl/Queries/Queries';

export const REGISTRANTS_MOCKS = [
  {
    request: {
      query: EVENT_REGISTRANTS,
      variables: { eventId: '660fdf7d2c1ef6c7db1649ad' },
    },
    result: {
      data: {
        getEventAttendeesByEventId: [
          {
            _id: '6589386a2caa9d8d69087484',
            userId: '6589386a2caa9d8d69087484',
            isRegistered: true,
            __typename: 'EventAttendee',
          },
          {
            _id: '6589386a2caa9d8d69087485',
            userId: '6589386a2caa9d8d69087485',
            isRegistered: true,
            __typename: 'EventAttendee',
          },
        ],
      },
    },
  },
  {
    request: {
      query: EVENT_ATTENDEES,
      variables: { id: '660fdf7d2c1ef6c7db1649ad' },
    },
    result: {
      data: {
        event: {
          attendees: [
            {
              _id: '6589386a2caa9d8d69087484',
              firstName: 'Bruce',
              lastName: 'Garza',
              createdAt: '2023-04-13T10:23:17.742Z',
              __typename: 'User',
            },
            {
              _id: '6589386a2caa9d8d69087485',
              firstName: 'Jane',
              lastName: 'Smith',
              createdAt: '2023-04-13T10:23:17.742Z',
              __typename: 'User',
            },
          ],
        },
      },
    },
  },
];

export const REGISTRANTS_MOCKS_ERROR = [
  {
    // Error mock for EVENT_REGISTRANTS query
    request: {
      query: EVENT_REGISTRANTS,
      variables: { eventId: 'event123' },
    },
    error: new Error('An error occurred while fetching registrants'),
  },
];
