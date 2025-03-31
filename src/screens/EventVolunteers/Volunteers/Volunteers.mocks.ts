import {
  ADD_VOLUNTEER,
  DELETE_VOLUNTEER,
} from 'GraphQl/Mutations/EventVolunteerMutation';
import { EVENT_VOLUNTEER_LIST } from 'GraphQl/Queries/EventVolunteerQueries';
import { MEMBERS_LIST } from 'GraphQl/Queries/Queries';

const volunteer1 = {
  _id: 'volunteerId1',
  hasAccepted: true,
  hoursVolunteered: 10,
  user: {
    _id: 'userId1',
    firstName: 'Teresa',
    lastName: 'Bradley',
    image: null,
  },
  assignments: [],
  groups: [
    {
      _id: 'groupId1',
      name: 'group1',
      volunteers: [
        {
          _id: 'volunteerId1',
        },
      ],
    },
  ],
};

const volunteer2 = {
  _id: 'volunteerId2',
  hasAccepted: false,
  hoursVolunteered: null,
  user: {
    _id: 'userId3',
    firstName: 'Bruce',
    lastName: 'Graza',
    image: 'img-url',
  },
  assignments: [],
  groups: [],
};

export const MOCKS = [
  {
    request: {
      query: EVENT_VOLUNTEER_LIST,
      variables: {
        where: { eventId: 'eventId', name_contains: '' },
        orderBy: null,
      },
    },
    result: {
      data: {
        getEventVolunteers: [volunteer1, volunteer2],
      },
    },
  },
  {
    request: {
      query: EVENT_VOLUNTEER_LIST,
      variables: {
        where: { eventId: 'eventId', name_contains: '' },
        orderBy: 'hoursVolunteered_ASC',
      },
    },
    result: {
      data: {
        getEventVolunteers: [volunteer2, volunteer1],
      },
    },
  },
  {
    request: {
      query: EVENT_VOLUNTEER_LIST,
      variables: {
        where: { eventId: 'eventId', name_contains: '' },
        orderBy: 'hoursVolunteered_DESC',
      },
    },
    result: {
      data: {
        getEventVolunteers: [volunteer1, volunteer2],
      },
    },
  },
  {
    request: {
      query: EVENT_VOLUNTEER_LIST,
      variables: {
        where: { eventId: 'eventId', name_contains: 'T' },
        orderBy: null,
      },
    },
    result: {
      data: {
        getEventVolunteers: [volunteer1],
      },
    },
  },
  {
    request: {
      query: EVENT_VOLUNTEER_LIST,
      variables: {
        where: { eventId: 'eventId', name_contains: '', hasAccepted: false },
        orderBy: null,
      },
    },
    result: {
      data: {
        getEventVolunteers: [volunteer2],
      },
    },
  },
  {
    request: {
      query: EVENT_VOLUNTEER_LIST,
      variables: {
        where: { eventId: 'eventId', name_contains: '', hasAccepted: false },
        orderBy: null,
      },
    },
    result: {
      data: {
        getEventVolunteers: [volunteer2],
      },
    },
  },
  {
    request: {
      query: EVENT_VOLUNTEER_LIST,
      variables: {
        where: { eventId: 'eventId', name_contains: '', hasAccepted: true },
        orderBy: null,
      },
    },
    result: {
      data: {
        getEventVolunteers: [volunteer1],
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
          _id: 'volunteerId1',
        },
      },
    },
  },
  {
    request: {
      query: MEMBERS_LIST,
      variables: {
        id: 'orgId',
      },
    },
    result: {
      data: {
        organizations: [
          {
            _id: 'orgId',
            members: [
              {
                _id: 'userId2',
                firstName: 'Harve',
                lastName: 'Lance',
                email: 'harve@example.com',
                image: '',
                organizationsBlockedBy: [],
                createdAt: '2024-02-14',
              },
              {
                _id: 'userId3',
                firstName: 'John',
                lastName: 'Doe',
                email: 'johndoe@example.com',
                image: '',
                organizationsBlockedBy: [],
                createdAt: '2024-02-14',
              },
            ],
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
          _id: 'volunteerId1',
        },
      },
    },
  },
];

export const MOCKS_ERROR = [
  {
    request: {
      query: EVENT_VOLUNTEER_LIST,
      variables: {
        where: { eventId: 'eventId', name_contains: '' },
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
        id: 'orgId',
      },
    },
    result: {
      data: {
        organizations: [
          {
            _id: 'orgId',
            members: [
              {
                _id: 'userId2',
                firstName: 'Harve',
                lastName: 'Lance',
                email: 'harve@example.com',
                image: '',
                organizationsBlockedBy: [],
                createdAt: '2024-02-14',
              },
              {
                _id: 'userId3',
                firstName: 'John',
                lastName: 'Doe',
                email: 'johndoe@example.com',
                image: '',
                organizationsBlockedBy: [],
                createdAt: '2024-02-14',
              },
            ],
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
      query: EVENT_VOLUNTEER_LIST,
      variables: {
        where: { eventId: 'eventId', name_contains: '' },
        orderBy: null,
      },
    },
    result: {
      data: {
        getEventVolunteers: [],
      },
    },
  },
];
