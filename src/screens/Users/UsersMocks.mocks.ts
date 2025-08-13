import { ORGANIZATION_LIST, USER_LIST } from 'GraphQl/Queries/Queries';
import { MOCK_USERS, MOCK_USERS2 } from './Organization.mocks';

// Add pagination and sorting variables to all USER_LIST mocks
const paginationVariables = {
  input: { ids: '123' },
  first: 12,
  skip: 0,
  filter: '',
  order: 'createdAt_DESC',
};

const loadMoreVariables = {
  input: { ids: '123' },
  first: 24,
  skip: 0,
  filter: '',
  order: 'createdAt_DESC',
};

// Example empty mock
export const EMPTY_MOCKS = [
  {
    request: {
      query: USER_LIST,
      variables: {
        input: {
          ids: [],
        },
      },
    },
    result: {
      data: {
        usersByIds: [],
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_LIST,
      variables: { filter: '', limit: null, offset: null },
    },
    result: {
      data: {
        organizations: [],
      },
    },
  },
];

export const MOCKS_NEW_2 = [
  {
    request: {
      query: USER_LIST,
      variables: paginationVariables,
    },
    result: {
      data: {
        usersByIds: MOCK_USERS.slice(0, 1),
      },
    },
  },
  {
    request: {
      query: USER_LIST,
      variables: loadMoreVariables,
    },
    result: {
      data: {
        usersByIds: MOCK_USERS.slice(1, 2),
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_LIST,
      variables: { filter: '', limit: null, offset: null },
    },
    result: {
      data: {
        organizations: [],
      },
    },
  },
];

export const MOCKS_NEW = [
  {
    request: {
      query: USER_LIST,
      variables: paginationVariables,
    },
    result: {
      data: {
        usersByIds: MOCK_USERS,
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_LIST,
      variables: { filter: '', limit: null, offset: null },
    },
    result: {
      data: {
        organizations: [],
      },
    },
  },
];

export const MOCKS_NEW2 = [
  {
    request: {
      query: USER_LIST,
      variables: {
        input: {
          ids: MOCK_USERS2.slice(0, 12).map((u) => u.user._id),
        },
      },
    },
    result: {
      data: {
        usersByIds: MOCK_USERS2.slice(0, 12),
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_LIST,
      variables: { filter: '', limit: null, offset: null },
    },
    result: {
      data: {
        organizations: [],
      },
    },
  },
  {
    request: {
      query: USER_LIST,
      variables: {
        input: {
          ids: MOCK_USERS2.slice(12, 15).map((u) => u.user._id),
        },
      },
    },
    result: {
      data: {
        usersByIds: MOCK_USERS2.slice(12, 15),
      },
    },
  },
];

export const MOCKS_NEW3 = [
  {
    request: {
      query: USER_LIST,
      variables: {
        input: {
          ids: MOCK_USERS2.slice(0, 12).map((u) => u.user._id),
        },
      },
    },
    result: {
      data: {
        usersByIds: MOCK_USERS2.slice(0, 12),
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_LIST,
      variables: { filter: '', limit: null, offset: null },
    },
    result: {
      data: {
        organizations: [],
      },
    },
  },
  {
    request: {
      query: USER_LIST,
      variables: {
        input: {
          ids: MOCK_USERS2.slice(11, 15).map((u) => u.user._id),
        },
      },
    },
    result: {
      data: {
        usersByIds: MOCK_USERS2.slice(11, 15),
      },
    },
  },
  {
    request: {
      query: USER_LIST,
      variables: {
        input: {
          ids: MOCK_USERS2.slice(11, 15).map((u) => u.user._id),
        },
      },
    },
    result: {
      data: {
        usersByIds: MOCK_USERS2.slice(11, 15),
      },
    },
  },
  {
    request: {
      query: USER_LIST,
      variables: {
        input: {
          ids: [],
        },
      },
    },
    result: {
      data: {
        usersByIds: [],
      },
    },
  },
];
