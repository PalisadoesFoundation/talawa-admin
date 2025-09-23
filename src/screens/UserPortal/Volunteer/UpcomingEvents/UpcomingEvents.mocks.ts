import { CREATE_VOLUNTEER_MEMBERSHIP } from 'GraphQl/Mutations/EventVolunteerMutation';
import {
  USER_EVENTS_VOLUNTEER,
  USER_VOLUNTEER_MEMBERSHIP,
} from 'GraphQl/Queries/EventVolunteerQueries';

const event1 = {
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
      _id: 'groupId1',
      name: 'Group 1',
      volunteersRequired: null,
      description: 'desc',
      volunteers: [
        {
          _id: 'volunteerId1',
        },
        {
          _id: 'volunteerId2',
        },
      ],
    },
  ],
  volunteers: [
    {
      _id: 'volunteerId1',
      user: {
        _id: 'userId1',
      },
    },
    {
      _id: 'volunteerId2',
      user: {
        _id: 'userId2',
      },
    },
  ],
};

const event2 = {
  _id: 'eventId2',
  title: 'Event 2',
  name: 'Event 2',
  startDate: '2044-10-31',
  endDate: '2044-10-31',
  location: 'Pune',
  startTime: null,
  endTime: null,
  allDay: true,
  recurring: false,
  volunteerGroups: [
    {
      _id: 'groupId2',
      name: 'Group 2',
      volunteersRequired: null,
      description: 'desc',
      volunteers: [
        {
          _id: 'volunteerId3',
        },
      ],
    },
  ],
  volunteers: [
    {
      _id: 'volunteerId3',
      user: {
        _id: 'userId3',
      },
    },
  ],
};

const event3 = {
  _id: 'eventId3',
  title: 'Event 3',
  name: 'Event 3',
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
      _id: 'groupId3',
      name: 'Group 3',
      volunteersRequired: null,
      description: 'desc',
      volunteers: [
        {
          _id: 'userId',
        },
      ],
    },
  ],
  volunteers: [
    {
      _id: 'volunteerId',
      user: {
        _id: 'userId',
      },
    },
  ],
};

// Recurring event with baseEvent for testing instance vs series scenarios
const recurringInstanceEvent = {
  id: 'eventInstanceId1',
  name: 'Recurring Event Instance 1',
  startAt: '2044-11-01T10:00:00.000Z',
  endAt: '2044-11-01T12:00:00.000Z',
  location: 'Mumbai',
  description: 'A recurring event instance',
  isRecurringEventTemplate: false,
  baseEvent: {
    id: 'baseEventId1',
    isRecurringEventTemplate: true,
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
  recurrenceRule: {
    frequency: 'WEEKLY',
  },
};

// Base recurring event template
const baseRecurringEvent = {
  id: 'baseEventId1',
  name: 'Base Recurring Event',
  startAt: '2044-11-01T10:00:00.000Z',
  endAt: '2044-11-01T12:00:00.000Z',
  location: 'Mumbai',
  description: 'Base template for recurring event',
  isRecurringEventTemplate: true,
  baseEvent: null,
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
  recurrenceRule: {
    frequency: 'WEEKLY',
  },
};

export const MOCKS = [
  {
    request: {
      query: USER_EVENTS_VOLUNTEER,
      variables: {
        organizationId: 'orgId',
        upcomingOnly: true,
        first: 30,
      },
    },
    result: {
      data: {
        organization: {
          events: {
            edges: [{ node: event1 }, { node: event2 }, { node: event3 }],
          },
        },
      },
    },
  },
  {
    request: {
      query: USER_VOLUNTEER_MEMBERSHIP,
      variables: {
        where: {
          userId: 'userId',
        },
      },
    },
    result: {
      data: {
        getVolunteerMembership: [],
      },
    },
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
    result: {
      data: {
        createVolunteerMembership: {
          id: 'membershipId1',
          status: 'requested',
          createdAt: '2025-09-20T15:20:00.000Z',
          volunteer: {
            id: 'volunteerId1',
            hasAccepted: false,
            user: {
              id: 'userId',
              name: 'User Name',
            },
          },
          event: {
            id: 'eventId1',
            name: 'Event 1',
          },
          createdBy: {
            id: 'createrId',
            name: 'Creator Name',
          },
        },
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
        createVolunteerMembership: {
          id: 'membershipId2',
          status: 'requested',
          createdAt: '2025-09-20T15:20:00.000Z',
          volunteer: {
            id: 'volunteerId2',
            hasAccepted: false,
            user: {
              id: 'userId',
              name: 'User Name',
            },
          },
          event: {
            id: 'eventId1',
            name: 'Event 1',
          },
          createdBy: {
            id: 'createrId',
            name: 'Creator Name',
          },
          group: {
            id: 'groupId1',
            name: 'Group 1',
            description: 'desc',
          },
        },
      },
    },
  },
];

// Mocks for testing recurring modal functionality
export const RECURRING_MODAL_MOCKS = [
  {
    request: {
      query: USER_EVENTS_VOLUNTEER,
      variables: {
        organizationId: 'orgId',
        upcomingOnly: true,
        first: 30,
      },
    },
    result: {
      data: {
        organization: {
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
    request: {
      query: USER_VOLUNTEER_MEMBERSHIP,
      variables: {
        where: {
          userId: 'userId',
        },
      },
    },
    result: {
      data: {
        getVolunteerMembership: [],
      },
    },
  },
  // Mock for recurring event series volunteering
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
        createVolunteerMembership: {
          id: 'membershipId3',
          status: 'requested',
          createdAt: '2025-09-20T15:20:00.000Z',
          volunteer: {
            id: 'volunteerId3',
            hasAccepted: false,
            user: {
              id: 'userId',
              name: 'User Name',
            },
          },
          event: {
            id: 'baseEventId1',
            name: 'Base Recurring Event',
          },
          createdBy: {
            id: 'createrId',
            name: 'Creator Name',
          },
        },
      },
    },
  },
  // Mock for recurring event instance volunteering
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
        createVolunteerMembership: {
          id: 'membershipId4',
          status: 'requested',
          createdAt: '2025-09-20T15:20:00.000Z',
          volunteer: {
            id: 'volunteerId4',
            hasAccepted: false,
            user: {
              id: 'userId',
              name: 'User Name',
            },
          },
          event: {
            id: 'baseEventId1',
            name: 'Base Recurring Event',
          },
          createdBy: {
            id: 'createrId',
            name: 'Creator Name',
          },
        },
      },
    },
  },
  // Mock for recurring group volunteering - series
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
        createVolunteerMembership: {
          id: 'membershipId5',
          status: 'requested',
          createdAt: '2025-09-20T15:20:00.000Z',
          volunteer: {
            id: 'volunteerId5',
            hasAccepted: false,
            user: {
              id: 'userId',
              name: 'User Name',
            },
          },
          event: {
            id: 'baseEventId1',
            name: 'Base Recurring Event',
          },
          createdBy: {
            id: 'createrId',
            name: 'Creator Name',
          },
          group: {
            id: 'recurringGroupId1',
            name: 'Recurring Group 1',
            description: 'desc',
          },
        },
      },
    },
  },
  // Mock for recurring group volunteering - instance only
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
        createVolunteerMembership: {
          id: 'membershipId6',
          status: 'requested',
          createdAt: '2025-09-20T15:20:00.000Z',
          volunteer: {
            id: 'volunteerId6',
            hasAccepted: false,
            user: {
              id: 'userId',
              name: 'User Name',
            },
          },
          event: {
            id: 'baseEventId1',
            name: 'Base Recurring Event',
          },
          createdBy: {
            id: 'createrId',
            name: 'Creator Name',
          },
          group: {
            id: 'recurringGroupId1',
            name: 'Recurring Group 1',
            description: 'desc',
          },
        },
      },
    },
  },
];

// Mocks for testing different volunteer membership statuses
export const MEMBERSHIP_STATUS_MOCKS = [
  {
    request: {
      query: USER_EVENTS_VOLUNTEER,
      variables: {
        organizationId: 'orgId',
        upcomingOnly: true,
        first: 30,
      },
    },
    result: {
      data: {
        organization: {
          events: {
            edges: [{ node: event1 }, { node: event2 }],
          },
        },
      },
    },
  },
  {
    request: {
      query: USER_VOLUNTEER_MEMBERSHIP,
      variables: {
        where: {
          userId: 'userId',
        },
      },
    },
    result: {
      data: {
        getVolunteerMembership: [
          // Accepted membership for individual volunteering
          {
            id: 'membership1',
            status: 'accepted',
            event: {
              id: 'eventId1',
            },
            group: null,
          },
          // Rejected membership for group volunteering
          {
            id: 'membership2',
            status: 'rejected',
            event: {
              id: 'eventId2',
            },
            group: {
              id: 'groupId2',
            },
          },
          // Requested membership for group volunteering
          {
            id: 'membership3',
            status: 'requested',
            event: {
              id: 'eventId1',
            },
            group: {
              id: 'groupId1',
            },
          },
        ],
      },
    },
  },
];

export const EMPTY_MOCKS = [
  {
    request: {
      query: USER_EVENTS_VOLUNTEER,
      variables: {
        organizationId: 'orgId',
        upcomingOnly: true,
        first: 30,
      },
    },
    result: {
      data: {
        organization: {
          events: {
            edges: [],
          },
        },
      },
    },
  },
];

export const ERROR_MOCKS = [
  {
    request: {
      query: USER_EVENTS_VOLUNTEER,
      variables: {
        organizationId: 'orgId',
        upcomingOnly: true,
        first: 30,
      },
    },
    error: new Error('Mock Graphql USER_EVENTS_VOLUNTEER Error'),
  },
];

export const CREATE_ERROR_MOCKS = [
  {
    request: {
      query: USER_EVENTS_VOLUNTEER,
      variables: {
        organizationId: 'orgId',
        upcomingOnly: true,
        first: 30,
      },
    },
    result: {
      data: {
        organization: {
          events: {
            edges: [{ node: event1 }, { node: event2 }, { node: event3 }],
          },
        },
      },
    },
  },
  {
    request: {
      query: USER_VOLUNTEER_MEMBERSHIP,
      variables: {
        where: {
          userId: 'userId',
        },
      },
    },
    result: {
      data: {
        getVolunteerMembership: [],
      },
    },
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
