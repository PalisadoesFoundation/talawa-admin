import { EVENT_ATTENDEES, EVENT_DETAILS } from 'GraphQl/Queries/Queries';

export const MOCKEVENT = {
  id: 'event123',
  name: 'Test Event',
  description: 'This is a test event description',
  location: 'Test Location',
  allDay: false,
  isPublic: true,
  isRegisterable: true,
  startAt: '2030-05-01T09:00:00.000Z',
  endAt: '2030-05-02T17:00:00.000Z',
  createdAt: '2030-04-01T00:00:00.000Z',
  updatedAt: '2030-04-01T00:00:00.000Z',
  recurrenceRule: {
    id: 'recurringEvent123',
  },
  creator: {
    id: 'creator123',
    name: 'Creator Name',
    emailAddress: 'creator@example.com',
  },
  updater: {
    id: 'updater123',
    name: 'Updater Name',
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
              eventsAttended: [
                { id: '660fdf7d2c1ef6c7db1649ad' },
                { id: '660fdd562c1ef6c7db1644f7' },
              ],
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
              eventsAttended: [{ id: '660fdf7d2c1ef6c7db1649ad' }],
            },

            {
              id: '6589386a2caa9d8d69087486',
              name: 'Tagged Member',
              emailAddress: 'tagged@example.com',
              avatarURL: null,
              // Fixed to current year/month to keep date-filter tests stable
              createdAt: new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                15,
              ).toISOString(),

              role: 'attendee',
              natalSex: null,
              birthDate: null,
              eventsAttended: null,
              tagsAssignedWith: {
                edges: [
                  { node: { name: 'Volunteer' } },
                  { node: { name: 'Coordinator' } },
                ],
              },
            },
          ],
        },
      },
    },
  },
];
