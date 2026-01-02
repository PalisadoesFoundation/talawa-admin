import {
  ORGANIZATION_LIST,
  USER_LIST,
  USER_LIST_FOR_ADMIN,
} from 'GraphQl/Queries/Queries';
import { MOCK_USERS } from './Organization.mocks';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

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
      query: USER_LIST_FOR_ADMIN,
      variables: {
        first: 12,
        after: null,
        orgFirst: 32,
        where: undefined,
      },
    },
    result: {
      data: {
        allUsers: {
          pageInfo: {
            endCursor: null,
            hasPreviousPage: false,
            hasNextPage: false,
            startCursor: null,
          },
          edges: [],
        },
      },
    },
  },
  {
    request: {
      query: USER_LIST_FOR_ADMIN,
      variables: {
        first: 12,
        after: null,
        orgFirst: 32,
        where: {
          name: 'NonexistentName',
        },
      },
    },
    result: {
      data: {
        allUsers: {
          pageInfo: {
            endCursor: null,
            hasPreviousPage: false,
            hasNextPage: false,
            startCursor: null,
          },
          edges: [],
        },
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

export const USER_UNDEFINED_MOCK = [
  {
    request: {
      query: USER_LIST_FOR_ADMIN,
      variables: {
        first: 12,
        after: null,
        orgFirst: 32,
        where: undefined,
      },
    },
    result: {
      data: {
        allUsers: {
          pageInfo: {
            endCursor: null,
            hasPreviousPage: false,
            hasNextPage: false,
            startCursor: null,
          },
          edges: [],
        },
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
  {
    request: {
      query: ORGANIZATION_LIST,
      variables: {
        filter: '',
        limit: null,
        offset: null,
      },
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
      query: USER_LIST_FOR_ADMIN,
      variables: {
        first: 12,
        after: null,
        orgFirst: 32,
        where: undefined,
      },
    },
    result: {
      data: {
        allUsers: {
          pageInfo: {
            endCursor: 'cursor_1',
            hasNextPage: true,
            hasPreviousPage: false,
            startCursor: 'cursor_start',
          },
          edges: [
            {
              cursor: 'cursor_1',
              node: {
                id: '1',
                name: 'John Doe',
                role: 'Member',
                avatarURL: 'https://example.com/avatar1.png',
                emailAddress: 'john@example.com',
                createdAt: dayjs
                  .utc()
                  .add(1, 'year')
                  .startOf('year')
                  .toISOString(),
                city: 'New York',
                state: 'NY',
                countryCode: 'US',
                postalCode: '10001',
                orgsWhereUserIsBlocked: { edges: [] },
                organizationsWhereMember: { edges: [] },
              },
            },
          ],
        },
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
