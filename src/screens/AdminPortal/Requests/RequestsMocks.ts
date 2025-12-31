import {
  MEMBERSHIP_REQUEST_PG,
  ORGANIZATION_LIST,
} from 'GraphQl/Queries/Queries';
import { PAGE_SIZE } from '../../../types/ReportingTable/utils';

// Helper functions for mocks

const createRequestVars = (skip = 0, first = PAGE_SIZE, nameContains = '') => ({
  input: { id: '' },
  skip,
  first,
  name_contains: nameContains,
});

const createOrgListMock = () => ({
  request: {
    query: ORGANIZATION_LIST,
  },
  result: {
    data: {
      organizations: [
        {
          id: 'org1',
          name: 'Palisadoes',
          addressLine1: '123 Jamaica Street',
          description: 'A community organization',
          avatarURL: null,
          members: {
            edges: [
              {
                node: {
                  id: 'user1',
                },
              },
            ],
            pageInfo: {
              hasNextPage: false,
            },
          },
        },
      ],
    },
  },
});

export const EMPTY_REQUEST_MOCKS = [
  createOrgListMock(),
  {
    request: {
      query: MEMBERSHIP_REQUEST_PG,
      variables: createRequestVars(),
    },
    result: {
      data: {
        organization: {
          id: 'org1',
          membershipRequests: [],
        },
      },
    },
  },
];

export const MOCKS = [
  createOrgListMock(),
  {
    request: {
      query: MEMBERSHIP_REQUEST_PG,
      variables: createRequestVars(),
    },
    result: {
      data: {
        organization: {
          id: '',
          membershipRequests: [
            {
              membershipRequestId: '1',
              createdAt: '2023-01-01T00:00:00Z',
              status: 'pending',
              user: {
                avatarURL: null,
                id: 'user2',
                name: 'Scott Tony',
                emailAddress: 'testuser3@example.com',
              },
            },
            {
              membershipRequestId: '2',
              createdAt: '2023-01-02T00:00:00Z',
              status: 'pending',
              user: {
                avatarURL: null,
                id: 'user3',
                name: 'Teresa Bradley',
                emailAddress: 'testuser4@example.com',
              },
            },
          ],
        },
      },
    },
  },
];

export const MOCKS4 = [
  createOrgListMock(),
  {
    request: {
      query: MEMBERSHIP_REQUEST_PG,
      variables: createRequestVars(),
    },
    result: {
      data: {
        organization: {
          id: '',
          membershipRequests: [
            {
              membershipRequestId: '1',
              createdAt: '2023-01-01T00:00:00Z',
              status: 'pending',
              user: {
                avatarURL: null,
                id: 'user2',
                name: 'Scott Tony',
                emailAddress: 'testuser3@example.com',
              },
            },
            {
              membershipRequestId: '2',
              createdAt: '2023-01-02T00:00:00Z',
              status: 'pending',
              user: {
                avatarURL: null,
                id: 'user3',
                name: 'Teresa Bradley',
                emailAddress: 'testuser4@example.com',
              },
            },
            {
              membershipRequestId: '3',
              createdAt: '2023-01-03T00:00:00Z',
              status: 'pending',
              user: {
                avatarURL: null,
                id: 'user4',
                name: 'Jesse Hart',
                emailAddress: 'testuser5@example.com',
              },
            },
            {
              membershipRequestId: '4',
              createdAt: '2023-01-04T00:00:00Z',
              status: 'pending',
              user: {
                avatarURL: null,
                id: 'user5',
                name: 'Lena Mcdonald',
                emailAddress: 'testuser6@example.com',
              },
            },
            {
              membershipRequestId: '5',
              createdAt: '2023-01-05T00:00:00Z',
              status: 'pending',
              user: {
                avatarURL: null,
                id: 'user6',
                name: 'David Smith',
                emailAddress: 'testuser7@example.com',
              },
            },
            {
              membershipRequestId: '6',
              createdAt: '2023-01-06T00:00:00Z',
              status: 'pending',
              user: {
                avatarURL: null,
                id: 'user7',
                name: 'Emily Johnson',
                emailAddress: 'testuser8@example.com',
              },
            },
            {
              membershipRequestId: '7',
              createdAt: '2023-01-07T00:00:00Z',
              status: 'pending',
              user: {
                avatarURL: null,
                id: 'user8',
                name: 'Michael Davis',
                emailAddress: 'testuser9@example.com',
              },
            },
            {
              membershipRequestId: '8',
              createdAt: '2023-01-08T00:00:00Z',
              status: 'pending',
              user: {
                avatarURL: null,
                id: 'user9',
                name: 'Sarah Wilson',
                emailAddress: 'testuser10@example.com',
              },
            },
          ],
        },
      },
    },
  },
  {
    request: {
      query: MEMBERSHIP_REQUEST_PG,
      variables: {
        input: { id: '' },
        skip: PAGE_SIZE,
        first: PAGE_SIZE,
        name_contains: '',
      },
    },
    result: {
      data: {
        organization: {
          id: '',
          membershipRequests: [
            {
              membershipRequestId: '9',
              createdAt: '2023-01-09T00:00:00Z',
              status: 'pending',
              user: {
                avatarURL: null,
                id: 'user10',
                name: 'Daniel Brown',
                emailAddress: 'testuser11@example.com',
              },
            },
            {
              membershipRequestId: '10',
              createdAt: '2023-01-10T00:00:00Z',
              status: 'pending',
              user: {
                avatarURL: null,
                id: 'user11',
                name: 'Jessica Martinez',
                emailAddress: 'testuser12@example.com',
              },
            },
            {
              membershipRequestId: '11',
              createdAt: '2023-01-11T00:00:00Z',
              status: 'pending',
              user: {
                avatarURL: null,
                id: 'user12',
                name: 'Matthew Taylor',
                emailAddress: 'testuser13@example.com',
              },
            },
            {
              membershipRequestId: '12',
              createdAt: '2023-01-12T00:00:00Z',
              status: 'pending',
              user: {
                avatarURL: null,
                id: 'user13',
                name: 'Amanda Anderson',
                emailAddress: 'testuser14@example.com',
              },
            },
            {
              membershipRequestId: '13',
              createdAt: '2023-01-13T00:00:00Z',
              status: 'pending',
              user: {
                avatarURL: null,
                id: 'user14',
                name: 'Christopher Thomas',
                emailAddress: 'testuser15@example.com',
              },
            },
            {
              membershipRequestId: '14',
              createdAt: '2023-01-14T00:00:00Z',
              status: 'pending',
              user: {
                avatarURL: null,
                id: 'user15',
                name: 'Ashley Hernandez',
                emailAddress: 'testuser16@example.com',
              },
            },
            {
              membershipRequestId: '15',
              createdAt: '2023-01-15T00:00:00Z',
              status: 'pending',
              user: {
                avatarURL: null,
                id: 'user16',
                name: 'Andrew Young',
                emailAddress: 'testuser17@example.com',
              },
            },
            {
              membershipRequestId: '16',
              createdAt: '2023-01-16T00:00:00Z',
              status: 'pending',
              user: {
                avatarURL: null,
                id: 'user17',
                name: 'Nicole Garcia',
                emailAddress: 'testuser18@example.com',
              },
            },
          ],
        },
      },
    },
  },
];

export const UPDATED_MOCKS = [
  ...MOCKS,
  {
    request: {
      query: MEMBERSHIP_REQUEST_PG,
      variables: createRequestVars(),
    },
    result: {
      data: {
        organization: {
          id: '',
          membershipRequests: Array.from({ length: 8 }, (_, i) => ({
            membershipRequestId: `${i + 1}`,
            createdAt: `2023-01-${String(i + 1).padStart(2, '0')}T00:00:00Z`,
            status: 'pending',
            user: {
              avatarURL: null,
              id: `user${i + 1}`,
              name: `Test User ${i + 1}`,
              emailAddress: `testuser${i + 1}@example.com`,
            },
          })),
        },
      },
    },
  },
  {
    request: {
      query: MEMBERSHIP_REQUEST_PG,
      variables: createRequestVars(PAGE_SIZE),
    },
    result: {
      data: {
        organization: {
          id: '',
          membershipRequests: null,
        },
      },
    },
  },
  // Additional mock for first: 10 consolidated with maxUsageCount
  {
    request: {
      query: MEMBERSHIP_REQUEST_PG,
      variables: {
        input: { id: '' },
        skip: 0,
        first: 10,
        name_contains: '',
      },
    },
    maxUsageCount: 12,
    result: {
      data: {
        organization: {
          id: '',
          membershipRequests: Array.from({ length: 10 }, (_, i) => ({
            membershipRequestId: `${i + 1}`,
            createdAt: `2023-01-${String(i + 1).padStart(2, '0')}T00:00:00Z`,
            status: 'pending',
            user: {
              avatarURL: null,
              id: `user${i + 1}`,
              name: `Test User ${i + 1}`,
              emailAddress: `testuser${i + 1}@example.com`,
            },
          })),
        },
      },
    },
  },
];

export const MOCKS2 = [
  createOrgListMock(),
  {
    request: {
      query: MEMBERSHIP_REQUEST_PG,
      variables: {
        input: { id: 'org1' },
        skip: 0,
        first: PAGE_SIZE,
        name_contains: '',
      },
    },
    result: {
      data: {
        organization: {
          id: 'org1',
          membershipRequests: [
            {
              membershipRequestId: '1',
              createdAt: '2023-01-01T00:00:00Z',
              status: 'pending',
              user: {
                avatarURL: null,
                id: 'user2',
                name: 'Scott Tony',
                emailAddress: 'testuser3@example.com',
              },
            },
          ],
        },
      },
    },
  },
];

export const MOCKS3 = [
  createOrgListMock(),
  {
    request: {
      query: MEMBERSHIP_REQUEST_PG,
      variables: {
        input: { id: 'org1' },
        skip: 0,
        first: PAGE_SIZE,
        name_contains: '',
      },
    },
    result: {
      data: {
        organization: null,
      },
    },
  },
];

export const EMPTY_MOCKS = [
  {
    request: {
      query: MEMBERSHIP_REQUEST_PG,
      variables: {
        input: { id: 'org1' },
        skip: 0,
        first: PAGE_SIZE,
        name_contains: '',
      },
    },
    result: {
      data: {
        organization: {
          id: 'org1',
          membershipRequests: [],
        },
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_LIST,
    },
    result: {
      data: {
        organizations: [],
      },
    },
  },
];

export const MOCKS_WITH_ERROR = [
  {
    request: {
      query: MEMBERSHIP_REQUEST_PG,
      variables: {
        input: { id: '1' },
        first: 0,
        skip: 0,
        name_contains: '',
      },
    },
    error: new Error('An error occurred'),
  },
  {
    request: {
      query: ORGANIZATION_LIST,
    },
    error: new Error('Failed to fetch organizations'),
  },
];
