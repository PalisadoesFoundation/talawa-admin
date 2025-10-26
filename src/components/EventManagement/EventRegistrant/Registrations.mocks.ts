import { EVENT_REGISTRANTS, EVENT_ATTENDEES } from 'GraphQl/Queries/Queries';

export const REGISTRANTS_MOCKS = [
  {
    request: {
      query: EVENT_REGISTRANTS,
      variables: { eventId: 'event123' },
    },
    result: {
      data: {
        getEventAttendeesByEventId: [
          {
            id: '6589386a2caa9d8d69087484',
            user: {
              id: '6589386a2caa9d8d69087484',
              name: 'Bruce Garza',
              emailAddress: 'bruce@example.com',
            },
            isRegistered: true,
            isInvited: false,
          },
          {
            id: '6589386a2caa9d8d69087485',
            user: {
              id: '6589386a2caa9d8d69087485',
              name: 'Jane Smith',
              emailAddress: 'jane@example.com',
            },
            isRegistered: true,
            isInvited: false,
          },
        ],
      },
    },
  },
  {
    request: {
      query: EVENT_ATTENDEES,
      variables: { eventId: 'event123' },
    },
    result: {
      data: {
        event: {
          attendees: [
            {
              id: '6589386a2caa9d8d69087484',
              name: 'Bruce Garza',
              emailAddress: 'bruce@example.com',
              avatarURL: null,
              createdAt: '2030-04-13T10:23:17.742Z',
              role: 'attendee',
              natalSex: null,
              birthDate: null,
              eventsAttended: {
                id: 'event123',
              },
            },
            {
              id: '6589386a2caa9d8d69087485',
              name: 'Jane Smith',
              emailAddress: 'jane@example.com',
              avatarURL: null,
              createdAt: '2030-04-13T10:23:17.742Z',
              role: 'attendee',
              natalSex: null,
              birthDate: null,
              eventsAttended: {
                id: 'event123',
              },
            },
          ],
        },
      },
    },
  },
];
