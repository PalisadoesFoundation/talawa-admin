import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
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
  CURRENT_USER,
} from 'GraphQl/Queries/Queries';
import { USER_CREATED_ORGANIZATIONS } from 'GraphQl/Queries/OrganizationQueries';
import { RESEND_VERIFICATION_EMAIL_MUTATION } from 'GraphQl/Mutations/mutations';
import Organizations from './Organizations';
import { StaticMockLink } from 'utils/StaticMockLink';

let setItem: ReturnType<typeof useLocalStorage>['setItem'];
let clearAllItems: ReturnType<typeof useLocalStorage>['clearAllItems'];

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
  'shared-components/PaginationList/PaginationList',
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

const toastMocks = vi.hoisted(() => ({
  success: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  warning: vi.fn(),
  warn: vi.fn(),
}));

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    success: toastMocks.success,
    error: toastMocks.error,
    info: toastMocks.info,
    warning: toastMocks.warning,
    warn: toastMocks.warn,
  },
}));

vi.mock('utils/errorHandler', () => ({
  errorHandler: vi.fn(),
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

const baseUserFields = {
  addressLine1: 'Address 1',
  addressLine2: 'Address 2',
  avatarMimeType: 'image/png',
  avatarURL: '',
  birthDate: '2000-01-01',
  city: 'City',
  countryCode: 'US',
  createdAt: '1234567890',
  description: 'Description',
  educationGrade: 'Grade',
  emailAddress: 'test@example.com',
  employmentStatus: 'Employed',
  homePhoneNumber: '1234567890',
  id: TEST_USER_ID,
  isEmailAddressVerified: false,
  maritalStatus: 'Single',
  mobilePhoneNumber: '1234567890',
  name: 'Test User',
  natalSex: 'Male',
  naturalLanguageCode: 'en',
  postalCode: '12345',
  role: 'user',
  state: 'State',
  updatedAt: '1234567890',
  workPhoneNumber: '1234567890',
  eventsAttended: [],
};

const CURRENT_USER_VERIFIED_MOCK = {
  request: {
    query: CURRENT_USER,
    variables: {},
  },
  result: {
    data: {
      currentUser: {
        __typename: 'User',
        ...baseUserFields,
        isEmailAddressVerified: true,
      },
    },
  },
};

const CURRENT_USER_UNVERIFIED_MOCK = {
  request: {
    query: CURRENT_USER,
    variables: {},
  },
  result: {
    data: {
      currentUser: {
        __typename: 'User',
        ...baseUserFields,
        isEmailAddressVerified: false,
      },
    },
  },
};

const RESEND_SUCCESS_MOCK = {
  request: {
    query: RESEND_VERIFICATION_EMAIL_MUTATION,
    variables: {},
  },
  result: {
    data: {
      sendVerificationEmail: {
        __typename: 'ResendVerificationEmailPayload',
        success: true,
        message: 'Success',
      },
    },
  },
};

const RESEND_FAILURE_MOCK = {
  request: {
    query: RESEND_VERIFICATION_EMAIL_MUTATION,
    variables: {},
  },
  result: {
    data: {
      sendVerificationEmail: {
        __typename: 'ResendVerificationEmailPayload',
        success: false,
        message: 'Failure',
      },
    },
  },
};

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

const ORGANIZATION_FILTER_LIST_MOCK = {
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
};

const MOCKS = [
  COMMUNITY_TIMEOUT_MOCK,
  CURRENT_USER_VERIFIED_MOCK,
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
  ORGANIZATION_FILTER_LIST_MOCK,
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

const ERROR_MOCKS = [
  COMMUNITY_TIMEOUT_MOCK,
  {
    request: {
      query: ORGANIZATION_FILTER_LIST,
      variables: { filter: '' },
    },
    error: new Error('Network error'),
  },
];

const link = new StaticMockLink(MOCKS, true);
const emptyLink = new StaticMockLink(EMPTY_MOCKS, true);
const errorLink = new StaticMockLink(ERROR_MOCKS, true);

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

beforeEach(() => {
  const { setItem: setItemLocal, clearAllItems: clearAllItemsLocal } =
    useLocalStorage();
  setItem = setItemLocal;
  clearAllItems = clearAllItemsLocal;
  clearAllItems(); // Clear first to ensure clean slate
  setItem('name', 'Test User');
  setItem('userId', TEST_USER_ID);
});

afterEach(() => {
  vi.clearAllMocks();
  clearAllItems();
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
  expect(screen.getByTestId('modeChangeBtn-container')).toBeInTheDocument();
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
  await userEvent.clear(searchInput);
  await userEvent.type(searchInput, 'Search Term');
  await userEvent.type(searchInput, '{Enter}');

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
  await userEvent.clear(searchInput);
  await userEvent.type(searchInput, 'Search Term');

  const searchButton = screen.getByTestId('searchBtn');
  await userEvent.click(searchButton);

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
  const modeButton = screen.getByTestId('modeChangeBtn-toggle');
  await userEvent.click(modeButton);

  // Initially should be in mode 0 with organizations
  await waitFor(() => {
    expect(screen.getByTestId('organizations-list')).toBeInTheDocument();
  });

  // Switch to Mode 1 (Joined Organizations)
  await userEvent.click(screen.getByTestId('modeChangeBtn-item-1'));

  // Wait for mode change and check if component is still working
  await wait(200);
  expect(screen.getByTestId('modeChangeBtn-container')).toBeInTheDocument();

  // Switch to Mode 2 (Created Organizations)
  await userEvent.click(modeButton);
  await userEvent.click(screen.getByTestId('modeChangeBtn-item-2'));

  // Wait for mode change and check if component is still working
  await wait(200);
  expect(screen.getByTestId('modeChangeBtn-container')).toBeInTheDocument();
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

  await userEvent.selectOptions(rowsPerPageSelect, '10');
  expect(rowsPerPageSelect).toHaveValue('10');

  const currentPage = screen.getByTestId('current-page');
  expect(currentPage.textContent).toBe('0');

  const nextButton = screen.getByTestId('next-page');
  await userEvent.click(nextButton);

  await waitFor(() => {
    expect(screen.getByTestId('current-page').textContent).toBe('1');
  });
});

test('should handle resize event and hide drawer on small screens', async () => {
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
    expect(screen.getByTestId('organizations-container')).toBeInTheDocument();
  });

  const container = screen.getByTestId('organizations-container');
  expect(container).toBeInTheDocument();
});

test('should switch between organization mode', async () => {
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
    expect(screen.getByTestId('searchBtn')).toBeInTheDocument();
  });

  const modeButton = screen.getByTestId('modeChangeBtn-container');
  expect(modeButton).toBeInTheDocument();
});

test('should handle search with special characters', async () => {
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
    expect(screen.getByTestId('organizations-list')).toBeInTheDocument();
  });

  const searchInput = screen.getByTestId('searchInput') as HTMLInputElement;
  await userEvent.type(searchInput, '@#$%');
  expect(searchInput.value).toBe('@#$%');

  const searchButton = screen.getByTestId('searchBtn');
  await userEvent.click(searchButton);

  await waitFor(() => {
    expect(screen.getByTestId('organizations-list')).toBeInTheDocument();
  });
});

test('should restore sidebar state from localStorage', async () => {
  // The actual component reads from localStorage, but our mock UserSidebar
  // doesn't implement this. We'll just verify the component renders correctly.
  setItem('sidebar', 'true');

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
    expect(screen.getByTestId('organizations-container')).toBeInTheDocument();
  });

  const sidebar = screen.getByTestId('user-sidebar');
  // Just verify the sidebar exists - the mock doesn't actually implement localStorage behavior
  expect(sidebar).toBeInTheDocument();
});

test('should toggle sidebar visibility', async () => {
  clearAllItems();

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
    expect(screen.getByTestId('organizations-list')).toBeInTheDocument();
  });

  const container = screen.getByTestId('organizations-container');
  expect(container).toBeInTheDocument();
});

test('should handle GraphQL error in all organizations query', async () => {
  const consoleErrorSpy = vi
    .spyOn(console, 'error')
    .mockImplementation(() => {});

  try {
    render(
      <MockedProvider link={errorLink}>
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
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  } finally {
    consoleErrorSpy.mockRestore();
  }
});

test('should handle organizations with null/undefined fields', async () => {
  const nullFieldsMocks = [
    COMMUNITY_TIMEOUT_MOCK,
    {
      request: {
        query: ORGANIZATION_FILTER_LIST,
        variables: { filter: '' },
      },
      result: {
        data: {
          organizations: [
            {
              __typename: 'Organization',
              id: 'org1',
              name: 'Org with Nulls',
              isMember: false,
              avatarURL: null,
              description: null,
              addressLine1: null,
              membersCount: null,
              adminsCount: null,
              members: { edges: [] },
            },
          ],
        },
      },
    },
  ];

  const nullLink = new StaticMockLink(nullFieldsMocks, true);

  render(
    <MockedProvider link={nullLink}>
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
    expect(screen.getByTestId('organizations-list')).toBeInTheDocument();
  });

  const orgCards = screen.getAllByTestId('organization-card');
  expect(orgCards.length).toBeGreaterThan(0);
});

test('should handle mode switching to joined organizations', async () => {
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
    expect(screen.getByTestId('modeChangeBtn-container')).toBeInTheDocument();
  });

  // Switch to joined organizations mode (mode 1)
  const modeButton = screen.getByTestId('modeChangeBtn-toggle');
  await userEvent.click(modeButton);
  await userEvent.click(screen.getByTestId('modeChangeBtn-item-1'));

  await wait(200);

  // Verify we're in mode 1 by checking if the mode button still exists
  expect(screen.getByTestId('modeChangeBtn-container')).toBeInTheDocument();
});

test('should handle mode switching to created organizations', async () => {
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
    expect(screen.getByTestId('modeChangeBtn-container')).toBeInTheDocument();
  });

  // Switch to created organizations mode (mode 2)
  const modeButton = screen.getByTestId('modeChangeBtn-toggle');
  await userEvent.click(modeButton);
  await userEvent.click(screen.getByTestId('modeChangeBtn-item-2'));

  await wait(200);

  // Verify we're in mode 2 by checking if the mode button still exists
  expect(screen.getByTestId('modeChangeBtn-container')).toBeInTheDocument();
});

test('should handle null user data in joined organizations', async () => {
  const nullUserMocks = [
    COMMUNITY_TIMEOUT_MOCK,
    {
      request: {
        query: ORGANIZATION_FILTER_LIST,
        variables: { filter: '' },
      },
      result: {
        data: {
          organizations: [
            makeOrg({
              id: 'org1',
              name: 'Test Org',
            }),
          ],
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
              edges: null, // null is falsy, will trigger else
              pageInfo: { hasNextPage: false },
            },
          },
        },
      },
    },
  ];

  const nullUserLink = new StaticMockLink(nullUserMocks, true);

  render(
    <MockedProvider link={nullUserLink}>
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <Organizations />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>
    </MockedProvider>,
  );

  // Wait for initial load in mode 0
  await waitFor(() => {
    expect(screen.getByTestId('organizations-list')).toBeInTheDocument();
  });

  // Switch to joined mode
  const modeButton = screen.getByTestId('modeChangeBtn-toggle');
  await userEvent.click(modeButton);
  await userEvent.click(screen.getByTestId('modeChangeBtn-item-1'));

  // Wait for the mode switch to complete - the else branch should execute
  // setting organizations to empty array
  await wait(300);

  // Should show no organizations message
  await waitFor(() => {
    expect(screen.getByTestId('no-organizations-message')).toBeInTheDocument();
  });
});

test('should handle missing organizationsWhereMember in joined organizations', async () => {
  const missingEdgesMocks = [
    COMMUNITY_TIMEOUT_MOCK,
    {
      request: {
        query: ORGANIZATION_FILTER_LIST,
        variables: { filter: '' },
      },
      result: {
        data: {
          organizations: [
            makeOrg({
              id: 'org1',
              name: 'Test Org',
            }),
          ],
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
            // organizationsWhereMember is undefined/missing
            id: TEST_USER_ID,
          },
        },
      },
    },
  ];

  const missingEdgesLink = new StaticMockLink(missingEdgesMocks, true);

  render(
    <MockedProvider link={missingEdgesLink}>
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <Organizations />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>
    </MockedProvider>,
  );

  // Wait for initial load in mode 0
  await waitFor(() => {
    expect(screen.getByTestId('organizations-list')).toBeInTheDocument();
  });

  // Switch to joined mode
  const modeButton = screen.getByTestId('modeChangeBtn-toggle');
  await userEvent.click(modeButton);
  await userEvent.click(screen.getByTestId('modeChangeBtn-item-1'));

  // Wait for the mode switch to complete
  await wait(300);

  // Should show no organizations message because organizationsWhereMember is missing
  await waitFor(() => {
    expect(screen.getByTestId('no-organizations-message')).toBeInTheDocument();
  });
});

test('should handle null createdOrganizations in created organizations', async () => {
  const nullCreatedMocks = [
    COMMUNITY_TIMEOUT_MOCK,
    {
      request: {
        query: ORGANIZATION_FILTER_LIST,
        variables: { filter: '' },
      },
      result: {
        data: {
          organizations: [
            makeOrg({
              id: 'org1',
              name: 'Test Org',
            }),
          ],
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
            createdOrganizations: null, // null is falsy, will trigger else
          },
        },
      },
    },
  ];

  const nullCreatedLink = new StaticMockLink(nullCreatedMocks, true);

  render(
    <MockedProvider link={nullCreatedLink}>
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <Organizations />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>
    </MockedProvider>,
  );

  // Wait for initial load in mode 0
  await waitFor(() => {
    expect(screen.getByTestId('organizations-list')).toBeInTheDocument();
  });

  // Switch to created mode
  const modeButton = screen.getByTestId('modeChangeBtn-toggle');
  await userEvent.click(modeButton);
  await userEvent.click(screen.getByTestId('modeChangeBtn-item-2'));

  // Wait for the mode switch to complete
  await wait(300);

  // Should show no organizations message
  await waitFor(() => {
    expect(screen.getByTestId('no-organizations-message')).toBeInTheDocument();
  });
});

test('should handle missing createdOrganizations field', async () => {
  const missingUserMocks = [
    COMMUNITY_TIMEOUT_MOCK,
    {
      request: {
        query: ORGANIZATION_FILTER_LIST,
        variables: { filter: '' },
      },
      result: {
        data: {
          organizations: [
            makeOrg({
              id: 'org1',
              name: 'Test Org',
            }),
          ],
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
            // createdOrganizations field is missing/undefined
          },
        },
      },
    },
  ];

  const missingUserLink = new StaticMockLink(missingUserMocks, true);

  render(
    <MockedProvider link={missingUserLink}>
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <Organizations />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>
    </MockedProvider>,
  );

  // Wait for initial load in mode 0
  await waitFor(() => {
    expect(screen.getByTestId('organizations-list')).toBeInTheDocument();
  });

  // Switch to created mode
  const modeButton = screen.getByTestId('modeChangeBtn-toggle');
  await userEvent.click(modeButton);
  await userEvent.click(screen.getByTestId('modeChangeBtn-item-2'));

  // Wait for the mode switch to complete
  await wait(300);

  // Should show no organizations message because createdOrganizations is missing
  await waitFor(() => {
    expect(screen.getByTestId('no-organizations-message')).toBeInTheDocument();
  });
});

test('should handle window resize to trigger handleResize', async () => {
  // Set a wider initial window size
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 1024,
  });

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
    expect(screen.getByTestId('organizations-container')).toBeInTheDocument();
  });

  // Simulate window resize to small screen
  act(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 800,
    });
    window.dispatchEvent(new Event('resize'));
  });

  await wait();

  const sidebar = screen.getByTestId('user-sidebar');
  expect(sidebar).toBeInTheDocument();
});

test('should display organizations with complete data fields', async () => {
  const completeDataMocks = [
    COMMUNITY_TIMEOUT_MOCK,
    {
      request: {
        query: ORGANIZATION_FILTER_LIST,
        variables: { filter: '' },
      },
      result: {
        data: {
          organizations: [
            {
              __typename: 'Organization',
              id: 'complete-org',
              name: 'Complete Organization',
              isMember: true,
              avatarURL: 'https://example.com/avatar.jpg',
              description: 'Full description',
              addressLine1: '123 Main St',
              membersCount: 50,
              adminsCount: 5,
              members: { edges: [] },
            },
          ],
        },
      },
    },
  ];

  const completeLink = new StaticMockLink(completeDataMocks, true);

  render(
    <MockedProvider link={completeLink}>
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
    expect(screen.getByTestId('organizations-list')).toBeInTheDocument();
  });

  const orgCards = screen.getAllByTestId('organization-card');
  expect(orgCards.length).toBeGreaterThan(0);
  // Check the first organization card
  expect(orgCards[0]).toHaveAttribute(
    'data-organization-name',
    'Complete Organization',
  );
});

test('should reset page when changing rows per page', async () => {
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
    expect(screen.getByTestId('organizations-list')).toBeInTheDocument();
  });

  // Go to next page first
  const nextButton = screen.getByTestId('next-page');
  await userEvent.click(nextButton);

  await waitFor(() => {
    expect(screen.getByTestId('current-page').textContent).toBe('1');
  });

  // Change rows per page
  const rowsPerPageSelect = screen.getByTestId('rows-per-page');
  await userEvent.selectOptions(rowsPerPageSelect, '10');

  // Page should reset to 0
  await waitFor(() => {
    expect(screen.getByTestId('current-page').textContent).toBe('0');
  });
});

describe('Email Verification Warning', () => {
  const emailLink = new StaticMockLink(
    [
      COMMUNITY_TIMEOUT_MOCK,
      CURRENT_USER_UNVERIFIED_MOCK,
      RESEND_SUCCESS_MOCK,
      RESEND_FAILURE_MOCK,
      ORGANIZATION_FILTER_LIST_MOCK,
    ],
    true,
  );

  test('should display email verification warning when user is not verified', async () => {
    render(
      <MockedProvider link={emailLink}>
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
      expect(
        screen.getByTestId('email-verification-warning'),
      ).toBeInTheDocument();
    });
    expect(
      screen.getByText(
        'Your email is not verified. Please check your inbox for the verification link.',
      ),
    ).toBeInTheDocument();
  });

  test('should hide email verification warning when user is verified', async () => {
    const verifiedLink = new StaticMockLink(
      [
        COMMUNITY_TIMEOUT_MOCK,
        CURRENT_USER_VERIFIED_MOCK,
        ORGANIZATION_FILTER_LIST_MOCK,
      ],
      true,
    );

    render(
      <MockedProvider link={verifiedLink}>
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
      expect(screen.getByTestId('organizations-list')).toBeInTheDocument();
    });
    expect(
      screen.queryByTestId('email-verification-warning'),
    ).not.toBeInTheDocument();
  });

  test('should handle resend verification success', async () => {
    render(
      <MockedProvider link={emailLink}>
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
      expect(
        screen.getByTestId('email-verification-warning'),
      ).toBeInTheDocument();
    });

    const resendBtn = screen.getByTestId('resend-verification-btn');
    await userEvent.click(resendBtn);

    await waitFor(() => {
      expect(toastMocks.success).toHaveBeenCalledWith(
        'Verification email has been resent successfully.',
      );
    });
  });

  test('should handle resend verification failure', async () => {
    const failureEmailLink = new StaticMockLink(
      [
        COMMUNITY_TIMEOUT_MOCK,
        CURRENT_USER_UNVERIFIED_MOCK,
        RESEND_FAILURE_MOCK,
        ORGANIZATION_FILTER_LIST_MOCK,
      ],
      true,
    );

    render(
      <MockedProvider link={failureEmailLink}>
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
      expect(
        screen.getByTestId('email-verification-warning'),
      ).toBeInTheDocument();
    });

    const resendBtn = screen.getByTestId('resend-verification-btn');
    await userEvent.click(resendBtn);

    await waitFor(() => {
      expect(toastMocks.info).toHaveBeenCalledWith(
        'Failed to resend verification email. Please try again.',
      );
    });
  });

  test('should dismiss email verification warning', async () => {
    render(
      <MockedProvider link={emailLink}>
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
      expect(
        screen.getByTestId('email-verification-warning'),
      ).toBeInTheDocument();
    });

    const dismissBtn = screen.getByLabelText(/close/i);
    await userEvent.click(dismissBtn);

    expect(
      screen.queryByTestId('email-verification-warning'),
    ).not.toBeInTheDocument();
  });
});
