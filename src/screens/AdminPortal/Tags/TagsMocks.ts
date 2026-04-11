import { CREATE_TAG, CREATE_TAG_FOLDER } from 'GraphQl/Mutations/TagMutations';
import {
  ORGANIZATION_TAGS_WITH_FOLDER,
  TAG_FOLDER_CHILD_FOLDERS,
} from 'GraphQl/Queries/userTagQueries';
import { TAGS_QUERY_DATA_CHUNK_SIZE } from 'utils/organizationTagsUtils';

const ORG_ID = 'orgId';
const PARENT_FOLDER_ID = 'folder-parent';

const folderVariables = {
  input: { id: PARENT_FOLDER_ID },
  first: TAGS_QUERY_DATA_CHUNK_SIZE,
};

const orgTagsVariables = {
  id: ORG_ID,
  first: 32,
};

const folderDataResult = {
  tagFolder: {
    id: PARENT_FOLDER_ID,
    name: 'Operations',
    tags: {
      edges: [
        {
          node: {
            id: 'tag-1',
            name: 'Urgent',
            createdAt: '2026-01-05T00:00:00.000Z',
            creator: { id: 'u1', name: 'Alice' },
          },
        },
      ],
    },
    childFolders: {
      edges: [
        {
          node: {
            id: 'folder-child-1',
            name: 'Community',
            createdAt: '2026-01-04T00:00:00.000Z',
            creator: { id: 'u2', name: 'Bob' },
            childFolders: { edges: [{ node: { id: 'folder-child-1-1' } }] },
            tags: { edges: [{ node: { id: 'tag-2' } }] },
          },
        },
      ],
      pageInfo: {
        startCursor: 'folder-child-1',
        endCursor: 'folder-child-1',
        hasNextPage: false,
        hasPreviousPage: false,
      },
    },
    parentFolder: {
      id: 'folder-root',
      name: 'All Teams',
      parentFolder: null,
    },
  },
};

const orgTagsResult = {
  organization: {
    id: ORG_ID,
    tags: {
      edges: [
        {
          node: {
            id: 'tag-1',
            name: 'Urgent',
            createdAt: '2026-01-05T00:00:00.000Z',
            creator: { id: 'u1', name: 'Alice' },
            folder: { id: PARENT_FOLDER_ID },
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
      query: TAG_FOLDER_CHILD_FOLDERS,
      variables: folderVariables,
    },
    result: {
      data: folderDataResult,
    },
  },
  {
    request: {
      query: ORGANIZATION_TAGS_WITH_FOLDER,
      variables: orgTagsVariables,
    },
    result: {
      data: orgTagsResult,
    },
  },
  {
    request: {
      query: CREATE_TAG_FOLDER,
      variables: {
        name: 'Growth Folder',
        organizationId: ORG_ID,
        parentFolderId: PARENT_FOLDER_ID,
      },
    },
    result: {
      data: {
        createTagFolder: {
          id: 'folder-new',
        },
      },
    },
  },
  {
    request: {
      query: TAG_FOLDER_CHILD_FOLDERS,
      variables: folderVariables,
    },
    result: {
      data: folderDataResult,
    },
  },
  {
    request: {
      query: CREATE_TAG,
      variables: {
        name: 'Urgent Tag',
        organizationId: ORG_ID,
        folderId: PARENT_FOLDER_ID,
      },
    },
    result: {
      data: {
        createTag: {
          id: 'tag-new',
        },
      },
    },
  },
  {
    request: {
      query: TAG_FOLDER_CHILD_FOLDERS,
      variables: folderVariables,
    },
    result: {
      data: folderDataResult,
    },
  },
];

export const MOCKS_EMPTY = [
  {
    request: {
      query: TAG_FOLDER_CHILD_FOLDERS,
      variables: folderVariables,
    },
    result: {
      data: {
        tagFolder: {
          id: PARENT_FOLDER_ID,
          name: 'Operations',
          tags: {
            edges: [],
          },
          childFolders: {
            edges: [],
            pageInfo: {
              startCursor: null,
              endCursor: null,
              hasNextPage: false,
              hasPreviousPage: false,
            },
          },
          parentFolder: {
            id: 'folder-root',
            name: 'All Teams',
            parentFolder: null,
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
      query: TAG_FOLDER_CHILD_FOLDERS,
      variables: folderVariables,
    },
    error: new Error('Mock Graphql Error'),
  },
  {
    request: {
      query: ORGANIZATION_TAGS_WITH_FOLDER,
      variables: orgTagsVariables,
    },
    result: {
      data: orgTagsResult,
    },
  },
];

export const MOCKS_CREATE_TAG_ERROR = [
  {
    request: {
      query: TAG_FOLDER_CHILD_FOLDERS,
      variables: folderVariables,
    },
    result: {
      data: folderDataResult,
    },
  },
  {
    request: {
      query: ORGANIZATION_TAGS_WITH_FOLDER,
      variables: orgTagsVariables,
    },
    result: {
      data: orgTagsResult,
    },
  },
  {
    request: {
      query: CREATE_TAG,
      variables: {
        name: 'Tag Error',
        organizationId: ORG_ID,
        folderId: PARENT_FOLDER_ID,
      },
    },
    error: new Error('Failed to create tag'),
  },
];

export const MOCKS_CREATE_FOLDER_ERROR = [
  {
    request: {
      query: TAG_FOLDER_CHILD_FOLDERS,
      variables: folderVariables,
    },
    result: {
      data: folderDataResult,
    },
  },
  {
    request: {
      query: ORGANIZATION_TAGS_WITH_FOLDER,
      variables: orgTagsVariables,
    },
    result: {
      data: orgTagsResult,
    },
  },
  {
    request: {
      query: CREATE_TAG_FOLDER,
      variables: {
        name: 'Folder Error',
        organizationId: ORG_ID,
        parentFolderId: PARENT_FOLDER_ID,
      },
    },
    error: new Error('Failed to create folder'),
  },
];
