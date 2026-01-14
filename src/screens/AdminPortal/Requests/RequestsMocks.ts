import {
  MEMBERSHIP_REQUEST_PG,
  ORGANIZATION_LIST,
} from 'GraphQl/Queries/Queries';
import { PAGE_SIZE } from 'types/ReportingTable/utils';
import dayjs from 'dayjs';

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
              createdAt: dayjs().subtract(1, 'year').toISOString(),
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
              createdAt: dayjs()
                .subtract(1, 'year')
                .add(1, 'day')
                .toISOString(),
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
          membershipRequests: Array.from({ length: 8 }, (_, i) => ({
            membershipRequestId: `${i + 1}`,
            createdAt: dayjs().subtract(1, 'year').add(i, 'days').toISOString(),
            status: 'pending',
            user: {
              avatarURL: null,
              id: `user${i + 2}`,
              name: [
                'Scott Tony',
                'Teresa Bradley',
                'Jesse Hart',
                'Lena Mcdonald',
                'David Smith',
                'Emily Johnson',
                'Michael Davis',
                'Sarah Wilson',
              ][i],
              emailAddress: `testuser${i + 3}@example.com`,
            },
          })),
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
          membershipRequests: Array.from({ length: 8 }, (_, i) => ({
            membershipRequestId: `${i + 9}`,
            createdAt: dayjs()
              .subtract(1, 'year')
              .add(i + 8, 'days')
              .toISOString(),
            status: 'pending',
            user: {
              avatarURL: null,
              id: `user${i + 10}`,
              name: [
                'Daniel Brown',
                'Jessica Martinez',
                'Matthew Taylor',
                'Amanda Anderson',
                'Christopher Thomas',
                'Ashley Hernandez',
                'Andrew Young',
                'Nicole Garcia',
              ][i],
              emailAddress: `testuser${i + 11}@example.com`,
            },
          })),
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
            createdAt: dayjs().subtract(1, 'year').add(i, 'days').toISOString(),
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
            createdAt: dayjs().subtract(1, 'year').add(i, 'days').toISOString(),
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
              createdAt: dayjs().subtract(1, 'year').toISOString(),
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
