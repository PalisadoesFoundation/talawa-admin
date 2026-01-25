import {
  ADD_VOLUNTEER,
  DELETE_VOLUNTEER,
} from 'GraphQl/Mutations/EventVolunteerMutation';
import { GET_EVENT_VOLUNTEERS } from 'GraphQl/Queries/EventVolunteerQueries';
import { MEMBERS_LIST } from 'GraphQl/Queries/Queries';
import { InterfaceEventVolunteerInfo } from 'types/Volunteer/interface';
import dayjs from 'dayjs';

const volunteer1: InterfaceEventVolunteerInfo = {
  id: 'volunteerId1',
  hasAccepted: true,
  volunteerStatus: 'accepted' as const,
  hoursVolunteered: 10,
  isPublic: true,
  isTemplate: true,
  isInstanceException: false,
  createdAt: dayjs().subtract(1, 'year').toISOString(),
  updatedAt: dayjs().subtract(1, 'year').toISOString(),
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

const volunteer2: InterfaceEventVolunteerInfo = {
  id: 'volunteerId2',
  hasAccepted: false,
  volunteerStatus: 'pending' as const,
  hoursVolunteered: 0,
  isPublic: true,
  isTemplate: true,
  isInstanceException: false,
  createdAt: dayjs().subtract(1, 'year').toISOString(),
  updatedAt: dayjs().subtract(1, 'year').toISOString(),
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

const volunteer3: InterfaceEventVolunteerInfo = {
  id: 'volunteerId3',
  hasAccepted: false,
  volunteerStatus: 'rejected' as const,
  hoursVolunteered: 5,
  isPublic: true,
  isTemplate: true,
  isInstanceException: false,
  createdAt: dayjs().subtract(1, 'year').toISOString(),
  updatedAt: dayjs().subtract(1, 'year').toISOString(),
  user: {
    id: 'userId3',
    name: 'Jane Doe',
    avatarURL: null,
  },
  event: {
    id: 'eventId',
    name: 'Test Event',
  },
  creator: {
    id: 'userId3',
    name: 'Creator Name',
  },
  updater: {
    id: 'userId3',
    name: 'Updater Name',
  },
  groups: [],
};

const eventResponseWrapper = (volunteers: InterfaceEventVolunteerInfo[]) => ({
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
        orderBy: undefined,
      },
    },
    result: {
      data: {
        event: eventResponseWrapper([volunteer1, volunteer2, volunteer3]),
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
        event: eventResponseWrapper([volunteer2, volunteer3, volunteer1]),
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
        event: eventResponseWrapper([volunteer1, volunteer3, volunteer2]),
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
        orderBy: undefined,
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
        where: {
          eventId: 'eventId',
          name_contains: 'Teresa',
          hasAccepted: undefined,
        },
        orderBy: undefined,
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
        orderBy: undefined,
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
        orderBy: undefined,
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
            firstName: 'John',
            lastName: 'Doe',
            name: 'John Doe',
            emailAddress: 'johndoe@example.com',
            role: 'regular',
            avatarURL: '',
            createdAt: dayjs().subtract(1, 'year').toISOString(),
            updatedAt: dayjs().subtract(1, 'year').toISOString(),
          },
          {
            id: 'userId4',
            firstName: 'Jane',
            lastName: 'Smith',
            name: 'Jane Smith',
            emailAddress: 'jane@example.com',
            role: 'regular',
            avatarURL: '',
            createdAt: dayjs().subtract(1, 'year').toISOString(),
            updatedAt: dayjs().subtract(1, 'year').toISOString(),
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
  // Mock for recurring event series volunteering
  {
    request: {
      query: ADD_VOLUNTEER,
      variables: {
        data: {
          eventId: 'baseEventId',
          userId: 'userId3',
          scope: 'ENTIRE_SERIES',
        },
      },
    },
    result: {
      data: {
        createEventVolunteer: {
          id: 'recurringVolunteerId1',
        },
      },
    },
  },
  // Mock for recurring event instance volunteering
  {
    request: {
      query: ADD_VOLUNTEER,
      variables: {
        data: {
          eventId: 'baseEventId',
          userId: 'userId3',
          scope: 'THIS_INSTANCE_ONLY',
          recurringEventInstanceId: 'eventInstanceId',
        },
      },
    },
    result: {
      data: {
        createEventVolunteer: {
          id: 'recurringVolunteerId2',
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
        orderBy: undefined,
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
            firstName: 'John',
            lastName: 'Doe',
            name: 'John Doe',
            emailAddress: 'johndoe@example.com',
            role: 'regular',
            avatarURL: '',
            createdAt: dayjs().subtract(1, 'year').toISOString(),
            updatedAt: dayjs().subtract(1, 'year').toISOString(),
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
        orderBy: undefined,
      },
    },
    result: {
      data: {
        event: eventResponseWrapper([]),
      },
    },
  },
];
