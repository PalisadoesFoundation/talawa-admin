import {
  ADD_VOLUNTEER,
  DELETE_VOLUNTEER,
} from 'GraphQl/Mutations/EventVolunteerMutation';
import { GET_EVENT_VOLUNTEERS } from 'GraphQl/Queries/EventVolunteerQueries';
import { MEMBERS_LIST } from 'GraphQl/Queries/Queries';

const volunteer1 = {
  id: 'volunteerId1',
  hasAccepted: true,
  volunteerStatus: 'accepted',
  hoursVolunteered: 10,
  isPublic: true,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
  user: {
    id: 'userId1',
    name: 'Teresa Bradley',
    avatarURL: null,
  },
  event: {
    id: 'eventId',
    name: 'Test Event',
  },
  creator: {
    id: 'userId1',
    name: 'Creator Name',
  },
  updater: {
    id: 'userId1',
    name: 'Updater Name',
  },
  groups: [
    {
      id: 'groupId1',
      name: 'group1',
      description: 'Test group',
      volunteers: [
        {
          id: 'volunteerId1',
        },
      ],
    },
  ],
};

const volunteer2 = {
  id: 'volunteerId2',
  hasAccepted: false,
  volunteerStatus: 'pending',
  hoursVolunteered: null,
  isPublic: true,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
  user: {
    id: 'userId2',
    name: 'Bruce Graza',
    avatarURL: 'img-url',
  },
  event: {
    id: 'eventId',
    name: 'Test Event',
  },
  creator: {
    id: 'userId2',
    name: 'Creator Name',
  },
  updater: {
    id: 'userId2',
    name: 'Updater Name',
  },
  groups: [],
};

const eventResponseWrapper = (volunteers: any[]) => ({
  id: 'eventId',
  recurrenceRule: null,
  baseEvent: null,
  volunteers,
});

export const MOCKS = [
  {
    request: {
      query: GET_EVENT_VOLUNTEERS,
      variables: {
        input: { id: 'eventId' },
        where: {
          eventId: 'eventId',
          name_contains: '',
          hasAccepted: undefined,
        },
        orderBy: null,
      },
    },
    result: {
      data: {
        event: eventResponseWrapper([volunteer1, volunteer2]),
      },
    },
  },
  {
    request: {
      query: GET_EVENT_VOLUNTEERS,
      variables: {
        input: { id: 'eventId' },
        where: {
          eventId: 'eventId',
          name_contains: '',
          hasAccepted: undefined,
        },
        orderBy: 'hoursVolunteered_ASC',
      },
    },
    result: {
      data: {
        event: eventResponseWrapper([volunteer2, volunteer1]),
      },
    },
  },
  {
    request: {
      query: GET_EVENT_VOLUNTEERS,
      variables: {
        input: { id: 'eventId' },
        where: {
          eventId: 'eventId',
          name_contains: '',
          hasAccepted: undefined,
        },
        orderBy: 'hoursVolunteered_DESC',
      },
    },
    result: {
      data: {
        event: eventResponseWrapper([volunteer1, volunteer2]),
      },
    },
  },
  {
    request: {
      query: GET_EVENT_VOLUNTEERS,
      variables: {
        input: { id: 'eventId' },
        where: {
          eventId: 'eventId',
          name_contains: 'T',
          hasAccepted: undefined,
        },
        orderBy: null,
      },
    },
    result: {
      data: {
        event: eventResponseWrapper([volunteer1]),
      },
    },
  },
  {
    request: {
      query: GET_EVENT_VOLUNTEERS,
      variables: {
        input: { id: 'eventId' },
        where: { eventId: 'eventId', name_contains: '', hasAccepted: false },
        orderBy: null,
      },
    },
    result: {
      data: {
        event: eventResponseWrapper([volunteer2]),
      },
    },
  },
  {
    request: {
      query: GET_EVENT_VOLUNTEERS,
      variables: {
        input: { id: 'eventId' },
        where: { eventId: 'eventId', name_contains: '', hasAccepted: true },
        orderBy: null,
      },
    },
    result: {
      data: {
        event: eventResponseWrapper([volunteer1]),
      },
    },
  },
  {
    request: {
      query: DELETE_VOLUNTEER,
      variables: {
        id: 'volunteerId1',
      },
    },
    result: {
      data: {
        removeEventVolunteer: {
          id: 'volunteerId1',
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
            id: 'userId3',
            name: 'John Doe',
            emailAddress: 'johndoe@example.com',
            role: 'regular',
            avatarURL: '',
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
          },
          {
            id: 'userId4',
            name: 'Jane Smith',
            emailAddress: 'jane@example.com',
            role: 'regular',
            avatarURL: '',
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
          },
        ],
      },
    },
  },
  {
    request: {
      query: ADD_VOLUNTEER,
      variables: {
        data: {
          eventId: 'eventId',
          userId: 'userId3',
        },
      },
    },
    result: {
      data: {
        createEventVolunteer: {
          id: 'volunteerId1',
        },
      },
    },
  },
];

export const MOCKS_ERROR = [
  {
    request: {
      query: GET_EVENT_VOLUNTEERS,
      variables: {
        input: { id: 'eventId' },
        where: {
          eventId: 'eventId',
          name_contains: '',
          hasAccepted: undefined,
        },
        orderBy: null,
      },
    },
    error: new Error('An error occurred'),
  },
  {
    request: {
      query: DELETE_VOLUNTEER,
      variables: {
        id: 'volunteerId1',
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
            id: 'userId3',
            name: 'John Doe',
            emailAddress: 'johndoe@example.com',
            role: 'regular',
            avatarURL: '',
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
          },
        ],
      },
    },
  },
  {
    request: {
      query: ADD_VOLUNTEER,
      variables: {
        data: {
          eventId: 'eventId',
          userId: 'userId3',
        },
      },
    },
    error: new Error('An error occurred'),
  },
];

export const MOCKS_EMPTY = [
  {
    request: {
      query: GET_EVENT_VOLUNTEERS,
      variables: {
        input: { id: 'eventId' },
        where: {
          eventId: 'eventId',
          name_contains: '',
          hasAccepted: undefined,
        },
        orderBy: null,
      },
    },
    result: {
      data: {
        event: eventResponseWrapper([]),
      },
    },
  },
];
