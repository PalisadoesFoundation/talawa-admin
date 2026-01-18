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
