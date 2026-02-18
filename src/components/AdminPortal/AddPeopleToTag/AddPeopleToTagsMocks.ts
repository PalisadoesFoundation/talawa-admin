import { ADD_PEOPLE_TO_TAG } from 'GraphQl/Mutations/TagMutations';
import { USER_TAGS_MEMBERS_TO_ASSIGN_TO } from 'GraphQl/Queries/userTagQueries';
import { TAGS_QUERY_DATA_CHUNK_SIZE } from 'types/AdminPortal/Tag/utils';

export const MOCKS = [
  {
    request: {
      query: USER_TAGS_MEMBERS_TO_ASSIGN_TO,
      variables: {
        id: '1',
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        where: {
          firstName: { starts_with: '' },
          lastName: { starts_with: '' },
        },
      },
    },
    result: {
      data: {
        getUsersToAssignTo: {
          name: 'tag1',
          usersToAssignTo: {
            edges: [
              {
                node: {
                  _id: '1',
                  firstName: 'member',
                  lastName: '1',
                },
                cursor: '1',
              },
              {
                node: {
                  _id: '2',
                  firstName: 'member',
                  lastName: '2',
                },
                cursor: '2',
              },
              {
                node: {
                  _id: '3',
                  firstName: 'member',
                  lastName: '3',
                },
                cursor: '3',
              },
              {
                node: {
                  _id: '4',
                  firstName: 'member',
                  lastName: '4',
                },
                cursor: '4',
              },
              {
                node: {
                  _id: '5',
                  firstName: 'member',
                  lastName: '5',
                },
                cursor: '5',
              },
              {
                node: {
                  _id: '6',
                  firstName: 'member',
                  lastName: '6',
                },
                cursor: '6',
              },
              {
                node: {
                  _id: '7',
                  firstName: 'member',
                  lastName: '7',
                },
                cursor: '7',
              },
              {
                node: {
                  _id: '8',
                  firstName: 'member',
                  lastName: '8',
                },
                cursor: '8',
              },
              {
                node: {
                  _id: '9',
                  firstName: 'member',
                  lastName: '9',
                },
                cursor: '9',
              },
              {
                node: {
                  _id: '10',
                  firstName: 'member',
                  lastName: '10',
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
        },
      },
    },
  },
  {
    request: {
      query: USER_TAGS_MEMBERS_TO_ASSIGN_TO,
      variables: {
        id: '1',
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        after: '10',
        where: {
          firstName: { starts_with: '' },
          lastName: { starts_with: '' },
        },
      },
    },
    result: {
      data: {
        getUsersToAssignTo: {
          name: 'tag1',
          usersToAssignTo: {
            edges: [
              {
                node: {
                  _id: '11',
                  firstName: 'member',
                  lastName: '11',
                },
                cursor: '11',
              },
              {
                node: {
                  _id: '12',
                  firstName: 'member',
                  lastName: '12',
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
        },
      },
    },
  },
  {
    request: {
      query: USER_TAGS_MEMBERS_TO_ASSIGN_TO,
      variables: {
        id: '1',
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        where: {
          firstName: { starts_with: 'usersToAssignTo' },
          lastName: { starts_with: '' },
        },
      },
    },
    result: {
      data: {
        getUsersToAssignTo: {
          name: 'tag1',
          usersToAssignTo: {
            edges: [
              {
                node: {
                  _id: '1',
                  firstName: 'usersToAssignTo',
                  lastName: 'user1',
                },
                cursor: '1',
              },
              {
                node: {
                  _id: '2',
                  firstName: 'usersToAssignTo',
                  lastName: 'user2',
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
        },
      },
    },
  },
  {
    request: {
      query: USER_TAGS_MEMBERS_TO_ASSIGN_TO,
      variables: {
        id: '1',
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        where: {
          firstName: { starts_with: '' },
          lastName: { starts_with: 'userToAssignTo' },
        },
      },
    },
    result: {
      data: {
        getUsersToAssignTo: {
          name: 'tag1',
          usersToAssignTo: {
            edges: [
              {
                node: {
                  _id: '1',
                  firstName: 'first',
                  lastName: 'userToAssignTo',
                },
                cursor: '1',
              },
              {
                node: {
                  _id: '2',
                  firstName: 'second',
                  lastName: 'userToAssignTo',
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
        },
      },
    },
  },
  {
    request: {
      query: ADD_PEOPLE_TO_TAG,
      variables: {
        tagId: '1',
        userIds: ['1', '3', '5'],
      },
    },
    result: {
      data: {
        addPeopleToUserTag: {
          _id: '1',
        },
      },
    },
  },
];

export const MOCKS_ERROR = [
  {
    request: {
      query: USER_TAGS_MEMBERS_TO_ASSIGN_TO,
      variables: {
        id: '1',
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        where: {
          firstName: { starts_with: '' },
          lastName: { starts_with: '' },
        },
      },
    },
    error: new Error('Mock Graphql Error'),
  },
];

export const MOCK_EMPTY = [
  {
    request: {
      query: USER_TAGS_MEMBERS_TO_ASSIGN_TO,
      variables: {
        id: '1',
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        where: {
          firstName: { starts_with: '' },
          lastName: { starts_with: '' },
        },
      },
    },
    result: {
      data: {
        getUsersToAssignTo: {
          usersToAssignTo: {
            edges: [], // No data
            pageInfo: {
              hasNextPage: false,
            },
          },
        },
      },
    },
  },
];

export const MOCK_NON_ERROR = [
  {
    request: {
      query: USER_TAGS_MEMBERS_TO_ASSIGN_TO,
      variables: {
        id: '1',
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        where: {
          firstName: { starts_with: '' },
          lastName: { starts_with: '' },
        },
      },
    },
    result: {
      data: {
        getUsersToAssignTo: {
          usersToAssignTo: {
            edges: [
              {
                node: { _id: '1', firstName: 'Test', lastName: 'User' },
                cursor: 'cursor1',
              },
            ],
            pageInfo: { hasNextPage: false, endCursor: 'cursor1' },
          },
        },
      },
    },
  },
  {
    request: {
      query: ADD_PEOPLE_TO_TAG,
      variables: { tagId: '1', userIds: ['1'] },
    },
    error: {
      graphQLErrors: [{ message: 'Plain object' }],
    } as unknown as Error,
  },
];
