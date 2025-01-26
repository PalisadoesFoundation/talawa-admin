import {
  ORGANIZATION_CONNECTION_LIST,
  USER_LIST,
} from 'GraphQl/Queries/Queries';

import { MOCK_USERS, MOCK_USERS2 } from './Organization.mocks';

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
