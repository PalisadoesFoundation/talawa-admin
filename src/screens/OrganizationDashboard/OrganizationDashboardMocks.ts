import {
  ORGANIZATIONS_LIST,
  ORGANIZATION_EVENT_CONNECTION_LIST,
  ORGANIZATION_POST_CONNECTION_LIST,
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
      query: ORGANIZATION_POST_CONNECTION_LIST,
    },
    result: {
      data: {
        postsByOrganizationConnection: {
          edges: [
            {
              _id: '6411e53835d7ba2344a78e21',
              title: 'Post 15',
              text: 'This is the first post that was made',
              imageUrl: null,
              videoUrl: null,
              creator: {
                _id: '640d98d9eb6a743d75341067',
                firstName: 'Aditya',
                lastName: 'Shelke',
                email: 'adidacreator1@gmail.com',
              },
              createdAt: dayjs(new Date()).add(1, 'day'),
              likeCount: 0,
              commentCount: 0,
              comments: [],
              likedBy: [],
              pinned: false,
            },
            {
              _id: '6411e54835d7ba2344a78e29',
              title: 'Post 2',
              text: 'Hey, anyone saw my watch that I left at the office?',
              imageUrl: null,
              videoUrl: null,
              creator: {
                _id: '640d98d9eb6a743d75341067',
                firstName: 'Aditya',
                lastName: 'Shelke',
                email: 'adidacreator1@gmail.com',
              },
              pinned: false,
              createdAt: dayjs(new Date()).add(1, 'day'),
              likeCount: 0,
              commentCount: 2,
              comments: [
                {
                  _id: '64eb13beca85de60ebe0ed0e',
                  creator: {
                    _id: '63d6064458fce20ee25c3bf7',
                    firstName: 'Noble',
                    lastName: 'Mittal',
                    email: 'test@gmail.com',
                    __typename: 'User',
                  },
                  likeCount: 1,
                  likedBy: [
                    {
                      _id: 1,
                    },
                  ],
                  text: 'Yes, that is $50',
                  __typename: 'Comment',
                },
                {
                  _id: '64eb483aca85de60ebe0ef99',
                  creator: {
                    _id: '63d6064458fce20ee25c3bf7',
                    firstName: 'Noble',
                    lastName: 'Mittal',
                    email: 'test@gmail.com',
                    __typename: 'User',
                  },
                  likeCount: 0,
                  likedBy: [],
                  text: 'Great View',
                  __typename: 'Comment',
                },
              ],
              likedBy: [
                {
                  _id: '63d6064458fce20ee25c3bf7',
                  firstName: 'Comment',
                  lastName: 'Likkert',
                },
              ],
            },
          ],
        },
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_EVENT_CONNECTION_LIST,
      variables: { organization_id: 'your_organization_id' },
    },
    result: {
      data: {
        eventsByOrganizationConnection: [
          { startDate: new Date().toISOString() }, // Assuming an event is upcoming
        ],
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_EVENT_CONNECTION_LIST,
      variables: {
        organization_id: '123',
      },
    },
    result: {
      data: {
        eventsByOrganizationConnection: [
          {
            _id: '1',
            title: 'Sample Event',
            description: 'Sample Description',
            startDate: '2023-10-29T00:00:00.000Z',
            endDate: '2023-10-29T23:59:59.000Z',
            location: 'Sample Location',
            startTime: '08:00:00',
            endTime: '17:00:00',
            allDay: false,
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
      query: ORGANIZATION_POST_CONNECTION_LIST,
    },
    result: {
      data: {
        postsByOrganizationConnection: {
          edges: [],
        },
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_EVENT_CONNECTION_LIST,
    },
    result: {
      data: {
        eventsByOrganizationConnection: [],
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
      query: ORGANIZATION_POST_CONNECTION_LIST,
    },
    error: new Error('Mock Graphql ORGANIZATION_POST_LIST Error'),
  },
  {
    request: {
      query: ORGANIZATION_EVENT_CONNECTION_LIST,
    },
    error: new Error('Mock Graphql ORGANIZATION_EVENT_LIST Error'),
  },
];
