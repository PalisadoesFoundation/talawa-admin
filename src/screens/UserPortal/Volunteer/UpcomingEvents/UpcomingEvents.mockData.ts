/**
 * Base event data for UpcomingEvents tests
 * This file contains reusable event mock data
 */

export const event1 = {
  __typename: 'Event',
  _id: 'eventId1',
  title: 'Event 1',
  name: 'Event 1',
  startDate: '2044-10-30',
  endDate: '2044-10-30',
  location: 'Mumbai',
  startTime: null,
  endTime: null,
  allDay: true,
  recurring: true,
  volunteerGroups: [
    {
      __typename: 'EventVolunteerGroup',
      _id: 'groupId1',
      name: 'Group 1',
      volunteersRequired: null,
      description: 'desc',
      volunteers: [
        { __typename: 'EventVolunteer', _id: 'volunteerId1' },
        { __typename: 'EventVolunteer', _id: 'volunteerId2' },
      ],
    },
  ],
  volunteers: [
    {
      __typename: 'EventVolunteer',
      _id: 'volunteerId1',
      user: { __typename: 'User', _id: 'userId1' },
    },
    {
      __typename: 'EventVolunteer',
      _id: 'volunteerId2',
      user: { __typename: 'User', _id: 'userId2' },
    },
  ],
};

export const event2 = {
  __typename: 'Event',
  id: 'eventId2',
  title: 'Event 2',
  name: 'Event 2',
  startDate: '2044-10-31',
  endDate: '2044-10-31',
  location: null,
  startTime: null,
  endTime: null,
  allDay: true,
  recurring: false,
  volunteerGroups: [
    {
      __typename: 'EventVolunteerGroup',
      id: 'groupId2',
      name: 'Group 2',
      volunteersRequired: null,
      description: 'desc',
      volunteers: [{ __typename: 'EventVolunteer', _id: 'volunteerId3' }],
    },
  ],
  volunteers: [
    {
      __typename: 'EventVolunteer',
      _id: 'volunteerId3',
      user: { __typename: 'User', _id: 'userId3' },
    },
  ],
};

export const event3 = {
  __typename: 'Event',
  _id: 'eventId3',
  title: 'Event 3',
  name: 'Event with Group Volunteers Null',
  startDate: '2044-10-31',
  endDate: '2022-10-31',
  location: 'Delhi',
  startTime: null,
  endTime: null,
  description: 'desc',
  allDay: true,
  recurring: true,
  volunteerGroups: [
    {
      __typename: 'EventVolunteerGroup',
      id: 'groupIdNull',
      name: 'Group NullVols',
      description: 'desc',
      volunteersRequired: null,
      volunteers: null, // Explicitly set to null
    },
  ],
  volunteers: null,
};

export const nullVolunteerGroups = {
  __typename: 'Event',
  id: 'nullEventId',
  name: 'Event with Null Fields',
  startAt: '2044-10-30T10:00:00.000Z',
  endAt: '2044-10-30T12:00:00.000Z',
  location: 'Test Location',
  description: 'Test Description',
  isRecurringEventTemplate: false,
  volunteerGroups: null, // This will test the null case
  volunteers: null, // This will test the null case
};

// Create past event based on existing event structure
export const pastEvent = {
  ...event1,
  __typename: 'Event',
  id: 'eventId1',
  name: 'Past Test Event',
  startAt: '2020-10-30T10:00:00.000Z',
  endAt: '2020-10-30T12:00:00.000Z', // Past date
};

// Create instance event for duplicate membership testing
export const duplicateInstanceEvent = {
  __typename: 'Event',
  id: 'instanceEventId1',
  name: 'Instance Event 1',
  startDate: '2044-11-06',
  endDate: '2044-11-06',
  startAt: '2044-11-06T10:00:00.000Z',
  endAt: '2044-11-06T12:00:00.000Z',
  allDay: false,
  recurring: true,
  isRecurringEventTemplate: false,
  baseEvent: {
    __typename: 'Event',
    id: 'baseEventId1',
    isRecurringEventTemplate: true,
  },
  volunteerGroups: [
    {
      __typename: 'EventVolunteerGroup',
      id: 'recurringGroupId1',
      name: 'Recurring Group 1',
      description: 'desc',
      volunteersRequired: 5,
      volunteers: [],
    },
  ],
  volunteers: [],
  recurrenceRule: { __typename: 'RecurrenceRule', frequency: 'WEEKLY' },
};

export const recurringInstanceEvent = {
  __typename: 'Event',
  id: 'eventInstanceId1',
  name: 'Recurring Event Instance 1',
  startAt: '2044-11-01T10:00:00.000Z',
  endAt: '2044-11-01T12:00:00.000Z',
  location: 'Mumbai',
  description: 'A recurring event instance',
  isRecurringEventTemplate: false,
  baseEvent: {
    __typename: 'Event',
    id: 'baseEventId1',
    isRecurringEventTemplate: true,
  },
  volunteerGroups: [
    {
      __typename: 'EventVolunteerGroup',
      id: 'recurringGroupId1',
      name: 'Recurring Group 1',
      description: 'desc',
      volunteersRequired: 5,
      volunteers: [],
    },
  ],
  volunteers: [],
  recurrenceRule: { __typename: 'RecurrenceRule', frequency: 'WEEKLY' },
};

export const baseRecurringEvent = {
  __typename: 'Event',
  startAt: '2044-10-30T10:00:00.000Z',
  endAt: '2044-10-30T12:00:00.000Z',
  location: 'Test Location',
  description: 'Test Description',
  isRecurringEventTemplate: true,
  baseEvent: null,
  recurrenceRule: { __typename: 'RecurrenceRule', frequency: 'WEEKLY' },
  volunteerGroups: [],
  volunteers: [],
};

export const baseEvent = {
  __typename: 'Event',
  startAt: '2044-10-30T10:00:00.000Z',
  endAt: '2044-10-30T12:00:00.000Z',
  location: 'Test Location',
  description: 'Test Description',
  isRecurringEventTemplate: false,
  baseEvent: null,
  recurrenceRule: null,
  volunteerGroups: [
    {
      __typename: 'EventVolunteerGroup',
      id: 'groupId1',
      name: 'Test Group',
      description: 'Test Description',
      volunteersRequired: 5,
      volunteers: [],
    },
  ],
  volunteers: [],
};
