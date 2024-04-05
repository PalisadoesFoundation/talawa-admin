import {
<<<<<<< HEAD
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
=======
  ACCEPT_ADMIN_MUTATION,
  REJECT_ADMIN_MUTATION,
} from 'GraphQl/Mutations/mutations';
import {
  ORGANIZATION_CONNECTION_LIST,
  USER_LIST_REQUEST,
  USER_ORGANIZATION_LIST,
} from 'GraphQl/Queries/Queries';

export const MOCKS = [
  {
    request: {
      query: USER_ORGANIZATION_LIST,
      variables: { id: localStorage.getItem('id') },
    },
    result: {
      data: {
        user: {
          _id: '123',
          userType: 'SUPERADMIN',
          firstName: 'John',
          lastName: 'Doe',
          image: '',
          email: 'John_Does_Palasidoes@gmail.com',
          adminFor: {
            _id: 1,
            name: 'Akatsuki',
            image: '',
          },
        },
      },
    },
  },
  {
    request: {
      query: USER_LIST_REQUEST,
      variables: {
        adminApproved: false,
        first: 12,
        firstName_contains: '',
        lastName_contains: '',
        skip: 0,
        userType: 'ADMIN',
      },
      notifyOnNetworkStatusChange: true,
    },
    result: {
      data: {
        users: [
          {
            _id: '123',
            firstName: 'John',
            lastName: 'Doe',
            image: 'dummyImage',
            email: 'johndoe@gmail.com',
            userType: 'SUPERADMIN',
            adminApproved: true,
            createdAt: '20/06/2022',
            organizationsBlockedBy: [
              {
                _id: '256',
                name: 'ABC',
              },
            ],
            joinedOrganizations: [
              {
                __typename: 'Organization',
                _id: '6401ff65ce8e8406b8f07af1',
              },
            ],
          },
          {
            _id: '456',
            firstName: 'Sam',
            lastName: 'Smith',
            image: 'dummyImage',
            email: 'samsmith@gmail.com',
            userType: 'ADMIN',
            adminApproved: false,
            createdAt: '20/06/2022',
            organizationsBlockedBy: [
              {
                _id: '256',
                name: 'ABC',
              },
            ],
            joinedOrganizations: [
              {
                __typename: 'Organization',
                _id: '6401ff65ce8e8406b8f07af2',
              },
            ],
          },
          {
            _id: '789',
            firstName: 'Peter',
            lastName: 'Parker',
            image: 'dummyImage',
            email: 'peterparker@gmail.com',
            userType: 'USER',
            adminApproved: true,
            createdAt: '20/06/2022',
            organizationsBlockedBy: [
              {
                _id: '256',
                name: 'ABC',
              },
            ],
            joinedOrganizations: [
              {
                __typename: 'Organization',
                _id: '6401ff65ce8e8406b8f07af3',
              },
            ],
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
          },
        ],
      },
    },
  },
  {
    request: {
<<<<<<< HEAD
      query: MEMBERSHIP_REQUEST,
      variables: {
        id: 'org1',
        skip: 0,
        first: 8,
        firstName_contains: '',
=======
      query: ACCEPT_ADMIN_MUTATION,
      variables: {
        id: '123',
        userType: 'ADMIN',
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
      },
    },
    result: {
      data: {
<<<<<<< HEAD
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
=======
        acceptAdmin: true,
      },
    },
  },
  {
    request: {
      query: REJECT_ADMIN_MUTATION,
      variables: {
        id: '123',
        userType: 'ADMIN',
      },
    },
    result: {
      data: {
        rejectAdmin: true,
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
      },
    },
  },
];

<<<<<<< HEAD
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
=======
export const EMPTY_ORG_MOCKS = [
  {
    request: {
      query: ACCEPT_ADMIN_MUTATION,
      variables: {
        id: '123',
        userType: 'ADMIN',
      },
    },
    result: {
      data: undefined,
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    },
  },
  {
    request: {
<<<<<<< HEAD
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
=======
      query: REJECT_ADMIN_MUTATION,
      variables: {
        id: '123',
        userType: 'ADMIN',
      },
    },
    result: {
      data: undefined,
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
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

<<<<<<< HEAD
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
=======
export const ORG_LIST_MOCK = [
  ...MOCKS,
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  {
    request: {
      query: ORGANIZATION_CONNECTION_LIST,
    },
<<<<<<< HEAD
=======
    result: {
      data: {
        organizationsConnection: [
          {
            _id: 1,
            image: '',
            name: 'Akatsuki',
            creator: {
              firstName: 'John',
              lastName: 'Doe',
            },
            admins: [
              {
                _id: '123',
              },
            ],
            members: {
              _id: '234',
            },
            createdAt: '02/02/2022',
            location: 'Washington DC',
          },
        ],
      },
    },
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  },
];
