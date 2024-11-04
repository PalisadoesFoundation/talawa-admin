import {
  ORGANIZATIONS_LIST,
  ORGANIZATION_EVENT_CONNECTION_LIST,
  ORGANIZATION_POST_LIST,
} from 'GraphQl/Queries/Queries';

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
                createdAt: '12-03-2024',
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
      variables: { first: 10 },
    },
    result: {
      data: {
        organizations: [
          {
            posts: {
              edges: [
                {
                  node: {
                    _id: '6411e53835d7ba2344a78e21',
                    title: 'postone',
                    text: 'This is the first post',
                    file: {
                      _id: 'file123',
                      fileName: 'sample.pdf',
                      mimeType: 'application/pdf',
                      size: 1024,
                      hash: {
                        value: 'abc123hash',
                        algorithm: 'SHA-256',
                      },
                      uri: 'https://example.com/files/sample.pdf',
                      metadata: {
                        objectKey: 'uploads/sample.pdf',
                      },
                      visibility: 'PUBLIC',
                      status: 'READY',
                    },
                    creator: {
                      _id: '640d98d9eb6a743d75341067',
                      firstName: 'Aditya',
                      lastName: 'Shelke',
                      email: 'adidacreator1@gmail.com',
                      image: 'https://example.com/profile.jpg',
                    },
                    createdAt: '2023-08-24T09:26:56.524+00:00',
                    likeCount: 2,
                    likedBy: [
                      {
                        _id: '123',
                        firstName: 'John',
                        lastName: 'Doe',
                      },
                      {
                        _id: '124',
                        firstName: 'Jane',
                        lastName: 'Doe',
                      },
                    ],
                    commentCount: 1,
                    comments: [
                      {
                        _id: 'comment123',
                        text: 'Great post!',
                        creator: {
                          _id: '125',
                          firstName: 'Alice',
                          lastName: 'Smith',
                          image: 'https://example.com/alice.jpg',
                        },
                        createdAt: '2023-08-24T10:00:00.000+00:00',
                        likeCount: 1,
                        likedBy: [
                          {
                            _id: '123',
                          },
                        ],
                      },
                    ],
                    pinned: true,
                  },
                  cursor: '6411e53835d7ba2344a78e21',
                },
                {
                  node: {
                    _id: '6411e54835d7ba2344a78e29',
                    title: 'posttwo',
                    text: 'This is post two',
                    file: null,
                    creator: {
                      _id: '640d98d9eb6a743d75341067',
                      firstName: 'Aditya',
                      lastName: 'Shelke',
                      email: 'adidacreator1@gmail.com',
                      image: 'https://example.com/profile.jpg',
                    },
                    createdAt: '2023-08-24T09:26:56.524+00:00',
                    likeCount: 0,
                    likedBy: [],
                    commentCount: 0,
                    comments: [],
                    pinned: false,
                  },
                  cursor: '6411e54835d7ba2344a78e29',
                },
              ],
              pageInfo: {
                startCursor: '6411e53835d7ba2344a78e21',
                endCursor: '6411e54835d7ba2344a78e29',
                hasNextPage: false,
                hasPreviousPage: false,
              },
              totalCount: 2,
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
            _id: '2',
            title: 'Sample Event',
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
      variables: { first: 10 },
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
      query: ORGANIZATION_POST_LIST,
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
