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
          _id: 'orgId',
          name: 'Test Organization',
          tags: {
            edges: [
              {
                node: {
                  id: '1',
                  _id: '1',
                  name: 'userTag 1',
                  folder: { id: 'folder1', name: 'Folder 1' },
                  createdAt: '2024-01-01T00:00:00.000Z',
                  updater: { id: 'user1', name: 'Test User' },
                },
                cursor: '1',
              },
              {
                node: {
                  id: '2',
                  _id: '2',
                  name: 'userTag 2',
                  createdAt: '2024-01-02T00:00:00.000Z',
                  updater: { id: 'user1', name: 'Test User' },
                },
                cursor: '2',
              },
              {
                node: {
                  id: '3',
                  _id: '3',
                  name: 'userTag 3',
                  folder: { id: 'folder3', name: 'Folder 3' },
                  createdAt: '2024-01-03T00:00:00.000Z',
                  updater: { id: 'user1', name: 'Test User' },
                },
                cursor: '3',
              },
              {
                node: {
                  id: '4',
                  _id: '4',
                  name: 'userTag 4',
                  createdAt: '2024-01-04T00:00:00.000Z',
                  updater: { id: 'user1', name: 'Test User' },
                },
                cursor: '4',
              },
              {
                node: {
                  id: '5',
                  _id: '5',
                  name: 'userTag 5',
                  folder: { id: 'folder5', name: 'Folder 5' },
                  createdAt: '2024-01-05T00:00:00.000Z',
                  updater: { id: 'user1', name: 'Test User' },
                },
                cursor: '5',
              },
              {
                node: {
                  id: '6',
                  _id: '6',
                  name: 'userTag 6',
                  folder: { id: 'folder6', name: 'Folder 6' },
                  createdAt: '2024-01-06T00:00:00.000Z',
                  updater: { id: 'user1', name: 'Test User' },
                },
                cursor: '6',
              },
              {
                node: {
                  id: '7',
                  _id: '7',
                  name: 'userTag 7',
                  folder: { id: 'folder7', name: 'Folder 7' },
                  createdAt: '2024-01-07T00:00:00.000Z',
                  updater: { id: 'user1', name: 'Test User' },
                },
                cursor: '7',
              },
              {
                node: {
                  id: '8',
                  _id: '8',
                  name: 'userTag 8',
                  folder: { id: 'folder8', name: 'Folder 8' },
                  createdAt: '2024-01-08T00:00:00.000Z',
                  updater: { id: 'user1', name: 'Test User' },
                },
                cursor: '8',
              },
              {
                node: {
                  id: '9',
                  _id: '9',
                  name: 'userTag 9',
                  folder: { id: 'folder9', name: 'Folder 9' },
                  createdAt: '2024-01-09T00:00:00.000Z',
                  updater: { id: 'user1', name: 'Test User' },
                },
                cursor: '9',
              },
              {
                node: {
                  id: '10',
                  _id: '10',
                  name: 'userTag 10',
                  folder: { id: 'folder10', name: 'Folder 10' },
                  createdAt: '2024-01-10T00:00:00.000Z',
                  updater: { id: 'user1', name: 'Test User' },
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
          _id: 'orgId',
          name: 'Test Organization',
          tags: {
            edges: [
              {
                node: {
                  id: '11',
                  _id: '11',
                  name: 'userTag 11',
                  folder: { id: 'folder11', name: 'Folder 11' },
                  createdAt: '2024-01-11T00:00:00.000Z',
                  updater: { id: 'user1', name: 'Test User' },
                },
                cursor: '11',
              },
              {
                node: {
                  id: '12',
                  _id: '12',
                  name: 'userTag 12',
                  createdAt: '2024-01-12T00:00:00.000Z',
                  updater: { id: 'user1', name: 'Test User' },
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
          _id: 'orgId',
          name: 'Test Organization',
          tags: {
            edges: [
              {
                node: {
                  id: 'searchUserTag1',
                  _id: 'searchUserTag1',
                  name: 'searchUserTag 1',
                  folder: { id: 'folder1', name: 'Folder 1' },
                  createdAt: '2024-01-01T00:00:00.000Z',
                  updater: { id: 'user1', name: 'Test User' },
                },
                cursor: 'searchUserTag1',
              },
              {
                node: {
                  id: 'searchUserTag2',
                  _id: 'searchUserTag2',
                  name: 'searchUserTag 2',
                  createdAt: '2024-01-02T00:00:00.000Z',
                  updater: { id: 'user1', name: 'Test User' },
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
          _id: 'orgId',
          name: 'Test Organization',
          tags: {
            edges: [
              {
                node: {
                  id: 'searchUserTag2',
                  _id: 'searchUserTag2',
                  name: 'searchUserTag 2',
                  folder: { id: 'folder2', name: 'Folder 2' },
                  createdAt: '2024-01-02T00:00:00.000Z',
                  updater: { id: 'user1', name: 'Test User' },
                },
                cursor: 'searchUserTag2',
              },
              {
                node: {
                  id: 'searchUserTag1',
                  _id: 'searchUserTag1',
                  name: 'searchUserTag 1',
                  createdAt: '2024-01-01T00:00:00.000Z',
                  updater: { id: 'user1', name: 'Test User' },
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
      variables: {
        name: 'userTag 12',
        organizationId: 'orgId',
        folderId: null,
      },
    },
    result: { data: { createTag: { id: '12', name: 'userTag 12' } } },
  },
  {
    request: {
      query: CREATE_USER_TAG,
      variables: {
        name: 'userTag 13',
        organizationId: 'orgId',
        folderId: null,
      },
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
      variables: { name: 'userTagE', organizationId: 'orgId', folderId: null },
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
          _id: 'orgId',
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
          _id: 'orgId',
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
          _id: 'orgId',
          name: 'Test Organization',
          tags: {
            edges: [
              {
                node: {
                  id: '1',
                  _id: '1',
                  name: 'userTag 1',
                  folder: { id: 'folder1', name: 'Folder 1' },
                  createdAt: '2024-01-01T00:00:00.000Z',
                  updater: { id: 'user1', name: 'Test User' },
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
          _id: 'orgId',
          name: 'Test Organization',
          tags: {
            edges: [
              {
                node: {
                  id: '1',
                  _id: '1',
                  name: 'userTag 1',
                  folder: { id: 'folder1', name: 'Folder 1' },
                  createdAt: '2024-01-01T00:00:00.000Z',
                  updater: { id: 'user1', name: 'Test User' },
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
          _id: 'orgId',
          name: 'Test Organization',
          tags: undefined,
        },
      },
    },
  },
];
