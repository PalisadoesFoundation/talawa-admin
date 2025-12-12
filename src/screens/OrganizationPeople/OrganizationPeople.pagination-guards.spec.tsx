import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  InMemoryCache,
} from '@apollo/client';
import { MemoryRouter, Routes, Route } from 'react-router';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { mockSingleLink } from 'utils/StaticMockLink';
import { ORGANIZATIONS_MEMBER_CONNECTION_LIST } from 'GraphQl/Queries/Queries';
import OrganizationPeople from './OrganizationPeople';
import { vi } from 'vitest';
import type { IPeopleTableProps } from 'types/PeopleTable/interface';
import type { GridCallbackDetails } from '@mui/x-data-grid';
import type { MockedResponse } from '@apollo/react-testing';
import type {
  DefinitionNode,
  DocumentNode,
  FieldNode,
  SelectionNode,
} from 'graphql';

const documentContainsField = (
  document: DocumentNode | undefined,
  fieldName: string,
): boolean => {
  if (!document) return false;

  const visitSelections = (selections: readonly SelectionNode[]): boolean => {
    for (const selection of selections) {
      if (selection.kind === 'Field') {
        const field = selection as FieldNode;
        if (field.name.value === fieldName) return true;
        if (
          field.selectionSet &&
          visitSelections(field.selectionSet.selections)
        ) {
          return true;
        }
      } else if (
        selection.kind === 'InlineFragment' &&
        selection.selectionSet &&
        visitSelections(selection.selectionSet.selections)
      ) {
        return true;
      } else if (
        selection.kind === 'FragmentSpread'
        // Fragment spreads require fragment definitions to be resolved; skip.
      ) {
        continue;
      }
    }
    return false;
  };

  return document.definitions.some((definition: DefinitionNode) => {
    if (definition.kind !== 'OperationDefinition') return false;
    return visitSelections(definition.selectionSet.selections);
  });
};

const isMemberConnectionOperation = (operation: {
  operationName?: string;
  query?: DocumentNode;
}): boolean => {
  // Prefer strict identity match when possible.
  if (operation.query === ORGANIZATIONS_MEMBER_CONNECTION_LIST) return true;

  // Fallback: match by operation name if present.
  if (operation.operationName === 'OrganizationsMemberConnectionList')
    return true;

  // Last resort: detect the expected field in the query.
  return documentContainsField(operation.query, 'members');
};

vi.mock('shared-components/PeopleTable/PeopleTable', () => ({
  default: ({
    rows,
    paginationModel,
    onPaginationModelChange,
  }: Pick<
    IPeopleTableProps,
    'rows' | 'paginationModel' | 'onPaginationModelChange'
  >) => {
    if (!onPaginationModelChange) {
      throw new Error(
        'PeopleTable mock: expected `onPaginationModelChange` to be provided by OrganizationPeople',
      );
    }

    const safeRows = rows ?? [];
    const safePaginationModel = paginationModel ?? { page: 0, pageSize: 10 };

    return (
      <div>
        <button
          type="button"
          aria-label="previous page"
          onClick={() =>
            onPaginationModelChange(
              {
                page: safePaginationModel.page - 1,
                pageSize: safePaginationModel.pageSize,
              },
              {} as GridCallbackDetails<'pagination'>,
            )
          }
        >
          previous page
        </button>
        <button
          type="button"
          aria-label="same page"
          onClick={() =>
            onPaginationModelChange(
              {
                page: safePaginationModel.page,
                pageSize: safePaginationModel.pageSize,
              },
              {} as GridCallbackDetails<'pagination'>,
            )
          }
        >
          same page
        </button>
        <button
          type="button"
          aria-label="next page"
          onClick={() =>
            onPaginationModelChange(
              {
                page: safePaginationModel.page + 1,
                pageSize: safePaginationModel.pageSize,
              },
              {} as GridCallbackDetails<'pagination'>,
            )
          }
        >
          next page
        </button>
        <button
          type="button"
          aria-label="jump forward"
          onClick={() =>
            onPaginationModelChange(
              {
                page: safePaginationModel.page + 2,
                pageSize: safePaginationModel.pageSize,
              },
              {} as GridCallbackDetails<'pagination'>,
            )
          }
        >
          jump forward
        </button>
        <button
          type="button"
          aria-label="jump backward"
          onClick={() =>
            onPaginationModelChange(
              {
                page: safePaginationModel.page - 2,
                pageSize: safePaginationModel.pageSize,
              },
              {} as GridCallbackDetails<'pagination'>,
            )
          }
        >
          jump backward
        </button>
        {safeRows.map((row, index) => {
          const typedRow = row as { _id?: string; id?: string; name?: string };
          return (
            <div key={typedRow._id ?? typedRow.id ?? index}>
              {typedRow.name}
            </div>
          );
        })}
      </div>
    );
  },
}));

vi.mock('./addMember/AddMember', () => ({
  default: () => null,
}));

type MemberConnectionVariables = {
  orgId: string;
  first?: number | null;
  after?: string | null;
  last?: number | null;
  before?: string | null;
  where?: { role?: { equal: string } };
};

const createMemberConnectionMock = (
  variables: MemberConnectionVariables,
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string;
    endCursor: string;
  },
): MockedResponse => {
  return {
    request: {
      query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
      variables,
    },
    result: {
      data: {
        organization: {
          members: {
            edges: [
              {
                node: {
                  id: 'member1',
                  name: 'John Doe',
                  emailAddress: 'john@example.com',
                  avatarURL: null,
                  createdAt: '2023-01-01T00:00:00Z',
                  role: 'member',
                  __typename: 'User',
                },
                cursor: 'cursor1',
                __typename: 'MemberEdge',
              },
            ],
            pageInfo: {
              ...pageInfo,
              __typename: 'PageInfo',
            },
            __typename: 'MemberConnection',
          },
          __typename: 'Organization',
        },
      },
    },
  };
};

describe('OrganizationPeople pagination guards', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('does not refetch on no-op page change', async () => {
    let operationCount = 0;
    const singlePageMock = createMemberConnectionMock(
      {
        orgId: 'orgid',
        first: 10,
        after: null,
        last: null,
        before: null,
      },
      {
        hasNextPage: true,
        hasPreviousPage: false,
        startCursor: 'cursor1',
        endCursor: 'cursor1',
      },
    );

    const mockLink = mockSingleLink(singlePageMock);
    const operationCountLink = new ApolloLink((operation, forward) => {
      if (isMemberConnectionOperation(operation)) {
        operationCount += 1;
      }
      return forward ? forward(operation) : null;
    });

    const client = new ApolloClient({
      cache: new InMemoryCache(),
      link: ApolloLink.from([operationCountLink, mockLink]),
    });

    render(
      <ApolloProvider client={client}>
        <MemoryRouter initialEntries={['/orgpeople/orgid']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/orgpeople/:orgId"
                  element={<OrganizationPeople />}
                />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </ApolloProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const operationCountAfterInitialLoad = operationCount;

    fireEvent.click(screen.getByRole('button', { name: /same page/i }));

    expect(operationCount).toBe(operationCountAfterInitialLoad);
  });

  test('blocks forward jumps when cursor chain is missing', async () => {
    let operationCount = 0;
    const initialMock = createMemberConnectionMock(
      {
        orgId: 'orgid',
        first: 10,
        after: null,
        last: null,
        before: null,
      },
      {
        hasNextPage: true,
        hasPreviousPage: false,
        startCursor: 'cursor1',
        endCursor: 'cursor1',
      },
    );

    const mockLink = mockSingleLink(initialMock);
    const operationCountLink = new ApolloLink((operation, forward) => {
      if (isMemberConnectionOperation(operation)) {
        operationCount += 1;
      }
      return forward ? forward(operation) : null;
    });

    const client = new ApolloClient({
      cache: new InMemoryCache(),
      link: ApolloLink.from([operationCountLink, mockLink]),
    });

    render(
      <ApolloProvider client={client}>
        <MemoryRouter initialEntries={['/orgpeople/orgid']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/orgpeople/:orgId"
                  element={<OrganizationPeople />}
                />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </ApolloProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const operationCountAfterInitialLoad = operationCount;

    fireEvent.click(screen.getByRole('button', { name: /jump forward/i }));

    expect(operationCount).toBe(operationCountAfterInitialLoad);
  });

  test('blocks backward jumps when cursor chain is missing', async () => {
    let operationCount = 0;
    const initialMock = createMemberConnectionMock(
      {
        orgId: 'orgid',
        first: 10,
        after: null,
        last: null,
        before: null,
      },
      {
        hasNextPage: false,
        hasPreviousPage: true,
        startCursor: 'cursor1',
        endCursor: 'cursor1',
      },
    );

    const mockLink = mockSingleLink(initialMock);
    const operationCountLink = new ApolloLink((operation, forward) => {
      if (isMemberConnectionOperation(operation)) {
        operationCount += 1;
      }
      return forward ? forward(operation) : null;
    });

    const client = new ApolloClient({
      cache: new InMemoryCache(),
      link: ApolloLink.from([operationCountLink, mockLink]),
    });

    render(
      <ApolloProvider client={client}>
        <MemoryRouter initialEntries={['/orgpeople/orgid']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/orgpeople/:orgId"
                  element={<OrganizationPeople />}
                />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </ApolloProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const operationCountAfterInitialLoad = operationCount;

    fireEvent.click(screen.getByRole('button', { name: /jump backward/i }));

    expect(operationCount).toBe(operationCountAfterInitialLoad);
  });

  test('blocks forward pagination when hasNextPage is false', async () => {
    let operationCount = 0;
    const singlePageMock = createMemberConnectionMock(
      {
        orgId: 'orgid',
        first: 10,
        after: null,
        last: null,
        before: null,
      },
      {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: 'cursor1',
        endCursor: 'cursor1',
      },
    );

    const mockLink = mockSingleLink(singlePageMock);
    const operationCountLink = new ApolloLink((operation, forward) => {
      if (isMemberConnectionOperation(operation)) {
        operationCount += 1;
      }
      return forward ? forward(operation) : null;
    });

    const client = new ApolloClient({
      cache: new InMemoryCache(),
      link: ApolloLink.from([operationCountLink, mockLink]),
    });

    render(
      <ApolloProvider client={client}>
        <MemoryRouter initialEntries={['/orgpeople/orgid']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/orgpeople/:orgId"
                  element={<OrganizationPeople />}
                />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </ApolloProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const operationCountAfterInitialLoad = operationCount;

    // This triggers OrganizationPeople.handlePaginationModelChange with a forward navigation.
    fireEvent.click(screen.getByRole('button', { name: /next page/i }));

    // Explicit assertion: the forward-navigation guard prevents any follow-up query.
    expect(operationCount).toBe(operationCountAfterInitialLoad);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  test('blocks backward pagination when hasPreviousPage is false', async () => {
    let operationCount = 0;
    const singlePageMock = createMemberConnectionMock(
      {
        orgId: 'orgid',
        first: 10,
        after: null,
        last: null,
        before: null,
      },
      {
        hasNextPage: true,
        hasPreviousPage: false,
        startCursor: 'cursor1',
        endCursor: 'cursor1',
      },
    );

    const mockLink = mockSingleLink(singlePageMock);
    const operationCountLink = new ApolloLink((operation, forward) => {
      if (isMemberConnectionOperation(operation)) {
        operationCount += 1;
      }
      return forward ? forward(operation) : null;
    });

    const client = new ApolloClient({
      cache: new InMemoryCache(),
      link: ApolloLink.from([operationCountLink, mockLink]),
    });

    render(
      <ApolloProvider client={client}>
        <MemoryRouter initialEntries={['/orgpeople/orgid']}>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Routes>
                <Route
                  path="/orgpeople/:orgId"
                  element={<OrganizationPeople />}
                />
              </Routes>
            </I18nextProvider>
          </Provider>
        </MemoryRouter>
      </ApolloProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const operationCountAfterInitialLoad = operationCount;

    // This triggers OrganizationPeople.handlePaginationModelChange with a backward navigation.
    fireEvent.click(screen.getByRole('button', { name: /previous page/i }));

    // Explicit assertion: the backward-navigation guard prevents any follow-up query.
    expect(operationCount).toBe(operationCountAfterInitialLoad);
  });
});
