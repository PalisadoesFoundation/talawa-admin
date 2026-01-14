import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import { EVENT_DETAILS, EVENT_DETAILS_BASIC } from 'GraphQl/Queries/Queries';

export const mockEventData = {
  event: {
    _id: 'event123',
    id: 'event123',
    title: 'Test Event',
    // Provide name/startAt/endAt to align with EVENT_DETAILS fields
    name: 'Test Event',
    description: 'Test Description',
    startAt: dayjs.utc().add(4, 'year').toISOString(),
    endAt: dayjs.utc().add(4, 'year').add(1, 'day').toISOString(),
    startTime: '09:00',
    endTime: '17:00',
    allDay: false,
    location: 'Test Location',
    isPublic: true,
    isRegisterable: true,
    createdAt: dayjs.utc().add(4, 'year').toISOString(),
    updatedAt: dayjs.utc().add(4, 'year').toISOString(),
    recurrenceRule: { id: 'rule123' },
    isRecurringEventTemplate: true,
    attendees: [
      { id: 'user1', gender: 'MALE' },
      { id: 'user2', gender: 'FEMALE' },
    ],
    creator: {
      id: 'user1',
      name: 'John Doe',
      emailAddress: 'john@example.com',
    },
    updater: {
      id: 'user1',
      name: 'John Doe',
      emailAddress: 'john@example.com',
    },
    organization: { id: 'org123', name: 'Test Org' },
  },
};

export const mockEventBasicData = {
  event: {
    id: 'event123',
    name: 'Test Event',
    location: 'Test Location',
    startAt: dayjs.utc().add(4, 'year').toISOString(),
    organization: { id: 'org123', name: 'Test Org' },
  },
};

export const mocks = [
  {
    request: {
      query: EVENT_DETAILS,
      // EVENT_DETAILS query parameter is $eventId
      variables: { eventId: 'event123' },
    },
    result: {
      data: mockEventData,
    },
  },
  {
    request: {
      query: EVENT_DETAILS_BASIC,
      variables: { eventId: 'event123' },
    },
    result: {
      data: mockEventBasicData,
    },
  },
];

export const errorMocks = [
  {
    request: {
      query: EVENT_DETAILS_BASIC,
      variables: { eventId: 'event123' },
    },
    error: new Error('An error occurred'),
  },
];
