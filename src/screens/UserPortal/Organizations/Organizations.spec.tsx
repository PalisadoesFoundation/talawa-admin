/* global HTMLSelectElement */
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
import { InterfaceOrganizationCardProps } from 'types/OrganizationCard/interface';

const { setItem, getItem } = useLocalStorage();

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
  default: ({ data }: { data: InterfaceOrganizationCardProps }) => (
    <div
      data-testid="organization-card-mock"
      data-organization-name={data.name}
      data-membership-status={data.membershipRequestStatus}
    >
      {data.name}
    </div>
  ),
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
        id: getItem('userId'),
        filter: '',
      },
    },
    result: {
      data: {
        user: {
          id: getItem('userId'),
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
        id: getItem('userId'),
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
        filter: '2',
      },
    },
    result: {
      data: {
        organizations: [
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
        id: getItem('userId'),
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
                  name: 'anyOrganization1',
                }),
              },
              {
                node: makeOrg({
                  id: '6401ff65ce8e8406b8f07af3',
                  name: 'anyOrganization2',
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
      query: USER_JOINED_ORGANIZATIONS_NO_MEMBERS,
      variables: {
        id: getItem('userId'),
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
                  id: '6401ff65ce8e8406b8f07af3',
                  name: 'anyOrganization2',
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
      query: USER_JOINED_ORGANIZATIONS_NO_MEMBERS,
      variables: {
        id: getItem('userId'),
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
                  name: 'anyOrganization1',
                }),
              },
              {
                node: makeOrg({
                  id: '6401ff65ce8e8406b8f07af3',
                  name: 'anyOrganization2',
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
      query: USER_JOINED_ORGANIZATIONS_NO_MEMBERS,
      variables: {
        id: getItem('userId'),
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
            ],
          },
        },
      },
    },
  },
];
const resizeWindow = (width: number): void => {
  window.innerWidth = width;
  fireEvent(window, new window.Event('resize'));
};

const TEST_USER_NAME = 'Noble Mittal';
beforeEach(() => {
  setItem('name', TEST_USER_NAME);
  setItem('userId', TEST_USER_ID);
});

afterEach(() => {
  vi.restoreAllMocks();
});

test('Screen should be rendered properly', async () => {
  render(
    <MockedProvider link={link} mocks={MOCKS}>
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
});

test('Search works properly', async () => {
  const searchMocks = [
    COMMUNITY_TIMEOUT_MOCK,
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
        query: ORGANIZATION_FILTER_LIST,
        variables: {
          filter: '2',
        },
      },
      result: {
        data: {
          organizations: [
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
        query: ORGANIZATION_FILTER_LIST,
        variables: {
          filter: '2',
        },
      },
      result: {
        data: {
          organizations: [
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
        query: ORGANIZATION_FILTER_LIST,
        variables: {
          filter: '2',
        },
      },
      result: {
        data: {
          organizations: [
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
        query: ORGANIZATION_FILTER_LIST,
        variables: {
          filter: '2',
        },
      },
      result: {
        data: {
          organizations: [
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
        query: ORGANIZATION_FILTER_LIST,
        variables: {
          filter: '2',
        },
      },
      result: {
        data: {
          organizations: [
            makeOrg({
              id: '6401ff65ce8e8406b8f07af3',
              name: 'anyOrganization2',
              isMember: true,
            }),
          ],
        },
      },
    },
  ];

  render(
    <MockedProvider mocks={searchMocks}>
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <Organizations />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>
    </MockedProvider>,
  );

  await wait(500);

  await waitFor(() => {
    const list = screen.getByTestId('organizations-list');
    expect(list).toBeInTheDocument();
    const cards = screen.getAllByTestId('organization-card');
    const orgNames = cards.map((card) =>
      card.getAttribute('data-organization-name'),
    );
    expect(orgNames).toContain('anyOrganization1');
    expect(orgNames).toContain('anyOrganization2');
  });

  const searchInput = screen.getByTestId('searchInput');
  await userEvent.type(searchInput, '2');

  const searchBtn = screen.getByTestId('searchBtn');
  await userEvent.click(searchBtn);

  await wait(300);

  await userEvent.clear(searchInput);
  await userEvent.click(searchBtn);

  await wait(300);

  await userEvent.type(searchInput, '2');
  await userEvent.keyboard('{Enter}');

  await wait(300);

  await waitFor(() => {
    const cards = screen.getAllByTestId('organization-card');
    const orgNames = cards.map((card) =>
      card.getAttribute('data-organization-name'),
    );
    expect(orgNames).toContain('anyOrganization2');
  });
});

test('Mode is changed to joined organizations', async () => {
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

  await userEvent.click(screen.getByTestId('modeChangeBtn'));
  await wait();
  await userEvent.click(screen.getByTestId('modeBtn1'));
  await wait();

  expect(screen.queryAllByText('joinedOrganization')).not.toBe([]);
});

test('Mode is changed to created organizations', async () => {
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

  await userEvent.click(screen.getByTestId('modeChangeBtn'));
  await wait();
  await userEvent.click(screen.getByTestId('modeBtn2'));
  await wait();

  expect(screen.queryAllByText('createdOrganization')).not.toBe([]);
});

test('Manage button renders correctly', async () => {
  const TEST_USER_ID = 'test-user-id';
  setItem('userId', TEST_USER_ID);

  const organizationsMock = {
    request: {
      query: ORGANIZATION_FILTER_LIST,
      variables: { filter: '' },
    },
    result: {
      data: {
        organizations: [
          makeOrg({
            id: 'org-id-1',
            name: 'anyOrganization1',
            description: 'Test description 1',
            addressLine1: 'Test Address',
            adminsCount: 5,
            membersCount: 100,
            isMember: true,
          }),
          makeOrg({
            id: 'org-id-2',
            name: 'anyOrganization2',
            description: 'Test description 2',
            addressLine1: 'Test Address',
            adminsCount: 3,
            membersCount: 50,
            isMember: true,
          }),
        ],
      },
    },
  };

  const joinedOrgsMock = {
    request: {
      query: USER_JOINED_ORGANIZATIONS_NO_MEMBERS,
      variables: { id: TEST_USER_ID, first: 5, filter: '' },
    },
    result: {
      data: {
        user: {
          organizationsWhereMember: {
            edges: [],
            pageInfo: {
              hasNextPage: false,
            },
          },
        },
      },
    },
  };

  const createdOrgsMock = {
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
  };

  const testMocks = [
    COMMUNITY_TIMEOUT_MOCK,
    organizationsMock,
    joinedOrgsMock,
    createdOrgsMock,
  ];
  const link = new StaticMockLink(testMocks, true);

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

  await waitFor(() => {
    expect(screen.getByTestId('organizations-list')).toBeInTheDocument();
  });

  const orgCards = screen.getAllByTestId('organization-card-mock');
  expect(orgCards.length).toBe(2);
});

test('Testing Sidebar', async () => {
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

  // Note: Toggle button functionality has been moved to separate components
  // (e.g., SidebarToggle) and is no longer part of the drawer components
  // due to plugin system modifications
});

test('Testing sidebar when the screen size is less than or equal to 820px', async () => {
  resizeWindow(800);
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
    expect(screen.getByTestId('orgsBtn')).toBeInTheDocument();
    expect(screen.getByText('User Portal')).toBeInTheDocument();
  });

  await act(async () => {
    const settingsBtn = screen.getByTestId('settingsBtn');

    settingsBtn.click();
  });
});

const link = new StaticMockLink(MOCKS, true);

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

test('should update rowsPerPage when rows per page selector is changed', async () => {
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

  await wait(500);

  const rowsPerPageSelect = screen.getByTestId(
    'rows-per-page',
  ) as HTMLSelectElement;
  expect(rowsPerPageSelect.value).toBe('5');

  fireEvent.change(rowsPerPageSelect, { target: { value: '10' } });

  expect(rowsPerPageSelect.value).toBe('10');

  expect(screen.getByTestId('current-page').textContent).toBe('0');
});

test('setPage updates page state correctly when pagination controls are used', async () => {
  const mockOrganizations = Array(12)
    .fill(0)
    .map((_, index) =>
      makeOrg({
        id: `org-id-${index}`,
        name: `Organization ${index + 1}`,
        description: `Description for org ${index + 1}`,
        addressLine1: 'Test Address',
        isMember: false,
      }),
    );

  const paginationMocks = [
    COMMUNITY_TIMEOUT_MOCK,
    {
      request: {
        query: ORGANIZATION_FILTER_LIST,
        variables: { filter: '' },
      },
      result: {
        data: {
          organizations: mockOrganizations,
        },
      },
    },
    {
      request: {
        query: USER_JOINED_ORGANIZATIONS_NO_MEMBERS,
        variables: { id: getItem('userId'), first: 5, filter: '' },
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
        variables: { id: getItem('userId'), filter: '' },
      },
      result: {
        data: {
          user: {
            id: getItem('userId'),
            createdOrganizations: [],
          },
        },
      },
    },
  ];

  render(
    <MockedProvider mocks={paginationMocks}>
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

  const currentPage = screen.getByTestId('current-page');
  expect(currentPage.textContent).toBe('0');

  const nextButton = screen.getByTestId('next-page');

  await act(async () => {
    fireEvent.click(nextButton);
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  fireEvent(window, new window.Event('resize'));

  await waitFor(
    () => {
      const updatedPage = screen.getByTestId('current-page');
      expect(updatedPage.textContent).toBe('1');
    },
    { timeout: 3000 },
  );

  const prevButton = screen.getByTestId('prev-page');

  await act(async () => {
    fireEvent.click(prevButton);
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  fireEvent(window, new window.Event('resize'));

  await waitFor(
    () => {
      const updatedPage = screen.getByTestId('current-page');
      expect(updatedPage.textContent).toBe('0');
    },
    { timeout: 3000 },
  );
});

test('should correctly map joined organizations data ', async () => {
  const TEST_USER_ID = 'test-joined-orgs-user';
  setItem('userId', TEST_USER_ID);

  const joinedOrgsMock = {
    request: {
      query: USER_JOINED_ORGANIZATIONS_NO_MEMBERS,
      variables: { id: TEST_USER_ID, first: 5, filter: '' },
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
                  id: 'joined-org-1',
                  name: 'Joined Organization 1',
                  avatarURL: 'org1.jpg',
                  description: 'First joined organization',
                  addressLine1: 'Test Address',
                  members: { edges: [{ node: { id: TEST_USER_ID } }] },
                  membershipRequests: [],
                  userRegistrationRequired: false,
                  isMember: true,
                }),
              },
              {
                node: makeOrg({
                  id: 'joined-org-2',
                  name: 'Joined Organization 2',
                  avatarURL: 'org2.jpg',
                  description: 'Second joined organization',
                  addressLine1: 'Another Address',
                  members: { edges: [{ node: { id: TEST_USER_ID } }] },
                  membershipRequests: [],
                  userRegistrationRequired: true,
                  isMember: true,
                }),
              },
            ],
          },
        },
      },
    },
  };

  const allOrgsMock = {
    request: {
      query: ORGANIZATION_FILTER_LIST,
      variables: { filter: '' },
    },
    result: {
      data: {
        organizations: [],
      },
    },
  };

  const createdOrgsMock = {
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
  };

  const mocks = [
    COMMUNITY_TIMEOUT_MOCK,
    joinedOrgsMock,
    allOrgsMock,
    createdOrgsMock,
  ];
  const link = new StaticMockLink(mocks, true);

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

  await waitFor(
    () => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    },
    { timeout: 2000 },
  );

  const modeDropdown = screen.getByTestId('modeChangeBtn');
  await userEvent.click(modeDropdown);
  await waitFor(() => {
    expect(screen.getByTestId('modeBtn1')).toBeInTheDocument();
  });
  await userEvent.click(screen.getByTestId('modeBtn1'));

  await waitFor(
    () => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    },
    { timeout: 2000 },
  );

  await waitFor(() => {
    const organizationsList = screen.getByTestId('organizations-list');
    expect(organizationsList).toBeInTheDocument();

    const orgCards = screen.getAllByTestId('organization-card');
    expect(orgCards.length).toBe(2);

    orgCards.forEach((card) => {
      expect(card.getAttribute('data-membership-status')).toBe('accepted');
    });
  });
});

test('should set membershipRequestStatus to "created" for created organizations', async () => {
  const TEST_USER_ID = 'created-orgs-test-user';
  setItem('userId', TEST_USER_ID);

  const createdOrgsMock = {
    request: {
      query: USER_CREATED_ORGANIZATIONS,
      variables: { id: TEST_USER_ID, filter: '' },
    },
    result: {
      data: {
        user: {
          id: TEST_USER_ID,
          createdOrganizations: [
            makeCreatedOrg({
              id: 'created-org-1',
              name: 'Created Organization 1',
              description: 'Test Description',
              addressLine1: 'Test Address',
              isMember: true,
              membersCount: 0,
              adminsCount: 0,
              avatarURL: 'test.jpg',
            }),
          ],
        },
      },
    },
  };

  const mocks = [
    COMMUNITY_TIMEOUT_MOCK,
    createdOrgsMock,
    {
      request: {
        query: ORGANIZATION_FILTER_LIST,
        variables: { filter: '' },
      },
      result: { data: { organizations: [] } },
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
  ];

  render(
    <MockedProvider mocks={mocks}>
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

  const modeBtn = screen.getByTestId('modeChangeBtn');
  fireEvent.click(modeBtn);
  const createdModeBtn = screen.getByTestId('modeBtn2');
  fireEvent.click(createdModeBtn);

  await waitFor(() => {
    const orgCard = screen.getByTestId('organization-card');
    expect(orgCard).toBeInTheDocument();
    expect(orgCard.getAttribute('data-membership-status')).toBe('created');

    const statusElement = screen.getByTestId(
      'membership-status-Created Organization 1',
    );
    expect(statusElement.getAttribute('data-status')).toBe('created');
  });
});

test('correctly map joined organizations data when mode is 1', async () => {
  const TEST_USER_ID = 'test-user-123';
  setItem('userId', TEST_USER_ID);

  const mocks = [
    COMMUNITY_TIMEOUT_MOCK,
    {
      request: {
        query: USER_JOINED_ORGANIZATIONS_NO_MEMBERS,
        variables: { id: TEST_USER_ID, first: 5, filter: '' },
      },
      result: {
        data: {
          user: {
            organizationsWhereMember: {
              pageInfo: { hasNextPage: false },
              edges: [
                {
                  node: makeOrg({
                    id: 'org-1',
                    name: 'Test Organization',
                    avatarURL: 'test.jpg',
                    description: 'Test Description',
                    addressLine1: '123 Test St',
                    membershipRequests: [],
                    userRegistrationRequired: false,
                    admins: [],
                    isMember: true,
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

  render(
    <MockedProvider mocks={mocks}>
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

  const modeBtn = screen.getByTestId('modeChangeBtn');
  fireEvent.click(modeBtn);

  const joinedModeBtn = screen.getByTestId('modeBtn1');
  fireEvent.click(joinedModeBtn);

  await waitFor(() => {
    const cards = screen.getAllByTestId('organization-card');
    expect(cards.length).toBeGreaterThan(0);

    const card = cards.find(
      (card) =>
        card.getAttribute('data-organization-name') === 'Test Organization',
    );

    if (card) {
      expect(card.getAttribute('data-membership-status')).toBe('accepted');

      const statusElement = screen.getByTestId(
        'membership-status-Test Organization',
      );
      expect(statusElement.getAttribute('data-status')).toBe('accepted');
    }
  });
});

test('should search organizations when pressing Enter key', async () => {
  const TEST_USER_ID = 'test-user-123';
  setItem('userId', TEST_USER_ID);

  const mocks = [
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
              id: 'org-1',
              name: 'Test Organization',
              avatarURL: 'test.jpg',
              description: 'Test Description',
              addressLine1: '123 Test St',
              isMember: false,
            }),
          ],
        },
      },
    },
    {
      request: {
        query: ORGANIZATION_FILTER_LIST,
        variables: { filter: 'Search Term' },
      },
      result: {
        data: {
          organizations: [
            makeOrg({
              id: 'org-2',
              name: 'Search Term Organization',
              avatarURL: 'search.jpg',
              description: 'Search Term Description',
              addressLine1: '456 Search St',
              isMember: false,
            }),
          ],
        },
      },
    },
    {
      request: {
        query: ORGANIZATION_FILTER_LIST,
        variables: { filter: 'Search Term' },
      },
      result: {
        data: {
          organizations: [
            makeOrg({
              id: 'org-2',
              name: 'Search Term Organization',
              avatarURL: 'search.jpg',
              description: 'Search Term Description',
              addressLine1: '456 Search St',
              isMember: false,
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
              pageInfo: { hasNextPage: false },
              edges: [],
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

  render(
    <MockedProvider mocks={mocks}>
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
    expect(orgCards.length).toBe(1);
  });
});

test('should search organizations when clicking search button', async () => {
  const TEST_USER_ID = 'test-user-123';
  setItem('userId', TEST_USER_ID);

  const mocks = [
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
              id: 'org-1',
              name: 'Test Organization',
              avatarURL: 'test.jpg',
              description: 'Test Description',
              addressLine1: '123 Test St',
              isMember: false,
            }),
          ],
        },
      },
    },
    {
      request: {
        query: ORGANIZATION_FILTER_LIST,
        variables: { filter: 'Button Search' },
      },
      result: {
        data: {
          organizations: [
            makeOrg({
              id: 'org-3',
              name: 'Button Search Organization',
              avatarURL: 'button.jpg',
              description: 'Button Search Description',
              addressLine1: '789 Button St',
              isMember: false,
            }),
          ],
        },
      },
    },
    {
      request: {
        query: ORGANIZATION_FILTER_LIST,
        variables: { filter: 'Button Search' },
      },
      result: {
        data: {
          organizations: [
            makeOrg({
              id: 'org-3',
              name: 'Button Search Organization',
              avatarURL: 'button.jpg',
              description: 'Button Search Description',
              addressLine1: '789 Button St',
              isMember: false,
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
              pageInfo: { hasNextPage: false },
              edges: [],
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

  render(
    <MockedProvider mocks={mocks}>
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
  fireEvent.change(searchInput, { target: { value: 'Button Search' } });

  const searchButton = screen.getByTestId('searchBtn');
  fireEvent.click(searchButton);

  await waitFor(() => {
    const orgCards = screen.getAllByTestId('organization-card');
    expect(orgCards.length).toBe(1);
  });
});

test('doSearch function should call appropriate refetch based on mode', async () => {
  const TEST_USER_ID = 'test-search-user';
  setItem('userId', TEST_USER_ID);
  const searchValue = 'test search';

  const mocks = [
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
        query: ORGANIZATION_FILTER_LIST,
        variables: { filter: searchValue },
      },
      result: {
        data: {
          organizations: [],
        },
      },
    },
    {
      request: {
        query: ORGANIZATION_FILTER_LIST,
        variables: { filter: searchValue },
      },
      result: {
        data: {
          organizations: [],
        },
      },
    },
    {
      request: {
        query: ORGANIZATION_FILTER_LIST,
        variables: { filter: searchValue },
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
        variables: { id: TEST_USER_ID, first: 5, filter: searchValue },
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
        query: USER_JOINED_ORGANIZATIONS_NO_MEMBERS,
        variables: { id: TEST_USER_ID, first: 5, filter: searchValue },
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
        variables: { id: TEST_USER_ID, filter: searchValue },
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
    {
      request: {
        query: USER_CREATED_ORGANIZATIONS,
        variables: { id: TEST_USER_ID, filter: searchValue },
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

  render(
    <MockedProvider mocks={mocks}>
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

  await act(async () => {
    fireEvent.change(searchInput, { target: { value: searchValue } });
    fireEvent.keyUp(searchInput, { key: 'Enter' });
  });
  await wait(300);

  const modeChangeBtn = screen.getByTestId('modeChangeBtn');

  await act(async () => {
    userEvent.click(modeChangeBtn);
    await wait(100);
  });

  const modeBtn1 = screen.getByTestId('modeBtn1');
  expect(modeBtn1).toBeInTheDocument();

  await act(async () => {
    userEvent.click(modeBtn1);
    await wait(100);
  });

  await act(async () => {
    fireEvent.change(searchInput, { target: { value: searchValue } });
    fireEvent.keyUp(searchInput, { key: 'Enter' });
  });
  await wait(300);

  await act(async () => {
    userEvent.click(modeChangeBtn);
    await wait(100);
  });

  const modeBtn2 = screen.getByTestId('modeBtn2');
  expect(modeBtn2).toBeInTheDocument();

  await act(async () => {
    userEvent.click(modeBtn2);
    await wait(100);
  });

  await act(async () => {
    fireEvent.change(searchInput, { target: { value: searchValue } });
    fireEvent.keyUp(searchInput, { key: 'Enter' });
  });
  await wait(300);

  expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
});

test('should display loading spinner when data is loading', async () => {
  const loadingMock = {
    request: {
      query: ORGANIZATION_FILTER_LIST,
      variables: { filter: '' },
    },
    delay: 1000, // Simulate slow loading
    result: {
      data: {
        organizations: [],
      },
    },
  };

  render(
    <MockedProvider mocks={[COMMUNITY_TIMEOUT_MOCK, loadingMock]}>
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <Organizations />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>
    </MockedProvider>,
  );

  // Check that loading spinner is displayed initially
  expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
});

test('should display "no organizations" message when organizations list is empty', async () => {
  const emptyMock = {
    request: {
      query: ORGANIZATION_FILTER_LIST,
      variables: { filter: '' },
    },
    result: {
      data: {
        organizations: [],
      },
    },
  };

  const joinedOrgsMock = {
    request: {
      query: USER_JOINED_ORGANIZATIONS_NO_MEMBERS,
      variables: { id: getItem('userId'), first: 5, filter: '' },
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
  };

  const createdOrgsMock = {
    request: {
      query: USER_CREATED_ORGANIZATIONS,
      variables: { id: getItem('userId'), filter: '' },
    },
    result: {
      data: {
        user: {
          id: getItem('userId'),
          createdOrganizations: [],
        },
      },
    },
  };

  render(
    <MockedProvider
      mocks={[
        COMMUNITY_TIMEOUT_MOCK,
        emptyMock,
        joinedOrgsMock,
        createdOrgsMock,
      ]}
    >
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

  // Check that a "no organizations found" message is displayed
  expect(screen.getByText('Nothing to show here.')).toBeInTheDocument();
});
test('should set membershipRequestStatus to empty string when isMember is false', async () => {
  const TEST_USER_ID = 'test-non-member-user';
  setItem('userId', TEST_USER_ID);

  const organizationsMock = {
    request: {
      query: ORGANIZATION_FILTER_LIST,
      variables: { filter: '' },
    },
    result: {
      data: {
        organizations: [
          makeOrg({
            id: 'non-member-org-1',
            name: 'Non Member Organization',
            avatarURL: 'test.jpg',
            description: 'Test Description',
            addressLine1: '123 Test St',
            adminsCount: 5,
            membersCount: 100,
            isMember: false, // Explicitly set to false
          }),
          makeOrg({
            id: 'member-org-1',
            name: 'Member Organization',
            avatarURL: 'test.jpg',
            description: 'Test Description',
            addressLine1: '456 Test St',
            adminsCount: 3,
            membersCount: 50,
            isMember: true, // Set to true for comparison
          }),
        ],
      },
    },
  };

  const joinedOrgsMock = {
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
  };

  const createdOrgsMock = {
    request: {
      query: USER_CREATED_ORGANIZATIONS,
      variables: { id: TEST_USER_ID, filter: '' },
    },
    result: {
      data: {
        user: {
          createdOrganizations: [],
        },
      },
    },
  };

  const mocks = [
    COMMUNITY_TIMEOUT_MOCK,
    organizationsMock,
    joinedOrgsMock,
    createdOrgsMock,
  ];
  const link = new StaticMockLink(mocks, true);

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

  await waitFor(() => {
    expect(screen.getByTestId('organizations-list')).toBeInTheDocument();
  });

  // Check that both organizations are rendered
  const orgCards = screen.getAllByTestId('organization-card');
  expect(orgCards.length).toBe(2);

  // Get all organization cards and check their membership status attributes
  const cards = screen.getAllByTestId('organization-card');

  // Find the card with empty membership status (non-member)
  const nonMemberCard = cards.find(
    (card) => card.getAttribute('data-membership-status') === '',
  );
  expect(nonMemberCard).toBeTruthy();
  expect(nonMemberCard?.getAttribute('data-membership-status')).toBe('');

  // Find the card with 'accepted' membership status (member)
  const memberCard = cards.find(
    (card) => card.getAttribute('data-membership-status') === 'accepted',
  );
  expect(memberCard).toBeTruthy();
  expect(memberCard?.getAttribute('data-membership-status')).toBe('accepted');

  // Verify that we have one of each type
  const emptyStatusCards = cards.filter(
    (card) => card.getAttribute('data-membership-status') === '',
  );
  const acceptedStatusCards = cards.filter(
    (card) => card.getAttribute('data-membership-status') === 'accepted',
  );

  expect(emptyStatusCards.length).toBe(1);
  expect(acceptedStatusCards.length).toBe(1);
});

test('should handle rowsPerPage <= 0 to show all organizations', async () => {
  const TEST_USER_ID = 'test-all-rows-user';

  setItem('userId', TEST_USER_ID);

  const mockOrganizations = Array(15)
    .fill(0)
    .map((_, index) =>
      makeOrg({
        id: `org-id-${index}`,
        name: `Organization ${index + 1}`,
        description: `Description ${index + 1}`,
        addressLine1: 'Test Address',
        adminsCount: 5,
        membersCount: 100,
        isMember: true,
      }),
    );

  const mocks = [
    COMMUNITY_TIMEOUT_MOCK,
    {
      request: { query: ORGANIZATION_FILTER_LIST, variables: { filter: '' } },
      result: { data: { organizations: mockOrganizations } },
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

  render(
    <MockedProvider mocks={mocks}>
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

  // Change rows per page to show all (simulate selecting a large value)
  const rowsPerPageSelect = screen.getByTestId(
    'rows-per-page',
  ) as HTMLSelectElement;

  // Simulate setting rowsPerPage to 0 or negative to trigger the else branch
  fireEvent.change(rowsPerPageSelect, { target: { value: '0' } });

  await waitFor(() => {
    // All organizations should be displayed when rowsPerPage <= 0
    const orgCards = screen.getAllByTestId('organization-card');
    expect(orgCards.length).toBe(15);
  });
});

it('should handle GraphQL error in ORGANIZATION_FILTER_LIST query', async () => {
  const consoleErrorSpy = vi
    .spyOn(console, 'error')
    .mockImplementation(() => {});

  const ERROR_MOCKS = [
    COMMUNITY_TIMEOUT_MOCK,
    {
      request: {
        query: ORGANIZATION_FILTER_LIST,
        variables: {
          filter: '',
        },
      },
      error: new Error('GraphQL Network Error'),
    },
  ];

  setItem('userId', TEST_USER_ID);

  render(
    <MockedProvider mocks={ERROR_MOCKS}>
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
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'All orgs error:',
      expect.any(Error),
    );
  });

  consoleErrorSpy.mockRestore();
});
