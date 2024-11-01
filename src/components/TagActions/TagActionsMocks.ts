import {
  ASSIGN_TO_TAGS,
  REMOVE_FROM_TAGS,
} from 'GraphQl/Mutations/TagMutations';
import { ORGANIZATION_USER_TAGS_LIST } from 'GraphQl/Queries/OrganizationQueries';
import { USER_TAG_SUB_TAGS } from 'GraphQl/Queries/userTagQueries';
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
                    parentTag: null,
                    usersAssignedTo: {
                      totalCount: 5,
                    },
                    childTags: {
                      totalCount: 11,
                    },
                    ancestorTags: [],
                  },
                  cursor: '1',
                },
                {
                  node: {
                    _id: '2',
                    name: 'userTag 2',
                    parentTag: null,
                    usersAssignedTo: {
                      totalCount: 5,
                    },
                    childTags: {
                      totalCount: 0,
                    },
                    ancestorTags: [],
                  },
                  cursor: '2',
                },
                {
                  node: {
                    _id: '3',
                    name: 'userTag 3',
                    parentTag: null,
                    usersAssignedTo: {
                      totalCount: 0,
                    },
                    childTags: {
                      totalCount: 5,
                    },
                    ancestorTags: [],
                  },
                  cursor: '3',
                },
                {
                  node: {
                    _id: '4',
                    name: 'userTag 4',
                    parentTag: null,
                    usersAssignedTo: {
                      totalCount: 0,
                    },
                    childTags: {
                      totalCount: 0,
                    },
                    ancestorTags: [],
                  },
                  cursor: '4',
                },
                {
                  node: {
                    _id: '5',
                    name: 'userTag 5',
                    parentTag: null,
                    usersAssignedTo: {
                      totalCount: 5,
                    },
                    childTags: {
                      totalCount: 5,
                    },
                    ancestorTags: [],
                  },
                  cursor: '5',
                },
                {
                  node: {
                    _id: '6',
                    name: 'userTag 6',
                    parentTag: null,
                    usersAssignedTo: {
                      totalCount: 6,
                    },
                    childTags: {
                      totalCount: 6,
                    },
                    ancestorTags: [],
                  },
                  cursor: '6',
                },
                {
                  node: {
                    _id: '7',
                    name: 'userTag 7',
                    parentTag: null,
                    usersAssignedTo: {
                      totalCount: 7,
                    },
                    childTags: {
                      totalCount: 7,
                    },
                    ancestorTags: [],
                  },
                  cursor: '7',
                },
                {
                  node: {
                    _id: '8',
                    name: 'userTag 8',
                    parentTag: null,
                    usersAssignedTo: {
                      totalCount: 8,
                    },
                    childTags: {
                      totalCount: 8,
                    },
                    ancestorTags: [],
                  },
                  cursor: '8',
                },
                {
                  node: {
                    _id: '9',
                    name: 'userTag 9',
                    parentTag: null,
                    usersAssignedTo: {
                      totalCount: 9,
                    },
                    childTags: {
                      totalCount: 9,
                    },
                    ancestorTags: [],
                  },
                  cursor: '9',
                },
                {
                  node: {
                    _id: '10',
                    name: 'userTag 10',
                    parentTag: null,
                    usersAssignedTo: {
                      totalCount: 10,
                    },
                    childTags: {
                      totalCount: 10,
                    },
                    ancestorTags: [],
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
                    parentTag: null,
                    usersAssignedTo: {
                      totalCount: 5,
                    },
                    childTags: {
                      totalCount: 5,
                    },
                    ancestorTags: [],
                  },
                  cursor: '11',
                },
                {
                  node: {
                    _id: '12',
                    name: 'userTag 12',
                    parentTag: null,
                    usersAssignedTo: {
                      totalCount: 5,
                    },
                    childTags: {
                      totalCount: 0,
                    },
                    ancestorTags: [],
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
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
      },
    },
    result: {
      data: {
        getChildTags: {
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
                  ancestorTags: [
                    {
                      _id: '1',
                      name: 'userTag 1',
                    },
                  ],
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
                  ancestorTags: [
                    {
                      _id: '1',
                      name: 'userTag 1',
                    },
                  ],
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
                  ancestorTags: [
                    {
                      _id: '1',
                      name: 'userTag 1',
                    },
                  ],
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
                  ancestorTags: [
                    {
                      _id: '1',
                      name: 'userTag 1',
                    },
                  ],
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
                  ancestorTags: [
                    {
                      _id: '1',
                      name: 'userTag 1',
                    },
                  ],
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
                  ancestorTags: [
                    {
                      _id: '1',
                      name: 'userTag 1',
                    },
                  ],
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
                  ancestorTags: [
                    {
                      _id: '1',
                      name: 'userTag 1',
                    },
                  ],
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
                  ancestorTags: [
                    {
                      _id: '1',
                      name: 'userTag 1',
                    },
                  ],
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
                  ancestorTags: [
                    {
                      _id: '1',
                      name: 'userTag 1',
                    },
                  ],
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
                  ancestorTags: [
                    {
                      _id: '1',
                      name: 'userTag 1',
                    },
                  ],
                },
                cursor: 'subTag10',
              },
            ],
            pageInfo: {
              startCursor: 'subTag1',
              endCursor: 'subTag10',
              hasNextPage: true,
              hasPreviousPage: false,
            },
            totalCount: 11,
          },
          ancestorTags: [],
        },
      },
    },
  },
  {
    request: {
      query: USER_TAG_SUB_TAGS,
      variables: {
        id: '1',
        after: 'subTag10',
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
      },
    },
    result: {
      data: {
        getChildTags: {
          name: 'userTag 1',
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
                  ancestorTags: [
                    {
                      _id: '1',
                      name: 'userTag 1',
                    },
                  ],
                },
                cursor: 'subTag11',
              },
            ],
            pageInfo: {
              startCursor: 'subTag11',
              endCursor: 'subTag11',
              hasNextPage: false,
              hasPreviousPage: true,
            },
            totalCount: 11,
          },
          ancestorTags: [],
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

export const MOCKS_ERROR_ORGANIZATION_TAGS_QUERY = [
  {
    request: {
      query: ORGANIZATION_USER_TAGS_LIST,
      variables: {
        id: '123',
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
      },
    },
    error: new Error('Mock Graphql Error for organization root tags query'),
  },
];

export const MOCKS_ERROR_SUBTAGS_QUERY = [
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
                    parentTag: null,
                    usersAssignedTo: {
                      totalCount: 5,
                    },
                    childTags: {
                      totalCount: 11,
                    },
                    ancestorTags: [],
                  },
                  cursor: '1',
                },
                {
                  node: {
                    _id: '2',
                    name: 'userTag 2',
                    parentTag: null,
                    usersAssignedTo: {
                      totalCount: 5,
                    },
                    childTags: {
                      totalCount: 0,
                    },
                    ancestorTags: [],
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
        ],
      },
    },
  },
  {
    request: {
      query: USER_TAG_SUB_TAGS,
      variables: {
        id: '1',
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
      },
    },
    error: new Error('Mock Graphql Error for subTags query'),
  },
];
