import { UPDATE_VOLUNTEER_MEMBERSHIP } from 'GraphQl/Mutations/EventVolunteerMutation';
import { USER_VOLUNTEER_MEMBERSHIP } from 'GraphQl/Queries/EventVolunteerQueries';

const baseEvent = (id: string, name: string, startAt: string) => ({
  _id: id,
  id,
  name,
  startAt,
  endAt: startAt,
  recurrenceRule: null,
});

const baseVolunteer = (
  id: string,
  name: string,
  avatarURL: string | null,
  email = 'john@example.com',
) => ({
  _id: id,
  id,
  hasAccepted: false,
  hoursVolunteered: 0,
  user: {
    _id: id.replace('volunteer', 'user'),
    id: id.replace('volunteer', 'user'),
    name,
    emailAddress: email,
    avatarURL,
  },
});

const baseAudit = { id: 'adminId', name: 'Admin User' };

const membership1 = {
  _id: 'membershipId1',
  id: 'membershipId1',
  status: 'invited',
  createdAt: '2024-10-29T10:18:05.851Z',
  updatedAt: '2024-10-29T10:18:05.851Z',
  event: baseEvent('eventId', 'Event 1', '2044-10-31T10:00:00Z'),
  volunteer: baseVolunteer('volunteerId1', 'John Doe', 'img-url'),
  createdBy: baseAudit,
  updatedBy: baseAudit,
  group: null,
};

const membership2 = {
  _id: 'membershipId2',
  id: 'membershipId2',
  status: 'invited',
  createdAt: '2024-10-30T10:18:05.851Z',
  updatedAt: '2024-10-30T10:18:05.851Z',
  event: baseEvent('eventId2', 'Event 2', '2044-11-30T12:00:00Z'),
  volunteer: baseVolunteer('volunteerId2', 'John Doe', null),
  group: {
    _id: 'groupId1',
    id: 'groupId1',
    name: 'Group 1',
    description: 'Group 1 description',
  },
  createdBy: baseAudit,
  updatedBy: baseAudit,
};
const membership3 = {
  _id: 'membershipId3',
  id: 'membershipId3',
  status: 'invited',
  createdAt: '2024-10-30T10:18:05.851Z',
  updatedAt: '2024-10-30T10:18:05.851Z',
  event: {
    ...baseEvent('eventId3', 'Event 3', '2044-11-30T12:00:00Z'),
    recurrenceRule: { id: 'recurrenceRuleId3' },
  },
  volunteer: baseVolunteer('volunteerId3', 'John Doe', null),
  group: {
    name: 'Group 2',
    _id: 'groupId2',
    id: 'groupId2',
    description: 'Group 2 description',
  },
  createdBy: baseAudit,
  updatedBy: baseAudit,
};
const membership4 = {
  _id: 'membershipId4',
  id: 'membershipId4',
  status: 'invited',
  createdAt: '2024-10-30T10:18:05.851Z',
  updatedAt: '2024-10-30T10:18:05.851Z',
  event: baseEvent('eventId4', 'Event 4', '2044-12-01T08:00:00Z'),
  volunteer: baseVolunteer('volunteerId4', 'John Doe', null),
  group: null,
  createdBy: baseAudit,
  updatedBy: baseAudit,
};
const membership5 = {
  _id: 'membershipId5',
  id: 'membershipId5',
  status: 'invited',
  createdAt: '2024-10-30T10:18:05.851Z',
  updatedAt: '2024-10-30T10:18:05.851Z',
  event: {
    ...baseEvent('eventId5', 'Event 5', '2044-11-30T13:00:00Z'),
    recurrenceRule: { id: 'recurrenceRuleId5' },
  },
  volunteer: baseVolunteer('volunteerId5', 'John Doe', null),
  group: null,
  createdBy: baseAudit,
  updatedBy: baseAudit,
};

export const MOCKS = [
  {
    request: {
      query: USER_VOLUNTEER_MEMBERSHIP,
      variables: {
        where: {
          userId: 'userId',
          status: 'invited',
        },
      },
    },
    result: {
      data: {
        getVolunteerMembership: [
          membership1,
          membership2,
          membership3,
          membership4,
          membership5,
        ],
      },
    },
  },
  {
    request: {
      query: USER_VOLUNTEER_MEMBERSHIP,
      variables: {
        where: {
          userId: 'userId',
          status: 'invited',
        },
        orderBy: 'createdAt_DESC',
      },
    },
    result: {
      data: {
        getVolunteerMembership: [membership2, membership1],
      },
    },
  },
  {
    request: {
      query: USER_VOLUNTEER_MEMBERSHIP,
      variables: {
        where: {
          userId: 'userId',
          status: 'invited',
        },
        orderBy: 'createdAt_ASC',
      },
    },
    result: {
      data: {
        getVolunteerMembership: [membership1, membership2],
      },
    },
  },
  {
    request: {
      query: USER_VOLUNTEER_MEMBERSHIP,
      variables: {
        where: {
          userId: 'userId',
          status: 'invited',
          filter: 'group',
        },
      },
    },
    result: {
      data: {
        getVolunteerMembership: [membership2],
      },
    },
  },
  {
    request: {
      query: USER_VOLUNTEER_MEMBERSHIP,
      variables: {
        where: {
          userId: 'userId',
          status: 'invited',
          filter: 'individual',
        },
      },
    },
    result: {
      data: {
        getVolunteerMembership: [membership1],
      },
    },
  },
  {
    request: {
      query: USER_VOLUNTEER_MEMBERSHIP,
      variables: {
        where: {
          userId: 'userId',
          status: 'invited',
          eventTitle: '1',
        },
      },
    },
    result: {
      data: {
        getVolunteerMembership: [membership1],
      },
    },
  },
  {
    request: {
      query: UPDATE_VOLUNTEER_MEMBERSHIP,
      variables: {
        id: 'membershipId1',
        status: 'accepted',
      },
    },
    result: {
      data: {
        updateVolunteerMembership: {
          _id: 'membershipId1',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_VOLUNTEER_MEMBERSHIP,
      variables: {
        id: 'membershipId1',
        status: 'rejected',
      },
    },
    result: {
      data: {
        updateVolunteerMembership: {
          _id: 'membershipId1',
        },
      },
    },
  },
];

export const EMPTY_MOCKS = [
  {
    request: {
      query: USER_VOLUNTEER_MEMBERSHIP,
      variables: {
        where: {
          userId: 'userId',
          status: 'invited',
        },
      },
    },
    result: {
      data: {
        getVolunteerMembership: [],
      },
    },
  },
];

export const ERROR_MOCKS = [
  {
    request: {
      query: USER_VOLUNTEER_MEMBERSHIP,
      variables: {
        where: {
          userId: 'userId',
          status: 'invited',
        },
      },
    },
    error: new Error('Mock Graphql USER_VOLUNTEER_MEMBERSHIP Error'),
  },
  {
    request: {
      query: UPDATE_VOLUNTEER_MEMBERSHIP,
      variables: {
        id: 'membershipId1',
        status: 'accepted',
      },
    },
    error: new Error('Mock Graphql UPDATE_VOLUNTEER_MEMBERSHIP Error'),
  },
];

export const UPDATE_ERROR_MOCKS = [
  {
    request: {
      query: USER_VOLUNTEER_MEMBERSHIP,
      variables: {
        where: {
          userId: 'userId',
          status: 'invited',
        },
      },
    },
    result: {
      data: {
        getVolunteerMembership: [membership1, membership2],
      },
    },
  },
  {
    request: {
      query: UPDATE_VOLUNTEER_MEMBERSHIP,
      variables: {
        id: 'membershipId1',
        status: 'accepted',
      },
    },
    error: new Error('Mock Graphql UPDATE_VOLUNTEER_MEMBERSHIP Error'),
  },
];

// Separate mocks for testing invitation subject text based on group/individual and recurrence rule
export const GROUP_RECURRING_MOCKS = [
  {
    request: {
      query: USER_VOLUNTEER_MEMBERSHIP,
      variables: {
        where: {
          userId: 'userId',
          status: 'invited',
        },
      },
    },
    result: {
      data: {
        getVolunteerMembership: [membership3], // Group with recurring event
      },
    },
  },
];

export const GROUP_NON_RECURRING_MOCKS = [
  {
    request: {
      query: USER_VOLUNTEER_MEMBERSHIP,
      variables: {
        where: {
          userId: 'userId',
          status: 'invited',
        },
      },
    },
    result: {
      data: {
        getVolunteerMembership: [membership2], // Group with recurrenceRule: null
      },
    },
  },
];

export const INDIVIDUAL_RECURRING_MOCKS = [
  {
    request: {
      query: USER_VOLUNTEER_MEMBERSHIP,
      variables: {
        where: {
          userId: 'userId',
          status: 'invited',
        },
      },
    },
    result: {
      data: {
        getVolunteerMembership: [membership5], // Individual with recurring event
      },
    },
  },
];

export const INDIVIDUAL_NON_RECURRING_MOCKS = [
  {
    request: {
      query: USER_VOLUNTEER_MEMBERSHIP,
      variables: {
        where: {
          userId: 'userId',
          status: 'invited',
        },
      },
    },
    result: {
      data: {
        getVolunteerMembership: [membership4], // Individual with recurrenceRule: null
      },
    },
  },
];
