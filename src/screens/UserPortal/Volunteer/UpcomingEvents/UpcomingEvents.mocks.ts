import { CREATE_VOLUNTEER_MEMBERSHIP } from 'GraphQl/Mutations/EventVolunteerMutation';
import {
  USER_EVENTS_VOLUNTEER,
  USER_VOLUNTEER_MEMBERSHIP,
} from 'GraphQl/Queries/EventVolunteerQueries';

type VolunteerStatus =
  | 'accepted'
  | 'pending'
  | 'requested'
  | 'rejected'
  | 'invited';

interface EventVolunteerOverride {
  hasAccepted?: boolean;
  volunteerStatus?: VolunteerStatus;
  userId?: string;
  userName?: string;
}

interface MembershipOptions {
  id: string;
  eventId: string;
  status: string;
  eventName?: string;
  startAt?: string;
  endAt?: string;
  recurrenceRuleId?: string | null;
  groupId?: string | null;
  groupName?: string;
  groupDescription?: string;
}

// Helper function to create common volunteer membership response
const createMembershipResponse = (
  id: string,
  eventId: string,
  groupId?: string,
) => ({
  id: `membershipId${id}`,
  status: 'requested',
  createdAt: '2025-09-20T15:20:00.000Z',
  volunteer: {
    id: `volunteerId${id}`,
    hasAccepted: false,
    user: { id: 'userId', name: 'User Name' },
  },
  event: { id: eventId, name: `Event ${id}` },
  createdBy: { id: 'createrId', name: 'Creator Name' },
  ...(groupId && {
    group: { id: groupId, name: `Group ${id}`, description: 'desc' },
  }),
});

const createEventVolunteer = (
  id: string,
  name: string,
  overrides: EventVolunteerOverride = {},
) => ({
  id,
  hasAccepted: overrides.hasAccepted ?? false,
  volunteerStatus: overrides.volunteerStatus ?? 'pending',
  user: {
    id: overrides.userId ?? `${id}-user`,
    name: overrides.userName ?? name,
  },
});

const createMembershipRecord = ({
  id,
  eventId,
  status,
  eventName,
  startAt,
  endAt,
  recurrenceRuleId = null,
  groupId = null,
  groupName,
  groupDescription,
}: MembershipOptions) => ({
  id,
  status,
  createdAt: '2024-10-30T10:00:00.000Z',
  updatedAt: '2024-10-30T10:00:00.000Z',
  event: {
    id: eventId,
    name: eventName ?? `Event ${eventId}`,
    startAt: startAt ?? '2044-10-30T10:00:00.000Z',
    endAt: endAt ?? '2044-10-30T12:00:00.000Z',
    recurrenceRule: recurrenceRuleId
      ? {
          id: recurrenceRuleId,
        }
      : null,
  },
  volunteer: {
    id: `membershipVolunteer-${id}`,
    hasAccepted: status === 'accepted',
    hoursVolunteered: 0,
    user: {
      id: `membershipUser-${id}`,
      name: `Membership User ${id}`,
      emailAddress: `membership${id}@example.com`,
      avatarURL: null,
    },
  },
  createdBy: { id: 'creatorId', name: 'Creator Name' },
  updatedBy: { id: 'updaterId', name: 'Updater Name' },
  group: groupId
    ? {
        id: groupId,
        name: groupName ?? `Group ${groupId}`,
        description: groupDescription ?? 'Test Description',
      }
    : null,
});

// Base events
const event1 = {
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

const event2 = {
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

const event3 = {
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

const nullVolunteerGroups = {
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

const pastEvent = {
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

const duplicateInstanceEvent = {
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

const recurringInstanceEvent = {
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

export const baseEvent = {
  id: 'baseSingleEventId',
  name: 'Base Single Event',
  description: 'Test Description',
  startAt: '2044-10-30T10:00:00.000Z',
  endAt: '2044-10-30T12:00:00.000Z',
  location: 'Test Location',
  allDay: false,
  isRecurringEventTemplate: false,
  baseEvent: null,
  recurrenceRule: null,
  volunteerGroups: [
    {
      id: 'groupId1',
      name: 'Test Group',
      description: 'Test Description',
      volunteersRequired: 5,
      volunteers: [],
    },
  ],
  volunteers: [],
};

// Common queries
const eventsQuery = {
  request: {
    query: USER_EVENTS_VOLUNTEER,
    variables: { organizationId: 'orgId', upcomingOnly: true, first: 30 },
  },
};

const membershipQuery = {
  request: {
    query: USER_VOLUNTEER_MEMBERSHIP,
    variables: { where: { userId: 'userId' } },
  },
};

export const MOCKS = [
  {
    ...eventsQuery,
    result: {
      data: {
        organization: {
          id: 'orgId',
          events: {
            edges: [
              { node: event1 },
              { node: event2 },
              { node: event3 },
              { node: nullVolunteerGroups },
              { node: pastEvent },
              { node: duplicateInstanceEvent },
            ],
          },
        },
      },
    },
  },
  {
    ...membershipQuery,
    result: {
      data: {
        getVolunteerMembership: [
          createMembershipRecord({
            id: 'membership1',
            status: 'accepted',
            eventId: 'eventId2',
            eventName: 'Event With Group Joined',
            groupId: 'groupId2',
            groupName: 'Test Group',
          }),
          createMembershipRecord({
            id: 'membershipUnknown',
            status: 'unknown_status',
            eventId: 'eventId1',
            eventName: 'Test Event',
          }),
          createMembershipRecord({
            id: 'membershipBase',
            status: 'accepted',
            eventId: 'baseEventId1',
            eventName: 'Base Template Event',
            recurrenceRuleId: 'baseRecurrenceRule',
          }),
          createMembershipRecord({
            id: 'membershipInstance',
            status: 'requested',
            eventId: 'instanceEventId1',
            eventName: 'Instance Event 1',
            startAt: '2044-11-06T10:00:00.000Z',
            endAt: '2044-11-06T12:00:00.000Z',
          }),
        ],
      },
    },
  },
  {
    request: {
      query: CREATE_VOLUNTEER_MEMBERSHIP,
      variables: {
        data: {
          event: 'eventId1',
          status: 'requested',
          userId: 'userId',
        },
      },
    },
    result: {
      data: {
        createVolunteerMembership: createMembershipResponse('1', 'eventId1'),
      },
    },
  },
  {
    request: {
      query: CREATE_VOLUNTEER_MEMBERSHIP,
      variables: {
        data: {
          event: 'eventId1',
          group: 'groupId1',
          status: 'requested',
          userId: 'userId',
        },
      },
    },
    result: {
      data: {
        createVolunteerMembership: createMembershipResponse(
          '2',
          'eventId1',
          'groupId1',
        ),
      },
    },
  },
];

export const RECURRING_MODAL_MOCKS = [
  {
    ...eventsQuery,
    result: {
      data: {
        organization: {
          id: 'orgId',
          events: {
            edges: [
              { node: recurringInstanceEvent },
              { node: baseRecurringEvent },
            ],
          },
        },
      },
    },
  },
  {
    ...membershipQuery,
    result: { data: { getVolunteerMembership: [] } },
  },
  // Series volunteering
  {
    request: {
      query: CREATE_VOLUNTEER_MEMBERSHIP,
      variables: {
        data: {
          event: 'baseEventId1',
          group: null,
          status: 'requested',
          userId: 'userId',
          scope: 'ENTIRE_SERIES',
        },
      },
    },
    result: {
      data: {
        createVolunteerMembership: createMembershipResponse(
          '3',
          'baseEventId1',
        ),
      },
    },
  },
  // Instance volunteering
  {
    request: {
      query: CREATE_VOLUNTEER_MEMBERSHIP,
      variables: {
        data: {
          event: 'baseEventId1',
          group: null,
          status: 'requested',
          userId: 'userId',
          scope: 'THIS_INSTANCE_ONLY',
          recurringEventInstanceId: 'eventInstanceId1',
        },
      },
    },
    result: {
      data: {
        createVolunteerMembership: createMembershipResponse(
          '4',
          'baseEventId1',
        ),
      },
    },
  },
  // Group series volunteering
  {
    request: {
      query: CREATE_VOLUNTEER_MEMBERSHIP,
      variables: {
        data: {
          event: 'baseEventId1',
          group: 'recurringGroupId1',
          status: 'requested',
          userId: 'userId',
          scope: 'ENTIRE_SERIES',
        },
      },
    },
    result: {
      data: {
        createVolunteerMembership: createMembershipResponse(
          '5',
          'baseEventId1',
          'recurringGroupId1',
        ),
      },
    },
  },
  // Group instance volunteering
  {
    request: {
      query: CREATE_VOLUNTEER_MEMBERSHIP,
      variables: {
        data: {
          event: 'baseEventId1',
          group: 'recurringGroupId1',
          status: 'requested',
          userId: 'userId',
          scope: 'THIS_INSTANCE_ONLY',
          recurringEventInstanceId: 'eventInstanceId1',
        },
      },
    },
    result: {
      data: {
        createVolunteerMembership: createMembershipResponse(
          '6',
          'baseEventId1',
          'recurringGroupId1',
        ),
      },
    },
  },
];

// Mocks for testing membership lookup enhancement with recurring events
export const MEMBERSHIP_LOOKUP_MOCKS = [
  {
    ...eventsQuery,
    result: {
      data: {
        organization: {
          id: 'orgId',
          events: {
            edges: [
              { node: recurringInstanceEvent },
              { node: baseRecurringEvent },
              {
                node: {
                  id: 'eventInstanceId2',
                  name: 'Recurring Event Instance 2',
                  description: 'Another instance of recurring event',
                  startAt: '2044-11-08T10:00:00.000Z',
                  endAt: '2044-11-08T12:00:00.000Z',
                  location: 'Mumbai',
                  allDay: false,
                  isRecurringEventTemplate: false,
                  baseEvent: {
                    id: 'baseEventId1',
                    name: 'Base Template Event',
                    isRecurringEventTemplate: true,
                  },
                  recurrenceRule: {
                    id: 'recurrenceRuleInstance3',
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
                },
              },
            ],
          },
        },
      },
    },
  },
  {
    ...membershipQuery,
    result: {
      data: {
        getVolunteerMembership: [
          createMembershipRecord({
            id: 'baseMembership1',
            status: 'accepted',
            eventId: 'baseEventId1',
            eventName: 'Base Template Event',
          }),
          createMembershipRecord({
            id: 'baseMembership2',
            status: 'requested',
            eventId: 'baseEventId1',
            eventName: 'Base Template Event',
            groupId: 'recurringGroupId1',
            groupName: 'Recurring Group 1',
          }),
        ],
      },
    },
  },
];

export const MEMBERSHIP_STATUS_MOCKS = [
  {
    ...eventsQuery,
    result: {
      data: {
        organization: {
          id: 'orgId',
          events: {
            edges: [{ node: event1 }, { node: event2 }],
          },
        },
      },
    },
  },
  {
    ...membershipQuery,
    result: {
      data: {
        getVolunteerMembership: [
          createMembershipRecord({
            id: 'membershipAccepted',
            status: 'accepted',
            eventId: 'eventId1',
          }),
          createMembershipRecord({
            id: 'membershipRejected',
            status: 'rejected',
            eventId: 'eventId2',
            groupId: 'groupId2',
          }),
          createMembershipRecord({
            id: 'membershipRequested',
            status: 'requested',
            eventId: 'eventId1',
            groupId: 'groupId1',
          }),
        ],
      },
    },
  },
];

export const EMPTY_MOCKS = [
  {
    ...eventsQuery,
    result: {
      data: { organization: { id: 'orgId', events: { edges: [] } } },
    },
  },
];

export const ERROR_MOCKS = [
  {
    ...eventsQuery,
    error: new Error('Mock Graphql USER_EVENTS_VOLUNTEER Error'),
  },
];

export const CREATE_ERROR_MOCKS = [
  {
    ...eventsQuery,
    result: {
      data: {
        organization: {
          id: 'orgId',
          events: {
            edges: [{ node: event2 }, { node: event1 }, { node: event3 }],
          },
        },
      },
    },
  },
  {
    ...membershipQuery,
    result: { data: { getVolunteerMembership: [] } },
  },
  {
    request: {
      query: CREATE_VOLUNTEER_MEMBERSHIP,
      variables: {
        data: {
          event: 'eventId1',
          group: null,
          status: 'requested',
          userId: 'userId',
        },
      },
    },
    error: new Error('Mock Graphql CREATE_VOLUNTEER_MEMBERSHIP Error'),
  },
];
