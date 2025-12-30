import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { act } from 'react-dom/test-utils';
import { expect, vi } from 'vitest';
import i18nForTest from 'utils/i18nForTest';
import { store } from 'state/store';
import useLocalStorage from 'utils/useLocalstorage';
import {
  GET_COMMUNITY_SESSION_TIMEOUT_DATA_PG,
  ORGANIZATION_FILTER_LIST,
  USER_JOINED_ORGANIZATIONS_NO_MEMBERS,
} from 'GraphQl/Queries/Queries';
import { USER_CREATED_ORGANIZATIONS } from 'GraphQl/Queries/OrganizationQueries';
import Organizations from './Organizations';
import { StaticMockLink } from 'utils/StaticMockLink';

const { setItem } = useLocalStorage();

const paginationMock = vi.hoisted(() => ({
  default: ({
    count,
    rowsPerPage,
    page,
    onPageChange,
    onRowsPerPageChange,
  }: {
    count: number;
    rowsPerPage: number;
    page: number;
    onPageChange: (
      event: React.MouseEvent<unknown> | null,
      newPage: number,
    ) => void;
    onRowsPerPageChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  }) => (
    <div data-testid="pagination">
      <span data-testid="current-page">{page}</span>
      <button
        type="button"
        data-testid="prev-page"
        onClick={(e) => onPageChange(e, page - 1)}
        disabled={page === 0}
      >
        Previous
      </button>
      <button
        type="button"
        data-testid="next-page"
        onClick={(e) => onPageChange(e, page + 1)}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        Next
      </button>
      <select
        data-testid="rows-per-page"
        value={rowsPerPage}
        onChange={(e) => onRowsPerPageChange(e)}
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="25">25</option>
      </select>
    </div>
  ),
}));

vi.mock(
  'components/Pagination/PaginationList/PaginationList',
  () => paginationMock,
);

vi.mock('shared-components/OrganizationCard/OrganizationCard', () => ({
  default: ({ data }: { data: { name?: string } }) => (
    <div data-testid="organization-card" data-organization-name={data.name}>
      {data.name}
    </div>
  ),
}));

// Mock components to prevent router errors
vi.mock('components/SignOut/SignOut', () => ({
  default: vi.fn(() => (
    <button data-testid="signOutBtn" type="button">
      Sign Out
    </button>
  )),
}));

vi.mock('utils/useSession', () => ({
  default: vi.fn(() => ({
    endSession: vi.fn(),
    startSession: vi.fn(),
    handleLogout: vi.fn(),
    extendSession: vi.fn(),
  })),
}));

vi.mock('components/ProfileCard/ProfileCard', () => ({
  default: vi.fn(() => (
    <div data-testid="profile-dropdown">
      <div data-testid="display-name">Test User</div>
      <button data-testid="profileBtn" type="button">
        Profile Button
      </button>
    </div>
  )),
}));

vi.mock('components/UserPortal/UserSidebar/UserSidebar', () => ({
  default: vi.fn(({ hideDrawer }: { hideDrawer: boolean }) => (
    <div data-testid="user-sidebar" data-hide-drawer={hideDrawer}>
      <button data-testid="orgsBtn" type="button">
        Organizations
      </button>
    </div>
  )),
}));

const TEST_USER_ID = '01958985-600e-7cde-94a2-b3fc1ce66cf3';
const baseOrgFields = {
  addressLine1: 'asdfg',
  description: 'desc',
  avatarURL: '',
  membersCount: 0,
  adminsCount: 0,
  createdAt: '1234567890',
  members: {
    edges: [],
  },
};

const makeOrg = (overrides: Record<string, unknown> = {}) => ({
  __typename: 'Organization',
  ...baseOrgFields,
  id: 'org-default',
  name: 'Default Org',
  isMember: false,
  ...overrides,
});

const makeCreatedOrg = (overrides: Record<string, unknown> = {}) => ({
  ...makeOrg({
    avatarMimeType: 'image/png',
    isMember: true,
    ...overrides,
  }),
});

const COMMUNITY_TIMEOUT_MOCK = {
  request: {
    query: GET_COMMUNITY_SESSION_TIMEOUT_DATA_PG,
  },
  result: {
    data: {
      community: {
        inactivityTimeoutDuration: 1800,
      },
    },
  },
};

const MOCKS = [
  COMMUNITY_TIMEOUT_MOCK,
  {
    request: {
      query: USER_CREATED_ORGANIZATIONS,
      variables: {
        id: TEST_USER_ID,
        filter: '',
      },
    },
    result: {
      data: {
        user: {
          id: TEST_USER_ID,
          createdOrganizations: [
            makeCreatedOrg({
              id: '6401ff65ce8e8406b8f07af2',
              name: 'anyOrganization1',
            }),
          ],
        },
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_FILTER_LIST,
      variables: {
        filter: '',
      },
    },
    result: {
      data: {
        organizations: [
          makeOrg({
            id: '6401ff65ce8e8406b8f07af2',
            name: 'anyOrganization1',
            isMember: true,
          }),
          makeOrg({
            id: '6401ff65ce8e8406b8f07af3',
            name: 'anyOrganization2',
            isMember: true,
          }),
        ],
      },
    },
  },
  {
    request: {
      query: USER_JOINED_ORGANIZATIONS_NO_MEMBERS,
      variables: {
        id: TEST_USER_ID,
        first: 5,
        filter: '',
      },
    },
    result: {
      data: {
        user: {
          organizationsWhereMember: {
            pageInfo: {
              hasNextPage: false,
            },
            edges: [
              {
                node: makeOrg({
                  id: '6401ff65ce8e8406b8f07af2',
                  name: 'Test Edge Org',
                  addressLine1: 'Test Line 1',
                  description: 'Test Description',
                }),
              },
              {
                node: makeOrg({
                  id: '6401ff65ce8e8406b8f07af3',
                  name: 'anyOrganization1',
                }),
              },
            ],
          },
        },
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_FILTER_LIST,
      variables: {
        filter: 'Search Term',
      },
    },
    result: {
      data: {
        organizations: [
          makeOrg({
            id: '6401ff65ce8e8406b8f07af3',
            name: 'Search Result Org',
            isMember: true,
          }),
        ],
      },
    },
  },
];

const EMPTY_MOCKS = [
  COMMUNITY_TIMEOUT_MOCK,
  {
    request: {
      query: ORGANIZATION_FILTER_LIST,
      variables: { filter: '' },
    },
    result: {
      data: {
        organizations: [],
      },
    },
  },
  {
    request: {
      query: USER_JOINED_ORGANIZATIONS_NO_MEMBERS,
      variables: { id: TEST_USER_ID, first: 5, filter: '' },
    },
    result: {
      data: {
        user: {
          organizationsWhereMember: {
            edges: [],
            pageInfo: { hasNextPage: false },
          },
        },
      },
    },
  },
  {
    request: {
      query: USER_CREATED_ORGANIZATIONS,
      variables: { id: TEST_USER_ID, filter: '' },
    },
    result: {
      data: {
        user: {
          id: TEST_USER_ID,
          createdOrganizations: [],
        },
      },
    },
  },
];

const link = new StaticMockLink(MOCKS, true);
const emptyLink = new StaticMockLink(EMPTY_MOCKS, true);

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

beforeEach(() => {
  setItem('name', 'Test User');
  setItem('userId', TEST_USER_ID);
});

afterEach(() => {
  vi.restoreAllMocks();
});

test('Screen should be rendered properly', async () => {
  render(
    <MockedProvider link={link}>
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <Organizations />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>
    </MockedProvider>,
  );

  await wait();
  expect(screen.getByTestId('orgsBtn')).toBeInTheDocument();
  expect(screen.getByTestId('searchInput')).toBeInTheDocument();
  expect(screen.getByTestId('searchBtn')).toBeInTheDocument();
  expect(screen.getByTestId('modeChangeBtn')).toBeInTheDocument();
});

test('should search organizations when pressing Enter key', async () => {
  render(
    <MockedProvider link={link}>
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <Organizations />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>
    </MockedProvider>,
  );

  await waitFor(() => {
    expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
  });

  const searchInput = screen.getByTestId('searchInput');
  fireEvent.change(searchInput, { target: { value: 'Search Term' } });
  fireEvent.keyUp(searchInput, { key: 'Enter' });

  await waitFor(() => {
    const orgCards = screen.getAllByTestId('organization-card');
    expect(orgCards.length).toBeGreaterThan(0);
  });
});

test('should search organizations when clicking search button', async () => {
  render(
    <MockedProvider link={link}>
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <Organizations />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>
    </MockedProvider>,
  );

  await waitFor(() => {
    expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
  });

  const searchInput = screen.getByTestId('searchInput');
  fireEvent.change(searchInput, { target: { value: 'Search Term' } });

  const searchButton = screen.getByTestId('searchBtn');
  fireEvent.click(searchButton);

  await waitFor(() => {
    const orgCards = screen.getAllByTestId('organization-card');
    expect(orgCards.length).toBeGreaterThan(0);
  });
});

test('Mode dropdown switches list correctly', async () => {
  render(
    <MockedProvider link={link}>
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <Organizations />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>
    </MockedProvider>,
  );

  await waitFor(() => {
    expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
  });

  // Test Mode 0 (All Organizations)
  const modeButton = screen.getByTestId('modeChangeBtn');
  await userEvent.click(modeButton);

  // Initially should be in mode 0
  expect(screen.getByTestId('organizations-list')).toBeInTheDocument();

  // Switch to Mode 1 (Joined Organizations)
  await userEvent.click(screen.getByTestId('1'));

  await waitFor(() => {
    expect(screen.getByTestId('organizations-list')).toBeInTheDocument();
  });

  // Switch to Mode 2 (Created Organizations)
  await userEvent.click(modeButton);
  await userEvent.click(screen.getByTestId('2'));

  await waitFor(() => {
    expect(screen.getByTestId('organizations-list')).toBeInTheDocument();
  });
});

test('should display empty state when no organizations exist', async () => {
  render(
    <MockedProvider link={emptyLink}>
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <Organizations />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>
    </MockedProvider>,
  );

  await waitFor(() => {
    expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
  });

  expect(screen.getByText(/nothing to show here/i)).toBeInTheDocument();
});

test('Pagination basic functionality works', async () => {
  render(
    <MockedProvider link={link}>
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <Organizations />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>
    </MockedProvider>,
  );

  await wait();

  const rowsPerPageSelect = screen.getByTestId('rows-per-page');
  expect(rowsPerPageSelect).toHaveValue('5');

  fireEvent.change(rowsPerPageSelect, { target: { value: '10' } });
  expect(rowsPerPageSelect).toHaveValue('10');

  const currentPage = screen.getByTestId('current-page');
  expect(currentPage.textContent).toBe('0');

  const nextButton = screen.getByTestId('next-page');
  fireEvent.click(nextButton);

  await waitFor(() => {
    expect(screen.getByTestId('current-page').textContent).toBe('1');
  });
});
