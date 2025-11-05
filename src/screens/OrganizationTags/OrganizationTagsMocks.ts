import { CREATE_USER_TAG } from 'GraphQl/Mutations/TagMutations';
import { ORGANIZATION_USER_TAGS_LIST_PG } from 'GraphQl/Queries/OrganizationQueries';
import { TAGS_QUERY_DATA_CHUNK_SIZE } from 'utils/organizationTagsUtils';

export const MOCKS = [
  {
    request: {
      query: ORGANIZATION_USER_TAGS_LIST_PG,
      variables: {
        input: { id: 'orgId' },
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        where: { name: { starts_with: '' } },
        sortedBy: { id: 'DESCENDING' },
      },
    },
    result: {
      data: {
        organization: {
          id: 'orgId',
          name: 'Test Organization',
          tags: {
            edges: [
              {
                node: {
                  id: '1',
                  name: 'userTag 1',
                  folder: { id: 'folder1', name: 'Folder 1' },
                },
                cursor: '1',
              },
              {
                node: {
                  id: '2',
                  name: 'userTag 2',
                },
                cursor: '2',
              },
              {
                node: {
                  id: '3',
                  name: 'userTag 3',
                  folder: { id: 'folder3', name: 'Folder 3' },
                },
                cursor: '3',
              },
              {
                node: {
                  id: '4',
                  name: 'userTag 4',
                },
                cursor: '4',
              },
              {
                node: {
                  id: '5',
                  name: 'userTag 5',
                  folder: { id: 'folder5', name: 'Folder 5' },
                },
                cursor: '5',
              },
              {
                node: {
                  id: '6',
                  name: 'userTag 6',
                  folder: { id: 'folder6', name: 'Folder 6' },
                },
                cursor: '6',
              },
              {
                node: {
                  id: '7',
                  name: 'userTag 7',
                  folder: { id: 'folder7', name: 'Folder 7' },
                },
                cursor: '7',
              },
              {
                node: {
                  id: '8',
                  name: 'userTag 8',
                  folder: { id: 'folder8', name: 'Folder 8' },
                },
                cursor: '8',
              },
              {
                node: {
                  id: '9',
                  name: 'userTag 9',
                  folder: { id: 'folder9', name: 'Folder 9' },
                },
                cursor: '9',
              },
              {
                node: {
                  id: '10',
                  name: 'userTag 10',
                  folder: { id: 'folder10', name: 'Folder 10' },
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
          },
        },
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_USER_TAGS_LIST_PG,
      variables: {
        input: { id: 'orgId' },
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        after: '10',
        where: { name: { starts_with: '' } },
        sortedBy: { id: 'DESCENDING' },
      },
    },
    result: {
      data: {
        organization: {
          id: 'orgId',
          name: 'Test Organization',
          tags: {
            edges: [
              {
                node: {
                  id: '11',
                  name: 'userTag 11',
                  folder: { id: 'folder11', name: 'Folder 11' },
                },
                cursor: '11',
              },
              {
                node: {
                  id: '12',
                  name: 'userTag 12',
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
          },
        },
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_USER_TAGS_LIST_PG,
      variables: {
        input: { id: 'orgId' },
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        where: { name: { starts_with: 'searchUserTag' } },
        sortedBy: { id: 'DESCENDING' },
      },
    },
    result: {
      data: {
        organization: {
          id: 'orgId',
          name: 'Test Organization',
          tags: {
            edges: [
              {
                node: {
                  id: 'searchUserTag1',
                  name: 'searchUserTag 1',
                  folder: { id: 'folder1', name: 'Folder 1' },
                },
                cursor: 'searchUserTag1',
              },
              {
                node: {
                  id: 'searchUserTag2',
                  name: 'searchUserTag 2',
                },
                cursor: 'searchUserTag2',
              },
            ],
            pageInfo: {
              startCursor: 'searchUserTag1',
              endCursor: 'searchUserTag2',
              hasNextPage: false,
              hasPreviousPage: false,
            },
          },
        },
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_USER_TAGS_LIST_PG,
      variables: {
        input: { id: 'orgId' },
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        where: { name: { starts_with: 'searchUserTag' } },
        sortedBy: { id: 'ASCENDING' },
      },
    },
    result: {
      data: {
        organization: {
          id: 'orgId',
          name: 'Test Organization',
          tags: {
            edges: [
              {
                node: {
                  id: 'searchUserTag2',
                  name: 'searchUserTag 2',
                  folder: { id: 'folder2', name: 'Folder 2' },
                },
                cursor: 'searchUserTag2',
              },
              {
                node: {
                  id: 'searchUserTag1',
                  name: 'searchUserTag 1',
                },
                cursor: 'searchUserTag1',
              },
            ],
            pageInfo: {
              startCursor: 'searchUserTag2',
              endCursor: 'searchUserTag1',
              hasNextPage: false,
              hasPreviousPage: false,
            },
          },
        },
      },
    },
  },
  {
    request: {
      query: CREATE_USER_TAG,
      variables: { name: 'userTag 12', organizationId: 'orgId' },
    },
    result: { data: { createTag: { id: '12', name: 'userTag 12' } } },
  },
  {
    request: {
      query: CREATE_USER_TAG,
      variables: { name: 'userTag 13', organizationId: 'orgId' },
    },
    result: { data: null },
  },
];

export const MOCKS_ERROR = [
  {
    request: {
      query: ORGANIZATION_USER_TAGS_LIST_PG,
      variables: {
        input: { id: 'orgIdError' },
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        where: { name: { starts_with: '' } },
        sortedBy: { id: 'DESCENDING' },
      },
    },
    error: new Error('Mock Graphql Error'),
  },
];

export const MOCKS_ERROR_ERROR_TAG = [
  {
    request: {
      query: CREATE_USER_TAG,
      variables: { name: 'userTagE', organizationId: 'orgId' },
    },
    error: new Error('Mock Graphql Error'),
  },
];

export const MOCKS_EMPTY = [
  {
    request: {
      query: ORGANIZATION_USER_TAGS_LIST_PG,
      variables: {
        input: { id: 'orgId' },
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        where: { name: { starts_with: '' } },
        sortedBy: { id: 'DESCENDING' },
      },
    },
    result: {
      data: {
        organization: {
          id: 'orgId',
          name: 'Test Organization',
          tags: {
            edges: [],
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: false,
              startCursor: null,
              endCursor: null,
            },
          },
        },
      },
    },
  },
];

export const MOCKS_UNDEFINED_USER_TAGS = [
  {
    request: {
      query: ORGANIZATION_USER_TAGS_LIST_PG,
      variables: {
        input: { id: 'orgId' },
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        where: { name: { starts_with: '' } },
        sortedBy: { id: 'DESCENDING' },
      },
    },
    result: {
      data: {
        organization: {
          id: 'orgId',
          name: 'Test Organization',
          tags: undefined,
        },
      },
    },
  },
];

export const MOCKS_NULL_END_CURSOR = [
  {
    request: {
      query: ORGANIZATION_USER_TAGS_LIST_PG,
      variables: {
        input: { id: 'orgId' },
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        where: { name: { starts_with: '' } },
        sortedBy: { id: 'DESCENDING' },
      },
    },
    result: {
      data: {
        organization: {
          id: 'orgId',
          name: 'Test Organization',
          tags: {
            edges: [
              {
                node: {
                  id: '1',
                  name: 'userTag 1',
                  folder: { id: 'folder1', name: 'Folder 1' },
                },
                cursor: '1',
              },
            ],
            pageInfo: {
              startCursor: '1',
              endCursor: null,
              hasNextPage: true,
              hasPreviousPage: false,
            },
          },
        },
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_USER_TAGS_LIST_PG,
      variables: {
        input: { id: 'orgId' },
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        where: { name: { starts_with: '' } },
        after: null,
        sortedBy: { id: 'DESCENDING' },
      },
    },
    result: {
      data: {
        organization: {
          id: 'orgId',
          name: 'Test Organization',
          tags: {
            edges: [
              {
                node: {
                  id: '1',
                  name: 'userTag 1',
                  folder: { id: 'folder1', name: 'Folder 1' },
                },
                cursor: '2',
              },
            ],
            pageInfo: {
              startCursor: '2',
              endCursor: null,
              hasNextPage: true,
              hasPreviousPage: false,
            },
          },
        },
      },
    },
  },
];

export const MOCKS_NO_MORE_PAGES = [
  {
    request: {
      query: ORGANIZATION_USER_TAGS_LIST_PG,
      variables: {
        input: { id: 'orgId' },
        first: TAGS_QUERY_DATA_CHUNK_SIZE,
        where: { name: { starts_with: '' } },
        sortedBy: { id: 'DESCENDING' },
      },
    },
    result: {
      data: {
        organization: {
          id: 'orgId',
          name: 'Test Organization',
          tags: {
            edges: [
              {
                node: {
                  id: '1',
                  name: 'userTag 1',
                  folder: { id: 'folder1', name: 'Folder 1' },
                },
                cursor: '1',
              },
            ],
            pageInfo: {
              startCursor: '1',
              endCursor: '1',
              hasNextPage: false,
              hasPreviousPage: false,
            },
          },
        },
      },
    },
  },
];
