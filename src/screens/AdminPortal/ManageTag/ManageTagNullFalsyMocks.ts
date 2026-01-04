import {
  REMOVE_USER_TAG,
  UNASSIGN_USER_TAG,
  UPDATE_USER_TAG,
} from 'GraphQl/Mutations/TagMutations';
import { USER_TAGS_ASSIGNED_MEMBERS } from 'GraphQl/Queries/userTagQueries';
import { TAGS_QUERY_DATA_CHUNK_SIZE } from 'utils/organizationTagsUtils';
import { buildAssignedUsers } from './ManageTagMockUtils';

export const MOCKS_NULL_USERS_ASSIGNED_TO = [
  {
    request: {
      query: USER_TAGS_ASSIGNED_MEMBERS,
      variables: {
        id: '1',
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        where: {
          firstName: { starts_with: '' },
          lastName: { starts_with: '' },
        },
        sortedBy: { id: 'DESCENDING' },
      },
    },
    result: {
      data: {
        getAssignedUsers: {
          __typename: 'UserTag',
          name: 'tag1',
          usersAssignedTo: null,
          ancestorTags: [],
        },
      },
    },
  },
];

export const MOCKS_EMPTY_ASSIGNED_MEMBERS_ARRAY = [
  {
    request: {
      query: USER_TAGS_ASSIGNED_MEMBERS,
      variables: {
        id: '1',
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        where: {
          firstName: { starts_with: '' },
          lastName: { starts_with: '' },
        },
        sortedBy: { id: 'DESCENDING' },
      },
    },
    result: {
      data: {
        getAssignedUsers: buildAssignedUsers({
          usersAssignedTo: {
            edges: [],
            pageInfo: {
              startCursor: null,
              endCursor: null,
              hasNextPage: false,
              hasPreviousPage: false,
            },
            totalCount: 0,
          },
        }),
      },
    },
  },
];

// Alias for semantic clarity - represents empty edges scenario
export const MOCKS_EMPTY_EDGES_ARRAY = MOCKS_EMPTY_ASSIGNED_MEMBERS_ARRAY;

export const MOCKS_EMPTY_PAGE_INFO = [
  {
    request: {
      query: USER_TAGS_ASSIGNED_MEMBERS,
      variables: {
        id: '1',
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        where: {
          firstName: { starts_with: '' },
          lastName: { starts_with: '' },
        },
        sortedBy: { id: 'DESCENDING' },
      },
    },
    result: {
      data: {
        getAssignedUsers: buildAssignedUsers({
          usersAssignedTo: {
            edges: [],
            pageInfo: {
              startCursor: null,
              endCursor: null,
              hasNextPage: false,
              hasPreviousPage: false,
            },
            totalCount: 0,
          },
        }),
      },
    },
  },
];

export const MOCKS_NULL_ANCESTOR_TAGS = [
  {
    request: {
      query: USER_TAGS_ASSIGNED_MEMBERS,
      variables: {
        id: '1',
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        where: {
          firstName: { starts_with: '' },
          lastName: { starts_with: '' },
        },
        sortedBy: { id: 'DESCENDING' },
      },
    },
    result: {
      data: {
        getAssignedUsers: buildAssignedUsers({
          ancestorTags: [],
        }),
      },
    },
  },
];

export const MOCKS_UNDEFINED_DATA = [
  {
    request: {
      query: USER_TAGS_ASSIGNED_MEMBERS,
      variables: {
        id: '1',
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        where: {
          firstName: { starts_with: '' },
          lastName: { starts_with: '' },
        },
        sortedBy: { id: 'DESCENDING' },
      },
    },
    result: {
      data: {
        getAssignedUsers: {
          __typename: 'UserTag',
          name: 'tag1',
          usersAssignedTo: undefined,
          ancestorTags: [],
        },
      },
    },
  },
];

export const MOCKS_NULL_DATA = [
  {
    request: {
      query: USER_TAGS_ASSIGNED_MEMBERS,
      variables: {
        id: '1',
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        where: {
          firstName: { starts_with: '' },
          lastName: { starts_with: '' },
        },
        sortedBy: { id: 'DESCENDING' },
      },
    },
    result: {
      data: null,
    },
  },
];

export const MOCKS_ERROR_UNASSIGN_USER_TAG = [
  {
    request: {
      query: USER_TAGS_ASSIGNED_MEMBERS,
      variables: {
        id: '1',
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        where: {
          firstName: { starts_with: '' },
          lastName: { starts_with: '' },
        },
        sortedBy: { id: 'DESCENDING' },
      },
    },
    result: {
      data: {
        getAssignedUsers: buildAssignedUsers(),
      },
    },
  },
  {
    request: {
      query: UNASSIGN_USER_TAG,
      variables: {
        tagId: '1',
        userId: '1',
      },
    },
    error: new Error('Failed to unassign user tag'),
  },
];

export const MOCKS_ERROR_UPDATE_USER_TAG = [
  {
    request: {
      query: USER_TAGS_ASSIGNED_MEMBERS,
      variables: {
        id: '1',
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        where: {
          firstName: { starts_with: '' },
          lastName: { starts_with: '' },
        },
        sortedBy: { id: 'DESCENDING' },
      },
    },
    result: {
      data: {
        getAssignedUsers: buildAssignedUsers(),
      },
    },
  },
  {
    request: {
      query: UPDATE_USER_TAG,
      variables: {
        tagId: '1',
        name: 'tag 1 edited',
      },
    },
    error: new Error('Failed to update user tag'),
  },
];

export const MOCKS_ERROR_REMOVE_USER_TAG = [
  {
    request: {
      query: USER_TAGS_ASSIGNED_MEMBERS,
      variables: {
        id: '1',
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        where: {
          firstName: { starts_with: '' },
          lastName: { starts_with: '' },
        },
        sortedBy: { id: 'DESCENDING' },
      },
    },
    result: {
      data: {
        getAssignedUsers: buildAssignedUsers(),
      },
    },
  },
  {
    request: {
      query: REMOVE_USER_TAG,
      variables: {
        id: '1',
      },
    },
    error: new Error('Failed to remove user tag'),
  },
];
