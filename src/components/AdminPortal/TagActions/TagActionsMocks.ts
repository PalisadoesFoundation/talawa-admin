import {
  ASSIGN_TO_TAGS,
  REMOVE_FROM_TAGS,
} from 'GraphQl/Mutations/TagMutations';
import { ORGANIZATION_USER_TAGS_LIST } from 'GraphQl/Queries/OrganizationQueries';
import { USER_TAG_SUB_TAGS } from 'GraphQl/Queries/userTagQueries';
import { TAGS_QUERY_DATA_CHUNK_SIZE } from 'utils/organizationTagsUtils';

function createEdge(
  _id: string,
  name: string,
  parentTag: { _id: string } | null,
  usersCount: number,
  childCount: number,
  ancestorTags: { _id: string; name: string }[],
  cursorVal?: string,
): {
  node: {
    _id: string;
    name: string;
    parentTag: { _id: string } | null;
    usersAssignedTo: { totalCount: number };
    childTags: { totalCount: number };
    ancestorTags: { _id: string; name: string }[];
    folder: null;
    createdAt: string;
    updatedAt: string;
    creator: { id: string; name: string };
    updater: { id: string; name: string };
    id: string;
  };
  cursor: string;
} {
  return {
    node: {
      _id,
      name,
      parentTag,
      usersAssignedTo: { totalCount: usersCount },
      childTags: { totalCount: childCount },
      ancestorTags,
      folder: null,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
      creator: { id: '1', name: 'Creator' },
      updater: { id: '1', name: 'Updater' },
      id: _id,
    },
    cursor: cursorVal || _id,
  };
}

const userTagEdgesFirst = [
  createEdge('1', 'userTag 1', null, 5, 11, []),
  createEdge('2', 'userTag 2', null, 5, 0, []),
  createEdge('3', 'userTag 3', null, 0, 5, []),
  createEdge('4', 'userTag 4', null, 0, 0, []),
  createEdge('5', 'userTag 5', null, 5, 5, []),
  createEdge('6', 'userTag 6', null, 6, 6, []),
  createEdge('7', 'userTag 7', null, 7, 7, []),
  createEdge('8', 'userTag 8', null, 8, 8, []),
  createEdge('9', 'userTag 9', null, 9, 9, []),
  createEdge('10', 'userTag 10', null, 10, 10, []),
];
const userTagEdgesNext = [
  createEdge('11', 'userTag 11', null, 5, 5, []),
  createEdge('12', 'userTag 12', null, 5, 0, []),
];
const userTagEdgesSearch = [
  createEdge('1', 'searchUserTag 1', { _id: '1' }, 5, 5, [
    { _id: '1', name: 'userTag 1' },
  ]),
  createEdge('2', 'searchUserTag 2', { _id: '1' }, 5, 0, [
    { _id: '1', name: 'userTag 1' },
  ]),
];

const subTagEdgesFirst = [
  createEdge('subTag1', 'subTag 1', null, 5, 5, [
    { _id: '1', name: 'userTag 1' },
  ]),
  createEdge('subTag2', 'subTag 2', null, 5, 0, [
    { _id: '1', name: 'userTag 1' },
  ]),
  createEdge('subTag3', 'subTag 3', null, 0, 5, [
    { _id: '1', name: 'userTag 1' },
  ]),
  createEdge('subTag4', 'subTag 4', null, 0, 0, [
    { _id: '1', name: 'userTag 1' },
  ]),
  createEdge('subTag5', 'subTag 5', null, 5, 5, [
    { _id: '1', name: 'userTag 1' },
  ]),
  createEdge('subTag6', 'subTag 6', null, 5, 5, [
    { _id: '1', name: 'userTag 1' },
  ]),
  createEdge('subTag7', 'subTag 7', null, 5, 5, [
    { _id: '1', name: 'userTag 1' },
  ]),
  createEdge('subTag8', 'subTag 8', null, 5, 5, [
    { _id: '1', name: 'userTag 1' },
  ]),
  createEdge('subTag9', 'subTag 9', null, 5, 5, [
    { _id: '1', name: 'userTag 1' },
  ]),
  createEdge('subTag10', 'subTag 10', null, 5, 5, [
    { _id: '1', name: 'userTag 1' },
  ]),
];
const subTagEdgesNext = [
  createEdge('subTag11', 'subTag 11', null, 0, 0, [
    { _id: '1', name: 'userTag 1' },
  ]),
];

export const MOCKS = [
  {
    request: {
      query: ORGANIZATION_USER_TAGS_LIST,
      variables: {
        id: '123',
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        after: null,
        where: { name: { starts_with: '' } },
      },
    },
    result: {
      data: {
        organizations: [
          {
            id: 'org1',
            name: 'Org 1',
            userTags: {
              edges: userTagEdgesFirst,
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
        where: { name: { starts_with: '' } },
      },
    },
    result: {
      data: {
        organizations: [
          {
            id: 'org1',
            name: 'Org 1',
            userTags: {
              edges: userTagEdgesFirst,
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
        where: { name: { starts_with: '' } },
      },
    },
    result: {
      data: {
        organizations: [
          {
            id: 'org1',
            name: 'Org 1',
            userTags: {
              edges: userTagEdgesNext,
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
      query: ORGANIZATION_USER_TAGS_LIST,
      variables: {
        id: '123',
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        after: null,
        where: { name: { starts_with: 'searchUserTag' } },
      },
    },
    result: {
      data: {
        organizations: [
          {
            id: 'org1',
            name: 'Org 1',
            userTags: {
              edges: userTagEdgesSearch,
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
      query: ORGANIZATION_USER_TAGS_LIST,
      variables: {
        id: '123',
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        where: { name: { starts_with: 'searchUserTag' } },
      },
    },
    result: {
      data: {
        organizations: [
          {
            id: 'org1',
            name: 'Org 1',
            userTags: {
              edges: userTagEdgesSearch,
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
    result: {
      data: {
        getChildTags: {
          name: 'userTag 1',
          childTags: {
            edges: subTagEdgesFirst,
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
            edges: subTagEdgesNext,
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

export const MOCKS_ERROR_SUBTAGS_QUERY = [
  {
    request: {
      query: ORGANIZATION_USER_TAGS_LIST,
      variables: {
        id: '123',
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        after: null,
        where: { name: { starts_with: '' } },
      },
    },
    result: {
      data: {
        organizations: [
          {
            id: 'org1',
            name: 'Org 1',
            userTags: {
              edges: [
                createEdge('1', 'userTag 1', null, 5, 11, []),
                createEdge('2', 'userTag 2', null, 5, 0, []),
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

export const MOCKS_ERROR_ASSIGN_OR_REMOVAL_TAGS = [
  {
    request: {
      query: ORGANIZATION_USER_TAGS_LIST,
      variables: {
        id: '123',
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        after: null,
        where: { name: { starts_with: '' } },
      },
    },
    result: {
      data: {
        organizations: [
          {
            id: 'org1',
            name: 'Org 1',
            userTags: {
              edges: userTagEdgesFirst,
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
      query: ASSIGN_TO_TAGS,
      variables: {
        currentTagId: '1',
        selectedTagIds: ['2', '3'],
      },
    },
    error: new Error('Mock Graphql Error While assigning/removing tags'),
  },
];
