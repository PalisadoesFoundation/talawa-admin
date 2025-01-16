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

export const EMPTY_MOCK_NEW = [
  {
    request: {
      query: USER_LIST,
      variables: {
        first: 12,
        skip: 0,
        firstName_contains: 'NonexistentName',
        lastName_contains: '',
        order: 'createdAt_DESC',
      },
    },
    result: {
      data: {
        users: [],
      },
    },
  },
];

export const createAddress = {
  city: 'Kingston',
  countryCode: 'JM',
  dependentLocality: 'Sample Dependent Locality',
  line1: '123 Jamaica Street',
  line2: 'Apartment 456',
  postalCode: 'JM12345',
  sortingCode: 'ABC-123',
  state: 'Kingston Parish',
};

export const createCreator = {
  _id: '123',
  firstName: 'Jack',
  lastName: 'Smith',
  image: null,
  email: 'jack@example.com',
  createdAt: '19/06/2022',
};

export const MOCK_USERS = [
  {
    user: {
      _id: 'user1',
      firstName: 'John',
      lastName: 'Doe',
      image: null,
      email: 'john@example.com',
      createdAt: '2023-04-13T04:53:17.742+00:00',
      registeredEvents: [],
      membershipRequests: [],
      organizationsBlockedBy: [
        {
          _id: 'xyz',
          name: 'ABC',
          image: null,
          address: createAddress,
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
          address: createAddress,
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
      createdAt: '2023-04-17T04:53:17.742+00:00',
      registeredEvents: [],
      membershipRequests: [],
      organizationsBlockedBy: [
        {
          _id: '456',
          name: 'ABC',
          image: null,
          address: createAddress,
          createdAt: '21/06/2022',
          creator: {
            _id: '123',
            firstName: 'John',
            lastName: 'Doe',
            image: null,
            email: 'john@example.com',
            createdAt: '21/06/2022',
          },
        },
      ],
      joinedOrganizations: [
        {
          _id: '123',
          name: 'Palisadoes',
          image: null,
          address: createAddress,
          createdAt: '21/06/2022',
          creator: {
            _id: '123',
            firstName: 'John',
            lastName: 'Doe',
            image: null,
            email: 'john@example.com',
            createdAt: '21/06/2022',
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
  {
    user: {
      _id: 'user3',
      firstName: 'Jack',
      lastName: 'Smith',
      image: null,
      email: 'jack@example.com',
      createdAt: '2023-04-09T04:53:17.742+00:00',
      registeredEvents: [],
      membershipRequests: [],
      organizationsBlockedBy: [
        {
          _id: 'xyz',
          name: 'ABC',
          image: null,
          address: createAddress,
          createdAt: '19/06/2022',
          creator: createCreator,
        },
      ],
      joinedOrganizations: [
        {
          _id: 'abc',
          name: 'Joined Organization 1',
          image: null,
          address: createAddress,
          createdAt: '19/06/2022',
          creator: createCreator,
        },
      ],
    },
    appUserProfile: {
      _id: 'user3',
      adminFor: [],
      isSuperAdmin: false,
      createdOrganizations: [],
      createdEvents: [],
      eventAdmin: [],
    },
  },
];

export const MOCK_USERS2 = [
  ...MOCK_USERS,
  {
    user: {
      _id: 'user4',
      firstName: 'Emma',
      lastName: 'Johnson',
      image: null,
      email: 'emma@example.com',
      createdAt: '2023-04-22T04:53:17.742+00:00',
      registeredEvents: [],
      membershipRequests: [],
      organizationsBlockedBy: [
        {
          _id: 'xyz',
          name: 'ABC',
          image: null,
          address: createAddress,
          createdAt: '19/06/2022',
          creator: createCreator,
        },
      ],
      joinedOrganizations: [
        {
          _id: 'abc',
          name: 'Joined Organization 1',
          image: null,
          address: createAddress,
          createdAt: '19/06/2022',
          creator: createCreator,
        },
      ],
    },
    appUserProfile: {
      _id: 'user4',
      adminFor: [],
      isSuperAdmin: false,
      createdOrganizations: [],
      createdEvents: [],
      eventAdmin: [],
    },
  },
  {
    user: {
      _id: 'user5',
      firstName: 'Liam',
      lastName: 'Smith',
      image: null,
      email: 'liam@example.com',
      createdAt: '2023-04-23T04:53:17.742+00:00',
      registeredEvents: [],
      membershipRequests: [],
      organizationsBlockedBy: [
        {
          _id: 'xyz',
          name: 'ABC',
          image: null,
          address: createAddress,
          createdAt: '19/06/2022',
          creator: createCreator,
        },
      ],
      joinedOrganizations: [
        {
          _id: 'abc',
          name: 'Joined Organization 1',
          image: null,
          address: createAddress,
          createdAt: '19/06/2022',
          creator: createCreator,
        },
      ],
    },
    appUserProfile: {
      _id: 'user5',
      adminFor: [],
      isSuperAdmin: false,
      createdOrganizations: [],
      createdEvents: [],
      eventAdmin: [],
    },
  },
  {
    user: {
      _id: 'user6',
      firstName: 'Olivia',
      lastName: 'Brown',
      image: null,
      email: 'olivia@example.com',
      createdAt: '2023-04-24T04:53:17.742+00:00',
      registeredEvents: [],
      membershipRequests: [],
      organizationsBlockedBy: [
        {
          _id: 'xyz',
          name: 'ABC',
          image: null,
          address: createAddress,
          createdAt: '19/06/2022',
          creator: createCreator,
        },
      ],
      joinedOrganizations: [
        {
          _id: 'abc',
          name: 'Joined Organization 1',
          image: null,
          address: createAddress,
          createdAt: '19/06/2022',
          creator: createCreator,
        },
      ],
    },
    appUserProfile: {
      _id: 'user6',
      adminFor: [],
      isSuperAdmin: false,
      createdOrganizations: [],
      createdEvents: [],
      eventAdmin: [],
    },
  },
  {
    user: {
      _id: 'user7',
      firstName: 'Noah',
      lastName: 'Williams',
      image: null,
      email: 'noah@example.com',
      createdAt: '2023-04-25T04:53:17.742+00:00',
      registeredEvents: [],
      membershipRequests: [],
      organizationsBlockedBy: [
        {
          _id: 'xyz',
          name: 'ABC',
          image: null,
          address: createAddress,
          createdAt: '19/06/2022',
          creator: createCreator,
        },
      ],
      joinedOrganizations: [
        {
          _id: 'abc',
          name: 'Joined Organization 1',
          image: null,
          address: createAddress,
          createdAt: '19/06/2022',
          creator: createCreator,
        },
      ],
    },
    appUserProfile: {
      _id: 'user7',
      adminFor: [],
      isSuperAdmin: false,
      createdOrganizations: [],
      createdEvents: [],
      eventAdmin: [],
    },
  },
  {
    user: {
      _id: 'user8',
      firstName: 'Ava',
      lastName: 'Jones',
      image: null,
      email: 'ava@example.com',
      createdAt: '2023-04-26T04:53:17.742+00:00',
      registeredEvents: [],
      membershipRequests: [],
      organizationsBlockedBy: [
        {
          _id: 'xyz',
          name: 'ABC',
          image: null,
          address: createAddress,
          createdAt: '19/06/2022',
          creator: createCreator,
        },
      ],
      joinedOrganizations: [
        {
          _id: 'abc',
          name: 'Joined Organization 1',
          image: null,
          address: createAddress,
          createdAt: '19/06/2022',
          creator: createCreator,
        },
      ],
    },
    appUserProfile: {
      _id: 'user8',
      adminFor: [],
      isSuperAdmin: false,
      createdOrganizations: [],
      createdEvents: [],
      eventAdmin: [],
    },
  },
  {
    user: {
      _id: 'user9',
      firstName: 'Ethan',
      lastName: 'Garcia',
      image: null,
      email: 'ethan@example.com',
      createdAt: '2023-04-27T04:53:17.742+00:00',
      registeredEvents: [],
      membershipRequests: [],
      organizationsBlockedBy: [
        {
          _id: 'xyz',
          name: 'ABC',
          image: null,
          address: createAddress,
          createdAt: '19/06/2022',
          creator: createCreator,
        },
      ],
      joinedOrganizations: [
        {
          _id: 'abc',
          name: 'Joined Organization 1',
          image: null,
          address: createAddress,
          createdAt: '19/06/2022',
          creator: createCreator,
        },
      ],
    },
    appUserProfile: {
      _id: 'user9',
      adminFor: [],
      isSuperAdmin: false,
      createdOrganizations: [],
      createdEvents: [],
      eventAdmin: [],
    },
  },
  {
    user: {
      _id: 'user10',
      firstName: 'Sophia',
      lastName: 'Martinez',
      image: null,
      email: 'sophia@example.com',
      createdAt: '2023-04-28T04:53:17.742+00:00',
      registeredEvents: [],
      membershipRequests: [],
      organizationsBlockedBy: [
        {
          _id: 'xyz',
          name: 'ABC',
          image: null,
          address: createAddress,
          createdAt: '19/06/2022',
          creator: createCreator,
        },
      ],
      joinedOrganizations: [
        {
          _id: 'abc',
          name: 'Joined Organization 1',
          image: null,
          address: createAddress,
          createdAt: '19/06/2022',
          creator: createCreator,
        },
      ],
    },
    appUserProfile: {
      _id: 'user10',
      adminFor: [],
      isSuperAdmin: false,
      createdOrganizations: [],
      createdEvents: [],
      eventAdmin: [],
    },
  },
  {
    user: {
      _id: 'user11',
      firstName: 'Mason',
      lastName: 'Davis',
      image: null,
      email: 'mason@example.com',
      createdAt: '2023-04-29T04:53:17.742+00:00',
      registeredEvents: [],
      membershipRequests: [],
      organizationsBlockedBy: [
        {
          _id: 'xyz',
          name: 'ABC',
          image: null,
          address: createAddress,
          createdAt: '19/06/2022',
          creator: createCreator,
        },
      ],
      joinedOrganizations: [
        {
          _id: 'abc',
          name: 'Joined Organization 1',
          image: null,
          address: createAddress,
          createdAt: '19/06/2022',
          creator: createCreator,
        },
      ],
    },
    appUserProfile: {
      _id: 'user11',
      adminFor: [],
      isSuperAdmin: false,
      createdOrganizations: [],
      createdEvents: [],
      eventAdmin: [],
    },
  },
  {
    user: {
      _id: 'user12',
      firstName: 'Isabella',
      lastName: 'Rodriguez',
      image: null,
      email: 'isabella@example.com',
      createdAt: '2023-04-30T04:53:17.742+00:00',
      registeredEvents: [],
      membershipRequests: [],
      organizationsBlockedBy: [
        {
          _id: 'xyz',
          name: 'ABC',
          image: null,
          address: createAddress,
          createdAt: '19/06/2022',
          creator: createCreator,
        },
      ],
      joinedOrganizations: [
        {
          _id: 'abc',
          name: 'Joined Organization 1',
          image: null,
          address: createAddress,
          createdAt: '19/06/2022',
          creator: createCreator,
        },
      ],
    },
    appUserProfile: {
      _id: 'user12',
      adminFor: [],
      isSuperAdmin: false,
      createdOrganizations: [],
      createdEvents: [],
      eventAdmin: [],
    },
  },
  {
    user: {
      _id: 'user13',
      firstName: 'Logan',
      lastName: 'Wilson',
      image: null,
      email: 'logan@example.com',
      createdAt: '2023-04-08T04:53:17.742+00:00',
      registeredEvents: [],
      membershipRequests: [],
      organizationsBlockedBy: [
        {
          _id: 'xyz',
          name: 'ABC',
          image: null,
          address: createAddress,
          createdAt: '19/06/2022',
          creator: createCreator,
        },
      ],
      joinedOrganizations: [
        {
          _id: 'abc',
          name: 'Joined Organization 1',
          image: null,
          address: createAddress,
          createdAt: '19/06/2022',
          creator: createCreator,
        },
      ],
    },
    appUserProfile: {
      _id: 'user13',
      adminFor: [],
      isSuperAdmin: false,
      createdOrganizations: [],
      createdEvents: [],
      eventAdmin: [],
    },
  },
  {
    user: {
      _id: 'user14',
      firstName: 'Mia',
      lastName: 'Anderson',
      image: null,
      email: 'mia@example.com',
      createdAt: '2023-04-07T04:53:17.742+00:00',
      registeredEvents: [],
      membershipRequests: [],
      organizationsBlockedBy: [
        {
          _id: 'xyz',
          name: 'ABC',
          image: null,
          address: createAddress,
          createdAt: '19/06/2022',
          creator: createCreator,
        },
      ],
      joinedOrganizations: [
        {
          _id: 'abc',
          name: 'Joined Organization 1',
          image: null,
          address: createAddress,
          createdAt: '19/06/2022',
          creator: createCreator,
        },
      ],
    },
    appUserProfile: {
      _id: 'user14',
      adminFor: [],
      isSuperAdmin: false,
      createdOrganizations: [],
      createdEvents: [],
      eventAdmin: [],
    },
  },
  {
    user: {
      _id: 'user15',
      firstName: 'Lucas',
      lastName: 'Thomas',
      image: null,
      email: 'lucas@example.com',
      createdAt: '2023-04-05T04:53:17.742+00:00',
      registeredEvents: [],
      membershipRequests: [],
      organizationsBlockedBy: [
        {
          _id: 'xyz',
          name: 'ABC',
          image: null,
          address: createAddress,
          createdAt: '19/06/2022',
          creator: createCreator,
        },
      ],
      joinedOrganizations: [
        {
          _id: 'abc',
          name: 'Joined Organization 1',
          image: null,
          address: createAddress,
          createdAt: '19/06/2022',
          creator: createCreator,
        },
      ],
    },
    appUserProfile: {
      _id: 'user15',
      adminFor: [],
      isSuperAdmin: false,
      createdOrganizations: [],
      createdEvents: [],
      eventAdmin: [],
    },
  },
];

export const MOCKS_NEW_2 = [
  {
    request: {
      query: USER_LIST,
      variables: {
        first: 12,
        skip: 0,
        firstName_contains: '',
        lastName_contains: '',
        order: 'createdAt_DESC',
      },
    },
    result: {
      data: {
        users: MOCK_USERS.slice(0, 12),
      },
    },
  },
  {
    request: {
      query: USER_LIST,
      variables: {
        first: 24,
        skip: 0,
        firstName_contains: '',
        lastName_contains: '',
        order: 'createdAt_DESC',
      },
    },
    result: {
      data: {
        users: MOCK_USERS.slice(12, 24),
      },
    },
  },
];

export const MOCKS_NEW = [
  {
    request: {
      query: USER_LIST,
      variables: {
        first: 12,
        skip: 0,
        firstName_contains: '',
        lastName_contains: '',
        order: 'createdAt_DESC',
      },
    },
    result: {
      data: {
        users: MOCK_USERS,
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

export const MOCKS_NEW2 = [
  {
    request: {
      query: USER_LIST,
      variables: {
        first: 12,
        skip: 0,
        firstName_contains: '',
        lastName_contains: '',
        order: 'createdAt_DESC',
      },
    },
    result: {
      data: {
        users: MOCK_USERS2.slice(0, 12),
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
  {
    request: {
      query: USER_LIST,
      variables: {
        first: 24,
        skip: 0,
        firstName_contains: '',
        lastName_contains: '',
        order: 'createdAt_DESC',
        filter: '',
      },
    },
    result: {
      data: {
        users: MOCK_USERS2.slice(12, 15),
      },
    },
  },
];

export const MOCKS_NEW3 = [
  {
    request: {
      query: USER_LIST,
      variables: {
        first: 12,
        skip: 0,
        firstName_contains: '',
        lastName_contains: '',
        order: 'createdAt_DESC',
      },
    },
    result: {
      data: {
        users: MOCK_USERS2.slice(0, 12),
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
  {
    request: {
      query: USER_LIST,
      variables: {
        first: 24,
        skip: 0,
        firstName_contains: '',
        lastName_contains: '',
        order: 'createdAt_DESC',
        filter: '',
      },
    },
    result: {
      data: {
        users: MOCK_USERS2.slice(11, 15),
      },
    },
  },
  {
    request: {
      query: USER_LIST,
      variables: {
        first: 24,
        skip: 0,
        firstName_contains: '',
        lastName_contains: '',
        order: 'createdAt_DESC',
        filter: '',
      },
    },
    result: {
      data: {
        users: MOCK_USERS2.slice(11, 15),
      },
    },
  },
  {
    request: {
      query: USER_LIST,
      variables: {
        first: 13,
        skip: 3,
        firstName_contains: '',
        lastName_contains: '',
        order: 'createdAt_DESC',
        filter: '',
      },
    },
    result: {
      data: {
        users: [],
      },
    },
  },
];
