import {
  ORGANIZATIONS_LIST,
  ORGANIZATION_EVENT_LIST,
  ORGANIZATION_POST_LIST,
} from 'GraphQl/Queries/Queries';
import dayjs from 'dayjs';

export const MOCKS = [
  {
    request: {
      query: ORGANIZATIONS_LIST,
    },
    result: {
      data: {
        organizations: [
          {
            _id: 123,
            image: '',
            name: 'Dummy Organization',
            description: 'This is a Dummy Organization',
            location: 'New Delhi',
            isPublic: true,
            visibleInSearch: false,
            creator: {
              firstName: '',
              lastName: '',
              email: '',
            },
            members: [
              {
                _id: '123',
                firstName: 'John',
                lastName: 'Doe',
                email: 'johndoe@gmail.com',
              },
            ],
            admins: [
              {
                _id: '123',
                firstName: 'John',
                lastName: 'Doe',
                email: 'johndoe@gmail.com',
              },
            ],
            membershipRequests: [
              {
                _id: '456',
                user: {
                  firstName: 'Jane',
                  lastName: 'Doe',
                  email: 'janedoe@gmail.com',
                },
              },
            ],
            blockedUsers: [
              {
                _id: '789',
                firstName: 'Steve',
                lastName: 'Smith',
                email: 'stevesmith@gmail.com',
              },
            ],
          },
        ],
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_POST_LIST,
    },
    result: {
      data: {
        postsByOrganization: [
          {
            _id: 1,
            title: 'Post 1',
            text: 'Test Post',
            imageUrl: '',
            videoUrl: '',
            creator: {
              _id: '583',
              firstName: 'John',
              lastName: 'Doe',
              email: 'johndoe@gmail.com',
            },
            createdAt: '01-31-2023',
          },
        ],
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_EVENT_LIST,
    },
    result: {
      data: {
        eventsByOrganization: [
          {
            _id: 1,
            title: 'Event 1',
            description: 'Event Test',
            startDate: dayjs(new Date()).add(1, 'day'),
            endDate: dayjs(new Date()).add(3, 'day'),
            location: 'New Delhi',
            startTime: '',
            endTime: '',
            allDay: true,
            recurring: false,
            isPublic: true,
            isRegisterable: true,
          },
          {
            _id: 2,
            title: 'Event 2',
            description: 'Event Test',
            startDate: dayjs(new Date()),
            endDate: dayjs(new Date()).add(1, 'day'),
            location: 'Jamaica',
            startTime: '',
            endTime: '',
            allDay: true,
            recurring: false,
            isPublic: true,
            isRegisterable: true,
          },
        ],
      },
    },
  },
];

export const EMPTY_MOCKS = [
  {
    request: {
      query: ORGANIZATIONS_LIST,
    },
    result: {
      data: {
        organizations: [
          {
            _id: 123,
            image: '',
            name: 'Dummy Organization',
            description: 'This is a Dummy Organization',
            location: 'New Delhi',
            isPublic: true,
            visibleInSearch: false,
            creator: {
              firstName: 'John',
              lastName: 'Doe',
              email: 'johndoe@gmail.com',
            },
            members: [
              {
                _id: '123',
                firstName: 'John',
                lastName: 'Doe',
                email: 'johndoe@gmail.com',
              },
            ],
            admins: [
              {
                _id: '123',
                firstName: 'John',
                lastName: 'Doe',
                email: 'johndoe@gmail.com',
              },
            ],
            membershipRequests: [],
            blockedUsers: [
              {
                _id: '789',
                firstName: 'Steve',
                lastName: 'Smith',
                email: 'stevesmith@gmail.com',
              },
            ],
          },
        ],
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_POST_LIST,
    },
    result: {
      data: {
        postsByOrganization: [],
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_EVENT_LIST,
    },
    result: {
      data: {
        eventsByOrganization: [],
      },
    },
  },
];

export const ERROR_MOCKS = [
  {
    request: {
      query: ORGANIZATIONS_LIST,
    },
    error: new Error('Mock Graphql ORGANIZATIONS_LIST Error'),
  },
  {
    request: {
      query: ORGANIZATION_POST_LIST,
    },
    error: new Error('Mock Graphql ORGANIZATION_POST_LIST Error'),
  },
  {
    request: {
      query: ORGANIZATION_EVENT_LIST,
    },
    error: new Error('Mock Graphql ORGANIZATION_EVENT_LIST Error'),
  },
];
