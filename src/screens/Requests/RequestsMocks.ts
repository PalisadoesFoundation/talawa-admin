import {
  MEMBERSHIP_REQUEST,
  ORGANIZATION_CONNECTION_LIST,
  USER_ORGANIZATION_LIST,
} from 'GraphQl/Queries/Queries';

export const EMPTY_REQUEST_MOCKS = [
  {
    request: {
      query: USER_ORGANIZATION_LIST,
      variables: { id: 'user1' },
    },
    result: {
      data: {
        user: {
          userType: 'ADMIN',
          firstName: 'John',
          lastName: 'Doe',
          image: '',
          email: 'John_Does_Palasidoes@gmail.com',
          adminFor: [
            {
              _id: 'org1',
              name: 'Palisadoes',
              image: '',
            },
          ],
        },
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_CONNECTION_LIST,
    },
    result: {
      data: {
        organizationsConnection: [
          {
            _id: 'org1',
            image: null,
            creator: {
              firstName: 'John',
              lastName: 'Doe',
            },
            name: 'Palisadoes',
            members: [
              {
                _id: 'user1',
              },
            ],
            admins: [
              {
                _id: 'user1',
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
  {
    request: {
      query: MEMBERSHIP_REQUEST,
      variables: {
        id: 'org1',
        skip: 0,
        first: 8,
        firstName_contains: '',
      },
    },
    result: {
      data: {
        organizations: [
          {
            _id: 'org1',
            membershipRequests: [],
          },
        ],
      },
    },
  },
];

export const MOCKS = [
  {
    request: {
      query: USER_ORGANIZATION_LIST,
      variables: { id: 'user1' },
    },
    result: {
      data: {
        user: {
          userType: 'ADMIN',
          firstName: 'John',
          lastName: 'Doe',
          image: '',
          email: 'John_Does_Palasidoes@gmail.com',
          adminFor: [
            {
              _id: 'org1',
              name: 'Palisadoes',
              image: '',
            },
          ],
        },
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_CONNECTION_LIST,
    },
    result: {
      data: {
        organizationsConnection: [
          {
            _id: 'org1',
            image: null,
            creator: {
              firstName: 'John',
              lastName: 'Doe',
            },
            name: 'Palisadoes',
            members: [
              {
                _id: 'user1',
              },
            ],
            admins: [
              {
                _id: 'user1',
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
  {
    request: {
      query: MEMBERSHIP_REQUEST,
      variables: {
        id: 'org1',
        skip: 0,
        first: 8,
        firstName_contains: '',
      },
    },
    result: {
      data: {
        organizations: [
          {
            _id: 'org1',
            membershipRequests: [
              {
                _id: '1',
                user: {
                  _id: 'user2',
                  firstName: 'Scott',
                  lastName: 'Tony',
                  email: 'testuser3@example.com',
                },
              },
              {
                _id: '2',
                user: {
                  _id: 'user3',
                  firstName: 'Teresa',
                  lastName: 'Bradley',
                  email: 'testuser4@example.com',
                },
              },
            ],
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
          userType: 'ADMIN',
          firstName: 'John',
          lastName: 'Doe',
          image: '',
          email: 'John_Does_Palasidoes@gmail.com',
          adminFor: [
            {
              _id: 'org1',
              name: 'Palisadoes',
              image: '',
            },
          ],
        },
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_CONNECTION_LIST,
    },
    result: {
      data: {
        organizationsConnection: [
          {
            _id: 'org1',
            image: null,
            creator: {
              firstName: 'John',
              lastName: 'Doe',
            },
            name: 'Palisadoes',
            members: [
              {
                _id: 'user1',
              },
            ],
            admins: [
              {
                _id: 'user1',
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
  {
    request: {
      query: MEMBERSHIP_REQUEST,
      variables: {
        id: 'org1',
        skip: 0,
        first: 8,
        firstName_contains: '',
      },
    },
    result: {
      data: {
        organizations: [
          {
            _id: 'org1',
            membershipRequests: [
              {
                _id: '1',
                user: {
                  _id: 'user2',
                  firstName: 'Scott',
                  lastName: 'Tony',
                  email: 'testuser3@example.com',
                },
              },
            ],
          },
        ],
      },
    },
  },
];

export const EMPTY_MOCKS = [
  {
    request: {
      query: USER_ORGANIZATION_LIST,
      variables: { id: '123' },
    },
    result: {
      data: {
        user: {
          userType: 'ADMIN',
          firstName: 'John',
          lastName: 'Doe',
          image: '',
          email: 'John_Does_Palasidoes@gmail.com',
          adminFor: [],
        },
      },
    },
  },
  {
    request: {
      query: MEMBERSHIP_REQUEST,
      variables: {
        id: 'org1',
        skip: 0,
        first: 8,
        firstName_contains: '',
      },
    },
    result: {
      data: {
        organizations: [
          {
            _id: 'org1',
            membershipRequests: [],
          },
        ],
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_CONNECTION_LIST,
    },
    result: {
      data: {
        organizationsConnection: [],
      },
    },
  },
];

export const MOCKS_WITH_ERROR = [
  {
    request: {
      query: USER_ORGANIZATION_LIST,
      variables: { id: 'user1' },
    },
  },
  {
    request: {
      query: MEMBERSHIP_REQUEST,
      variables: {
        first: 0,
        skip: 0,
        id: '1',
        firstName_contains: '',
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_CONNECTION_LIST,
    },
  },
];
