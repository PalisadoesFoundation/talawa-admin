import {
  ASSIGN_TO_TAGS,
  REMOVE_FROM_TAGS,
} from 'GraphQl/Mutations/TagMutations';
import { ORGANIZATION_USER_TAGS_LIST } from 'GraphQl/Queries/OrganizationQueries';
import { USER_TAG_SUB_TAGS } from 'GraphQl/Queries/userTagQueries';
import { TAGS_QUERY_LIMIT } from 'utils/organizationTagsUtils';

export const MOCKS = [
  {
    request: {
      query: ORGANIZATION_USER_TAGS_LIST,
      variables: {
        id: '123',
        first: TAGS_QUERY_LIMIT,
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
        first: TAGS_QUERY_LIMIT,
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
      query: USER_TAG_SUB_TAGS,
      variables: {
        id: '1',
        first: TAGS_QUERY_LIMIT,
      },
    },
    result: {
      data: {
        getUserTag: {
          name: 'userTag 1',
          childTags: {
            edges: [
              {
                node: {
                  _id: 'subTag1',
                  name: 'subTag 1',
                  usersAssignedTo: {
                    totalCount: 5,
                  },
                  childTags: {
                    totalCount: 5,
                  },
                },
                cursor: 'subTag1',
              },
              {
                node: {
                  _id: 'subTag2',
                  name: 'subTag 2',
                  usersAssignedTo: {
                    totalCount: 5,
                  },
                  childTags: {
                    totalCount: 0,
                  },
                },
                cursor: 'subTag2',
              },
              {
                node: {
                  _id: 'subTag3',
                  name: 'subTag 3',
                  usersAssignedTo: {
                    totalCount: 0,
                  },
                  childTags: {
                    totalCount: 5,
                  },
                },
                cursor: 'subTag3',
              },
              {
                node: {
                  _id: 'subTag4',
                  name: 'subTag 4',
                  usersAssignedTo: {
                    totalCount: 0,
                  },
                  childTags: {
                    totalCount: 0,
                  },
                },
                cursor: 'subTag4',
              },
              {
                node: {
                  _id: 'subTag5',
                  name: 'subTag 5',
                  usersAssignedTo: {
                    totalCount: 5,
                  },
                  childTags: {
                    totalCount: 5,
                  },
                },
                cursor: 'subTag5',
              },
              {
                node: {
                  _id: 'subTag6',
                  name: 'subTag 6',
                  usersAssignedTo: {
                    totalCount: 5,
                  },
                  childTags: {
                    totalCount: 5,
                  },
                },
                cursor: 'subTag6',
              },
              {
                node: {
                  _id: 'subTag7',
                  name: 'subTag 7',
                  usersAssignedTo: {
                    totalCount: 5,
                  },
                  childTags: {
                    totalCount: 5,
                  },
                },
                cursor: 'subTag7',
              },
              {
                node: {
                  _id: 'subTag8',
                  name: 'subTag 8',
                  usersAssignedTo: {
                    totalCount: 5,
                  },
                  childTags: {
                    totalCount: 5,
                  },
                },
                cursor: 'subTag8',
              },
              {
                node: {
                  _id: 'subTag9',
                  name: 'subTag 9',
                  usersAssignedTo: {
                    totalCount: 5,
                  },
                  childTags: {
                    totalCount: 5,
                  },
                },
                cursor: 'subTag9',
              },
              {
                node: {
                  _id: 'subTag10',
                  name: 'subTag 10',
                  usersAssignedTo: {
                    totalCount: 5,
                  },
                  childTags: {
                    totalCount: 5,
                  },
                },
                cursor: 'subTag10',
              },
            ],
            pageInfo: {
              startCursor: '1',
              endCursor: '10',
              hasNextPage: true,
              hasPreviousPage: false,
            },
            totalCount: 11,
          },
        },
      },
    },
  },
  {
    request: {
      query: USER_TAG_SUB_TAGS,
      variables: {
        id: '1',
        after: '10',
        first: TAGS_QUERY_LIMIT,
      },
    },
    result: {
      data: {
        getUserTag: {
          name: 'tag1',
          childTags: {
            edges: [
              {
                node: {
                  _id: 'subTag11',
                  name: 'subTag 11',
                  usersAssignedTo: {
                    totalCount: 0,
                  },
                  childTags: {
                    totalCount: 0,
                  },
                },
                cursor: 'subTag11',
              },
            ],
            pageInfo: {
              startCursor: '11',
              endCursor: '11',
              hasNextPage: false,
              hasPreviousPage: true,
            },
            totalCount: 11,
          },
        },
      },
    },
  },
  {
    request: {
      query: ASSIGN_TO_TAGS,
      variables: {
        currentTagId: '1',
        selectedTagIds: ['2', '3'],
      },
    },
    result: {
      data: {
        assignToUserTags: {
          _id: '1',
        },
      },
    },
  },
  {
    request: {
      query: REMOVE_FROM_TAGS,
      variables: {
        currentTagId: '1',
        selectedTagIds: ['2'],
      },
    },
    result: {
      data: {
        removeFromUserTags: {
          _id: '1',
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
        after: null,
        before: null,
        first: 5,
        last: null,
      },
    },
    error: new Error('Mock Graphql Error'),
  },
];
