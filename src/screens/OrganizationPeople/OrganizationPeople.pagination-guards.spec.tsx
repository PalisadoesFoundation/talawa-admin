import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter, Routes, Route } from 'react-router';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { ORGANIZATIONS_MEMBER_CONNECTION_LIST } from 'GraphQl/Queries/Queries';
import OrganizationPeople from './OrganizationPeople';
import { vi } from 'vitest';
import type { IPeopleTableProps } from 'types/PeopleTable/interface';
import type { GridCallbackDetails } from '@mui/x-data-grid';

vi.mock('components/PeopleTable/PeopleTable', () => ({
  default: ({
    rows,
    paginationModel,
    onPaginationModelChange,
  }: Pick<
    IPeopleTableProps,
    'rows' | 'paginationModel' | 'onPaginationModelChange'
  >) => {
    const safeRows = rows ?? [];
    const safePaginationModel = paginationModel ?? { page: 0, pageSize: 10 };

    return (
      <div>
        <button
          type="button"
          aria-label="next page"
          onClick={() =>
            onPaginationModelChange?.(
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
) => {
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

  test('blocks forward pagination when hasNextPage is false', async () => {
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

    render(
      <MockedProvider mocks={[singlePageMock]}>
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
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // This triggers OrganizationPeople.handlePaginationModelChange with a forward navigation.
    fireEvent.click(screen.getByRole('button', { name: /next page/i }));

    // If a follow-up query is executed, MockedProvider will throw due to missing mocks.
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
