import { EVENT_ATTENDEES, EVENT_DETAILS } from 'GraphQl/Queries/Queries';

export const MOCKEVENT = {
  _id: 'event123',
  title: 'Test Event',
  // Also provide current schema-compatible fields for components/queries that expect them
  name: 'Test Event',
  description: 'This is a test event description',
  startDate: '2030-05-01',
  endDate: '2030-05-02',
  // Duplicate date-time fields for newer queries expecting startAt/endAt
  startAt: '2030-05-01T09:00:00.000Z',
  endAt: '2030-05-02T17:00:00.000Z',
  startTime: '09:00:00',
  endTime: '17:00:00',
  allDay: false,
  location: 'Test Location',
  recurring: true,
  baseRecurringEvent: {
    _id: 'recurringEvent123',
  },
  organization: {
    _id: 'org456',
    members: [
      { _id: 'member1', firstName: 'John', lastName: 'Doe' },
      { _id: 'member2', firstName: 'Jane', lastName: 'Smith' },
    ],
  },
  attendees: [{ _id: 'user1' }, { _id: 'user2' }],
};

export const MOCKDETAIL = [
  {
    request: {
      query: EVENT_DETAILS,
      // Align variable name with query definition: GetEvent($eventId: String!)
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
      // EVENT_ATTENDEES($id: ID!) requires an id variable
      variables: { id: 'event123' },
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
      variables: { id: 'event123' },
    },
    error: new Error('An error occurred'),
  },
];
