import { VOLUNTEER_RANKING } from 'GraphQl/Queries/EventVolunteerQueries';
import {
  ORGANIZATIONS_LIST,
  ORGANIZATION_EVENT_CONNECTION_LIST,
  ORGANIZATION_POST_LIST,
} from 'GraphQl/Queries/Queries';

export const MOCKS = [
  {
    request: {
      query: ORGANIZATIONS_LIST,
      variables: { id: 'orgId' },
    },
    result: {
      data: {
        organizations: [
          {
            _id: 'orgId',
            image: '',
            name: 'Dummy Organization',
            description: 'This is a Dummy Organization',
            address: {
              city: 'Delhi',
              countryCode: 'IN',
              dependentLocality: 'Some Dependent Locality',
              line1: '123 Random Street',
              line2: 'Apartment 456',
              postalCode: '110001',
              sortingCode: 'ABC-123',
              state: 'Delhi',
            },
            userRegistrationRequired: true,
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
                createdAt: '12-03-2024',
              },
            ],
            membershipRequests: [
              {
                _id: 'requestId1',
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
      variables: { id: 'orgId', first: 10 },
    },
    result: {
      data: {
        organizations: [
          {
            posts: {
              edges: [
                {
                  node: {
                    _id: 'postId1',
                    title: 'postone',
                    text: 'This is the first post',
                    imageUrl: null,
                    videoUrl: null,
                    createdAt: '2023-08-24T09:26:56.524+00:00',
                    creator: {
                      _id: '640d98d9eb6a743d75341067',
                      firstName: 'Aditya',
                      lastName: 'Shelke',
                      email: 'adidacreator1@gmail.com',
                    },
                    likeCount: 0,
                    commentCount: 0,
                    comments: [],
                    pinned: true,
                    likedBy: [],
                  },
                  cursor: 'postId1',
                },
                {
                  node: {
                    _id: 'postId2',
                    title: 'posttwo',
                    text: 'Tis is the post two',
                    imageUrl: null,
                    videoUrl: null,
                    createdAt: '2023-08-24T09:26:56.524+00:00',
                    creator: {
                      _id: '640d98d9eb6a743d75341067',
                      firstName: 'Aditya',
                      lastName: 'Shelke',
                      email: 'adidacreator1@gmail.com',
                    },
                    likeCount: 0,
                    commentCount: 0,
                    pinned: false,
                    likedBy: [],
                    comments: [],
                  },
                  cursor: 'postId2',
                },
                {
                  node: {
                    _id: 'postId3',
                    title: 'posttwo',
                    text: 'Tis is the post two',
                    imageUrl: null,
                    videoUrl: null,
                    createdAt: '2023-08-24T09:26:56.524+00:00',
                    creator: {
                      _id: '640d98d9eb6a743d75341067',
                      firstName: 'Aditya',
                      lastName: 'Shelke',
                      email: 'adidacreator1@gmail.com',
                    },
                    likeCount: 0,
                    commentCount: 0,
                    pinned: true,
                    likedBy: [],
                    comments: [],
                  },
                  cursor: 'postId3',
                },
                {
                  node: {
                    _id: 'postId4',
                    title: 'posttwo',
                    text: 'Tis is the post two',
                    imageUrl: null,
                    videoUrl: null,
                    createdAt: '2023-08-24T09:26:56.524+00:00',
                    creator: {
                      _id: '640d98d9eb6a743d75341067',
                      firstName: 'Aditya',
                      lastName: 'Shelke',
                      email: 'adidacreator1@gmail.com',
                    },
                    likeCount: 0,
                    commentCount: 0,
                    pinned: false,
                    likedBy: [],
                    comments: [],
                  },
                  cursor: 'postId4',
                },
              ],
              pageInfo: {
                startCursor: 'postId1',
                endCursor: 'postId4',
                hasNextPage: false,
                hasPreviousPage: false,
              },
              totalCount: 4,
            },
          },
        ],
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_EVENT_CONNECTION_LIST,
      variables: {
        organization_id: 'orgId',
      },
    },
    result: {
      data: {
        eventsByOrganizationConnection: [
          {
            _id: 'eventId1',
            title: 'Event 1',
            description: 'Sample Description',
            startDate: '2025-10-29T00:00:00.000Z',
            endDate: '2023-10-29T23:59:59.000Z',
            location: 'Sample Location',
            startTime: '08:00:00',
            endTime: '17:00:00',
            allDay: false,
            recurring: false,
            recurrenceRule: null,
            isRecurringEventException: false,
            isPublic: true,
            isRegisterable: true,
          },
          {
            _id: 'eventId2',
            title: 'Event 2',
            description: 'Sample Description',
            startDate: '2022-10-29T00:00:00.000Z',
            endDate: '2023-10-29T23:59:59.000Z',
            location: 'Sample Location',
            startTime: '08:00:00',
            endTime: '17:00:00',
            allDay: false,
            recurring: false,
            recurrenceRule: null,
            isRecurringEventException: false,
            isPublic: true,
            isRegisterable: true,
          },
        ],
      },
    },
  },
  {
    request: {
      query: VOLUNTEER_RANKING,
      variables: {
        orgId: 'orgId',
        where: {
          orderBy: 'hours_DESC',
          timeFrame: 'allTime',
          limit: 3,
        },
      },
    },
    result: {
      data: {
        getVolunteerRanks: [
          {
            rank: 1,
            hoursVolunteered: 5,
            user: {
              _id: 'userId1',
              lastName: 'Bradley',
              firstName: 'Teresa',
              image: null,
              email: 'testuser4@example.com',
            },
          },
          {
            rank: 2,
            hoursVolunteered: 4,
            user: {
              _id: 'userId2',
              lastName: 'Garza',
              firstName: 'Bruce',
              image: null,
              email: 'testuser5@example.com',
            },
          },
          {
            rank: 3,
            hoursVolunteered: 3,
            user: {
              _id: 'userId3',
              lastName: 'John',
              firstName: 'Doe',
              image: null,
              email: 'testuser6@example.com',
            },
          },
          {
            rank: 4,
            hoursVolunteered: 2,
            user: {
              _id: 'userId4',
              lastName: 'Jane',
              firstName: 'Doe',
              image: null,
              email: 'testuser7@example.com',
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
      query: ORGANIZATIONS_LIST,
      variables: { id: 'orgId' },
    },
    result: {
      data: {
        organizations: [
          {
            _id: 123,
            image: '',
            name: 'Dummy Organization',
            description: 'This is a Dummy Organization',
            address: {
              city: 'Delhi',
              countryCode: 'IN',
              dependentLocality: 'Some Dependent Locality',
              line1: '123 Random Street',
              line2: 'Apartment 456',
              postalCode: '110001',
              sortingCode: 'ABC-123',
              state: 'Delhi',
            },
            userRegistrationRequired: true,
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
                createdAt: '12-03-2024',
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
      variables: { id: 'orgId', first: 10 },
    },
    result: {
      data: {
        organizations: [
          {
            posts: {
              edges: [],
              pageInfo: {
                startCursor: '',
                endCursor: '',
                hasNextPage: false,
                hasPreviousPage: false,
              },
              totalCount: 0,
            },
          },
        ],
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_EVENT_CONNECTION_LIST,
      variables: {
        organization_id: 'orgId',
      },
    },
    result: {
      data: {
        eventsByOrganizationConnection: [],
      },
    },
  },
  {
    request: {
      query: VOLUNTEER_RANKING,
      variables: {
        orgId: '123',
        where: {
          orderBy: 'hours_DESC',
          timeFrame: 'allTime',
          limit: 3,
        },
      },
    },
    result: {
      data: {
        getVolunteerRanks: [],
      },
    },
  },
];

export const ERROR_MOCKS = [
  {
    request: {
      query: ORGANIZATIONS_LIST,
      variables: { id: 'orgId' },
    },
    error: new Error('Mock Graphql ORGANIZATIONS_LIST Error'),
  },
  {
    request: {
      query: ORGANIZATION_POST_LIST,
      variables: { id: 'orgId', first: 10 },
    },
    error: new Error('Mock Graphql ORGANIZATION_POST_LIST Error'),
  },
  {
    request: {
      query: ORGANIZATION_EVENT_CONNECTION_LIST,
      variables: {
        organization_id: 'orgId',
      },
    },
    error: new Error('Mock Graphql ORGANIZATION_EVENT_LIST Error'),
  },
  {
    request: {
      query: VOLUNTEER_RANKING,
      variables: {
        orgId: '123',
        where: {
          orderBy: 'hours_DESC',
          timeFrame: 'allTime',
          limit: 3,
        },
      },
    },
    error: new Error('Mock Graphql VOLUNTEER_RANKING Error'),
  },
];
