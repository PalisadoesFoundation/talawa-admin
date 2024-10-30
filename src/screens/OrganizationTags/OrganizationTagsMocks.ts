import { CREATE_USER_TAG } from 'GraphQl/Mutations/TagMutations';
import { ORGANIZATION_USER_TAGS_LIST } from 'GraphQl/Queries/OrganizationQueries';
import { TAGS_QUERY_DATA_CHUNK_SIZE } from 'utils/organizationTagsUtils';

export const MOCKS = [
  {
    request: {
      query: ORGANIZATION_USER_TAGS_LIST,
      variables: {
        id: '123',
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
      },
    },
    result: {
      data: {
        organizations: [
          {
            userTags: {
              edges: [
                {
                  node: {
                    _id: '1',
                    name: 'userTag 1',
                    usersAssignedTo: {
                      totalCount: 5,
                    },
                    childTags: {
                      totalCount: 11,
                    },
                  },
                  cursor: '1',
                },
                {
                  node: {
                    _id: '2',
                    name: 'userTag 2',
                    usersAssignedTo: {
                      totalCount: 5,
                    },
                    childTags: {
                      totalCount: 0,
                    },
                  },
                  cursor: '2',
                },
                {
                  node: {
                    _id: '3',
                    name: 'userTag 3',
                    usersAssignedTo: {
                      totalCount: 0,
                    },
                    childTags: {
                      totalCount: 5,
                    },
                  },
                  cursor: '3',
                },
                {
                  node: {
                    _id: '4',
                    name: 'userTag 4',
                    usersAssignedTo: {
                      totalCount: 0,
                    },
                    childTags: {
                      totalCount: 0,
                    },
                  },
                  cursor: '4',
                },
                {
                  node: {
                    _id: '5',
                    name: 'userTag 5',
                    usersAssignedTo: {
                      totalCount: 5,
                    },
                    childTags: {
                      totalCount: 5,
                    },
                  },
                  cursor: '5',
                },
                {
                  node: {
                    _id: '6',
                    name: 'userTag 6',
                    usersAssignedTo: {
                      totalCount: 6,
                    },
                    childTags: {
                      totalCount: 6,
                    },
                  },
                  cursor: '6',
                },
                {
                  node: {
                    _id: '7',
                    name: 'userTag 7',
                    usersAssignedTo: {
                      totalCount: 7,
                    },
                    childTags: {
                      totalCount: 7,
                    },
                  },
                  cursor: '7',
                },
                {
                  node: {
                    _id: '8',
                    name: 'userTag 8',
                    usersAssignedTo: {
                      totalCount: 8,
                    },
                    childTags: {
                      totalCount: 8,
                    },
                  },
                  cursor: '8',
                },
                {
                  node: {
                    _id: '9',
                    name: 'userTag 9',
                    usersAssignedTo: {
                      totalCount: 9,
                    },
                    childTags: {
                      totalCount: 9,
                    },
                  },
                  cursor: '9',
                },
                {
                  node: {
                    _id: '10',
                    name: 'userTag 10',
                    usersAssignedTo: {
                      totalCount: 10,
                    },
                    childTags: {
                      totalCount: 10,
                    },
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
        ],
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_USER_TAGS_LIST,
      variables: {
        id: '123',
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        after: '10',
      },
    },
    result: {
      data: {
        organizations: [
          {
            userTags: {
              edges: [
                {
                  node: {
                    _id: '11',
                    name: 'userTag 11',
                    usersAssignedTo: {
                      totalCount: 5,
                    },
                    childTags: {
                      totalCount: 5,
                    },
                  },
                  cursor: '11',
                },
                {
                  node: {
                    _id: '12',
                    name: 'userTag 12',
                    usersAssignedTo: {
                      totalCount: 5,
                    },
                    childTags: {
                      totalCount: 0,
                    },
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
        ],
      },
    },
  },
  {
    request: {
      query: CREATE_USER_TAG,
      variables: {
        name: 'userTag 12',
        organizationId: '123',
      },
    },
    result: {
      data: {
        createUserTag: {
          _id: '12',
        },
      },
    },
  },
];

export const MOCKS_ERROR = [
  {
    request: {
      query: ORGANIZATION_USER_TAGS_LIST,
      variables: {
        id: '123',
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
      },
    },
    error: new Error('Mock Graphql Error'),
  },
];
