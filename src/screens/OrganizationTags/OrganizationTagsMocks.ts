import { CREATE_USER_TAG } from 'GraphQl/Mutations/TagMutations';
import { ORGANIZATION_USER_TAGS_LIST_PG } from 'GraphQl/Queries/OrganizationQueries';
import { PAGE_SIZE } from 'types/ReportingTable/utils';

/* ---------- Types ---------- */

type TagAncestor = { id: string; name: string };

export type TagEdge = {
  node: {
    id: string;
    name: string;
    parentTag: { id: string } | null;
    usersAssignedTo: { totalCount: number };
    childTags: { totalCount: number };
    ancestorTags: TagAncestor[];
  };
  cursor: string;
};

type PageInfo = {
  startCursor: string | null;
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

type UserTags = {
  edges: TagEdge[];
  pageInfo: PageInfo;
  totalCount: number;
};

type ListMock = {
  request: {
    query: typeof ORGANIZATION_USER_TAGS_LIST_PG;
    variables: Record<string, unknown>;
  };
  result: { data: { organization: { tags: UserTags } } };
};

type ErrorMock = {
  request: {
    query: typeof ORGANIZATION_USER_TAGS_LIST_PG;
    variables: Record<string, unknown>;
  };
  error: Error;
};

/* ---------- Utility builders ---------- */
export const makeTagEdge = (
  id: string | number,
  opts?: {
    parentId?: string | null;
    users?: number;
    children?: number;
    ancestors?: TagAncestor[];
  },
): TagEdge => ({
  node: {
    id: String(id),
    name: `userTag ${id}`,
    parentTag: opts?.parentId ? { id: opts.parentId } : null,
    usersAssignedTo: { totalCount: opts?.users ?? 5 },
    childTags: { totalCount: opts?.children ?? 5 },
    ancestorTags: opts?.ancestors ?? [],
  },
  cursor: String(id),
});

export const makeUserTags = (
  edges: TagEdge[],
  pageInfo: Partial<PageInfo> = {},
): UserTags => ({
  edges,
  pageInfo: {
    startCursor: edges[0]?.cursor ?? null,
    endCursor: edges[edges.length - 1]?.cursor ?? null,
    hasNextPage: false,
    hasPreviousPage: false,
    ...pageInfo,
  },
  totalCount: edges.length,
});

const listMock = (
  variables: Record<string, unknown>,
  edges: TagEdge[],
  pageInfo: Partial<PageInfo> = {},
): ListMock => ({
  request: { query: ORGANIZATION_USER_TAGS_LIST_PG, variables },
  result: {
    data: { organization: { tags: makeUserTags(edges, pageInfo) } },
  },
});

const errorMock = (
  variables: Record<string, unknown>,
  error: Error,
): ErrorMock => ({
  request: { query: ORGANIZATION_USER_TAGS_LIST_PG, variables },
  error,
});

/* ---------- Build mock sets ---------- */

export const MOCK_RESPONSES = {
  DEFAULT: [
    listMock(
      {
        input: { id: 'orgId' },
        first: PAGE_SIZE,
        where: { name: { starts_with: '' } },
        sortedBy: { id: 'DESCENDING' },
      },
      [...Array(10)].map((_, i) => makeTagEdge(i + 1)),
      { hasNextPage: true },
    ),
    listMock(
      {
        input: { id: 'orgId' },
        first: PAGE_SIZE,
        after: '10',
        where: { name: { starts_with: '' } },
        sortedBy: { id: 'DESCENDING' },
      },
      [makeTagEdge(11), makeTagEdge(12)],
    ),
    listMock(
      {
        input: { id: 'orgId' },
        first: PAGE_SIZE,
        where: { name: { starts_with: 'searchUserTag' } },
        sortedBy: { id: 'DESCENDING' },
      },
      [
        makeTagEdge('searchUserTag1', {
          parentId: '1',
          ancestors: [{ id: '1', name: 'userTag 1' }],
        }),
        makeTagEdge('searchUserTag2', {
          parentId: '1',
          ancestors: [{ id: '1', name: 'userTag 1' }],
        }),
      ],
    ),
    listMock(
      {
        input: { id: 'orgId' },
        first: PAGE_SIZE,
        where: { name: { starts_with: 'searchUserTag' } },
        sortedBy: { id: 'ASCENDING' },
      },
      [
        makeTagEdge('searchUserTag2', {
          parentId: '1',
          ancestors: [{ id: '1', name: 'userTag 1' }],
        }),
        makeTagEdge('searchUserTag1', {
          parentId: '1',
          ancestors: [{ id: '1', name: 'userTag 1' }],
        }),
      ],
    ),
    {
      request: {
        query: CREATE_USER_TAG,
        variables: { name: 'userTag 12', organizationId: 'orgId' },
      },
      result: { data: { createUserTag: { id: '12' } } },
    },
    {
      request: {
        query: CREATE_USER_TAG,
        variables: { name: 'userTag 13', organizationId: 'orgId' },
      },
      result: { data: null },
    },
  ],

  ERROR_ORG: [
    errorMock(
      {
        input: { id: 'orgIdError' },
        first: PAGE_SIZE,
        where: { name: { starts_with: '' } },
        sortedBy: { id: 'DESCENDING' },
      },
      new Error('Mock Graphql Error'),
    ),
  ],

  ERROR_CREATE_TAG: [
    {
      request: {
        query: CREATE_USER_TAG,
        variables: { name: 'userTagE', organizationId: 'orgId' },
      },
      error: new Error('Mock Graphql Error'),
    },
  ],

  EMPTY: [
    listMock(
      {
        input: { id: 'orgId' },
        first: PAGE_SIZE,
        where: { name: { starts_with: '' } },
        sortedBy: { id: 'DESCENDING' },
      },
      [],
    ),
  ],

  UNDEFINED_USER_TAGS: [
    {
      request: {
        query: ORGANIZATION_USER_TAGS_LIST_PG,
        variables: {
          input: { id: 'orgId' },
          first: PAGE_SIZE,
          where: { name: { starts_with: '' } },
          sortedBy: { id: 'DESCENDING' },
        },
      },
      result: {
        data: {
          organization: { tags: undefined as unknown as UserTags },
        },
      },
    },
  ],

  NULL_END_CURSOR: [
    listMock(
      {
        input: { id: 'orgId' },
        first: PAGE_SIZE,
        where: { name: { starts_with: '' } },
        sortedBy: { id: 'DESCENDING' },
      },
      [makeTagEdge(1)],
      { endCursor: null, hasNextPage: true },
    ),
    listMock(
      {
        input: { id: 'orgId' },
        first: PAGE_SIZE,
        after: null,
        where: { name: { starts_with: '' } },
        sortedBy: { id: 'DESCENDING' },
      },
      [makeTagEdge(1, {})],
      { endCursor: null, hasNextPage: true },
    ),
    {
      request: {
        query: ORGANIZATION_USER_TAGS_LIST_PG,
        variables: {
          input: { id: 'orgId' },
          first: PAGE_SIZE,
          after: null,
          where: { name: { starts_with: '' } },
          sortedBy: { id: 'DESCENDING' },
        },
      },
      error: new Error('Mock Graphql Error'),
    },
  ],

  ASCENDING_NO_SEARCH: [
    listMock(
      {
        input: { id: 'orgId' },
        first: PAGE_SIZE,
        where: { name: { starts_with: '' } },
        sortedBy: { id: 'ASCENDING' },
      },
      [...Array(10)].map((_, i) => makeTagEdge(10 - i)),
      { hasNextPage: true },
    ),
  ],

  FETCHMORE_UNDEFINED: [
    listMock(
      {
        input: { id: 'orgId' },
        first: PAGE_SIZE,
        where: { name: { starts_with: '' } },
        sortedBy: { id: 'DESCENDING' },
      },
      [makeTagEdge(1)],
      { hasNextPage: true },
    ),
    {
      request: {
        query: ORGANIZATION_USER_TAGS_LIST_PG,
        variables: {
          input: { id: 'orgId' },
          first: PAGE_SIZE,
          after: '1',
          where: { name: { starts_with: '' } },
          sortedBy: { id: 'DESCENDING' },
        },
      },
      result: { data: undefined },
    },
  ],
};

export const MOCKS = MOCK_RESPONSES.DEFAULT;
export const MOCKS_ERROR = MOCK_RESPONSES.ERROR_ORG;
export const MOCKS_ERROR_ERROR_TAG = MOCK_RESPONSES.ERROR_CREATE_TAG;
export const MOCKS_EMPTY = MOCK_RESPONSES.EMPTY;
export const MOCKS_UNDEFINED_USER_TAGS = MOCK_RESPONSES.UNDEFINED_USER_TAGS;
export const MOCKS_NULL_END_CURSOR = MOCK_RESPONSES.NULL_END_CURSOR;
export const MOCKS_NO_MORE_PAGES = MOCK_RESPONSES.DEFAULT;
export const MOCKS_ASCENDING_NO_SEARCH = MOCK_RESPONSES.ASCENDING_NO_SEARCH;
export const MOCKS_FETCHMORE_UNDEFINED = MOCK_RESPONSES.FETCHMORE_UNDEFINED;
