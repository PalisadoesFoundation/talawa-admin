import { createEventVolunteer } from './UpcomingEvents.mockHelpers';

// Base events
export const event1 = {
  id: 'eventId1',
  name: 'Event 1',
  description: 'desc',
  startAt: '2044-10-30T10:00:00.000Z',
  endAt: '2044-10-30T12:00:00.000Z',
  location: 'Mumbai',
  allDay: true,
  isRecurringEventTemplate: true,
  baseEvent: null,
  recurrenceRule: {
    id: 'recurrenceRuleId1',
    frequency: 'DAILY',
  },
  volunteerGroups: [
    {
      id: 'groupId1',
      name: 'Group 1',
      volunteersRequired: null,
      description: 'desc',
      volunteers: [
        createEventVolunteer('volunteerId1', 'User 1', {
          hasAccepted: true,
          volunteerStatus: 'accepted',
          userId: 'userId1',
        }),
        createEventVolunteer('volunteerId2', 'User 2', {
          volunteerStatus: 'pending',
          userId: 'userId2',
        }),
      ],
    },
  ],
  volunteers: [
    createEventVolunteer('volunteerId1', 'User 1', {
      hasAccepted: true,
      volunteerStatus: 'accepted',
      userId: 'userId1',
    }),
    createEventVolunteer('volunteerId2', 'User 2', {
      volunteerStatus: 'pending',
      userId: 'userId2',
    }),
  ],
};

export const event2 = {
  id: 'eventId2',
  name: 'Event 2',
  description: null,
  startAt: '2044-10-31T10:00:00.000Z',
  endAt: '2044-10-31T12:00:00.000Z',
  location: null,
  allDay: true,
  isRecurringEventTemplate: false,
  baseEvent: null,
  recurrenceRule: null,
  volunteerGroups: [
    {
      id: 'groupId2',
      name: 'Group 2',
      volunteersRequired: null,
      description: 'desc',
      volunteers: [
        createEventVolunteer('volunteerId3', 'User 3', {
          volunteerStatus: 'accepted',
          hasAccepted: true,
          userId: 'userId3',
        }),
      ],
    },
  ],
  volunteers: [
    createEventVolunteer('volunteerId3', 'User 3', {
      volunteerStatus: 'accepted',
      hasAccepted: true,
      userId: 'userId3',
    }),
  ],
};

export const event3 = {
  id: 'eventId3',
  name: 'Event with Group Volunteers Null',
  description: 'desc',
  startAt: '2044-10-31T10:00:00.000Z',
  endAt: '2044-10-31T12:00:00.000Z',
  location: 'Delhi',
  allDay: true,
  isRecurringEventTemplate: true,
  baseEvent: null,
  recurrenceRule: {
    id: 'recurrenceRuleId3',
    frequency: 'WEEKLY',
  },
  volunteerGroups: [
    {
      id: 'groupIdNull',
      name: 'Group NullVols',
      description: 'desc',
      volunteersRequired: null,
      volunteers: null,
    },
  ],
  volunteers: null,
};

export const nullVolunteerGroups = {
  id: 'nullEventId',
  name: 'Event with Null Fields',
  description: 'Test Description',
  startAt: '2044-10-30T10:00:00.000Z',
  endAt: '2044-10-30T12:00:00.000Z',
  location: 'Test Location',
  allDay: false,
  isRecurringEventTemplate: false,
  baseEvent: null,
  recurrenceRule: null,
  volunteerGroups: null,
  volunteers: null,
};

export const pastEvent = {
  id: 'pastEventId',
  name: 'Past Test Event',
  description: 'Past desc',
  startAt: '2020-10-30T10:00:00.000Z',
  endAt: '2020-10-30T12:00:00.000Z',
  location: 'Past City',
  allDay: true,
  isRecurringEventTemplate: false,
  baseEvent: null,
  recurrenceRule: null,
  volunteerGroups: [
    {
      id: 'pastGroupId',
      name: 'Past Group',
      description: 'desc',
      volunteersRequired: null,
      volunteers: [],
    },
  ],
  volunteers: [],
};

export const duplicateInstanceEvent = {
  id: 'instanceEventId1',
  name: 'Instance Event 1',
  description: 'desc',
  startAt: '2044-11-06T10:00:00.000Z',
  endAt: '2044-11-06T12:00:00.000Z',
  location: 'Mumbai',
  allDay: false,
  isRecurringEventTemplate: false,
  baseEvent: {
    id: 'baseEventId1',
    name: 'Base Template Event',
    isRecurringEventTemplate: true,
  },
  recurrenceRule: {
    id: 'recurrenceRuleInstance1',
    frequency: 'WEEKLY',
  },
  volunteerGroups: [
    {
      id: 'recurringGroupId1',
      name: 'Recurring Group 1',
      description: 'desc',
      volunteersRequired: 5,
      volunteers: [],
    },
  ],
  volunteers: [],
};

export const recurringInstanceEvent = {
  id: 'eventInstanceId1',
  name: 'Recurring Event Instance 1',
  description: 'A recurring event instance',
  startAt: '2044-11-01T10:00:00.000Z',
  endAt: '2044-11-01T12:00:00.000Z',
  location: 'Mumbai',
  allDay: false,
  isRecurringEventTemplate: false,
  baseEvent: {
    id: 'baseEventId1',
    name: 'Base Template Event',
    isRecurringEventTemplate: true,
  },
  recurrenceRule: {
    id: 'recurrenceRuleInstance2',
    frequency: 'WEEKLY',
  },
  volunteerGroups: [
    {
      id: 'recurringGroupId1',
      name: 'Recurring Group 1',
      description: 'desc',
      volunteersRequired: 5,
      volunteers: [],
    },
  ],
  volunteers: [],
};

export const baseRecurringEvent = {
  id: 'baseEventId1',
  name: 'Recurring Template Event',
  description: 'Test Description',
  startAt: '2044-10-30T10:00:00.000Z',
  endAt: '2044-10-30T12:00:00.000Z',
  location: 'Test Location',
  allDay: false,
  isRecurringEventTemplate: true,
  baseEvent: null,
  recurrenceRule: { id: 'baseRecurrenceRule', frequency: 'WEEKLY' },
  volunteerGroups: [
    {
      id: 'recurringGroupId1',
      name: 'Recurring Group 1',
      description: 'desc',
      volunteersRequired: 5,
      volunteers: [],
    },
  ],
  volunteers: [],
};
