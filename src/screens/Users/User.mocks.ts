import {
  ORGANIZATION_LIST,
  USER_LIST,
  USER_ORGANIZATION_LIST,
} from 'GraphQl/Queries/Queries';

export const MOCKS = [
  {
    request: {
      query: USER_ORGANIZATION_LIST,
      variables: { id: 'user1' },
    },
    result: {
      data: {
        user: {
          name: 'John Doe',
          avatarURL: '',
          emailAddress: 'John_Does_Palasidoes@gmail.com',
        },
      },
    },
  },
  {
    request: {
      query: USER_LIST,
      variables: {
        input: {
          ids: '123', // Match loggedInUserId from beforeEach
        },
      },
    },
    result: {
      data: {
        usersByIds: [
          // Changed from 'users' to 'usersByIds'
          {
            id: 'user1',
            name: 'John Doe',
            emailAddress: 'john@example.com',
            avatarURL: null,
            createdAt: '2030-06-20T00:00:00.000Z',
            city: 'Kingston',
            state: 'Kingston Parish',
            countryCode: 'JM',
            postalCode: 'JM12345',
            organizationsWhereMember: {
              edges: [
                {
                  node: {
                    id: 'org1',
                    name: 'Organization 1',
                    avatarURL: null,
                    createdAt: '2030-06-20T00:00:00.000Z',
                    city: 'Kingston',
                    state: 'Kingston Parish',
                    countryCode: 'JM',
                    creator: {
                      id: 'user1',
                      name: 'John Doe',
                      emailAddress: 'john@example.com',
                      avatarURL: null,
                    },
                  },
                },
              ],
            },
            createdOrganizations: [
              {
                id: 'org1',
                name: 'Organization 1',
                avatarURL: null,
              },
            ],
          },
          {
            id: 'user2',
            name: 'Jane Doe',
            emailAddress: 'jane@example.com',
            avatarURL: null,
            createdAt: '2030-06-20T00:00:00.000Z',
            city: 'Kingston',
            state: 'Kingston Parish',
            countryCode: 'JM',
            postalCode: 'JM12345',
            organizationsWhereMember: {
              edges: [
                {
                  node: {
                    id: 'org1',
                    name: 'Organization 1',
                    avatarURL: null,
                    createdAt: '2030-06-20T00:00:00.000Z',
                    city: 'Kingston',
                    state: 'Kingston Parish',
                    countryCode: 'JM',
                    creator: {
                      id: 'user1',
                      name: 'John Doe',
                      emailAddress: 'john@example.com',
                      avatarURL: null,
                    },
                  },
                },
              ],
            },
            createdOrganizations: [],
          },
        ],
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_LIST,
    },
    result: {
      data: {
        organizations: [
          {
            id: 'org1',
            image: null,
            creator: {
              firstName: 'John',
              lastName: 'Doe',
            },
            name: 'Palisadoes',
            members: [
              {
                id: 'user1',
              },
              {
                id: 'user2',
              },
            ],
            admins: [
              {
                id: 'user1',
              },
              {
                id: 'user2',
              },
            ],
            createdAt: '09/11/2001',
            address: {
              city: 'Kingston',
              countryCode: 'JM',
              dependentLocality: 'Sample Dependent Locality',
              line1: '123 Jamaica Street',
              line2: 'Apartment 456',
              postalCode: 'JM12345',
              sortingCode: 'ABC-123',
              state: 'Kingston Parish',
            },
          },
        ],
      },
    },
  },
];

export const MOCKS2 = [
  {
    request: {
      query: USER_ORGANIZATION_LIST,
      variables: { id: 'user1' },
    },
    result: {
      data: {
        user: {
          firstName: 'John',
          lastName: 'Doe',
          image: '',
          email: 'John_Does_Palasidoes@gmail.com',
        },
      },
    },
  },
  {
    request: {
      query: USER_LIST,
      variables: {
        input: {
          ids: '123', // Match loggedInUserId from beforeEach
        },
      },
    },
    result: {
      data: {
        usersByIds: [
          // Changed from 'users' to 'usersByIds'
          {
            id: 'user1',
            name: 'John Doe',
            emailAddress: 'john@example.com',
            avatarURL: null,
            createdAt: '2030-06-20T00:00:00.000Z',
            city: 'Kingston',
            state: 'Kingston Parish',
            countryCode: 'JM',
            postalCode: 'JM12345',
            organizationsWhereMember: {
              edges: [
                {
                  node: {
                    id: 'org1',
                    name: 'Organization 1',
                    avatarURL: null,
                    createdAt: '2030-06-20T00:00:00.000Z',
                    city: 'Kingston',
                    state: 'Kingston Parish',
                    countryCode: 'JM',
                    creator: {
                      id: 'user1',
                      name: 'John Doe',
                      emailAddress: 'john@example.com',
                      avatarURL: null,
                    },
                  },
                },
              ],
            },
            createdOrganizations: [],
          },
        ],
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_LIST,
    },
    result: {
      data: {
        organizations: [
          {
            id: 'org1',
            image: null,
            creator: {
              firstName: 'John',
              lastName: 'Doe',
            },
            name: 'Palisadoes',
            members: [
              {
                id: 'user1',
              },
            ],
            admins: [
              {
                id: 'user1',
              },
            ],
            createdAt: '09/11/2001',
            address: {
              city: 'Kingston',
              countryCode: 'JM',
              dependentLocality: 'Sample Dependent Locality',
              line1: '123 Jamaica Street',
              line2: 'Apartment 456',
              postalCode: 'JM12345',
              sortingCode: 'ABC-123',
              state: 'Kingston Parish',
            },
          },
        ],
      },
    },
  },
];
