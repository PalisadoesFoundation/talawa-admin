import {
  CREATE_VOLUNTEER_GROUP,
  DELETE_VOLUNTEER_GROUP,
  UPDATE_VOLUNTEER_GROUP,
} from 'GraphQl/Mutations/EventVolunteerMutation';
import { GET_EVENT_VOLUNTEER_GROUPS } from 'GraphQl/Queries/EventVolunteerQueries';
import { MEMBERS_LIST } from 'GraphQl/Queries/Queries';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

const group1 = {
  id: 'groupId1',
  name: 'Group 1',
  description: 'desc',
  volunteersRequired: 2,
  isTemplate: true,
  isInstanceException: false,
  createdAt: '2030-10-25T16:16:32.978Z',
  creator: {
    id: 'creatorId1',
    name: 'Wilt Shepherd',
    avatarURL: null,
  },
  leader: {
    id: 'userId',
    name: 'Bruce Trainer',
    avatarURL: 'img-url',
  },
  volunteers: [
    {
      id: 'volunteerId1',
      hasAccepted: true,
      hoursVolunteered: 10,
      isPublic: true,
      user: {
        id: 'userId',
        name: 'Teresa Bradley',
        avatarURL: null,
      },
    },
  ],
  event: {
    id: 'eventId',
  },
};

const group2 = {
  id: 'groupId2',
  name: 'Group 2',
  description: 'desc',
  volunteersRequired: 3,
  isTemplate: true,
  isInstanceException: false,
  createdAt: '2030-10-27T15:25:13.044Z',
  creator: {
    id: 'creatorId2',
    name: 'Test Creator',
    avatarURL: null,
  },
  leader: {
    id: 'userId2',
    name: 'Bruce Garza',
    avatarURL: null,
  },
  volunteers: [],
  event: {
    id: 'eventId',
  },
};

const group3 = {
  id: 'groupId3',
  name: 'Group 3',
  description: 'desc',
  volunteersRequired: 1,
  isTemplate: true,
  isInstanceException: false,
  createdAt: '2030-10-27T15:34:15.889Z',
  creator: {
    id: 'creatorId3',
    name: 'Test Creator',
    avatarURL: null,
  },
  leader: {
    id: 'userId3',
    name: 'Bruce Garza',
    avatarURL: null,
  },
  volunteers: [
    {
      id: 'volunteerId3',
      hasAccepted: true,
      hoursVolunteered: null,
      isPublic: true,
      user: {
        id: 'userId3',
        name: 'Bruce Garza',
        avatarURL: null,
      },
    },
  ],
  event: {
    id: 'eventId',
  },
};

export const MOCKS = [
  {
    request: {
      query: GET_EVENT_VOLUNTEER_GROUPS,
      variables: {
        input: { id: 'eventId' },
      },
    },
    result: {
      data: {
        event: {
          id: 'eventId',
          recurrenceRule: null,
          baseEvent: null,
          volunteerGroups: [group1, group2, group3],
        },
      },
    },
  },
  {
    request: {
      query: MEMBERS_LIST,
      variables: {
        organizationId: 'orgId',
      },
    },
    result: {
      data: {
        usersByOrganizationId: [
          {
            id: 'userId',
            name: 'Harve Lance',
            emailAddress: 'harve@example.com',
            avatarURL: '',
            role: 'regular',
            createdAt: dayjs.utc().subtract(2, 'year').toISOString(),
            updatedAt: dayjs.utc().subtract(1, 'year').toISOString(),
          },
          {
            id: 'userId2',
            name: 'John Doe',
            emailAddress: 'johndoe@example.com',
            avatarURL: '',
            role: 'regular',
            createdAt: dayjs.utc().subtract(2, 'year').toISOString(),
            updatedAt: dayjs.utc().subtract(1, 'year').toISOString(),
          },
        ],
      },
    },
  },
  {
    request: {
      query: CREATE_VOLUNTEER_GROUP,
      variables: {
        data: {
          eventId: 'eventId',
          leaderId: 'userId',
          name: 'Group 1',
          description: 'desc',
          volunteerUserIds: ['userId', 'userId2'],
          volunteersRequired: 10,
        },
      },
    },
    result: {
      data: {
        createEventVolunteerGroup: {
          id: 'groupId',
        },
      },
    },
  },
  {
    request: {
      query: DELETE_VOLUNTEER_GROUP,
      variables: {
        id: 'groupId',
      },
    },
    result: {
      data: {
        removeEventVolunteerGroup: {
          id: 'groupId',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_VOLUNTEER_GROUP,
      variables: {
        id: 'groupId',
        data: {
          eventId: 'eventId',
          name: 'Group 2',
          description: 'desc new',
          volunteersRequired: 10,
        },
      },
    },
    result: {
      data: {
        updateEventVolunteerGroup: {
          id: 'groupId',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_VOLUNTEER_GROUP,
      variables: {
        id: 'groupId',
        data: {
          eventId: 'eventId',
        },
      },
    },
    result: {
      data: {
        updateEventVolunteerGroup: {
          id: 'groupId',
        },
      },
    },
  },
  // Mock for recurring event series scope
  {
    request: {
      query: CREATE_VOLUNTEER_GROUP,
      variables: {
        data: {
          eventId: 'baseEventId',
          leaderId: 'userId',
          name: 'Recurring Group Series',
          description: 'desc',
          volunteerUserIds: ['userId', 'userId2'],
          volunteersRequired: 10,
          scope: 'ENTIRE_SERIES',
        },
      },
    },
    result: {
      data: {
        createEventVolunteerGroup: {
          id: 'recurringGroupId',
        },
      },
    },
  },
  // Mock for recurring event series scope with alternate payload
  {
    request: {
      query: CREATE_VOLUNTEER_GROUP,
      variables: {
        data: {
          eventId: 'baseEventId',
          leaderId: 'userId',
          name: 'Test Group',
          description: 'desc',
          volunteerUserIds: ['userId', 'userId2'],
          volunteersRequired: 10,
          scope: 'ENTIRE_SERIES',
        },
      },
    },
    result: {
      data: {
        createEventVolunteerGroup: {
          id: 'recurringTestGroupId',
        },
      },
    },
    variableMatcher: (variables: Record<string, unknown>) => {
      const data = (variables?.data ?? {}) as Record<string, unknown>;
      return (
        data.eventId === 'baseEventId' &&
        data.name === 'Test Group' &&
        data.leaderId === 'userId'
      );
    },
  },
  // Mock for recurring event instance scope
  {
    request: {
      query: CREATE_VOLUNTEER_GROUP,
      variables: {
        data: {
          eventId: 'baseEventId',
          leaderId: 'userId',
          name: 'Recurring Group Instance',
          description: 'desc',
          volunteerUserIds: ['userId', 'userId2'],
          volunteersRequired: 10,
          scope: 'THIS_INSTANCE_ONLY',
          recurringEventInstanceId: 'eventInstanceId',
        },
      },
    },
    result: {
      data: {
        createEventVolunteerGroup: {
          id: 'recurringGroupInstanceId',
        },
      },
    },
  },
];

export const MOCKS_EMPTY = [
  {
    request: {
      query: GET_EVENT_VOLUNTEER_GROUPS,
      variables: {
        input: { id: 'eventId' },
      },
    },
    result: {
      data: {
        event: {
          id: 'eventId',
          recurrenceRule: null,
          baseEvent: null,
          volunteerGroups: [],
        },
      },
    },
  },
];

export const MOCKS_ERROR = [
  {
    request: {
      query: GET_EVENT_VOLUNTEER_GROUPS,
      variables: {
        input: { id: 'eventId' },
      },
    },
    error: new Error('An error occurred'),
  },
  {
    request: {
      query: DELETE_VOLUNTEER_GROUP,
      variables: {
        id: 'groupId',
      },
    },
    error: new Error('An error occurred'),
  },
  {
    request: {
      query: MEMBERS_LIST,
      variables: {
        organizationId: 'orgId',
      },
    },
    result: {
      data: {
        usersByOrganizationId: [
          {
            id: 'userId',
            name: 'Harve Lance',
            emailAddress: 'harve@example.com',
            role: 'regular',
            avatarURL: '',
            createdAt: dayjs.utc().subtract(2, 'year').toISOString(),
            updatedAt: dayjs.utc().subtract(1, 'year').toISOString(),
          },
          {
            id: 'userId2',
            name: 'John Doe',
            emailAddress: 'johndoe@example.com',
            role: 'regular',
            avatarURL: '',
            createdAt: dayjs.utc().subtract(2, 'year').toISOString(),
            updatedAt: dayjs.utc().subtract(1, 'year').toISOString(),
          },
        ],
      },
    },
  },
  {
    request: {
      query: CREATE_VOLUNTEER_GROUP,
      variables: {
        data: {
          eventId: 'eventId',
          leaderId: 'userId',
          name: 'Group 1',
          description: 'desc',
          volunteerUserIds: ['userId', 'userId2'],
          volunteersRequired: 10,
        },
      },
    },
    error: new Error('An error occurred'),
  },
  {
    request: {
      query: UPDATE_VOLUNTEER_GROUP,
      variables: {
        id: 'groupId',
        data: {
          eventId: 'eventId',
          name: 'Group 2',
          description: 'desc new',
          volunteersRequired: 10,
        },
      },
    },
    error: new Error('An error occurred'),
  },
];
