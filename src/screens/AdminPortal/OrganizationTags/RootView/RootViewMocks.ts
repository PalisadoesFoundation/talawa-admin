import { CREATE_TAG_FOLDER } from 'GraphQl/Mutations/TagMutations';
import { ORGANIZATION_USER_TAGS_LIST_PG } from 'GraphQl/Queries/OrganizationQueries';
import { ORGANIZATION_TAGS_WITH_FOLDER } from 'GraphQl/Queries/userTagQueries';
import { PAGE_SIZE } from 'types/ReportingTable/utils';

const ORG_ID = 'orgId';

const tagFoldersVariables = {
  input: { id: ORG_ID },
  first: PAGE_SIZE,
};

const orgTagsVariables = {
  id: ORG_ID,
  first: 32,
};

const tagFoldersResult = {
  organization: {
    id: ORG_ID,
    name: 'Test Org',
    tagFolders: {
      edges: [
        {
          cursor: 'folder-1',
          node: {
            id: 'folder-1',
            name: 'Operations',
            createdAt: '2026-01-02T00:00:00.000Z',
            creator: { id: 'u1', name: 'Alice' },
            childFolders: { edges: [{ node: { id: 'folder-1-1' } }] },
            tags: { edges: [{ node: { id: 'tag-1' } }] },
          },
        },
        {
          cursor: 'folder-2',
          node: {
            id: 'folder-2',
            name: 'Community',
            createdAt: '2026-01-03T00:00:00.000Z',
            creator: { id: 'u2', name: 'Bob' },
            childFolders: { edges: [] },
            tags: { edges: [] },
          },
        },
      ],
      pageInfo: {
        startCursor: 'folder-1',
        endCursor: 'folder-2',
        hasNextPage: false,
        hasPreviousPage: false,
      },
    },
  },
};

const tagsResult = {
  organization: {
    id: ORG_ID,
    tags: {
      edges: [
        {
          node: {
            id: 'tag-1',
            name: 'Urgent',
            createdAt: '2026-01-02T00:00:00.000Z',
            creator: { id: 'u1', name: 'Alice' },
            folder: { id: 'folder-1' },
          },
        },
      ],
      pageInfo: {
        startCursor: 'tag-1',
        endCursor: 'tag-1',
        hasNextPage: false,
        hasPreviousPage: false,
      },
    },
  },
};

export const MOCKS = [
  {
    request: {
      query: ORGANIZATION_USER_TAGS_LIST_PG,
      variables: tagFoldersVariables,
    },
    result: { data: tagFoldersResult },
  },
  {
    request: {
      query: ORGANIZATION_TAGS_WITH_FOLDER,
      variables: orgTagsVariables,
    },
    result: { data: tagsResult },
  },
  {
    request: {
      query: CREATE_TAG_FOLDER,
      variables: {
        name: 'Growth',
        organizationId: ORG_ID,
      },
    },
    result: {
      data: {
        createTagFolder: {
          id: 'folder-3',
        },
      },
    },
  },
];

export const MOCKS_EMPTY = [
  {
    request: {
      query: ORGANIZATION_USER_TAGS_LIST_PG,
      variables: tagFoldersVariables,
    },
    result: {
      data: {
        organization: {
          id: ORG_ID,
          name: 'Test Org',
          tagFolders: {
            edges: [],
            pageInfo: {
              startCursor: null,
              endCursor: null,
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
      query: ORGANIZATION_TAGS_WITH_FOLDER,
      variables: orgTagsVariables,
    },
    result: {
      data: {
        organization: {
          id: ORG_ID,
          tags: {
            edges: [],
            pageInfo: {
              startCursor: null,
              endCursor: null,
              hasNextPage: false,
              hasPreviousPage: false,
            },
          },
        },
      },
    },
  },
];

export const MOCKS_ERROR = [
  {
    request: {
      query: ORGANIZATION_USER_TAGS_LIST_PG,
      variables: tagFoldersVariables,
    },
    error: new Error('Mock Graphql Error'),
  },
  {
    request: {
      query: ORGANIZATION_TAGS_WITH_FOLDER,
      variables: orgTagsVariables,
    },
    result: { data: tagsResult },
  },
];

export const MOCKS_CREATE_ERROR = [
  ...MOCKS,
  {
    request: {
      query: CREATE_TAG_FOLDER,
      variables: {
        name: 'Growth Error',
        organizationId: ORG_ID,
      },
    },
    error: new Error('Mock Graphql Error'),
  },
];

export const MOCKS_CREATE_NO_DATA = [
  ...MOCKS,
  {
    request: {
      query: CREATE_TAG_FOLDER,
      variables: {
        name: 'Growth NoData',
        organizationId: ORG_ID,
      },
    },
    result: {
      data: null,
    },
  },
];

export const MOCKS_CREATE_DELAYED = [
  {
    request: {
      query: ORGANIZATION_USER_TAGS_LIST_PG,
      variables: tagFoldersVariables,
    },
    result: { data: tagFoldersResult },
  },
  {
    request: {
      query: ORGANIZATION_TAGS_WITH_FOLDER,
      variables: orgTagsVariables,
    },
    result: { data: tagsResult },
  },
  {
    request: {
      query: CREATE_TAG_FOLDER,
      variables: {
        name: 'Growth Delayed',
        organizationId: ORG_ID,
      },
    },
    delay: 200,
    result: {
      data: {
        createTagFolder: {
          id: 'folder-delayed',
        },
      },
    },
  },
];
