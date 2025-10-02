import { EVENT_ATTENDEES, EVENT_DETAILS } from 'GraphQl/Queries/Queries';

export const MOCKEVENT = {
  id: 'event123',
  name: 'Test Event',
  description: 'This is a test event description',
  startAt: '2030-05-01T09:00:00Z',
  endAt: '2030-05-02T17:00:00Z',
  allDay: false,
  location: 'Test Location',
  isPublic: true,
  isRegisterable: true,
  createdAt: '2030-04-01T00:00:00Z',
  updatedAt: '2030-04-01T00:00:00Z',
  creator: {
    id: 'creator1',
    name: 'John Creator',
    emailAddress: 'creator@example.com',
  },
  updater: {
    id: 'updater1',
    name: 'Jane Updater',
    emailAddress: 'updater@example.com',
  },
  organization: {
    id: 'org456',
    name: 'Test Organization',
  },
};

export const MOCKDETAIL = [
  {
    request: {
      query: EVENT_DETAILS,
      variables: { eventId: 'event123' },
    },
    result: {
      data: {
        event: MOCKEVENT,
      },
    },
  },
];

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
              createdAt: '2030-04-13T10:23:17.742Z',
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
              createdAt: '2030-04-13T10:23:17.742Z',
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
