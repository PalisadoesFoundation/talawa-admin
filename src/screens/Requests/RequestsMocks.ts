import {
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
          },
        ],
      },
    },
  },
  {
    request: {
      query: ACCEPT_ADMIN_MUTATION,
      variables: {
        id: '123',
        userType: 'ADMIN',
      },
    },
    result: {
      data: {
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
      },
    },
  },
];

export const EMPTY_REQUEST_MOCKS = [
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
        users: [],
      },
    },
  },
  {
    request: {
      query: USER_LIST_REQUEST,
      variables: {
        adminApproved: false,
        first: 12,
        firstName_contains: 'l',
        lastName_contains: '',
        skip: 0,
        userType: 'ADMIN',
      },
      notifyOnNetworkStatusChange: true,
    },
    result: {
      data: {
        users: [],
      },
    },
  },
  {
    request: {
      query: ACCEPT_ADMIN_MUTATION,
      variables: {
        id: '123',
        userType: 'ADMIN',
      },
    },
    result: {
      data: {
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
      },
    },
  },
];

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
      data: undefined,
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

export const ORG_LIST_MOCK = [
  ...MOCKS,
  {
    request: {
      query: ORGANIZATION_CONNECTION_LIST,
    },
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
  },
];
