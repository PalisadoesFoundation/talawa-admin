import {
  REMOVE_USER_TAG,
  UNASSIGN_USER_TAG,
  UPDATE_USER_TAG,
} from 'GraphQl/Mutations/TagMutations';
import { USER_TAGS_ASSIGNED_MEMBERS } from 'GraphQl/Queries/userTagQueries';
import { TAGS_QUERY_DATA_CHUNK_SIZE } from 'utils/organizationTagsUtils';
import { buildAssignedUsers } from './ManageTagMockUtils';

export const MOCKS = [
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
            edges: [
              {
                node: {
                  _id: '1',
                  firstName: 'member',
                  lastName: '1',
                  __typename: 'User',
                },
                cursor: '1',
              },
              {
                node: {
                  _id: '2',
                  firstName: 'member',
                  lastName: '2',
                  __typename: 'User',
                },
                cursor: '2',
              },
              {
                node: {
                  _id: '3',
                  firstName: 'member',
                  lastName: '3',
                  __typename: 'User',
                },
                cursor: '3',
              },
              {
                node: {
                  _id: '4',
                  firstName: 'member',
                  lastName: '4',
                  __typename: 'User',
                },
                cursor: '4',
              },
              {
                node: {
                  _id: '5',
                  firstName: 'member',
                  lastName: '5',
                  __typename: 'User',
                },
                cursor: '5',
              },
              {
                node: {
                  _id: '6',
                  firstName: 'member',
                  lastName: '6',
                  __typename: 'User',
                },
                cursor: '6',
              },
              {
                node: {
                  _id: '7',
                  firstName: 'member',
                  lastName: '7',
                  __typename: 'User',
                },
                cursor: '7',
              },
              {
                node: {
                  _id: '8',
                  firstName: 'member',
                  lastName: '8',
                  __typename: 'User',
                },
                cursor: '8',
              },
              {
                node: {
                  _id: '9',
                  firstName: 'member',
                  lastName: '9',
                  __typename: 'User',
                },
                cursor: '9',
              },
              {
                node: {
                  _id: '10',
                  firstName: 'member',
                  lastName: '10',
                  __typename: 'User',
                },
                cursor: '10',
              },
            ],
            pageInfo: {
              startCursor: '1',
              endCursor: '10',
              hasNextPage: true,
              hasPreviousPage: false,
            },
            totalCount: 12,
          },
        }),
      },
    },
  },
  {
    request: {
      query: USER_TAGS_ASSIGNED_MEMBERS,
      variables: {
        id: '1',
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        after: '10',
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
            edges: [
              {
                node: {
                  _id: '11',
                  firstName: 'member',
                  lastName: '11',
                  __typename: 'User',
                },
                cursor: '11',
              },
              {
                node: {
                  _id: '12',
                  firstName: 'member',
                  lastName: '12',
                  __typename: 'User',
                },
                cursor: '12',
              },
            ],
            pageInfo: {
              startCursor: '11',
              endCursor: '12',
              hasNextPage: false,
              hasPreviousPage: true,
            },
            totalCount: 12,
          },
        }),
      },
    },
  },
  {
    request: {
      query: USER_TAGS_ASSIGNED_MEMBERS,
      variables: {
        id: '1',
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        where: {
          firstName: { starts_with: 'assigned' },
          lastName: { starts_with: 'user' },
        },
        sortedBy: { id: 'DESCENDING' },
      },
    },
    result: {
      data: {
        getAssignedUsers: buildAssignedUsers({
          usersAssignedTo: {
            edges: [
              {
                node: {
                  _id: '1',
                  firstName: 'assigned',
                  lastName: 'user1',
                  __typename: 'User',
                },
                cursor: '1',
              },
              {
                node: {
                  _id: '2',
                  firstName: 'assigned',
                  lastName: 'user2',
                  __typename: 'User',
                },
                cursor: '2',
              },
            ],
            pageInfo: {
              startCursor: '1',
              endCursor: '2',
              hasNextPage: false,
              hasPreviousPage: false,
            },
            totalCount: 2,
          },
        }),
      },
    },
  },
  {
    request: {
      query: USER_TAGS_ASSIGNED_MEMBERS,
      variables: {
        id: '1',
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        where: {
          firstName: { starts_with: 'assigned' },
          lastName: { starts_with: 'user' },
        },
        sortedBy: { id: 'ASCENDING' },
      },
    },
    result: {
      data: {
        getAssignedUsers: buildAssignedUsers({
          usersAssignedTo: {
            edges: [
              {
                node: {
                  _id: '2',
                  firstName: 'assigned',
                  lastName: 'user2',
                  __typename: 'User',
                },
                cursor: '2',
              },
              {
                node: {
                  _id: '1',
                  firstName: 'assigned',
                  lastName: 'user1',
                  __typename: 'User',
                },
                cursor: '1',
              },
            ],
            pageInfo: {
              startCursor: '2',
              endCursor: '1',
              hasNextPage: false,
              hasPreviousPage: false,
            },
            totalCount: 2,
          },
        }),
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
  // Mock for search functionality - when searching for "assigned user"
  {
    request: {
      query: USER_TAGS_ASSIGNED_MEMBERS,
      variables: {
        id: '1',
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        where: {
          firstName: { starts_with: 'assigned' },
          lastName: { starts_with: 'user' },
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
                  firstName: 'assigned',
                  lastName: 'user1',
                  id: '1',
                },
                cursor: '1',
              },
              {
                __typename: 'UserTagUsersAssignedToEdge',
                node: {
                  __typename: 'User',
                  _id: '2',
                  firstName: 'assigned',
                  lastName: 'user2',
                  id: '2',
                },
                cursor: '2',
              },
            ],
            pageInfo: {
              __typename: 'PageInfo',
              startCursor: '1',
              endCursor: '2',
              hasNextPage: false,
              hasPreviousPage: false,
            },
            totalCount: 2,
          },
        },
      },
    },
  },
];

export const MOCKS_ERROR_ASSIGNED_MEMBERS = [
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
    error: new Error('Mock Graphql Error'),
  },
];
