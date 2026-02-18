import { CREATE_USER_TAG } from 'GraphQl/Mutations/TagMutations';
import { USER_TAG_SUB_TAGS } from 'GraphQl/Queries/userTagQueries';
import { TAGS_QUERY_DATA_CHUNK_SIZE } from 'utils/organizationTagsUtils';

/**
 * Helper to create tag node structure
 */
const createTagNode = (
  id: string,
  name: string,
  usersCount: number,
  childCount: number,
  ancestorTags: Array<{ _id: string; name: string }>,
) => ({
  node: {
    _id: id,
    name,
    usersAssignedTo: { totalCount: usersCount },
    childTags: { totalCount: childCount },
    ancestorTags,
  },
  cursor: id,
});

const ANCESTOR_TAG_1 = [{ _id: '1', name: 'userTag 1' }];

export const MOCKS = [
  // 1. Default Load (Descending, No Search)
  {
    request: {
      query: USER_TAG_SUB_TAGS,
      variables: {
        id: '1',
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        where: { name: { starts_with: '' } },
        sortedBy: { id: 'DESCENDING' },
      },
    },
    result: {
      data: {
        getChildTags: {
          name: 'userTag 1',
          childTags: {
            edges: [
              createTagNode('subTag1', 'subTag 1', 5, 5, ANCESTOR_TAG_1),
              createTagNode('subTag2', 'subTag 2', 5, 0, ANCESTOR_TAG_1),
              createTagNode('subTag3', 'subTag 3', 0, 5, ANCESTOR_TAG_1),
              createTagNode('subTag4', 'subTag 4', 0, 0, ANCESTOR_TAG_1),
              createTagNode('subTag5', 'subTag 5', 5, 5, ANCESTOR_TAG_1),
              createTagNode('subTag6', 'subTag 6', 5, 5, ANCESTOR_TAG_1),
              createTagNode('subTag7', 'subTag 7', 5, 5, ANCESTOR_TAG_1),
              createTagNode('subTag8', 'subTag 8', 5, 5, ANCESTOR_TAG_1),
              createTagNode('subTag9', 'subTag 9', 5, 5, ANCESTOR_TAG_1),
              createTagNode('subTag10', 'subTag 10', 5, 5, ANCESTOR_TAG_1),
            ],
            pageInfo: {
              startCursor: '1',
              endCursor: '10',
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
  // 2. Load More (Infinite Scroll)
  {
    request: {
      query: USER_TAG_SUB_TAGS,
      variables: {
        id: '1',
        after: '10',
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        where: { name: { starts_with: '' } },
        sortedBy: { id: 'DESCENDING' },
      },
    },
    result: {
      data: {
        getChildTags: {
          name: 'userTag 1',
          childTags: {
            edges: [
              createTagNode('subTag11', 'subTag 11', 0, 0, ANCESTOR_TAG_1),
            ],
            pageInfo: {
              startCursor: '11',
              endCursor: '11',
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
  // 3. Navigate to a Child Tag (Drill down)
  {
    request: {
      query: USER_TAG_SUB_TAGS,
      variables: {
        id: 'subTag1',
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        where: { name: { starts_with: '' } },
        sortedBy: { id: 'DESCENDING' },
      },
    },
    result: {
      data: {
        getChildTags: {
          name: 'subTag 1',
          childTags: {
            edges: [
              createTagNode('subTag1.1', 'subTag 1.1', 5, 5, [
                { _id: '1', name: 'userTag 1' },
                { _id: 'subTag1', name: 'subTag 1' },
              ]),
            ],
            pageInfo: {
              startCursor: 'subTag1.1',
              endCursor: 'subTag1.1',
              hasNextPage: false,
              hasPreviousPage: false,
            },
            totalCount: 1,
          },
          ancestorTags: [
            {
              _id: '1',
              name: 'userTag 1',
            },
          ],
        },
      },
    },
  },
  // 4. Search Functionality
  {
    request: {
      query: USER_TAG_SUB_TAGS,
      variables: {
        id: '1',
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        where: { name: { starts_with: 'searchSubTag' } },
        sortedBy: { id: 'DESCENDING' },
      },
    },
    result: {
      data: {
        getChildTags: {
          name: 'userTag 1',
          childTags: {
            edges: [
              createTagNode(
                'searchSubTag1',
                'searchSubTag 1',
                0,
                0,
                ANCESTOR_TAG_1,
              ),
              createTagNode(
                'searchSubTag2',
                'searchSubTag 2',
                0,
                0,
                ANCESTOR_TAG_1,
              ),
            ],
            pageInfo: {
              startCursor: 'searchSubTag1',
              endCursor: 'searchSubTag2',
              hasNextPage: false,
              hasPreviousPage: false,
            },
            totalCount: 2,
          },
          ancestorTags: [],
        },
      },
    },
  },
  // 5. Sort Functionality (Ascending - Empty Search)
  {
    request: {
      query: USER_TAG_SUB_TAGS,
      variables: {
        id: '1',
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        where: { name: { starts_with: '' } }, // Fixed: Empty search for standard sort test
        sortedBy: { id: 'ASCENDING' },
      },
    },
    result: {
      data: {
        getChildTags: {
          name: 'userTag 1',
          childTags: {
            edges: [
              createTagNode(
                'searchSubTag2',
                'searchSubTag 2',
                0,
                0,
                ANCESTOR_TAG_1,
              ),
              createTagNode(
                'searchSubTag1',
                'searchSubTag 1',
                0,
                0,
                ANCESTOR_TAG_1,
              ),
            ],
            pageInfo: {
              startCursor: 'searchSubTag2',
              endCursor: 'searchSubTag1',
              hasNextPage: false,
              hasPreviousPage: false,
            },
            totalCount: 2,
          },
          ancestorTags: [],
        },
      },
    },
  },
  // 6. Create Tag Mutation
  {
    request: {
      query: CREATE_USER_TAG,
      variables: {
        name: 'subTag 12',
        organizationId: '123',
        folderId: '1',
      },
    },
    result: {
      data: {
        createUserTag: {
          _id: 'subTag12',
        },
      },
    },
  },
];

export const MOCKS_ERROR_SUB_TAGS = [
  {
    request: {
      query: USER_TAG_SUB_TAGS,
      variables: {
        id: '1',
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        where: { name: { starts_with: '' } },
        sortedBy: { id: 'DESCENDING' },
      },
    },
    error: new Error('Mock Graphql Error'),
  },
];

export const emptyMocks = [
  {
    request: {
      query: USER_TAG_SUB_TAGS,
      variables: {
        id: '1',
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        where: { name: { starts_with: '' } },
        sortedBy: { id: 'DESCENDING' },
      },
    },
    result: {
      data: {
        getChildTags: {
          name: 'userTag 1',
          childTags: {
            edges: [],
            pageInfo: {
              hasNextPage: false,
              endCursor: null,
            },
            totalCount: 0,
          },
          ancestorTags: [],
        },
      },
    },
  },
];

export const MOCKS_CREATE_TAG_ERROR = [
  {
    request: {
      query: USER_TAG_SUB_TAGS,
      variables: {
        id: '1',
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        where: { name: { starts_with: '' } },
        sortedBy: { id: 'DESCENDING' },
      },
    },
    result: {
      data: {
        getChildTags: {
          name: 'userTag 1',
          childTags: {
            edges: [
              createTagNode('subTag1', 'subTag 1', 5, 5, [
                { _id: '1', name: 'userTag 1' },
              ]),
            ],
            pageInfo: {
              startCursor: '1',
              endCursor: '1',
              hasNextPage: false,
              hasPreviousPage: false,
            },
            totalCount: 1,
          },
          ancestorTags: [],
        },
      },
    },
  },
  {
    request: {
      query: CREATE_USER_TAG,
      variables: {
        name: 'subTag 12',
        organizationId: '123',
        folderId: '1',
      },
    },
    error: new Error('Failed to create tag'),
  },
];
