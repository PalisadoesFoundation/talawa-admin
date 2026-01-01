import {
  REMOVE_USER_TAG,
  UNASSIGN_USER_TAG,
  UPDATE_USER_TAG,
} from 'GraphQl/Mutations/TagMutations';
import { USER_TAGS_ASSIGNED_MEMBERS } from 'GraphQl/Queries/userTagQueries';
import { TAGS_QUERY_DATA_CHUNK_SIZE } from 'utils/organizationTagsUtils';
import { buildAssignedUsers } from './ManageTagMockUtils';

export const MOCKS_SUCCESS_UNASSIGN_USER_TAG = [
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
    result: {
      data: {
        unassignUserTag: {
          _id: '1',
          __typename: 'UserTag',
        },
      },
    },
  },
];

export const MOCKS_SUCCESS_UPDATE_USER_TAG = [
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
    result: {
      data: {
        updateUserTag: {
          _id: '1',
          __typename: 'UserTag',
        },
      },
    },
  },
];

export const MOCKS_SUCCESS_REMOVE_USER_TAG = [
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
    result: {
      data: {
        removeUserTag: {
          _id: '1',
          __typename: 'UserTag',
        },
      },
    },
  },
];

export const MOCKS_WITH_ANCESTOR_TAGS = [
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
          ancestorTags: [
            { _id: 'parent1', name: 'Parent Tag 1', __typename: 'UserTag' },
            { _id: 'parent2', name: 'Parent Tag 2', __typename: 'UserTag' },
          ],
        }),
      },
    },
  },
];

export const MOCKS_INFINITE_SCROLL_PAGINATION = [
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
          ancestorTags: [],
          usersAssignedTo: {
            __typename: 'UserTagUsersAssignedToConnection',
            edges: [
              {
                __typename: 'UserTagUsersAssignedToEdge',
                node: {
                  __typename: 'User',
                  _id: '1',
                  firstName: 'member',
                  lastName: '1',
                  id: '1',
                },
                cursor: '1',
              },
            ],
            pageInfo: {
              __typename: 'PageInfo',
              startCursor: '1',
              endCursor: '1',
              hasNextPage: true,
              hasPreviousPage: false,
            },
            totalCount: 2,
          },
        },
      },
    },
  },
  {
    request: {
      query: USER_TAGS_ASSIGNED_MEMBERS,
      variables: {
        id: '1',
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        after: '1',
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
          ancestorTags: [],
          usersAssignedTo: {
            __typename: 'UserTagUsersAssignedToConnection',
            edges: [
              {
                __typename: 'UserTagUsersAssignedToEdge',
                node: {
                  __typename: 'User',
                  _id: '2',
                  firstName: 'member',
                  lastName: '2',
                  id: '2',
                },
                cursor: '2',
              },
            ],
            pageInfo: {
              __typename: 'PageInfo',
              startCursor: '2',
              endCursor: '2',
              hasNextPage: false,
              hasPreviousPage: true,
            },
            totalCount: 2,
          },
        },
      },
    },
  },
];

export const MOCKS_INFINITE_SCROLL_NULL_EDGES = [
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
          ancestorTags: [],
          usersAssignedTo: {
            __typename: 'UserTagUsersAssignedToConnection',
            edges: null,
            pageInfo: {
              __typename: 'PageInfo',
              startCursor: null,
              endCursor: '1',
              hasNextPage: true,
              hasPreviousPage: false,
            },
            totalCount: 0,
          },
        },
      },
    },
  },
  {
    request: {
      query: USER_TAGS_ASSIGNED_MEMBERS,
      variables: {
        id: '1',
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        after: '1',
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
          ancestorTags: [],
          usersAssignedTo: {
            __typename: 'UserTagUsersAssignedToConnection',
            edges: null,
            pageInfo: {
              __typename: 'PageInfo',
              startCursor: null,
              endCursor: '2',
              hasNextPage: false,
              hasPreviousPage: true,
            },
            totalCount: 0,
          },
        },
      },
    },
  },
];

export const MOCKS_INFINITE_SCROLL_NULL_FETCH_RESULT = [
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
          ancestorTags: [],
          usersAssignedTo: {
            __typename: 'UserTagUsersAssignedToConnection',
            edges: [
              {
                __typename: 'UserTagUsersAssignedToEdge',
                node: {
                  __typename: 'User',
                  _id: '1',
                  firstName: 'member',
                  lastName: '1',
                  id: '1',
                },
                cursor: '1',
              },
            ],
            pageInfo: {
              __typename: 'PageInfo',
              startCursor: '1',
              endCursor: '1',
              hasNextPage: true,
              hasPreviousPage: false,
            },
            totalCount: 2,
          },
        },
      },
    },
  },
  {
    request: {
      query: USER_TAGS_ASSIGNED_MEMBERS,
      variables: {
        id: '1',
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        after: '1',
        where: {
          firstName: { starts_with: '' },
          lastName: { starts_with: '' },
        },
        sortedBy: { id: 'DESCENDING' },
      },
    },
    result: {
      data: {
        getAssignedUsers: null,
      },
    },
  },
];

export const MOCKS_ERROR_OBJECT = [
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
    error: new Error('Simulated error to exercise generic error path'),
  },
];
