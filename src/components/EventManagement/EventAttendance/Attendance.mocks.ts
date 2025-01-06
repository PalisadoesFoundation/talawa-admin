import { EVENT_ATTENDEES } from 'GraphQl/Queries/Queries';

export const MOCKS = [
  {
    request: {
      query: EVENT_ATTENDEES,
      variables: {}, // Removed id since it's not required based on error
    },
    result: {
      data: {
        event: {
          attendees: [
            {
              _id: '6589386a2caa9d8d69087484',
              firstName: 'Bruce',
              lastName: 'Garza',
              gender: null,
              birthDate: null,
              createdAt: '2023-04-13T10:23:17.742',
              eventsAttended: [
                {
                  __typename: 'Event',
                  _id: '660fdf7d2c1ef6c7db1649ad',
                },
                {
                  __typename: 'Event',
                  _id: '660fdd562c1ef6c7db1644f7',
                },
              ],
              __typename: 'User',
            },
            {
              _id: '6589386a2caa9d8d69087485',
              firstName: 'Jane',
              lastName: 'Smith',
              gender: null,
              birthDate: null,
              createdAt: '2023-04-13T10:23:17.742',
              eventsAttended: [
                {
                  __typename: 'Event',
                  _id: '660fdf7d2c1ef6c7db1649ad',
                },
              ],
              __typename: 'User',
            },
          ],
        },
      },
    },
  },
];

export const MOCKS_ERROR = [
  {
    request: {
      query: EVENT_ATTENDEES,
      variables: {},
    },
    error: new Error('An error occurred'),
  },
];
