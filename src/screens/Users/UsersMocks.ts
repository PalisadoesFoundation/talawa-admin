import {
  ORGANIZATION_CONNECTION_LIST,
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
        first: 12,
        skip: 0,
        firstName_contains: '',
        lastName_contains: '',
      },
    },
    result: {
      data: {
        users: [
          {
            user: {
              _id: 'user1',
              firstName: 'John',
              lastName: 'Doe',
              image: null,
              email: 'john@example.com',
              createdAt: '20/06/2022',
              registeredEvents: [],
              membershipRequests: [],
              organizationsBlockedBy: [
                {
                  _id: 'xyz',
                  name: 'ABC',
                  image: null,
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
                  createdAt: '20/06/2022',
                  creator: {
                    _id: '123',
                    firstName: 'John',
                    lastName: 'Doe',
                    image: null,
                    email: 'john@example.com',
                    createdAt: '20/06/2022',
                  },
                },
              ],
              joinedOrganizations: [
                {
                  _id: 'abc',
                  name: 'Joined Organization 1',
                  image: null,
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
                  createdAt: '20/06/2022',
                  creator: {
                    _id: '123',
                    firstName: 'John',
                    lastName: 'Doe',
                    image: null,
                    email: 'john@example.com',
                    createdAt: '20/06/2022',
                  },
                },
              ],
            },
            appUserProfile: {
              _id: 'user1',
              adminFor: [
                {
                  _id: '123',
                },
              ],
              isSuperAdmin: true,
              createdOrganizations: [],
              createdEvents: [],
              eventAdmin: [],
            },
          },
          {
            user: {
              _id: 'user2',
              firstName: 'Jane',
              lastName: 'Doe',
              image: null,
              email: 'john@example.com',
              createdAt: '20/06/2022',
              registeredEvents: [],
              membershipRequests: [],
              organizationsBlockedBy: [
                {
                  _id: '456',
                  name: 'ABC',
                  image: null,
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
                  createdAt: '20/06/2022',
                  creator: {
                    _id: '123',
                    firstName: 'John',
                    lastName: 'Doe',
                    image: null,
                    email: 'john@example.com',
                    createdAt: '20/06/2022',
                  },
                },
              ],
              joinedOrganizations: [
                {
                  _id: '123',
                  name: 'Palisadoes',
                  image: null,
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
                  createdAt: '20/06/2022',
                  creator: {
                    _id: '123',
                    firstName: 'John',
                    lastName: 'Doe',
                    image: null,
                    email: 'john@example.com',
                    createdAt: '20/06/2022',
                  },
                },
              ],
            },
            appUserProfile: {
              _id: 'user2',
              adminFor: [
                {
                  _id: '123',
                },
              ],
              isSuperAdmin: false,
              createdOrganizations: [],
              createdEvents: [],
              eventAdmin: [],
            },
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
        organizationsConnection: [
          {
            _id: 123,
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
              {
                _id: 'user2',
              },
            ],
            admins: [
              {
                _id: 'user1',
              },
              {
                _id: 'user2',
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
        first: 12,
        skip: 0,
        firstName_contains: '',
        lastName_contains: '',
      },
    },
    result: {
      data: {
        users: [
          {
            user: {
              _id: 'user1',
              firstName: 'John',
              lastName: 'Doe',
              image: null,
              email: 'john@example.com',
              createdAt: '20/06/2022',
              registeredEvents: [],
              membershipRequests: [],
              organizationsBlockedBy: [
                {
                  _id: 'xyz',
                  name: 'ABC',
                  image: null,
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
                  createdAt: '20/06/2022',
                  creator: {
                    _id: '123',
                    firstName: 'John',
                    lastName: 'Doe',
                    image: null,
                    email: 'john@example.com',
                    createdAt: '20/06/2022',
                  },
                },
              ],
              joinedOrganizations: [
                {
                  _id: 'abc',
                  name: 'Joined Organization 1',
                  image: null,
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
                  createdAt: '20/06/2022',
                  creator: {
                    _id: '123',
                    firstName: 'John',
                    lastName: 'Doe',
                    image: null,
                    email: 'john@example.com',
                    createdAt: '20/06/2022',
                  },
                },
              ],
            },
            appUserProfile: {
              _id: 'user1',
              adminFor: [
                {
                  _id: '123',
                },
              ],
              isSuperAdmin: true,
              createdOrganizations: [],
              createdEvents: [],
              eventAdmin: [],
            },
          },
          {
            user: {
              _id: 'user2',
              firstName: 'Jane',
              lastName: 'Doe',
              image: null,
              email: 'john@example.com',
              createdAt: '20/06/2022',
              registeredEvents: [],
              membershipRequests: [],
              organizationsBlockedBy: [
                {
                  _id: '456',
                  name: 'ABC',
                  image: null,
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
                  createdAt: '20/06/2022',
                  creator: {
                    _id: '123',
                    firstName: 'John',
                    lastName: 'Doe',
                    image: null,
                    email: 'john@example.com',
                    createdAt: '20/06/2022',
                  },
                },
              ],
              joinedOrganizations: [
                {
                  _id: '123',
                  name: 'Palisadoes',
                  image: null,
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
                  createdAt: '20/06/2022',
                  creator: {
                    _id: '123',
                    firstName: 'John',
                    lastName: 'Doe',
                    image: null,
                    email: 'john@example.com',
                    createdAt: '20/06/2022',
                  },
                },
              ],
            },
            appUserProfile: {
              _id: 'user2',
              adminFor: [
                {
                  _id: '123',
                },
              ],
              isSuperAdmin: false,
              createdOrganizations: [],
              createdEvents: [],
              eventAdmin: [],
            },
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
        organizationsConnection: [
          {
            _id: 123,
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
              {
                _id: 'user2',
              },
            ],
            admins: [
              {
                _id: 'user1',
              },
              {
                _id: 'user2',
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

export const EMPTY_MOCKS = [
  {
    request: {
      query: USER_LIST,
      variables: {
        first: 12,
        skip: 0,
        firstName_contains: '',
        lastName_contains: '',
      },
    },
    result: {
      data: {
        users: [],
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
