import {
  MEMBERSHIP_REQUEST,
  ORGANIZATION_CONNECTION_LIST,
} from 'GraphQl/Queries/Queries';

export const EMPTY_REQUEST_MOCKS = [
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
        id: '',
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
        id: '',
        skip: 0,
        first: 8,
        firstName_contains: '',
      },
    },
    result: {
      data: {
        organizations: [
          {
            _id: '',
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

export const MOCKS4 = [
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
        id: '',
        skip: 0,
        first: 8,
        firstName_contains: '',
      },
    },
    result: {
      data: {
        organizations: [
          {
            _id: '',
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
              {
                _id: '3',
                user: {
                  _id: 'user4',
                  firstName: 'Jesse',
                  lastName: 'Hart',
                  email: 'testuser5@example.com',
                },
              },
              {
                _id: '4',
                user: {
                  _id: 'user5',
                  firstName: 'Lena',
                  lastName: 'Mcdonald',
                  email: 'testuser6@example.com',
                },
              },
              {
                _id: '5',
                user: {
                  _id: 'user6',
                  firstName: 'David',
                  lastName: 'Smith',
                  email: 'testuser7@example.com',
                },
              },
              {
                _id: '6',
                user: {
                  _id: 'user7',
                  firstName: 'Emily',
                  lastName: 'Johnson',
                  email: 'testuser8@example.com',
                },
              },
              {
                _id: '7',
                user: {
                  _id: 'user8',
                  firstName: 'Michael',
                  lastName: 'Davis',
                  email: 'testuser9@example.com',
                },
              },
              {
                _id: '8',
                user: {
                  _id: 'user9',
                  firstName: 'Sarah',
                  lastName: 'Wilson',
                  email: 'testuser10@example.com',
                },
              },
            ],
          },
        ],
      },
    },
  },
  {
    request: {
      query: MEMBERSHIP_REQUEST,
      variables: {
        id: '',
        skip: 8,
        first: 16,
        firstName_contains: '',
      },
    },
    result: {
      data: {
        organizations: [
          {
            _id: '',
            membershipRequests: [
              {
                _id: '9',
                user: {
                  _id: 'user10',
                  firstName: 'Daniel',
                  lastName: 'Brown',
                  email: 'testuser11@example.com',
                },
              },
              {
                _id: '10',
                user: {
                  _id: 'user11',
                  firstName: 'Jessica',
                  lastName: 'Martinez',
                  email: 'testuser12@example.com',
                },
              },
              {
                _id: '11',
                user: {
                  _id: 'user12',
                  firstName: 'Matthew',
                  lastName: 'Taylor',
                  email: 'testuser13@example.com',
                },
              },
              {
                _id: '12',
                user: {
                  _id: 'user13',
                  firstName: 'Amanda',
                  lastName: 'Anderson',
                  email: 'testuser14@example.com',
                },
              },
              {
                _id: '13',
                user: {
                  _id: 'user14',
                  firstName: 'Christopher',
                  lastName: 'Thomas',
                  email: 'testuser15@example.com',
                },
              },
              {
                _id: '14',
                user: {
                  _id: 'user15',
                  firstName: 'Ashley',
                  lastName: 'Hernandez',
                  email: 'testuser16@example.com',
                },
              },
              {
                _id: '15',
                user: {
                  _id: 'user16',
                  firstName: 'Andrew',
                  lastName: 'Young',
                  email: 'testuser17@example.com',
                },
              },
              {
                _id: '16',
                user: {
                  _id: 'user17',
                  firstName: 'Nicole',
                  lastName: 'Garcia',
                  email: 'testuser18@example.com',
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

export const MOCKS3 = [
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
        organizations: [],
      },
    },
  },
];

export const EMPTY_MOCKS = [
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
