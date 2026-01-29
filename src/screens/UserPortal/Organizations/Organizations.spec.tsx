/* global HTMLSelectElement */
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
  ORGANIZATION_FILTER_LIST,
  USER_JOINED_ORGANIZATIONS_NO_MEMBERS,
} from 'GraphQl/Queries/Queries';
import { USER_CREATED_ORGANIZATIONS } from 'GraphQl/Queries/OrganizationQueries';
import Organizations from './Organizations';
import { StaticMockLink } from 'utils/StaticMockLink';

const { setItem, getItem } = useLocalStorage();

const TEST_USER_ID = '01958985-600e-7cde-94a2-b3fc1ce66cf3';
const MOCKS = [
  {
    request: {
      query: USER_CREATED_ORGANIZATIONS,
      variables: {
        id: getItem('userId'),
      },
    },
    result: {
      data: {
        users: [
          {
            appUserProfile: {
              createdOrganizations: [
                {
                  __typename: 'Organization',
                  _id: '6401ff65ce8e8406b8f07af2',
                  image: '',
                  name: 'anyOrganization1',
                  description: 'desc',
                  address: {
                    city: 'abc',
                    countryCode: '123',
                    postalCode: '456',
                    state: 'def',
                    dependentLocality: 'ghi',
                    line1: 'asdfg',
                    line2: 'dfghj',
                    sortingCode: '4567',
                  },
                  createdAt: '1234567890',
                  userRegistrationRequired: true,
                  creator: {
                    __typename: 'User',
                    name: 'John Doe',
                  },
                },
              ],
            },
          },
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
          {
            __typename: 'Organization',
            id: '6401ff65ce8e8406b8f07af2',
            image: '',
            name: 'anyOrganization1',
            description: 'desc',
            address: {
              city: 'abc',
              countryCode: '123',
              postalCode: '456',
              state: 'def',
              dependentLocality: 'ghi',
              line1: 'asdfg',
              line2: 'dfghj',
              sortingCode: '4567',
            },
            createdAt: '1234567890',
            userRegistrationRequired: true,
            creator: { __typename: 'User', name: 'John Doe' },
          },
          {
            __typename: 'Organization',
            _id: '6401ff65ce8e8406b8f07af3',
            image: '',
            name: 'anyOrganization2',
            createdAt: '1234567890',
            address: {
              city: 'abc',
              countryCode: '123',
              postalCode: '456',
              state: 'def',
              dependentLocality: 'ghi',
              line1: 'asdfg',
              line2: 'dfghj',
              sortingCode: '4567',
            },
            description: 'desc',
            userRegistrationRequired: true,
            creator: { __typename: 'User', name: 'John Doe' },
          },
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
                node: {
                  id: '6401ff65ce8e8406b8f07af2',
                  name: 'Test Edge Org',
                  addressLine1: 'Test Line 1',
                  description: 'Test Description',
                  avatarURL: '',
                },
              },
              {
                node: {
                  id: '6401ff65ce8e8406b8f07af3',
                  name: 'anyOrganization1',
                  addressLine1: 'asdfg',
                  description: 'desc',
                  avatarURL: '',
                },
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
          {
            __typename: 'Organization',
            id: '6401ff65ce8e8406b8f07af3',
            image: '',
            name: 'anyOrganization2',
            description: 'desc',
            address: {
              city: 'abc',
              countryCode: '123',
              postalCode: '456',
              state: 'def',
              dependentLocality: 'ghi',
              line1: 'asdfg',
              line2: 'dfghj',
              sortingCode: '4567',
            },
            userRegistrationRequired: true,
            createdAt: '1234567890',
            creator: { __typename: 'User', name: 'John Doe' },
          },
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
                node: {
                  id: '6401ff65ce8e8406b8f07af2',
                  name: 'anyOrganization1',
                  addressLine1: 'asdfg',
                  description: 'desc',
                  avatarURL: '',
                },
              },
              {
                node: {
                  id: '6401ff65ce8e8406b8f07af3',
                  name: 'anyOrganization2',
                  addressLine1: 'asdfg',
                  description: 'desc',
                  avatarURL: '',
                },
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
                node: {
                  id: '6401ff65ce8e8406b8f07af3',
                  name: 'anyOrganization2',
                  addressLine1: 'asdfg',
                  description: 'desc',
                  avatarURL: '',
                },
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
                node: {
                  id: '6401ff65ce8e8406b8f07af2',
                  name: 'anyOrganization1',
                  addressLine1: 'asdfg',
                  description: 'desc',
                  avatarURL: '',
                },
              },
              {
                node: {
                  id: '6401ff65ce8e8406b8f07af3',
                  name: 'anyOrganization2',
                  addressLine1: 'asdfg',
                  description: 'desc',
                  avatarURL: '',
                },
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
                node: {
                  id: '6401ff65ce8e8406b8f07af2',
                  name: 'Test Edge Org',
                  addressLine1: 'Test Line 1',
                  description: 'Test Description',
                  avatarURL: '',
                },
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
  window.dispatchEvent(new window.Event('resize'));
};

const TEST_USER_NAME = 'Noble Mittal';
let user: ReturnType<typeof userEvent.setup>;
beforeEach(() => {
  user = userEvent.setup();
  setItem('name', TEST_USER_NAME);
  setItem('userId', TEST_USER_ID);
});

test('Screen should be rendered properly', async () => {
  render(
    <MockedProvider addTypename={false} link={link} mocks={MOCKS}>
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
  render(
    <MockedProvider addTypename={false} link={link}>
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
    expect(screen.getByTestId('organizations-list')).toBeInTheDocument();
  });

  await waitFor(() => {
    expect(screen.getByTestId('org-name-anyOrganization1')).toBeInTheDocument();
    expect(screen.getByTestId('org-name-anyOrganization2')).toBeInTheDocument();
  });

  const searchInput = screen.getByTestId('searchInput');
  await user.type(searchInput, '2');

  const searchBtn = screen.getByTestId('searchBtn');
  await user.click(searchBtn);

  await wait(300);

  await user.clear(searchInput);
  await user.click(searchBtn);

  await wait(300);

  await user.type(searchInput, '2');
  await user.keyboard('{Enter}');

  await wait(300);

  await waitFor(() => {
    const org2Element = screen.getByTestId('org-name-anyOrganization2');
    expect(org2Element).toBeInTheDocument();
  });
});

test('Mode is changed to joined organizations', async () => {
  render(
    <MockedProvider addTypename={false} link={link}>
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

  await user.click(screen.getByTestId('modeChangeBtn'));
  await wait();
  await user.click(screen.getByTestId('modeBtn1'));
  await wait();

  expect(screen.queryAllByText('joinedOrganization')).not.toBe([]);
});

test('Mode is changed to created organizations', async () => {
  render(
    <MockedProvider addTypename={false} link={link}>
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

  await user.click(screen.getByTestId('modeChangeBtn'));
  await wait();
  await user.click(screen.getByTestId('modeBtn2'));
  await wait();

  expect(screen.queryAllByText('createdOrganization')).not.toBe([]);
});

test('Join Now button renders correctly', async () => {
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
          {
            id: 'org-id-1',
            name: 'anyOrganization1',
            avatarURL: '',
            description: 'Test description 1',
            addressLine1: 'Test Address',
            adminsCount: 5,
            membersCount: 100,
          },
          {
            id: 'org-id-2',
            name: 'anyOrganization2',
            avatarURL: '',
            description: 'Test description 2',
            addressLine1: 'Test Address',
            adminsCount: 3,
            membersCount: 50,
          },
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
          createdOrganizations: [],
        },
      },
    },
  };

  const testMocks = [organizationsMock, joinedOrgsMock, createdOrgsMock];
  const link = new StaticMockLink(testMocks, true);

  render(
    <MockedProvider addTypename={false} link={link}>
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

  const orgCards = screen.getAllByTestId('organization-card');
  expect(orgCards.length).toBe(2);

  await waitFor(() => {
    const joinButtons = screen.getAllByTestId('joinBtn');
    expect(joinButtons.length).toBe(2);
  });
});

test('Testing Sidebar', async () => {
  render(
    <MockedProvider addTypename={false} link={link}>
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
    <MockedProvider addTypename={false} link={link}>
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

vi.mock('components/Pagination/PaginationList/PaginationList', () => ({
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
        data-testid="prev-page"
        onClick={(e) => onPageChange(e, page - 1)}
        disabled={page === 0}
      >
        Previous
      </button>
      <button
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

test('should update rowsPerPage when rows per page selector is changed', async () => {
  render(
    <MockedProvider addTypename={false} link={link}>
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

  await user.selectOptions(rowsPerPageSelect, '10');

  expect(rowsPerPageSelect.value).toBe('10');

  expect(screen.getByTestId('current-page').textContent).toBe('0');
});

test('setPage updates page state correctly when pagination controls are used', async () => {
  const mockOrganizations = Array(12)
    .fill(0)
    .map((_, index) => ({
      id: `org-id-${index}`,
      name: `Organization ${index + 1}`,
      image: '',
      description: `Description for org ${index + 1}`,
      address: {
        city: 'Test City',
        countryCode: 'TC',
        line1: 'Test Address',
        postalCode: '12345',
        state: 'TS',
      },
      userRegistrationRequired: true,
    }));

  const paginationMocks = [
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
            createdOrganizations: [],
          },
        },
      },
    },
  ];

  render(
    <MockedProvider addTypename={false} mocks={paginationMocks}>
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
    await user.click(nextButton);
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  window.dispatchEvent(new window.Event('resize'));

  await waitFor(
    () => {
      const updatedPage = screen.getByTestId('current-page');
      expect(updatedPage.textContent).toBe('1');
    },
    { timeout: 3000 },
  );

  const prevButton = screen.getByTestId('prev-page');

  await act(async () => {
    await user.click(prevButton);
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  window.dispatchEvent(new window.Event('resize'));

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
                node: {
                  id: 'joined-org-1',
                  name: 'Joined Organization 1',
                  avatarURL: 'org1.jpg',
                  description: 'First joined organization',
                  addressLine1: 'Test Address',
                  members: [{ _id: TEST_USER_ID }],
                  membershipRequests: [],
                  userRegistrationRequired: false,
                },
              },
              {
                node: {
                  id: 'joined-org-2',
                  name: 'Joined Organization 2',
                  avatarURL: 'org2.jpg',
                  description: 'Second joined organization',
                  addressLine1: 'Another Address',
                  members: [{ _id: TEST_USER_ID }],
                  membershipRequests: [],
                  userRegistrationRequired: true,
                },
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
          createdOrganizations: [],
        },
      },
    },
  };

  const mocks = [joinedOrgsMock, allOrgsMock, createdOrgsMock];
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
          createdOrganizations: [
            {
              id: 'created-org-1',
              name: 'Created Organization 1',
              image: 'test.jpg',
              description: 'Test Description',
              address: {
                city: 'Test City',
                countryCode: 'TC',
                line1: 'Test Address',
                postalCode: '12345',
                state: 'TS',
              },
              userRegistrationRequired: false,
              membershipRequests: [],
            },
          ],
        },
      },
    },
  };

  const mocks = [
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
    <MockedProvider mocks={mocks} addTypename={false}>
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
  await user.click(modeBtn);
  const createdModeBtn = screen.getByTestId('modeBtn2');
  await user.click(createdModeBtn);

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
                  node: {
                    id: 'org-1',
                    name: 'Test Organization',
                    avatarURL: 'test.jpg',
                    description: 'Test Description',
                    addressLine1: '123 Test St',
                    membershipRequests: [],
                    userRegistrationRequired: false,
                    address: {
                      city: 'Test City',
                      countryCode: 'TC',
                      line1: '123 Test St',
                      postalCode: '12345',
                      state: 'TS',
                    },
                    admins: [],
                  },
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
            createdOrganizations: [],
          },
        },
      },
    },
  ];

  render(
    <MockedProvider mocks={mocks} addTypename={false}>
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
  await user.click(modeBtn);

  const joinedModeBtn = screen.getByTestId('modeBtn1');
  await user.click(joinedModeBtn);

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
    {
      request: {
        query: ORGANIZATION_FILTER_LIST,
        variables: { filter: '' },
      },
      result: {
        data: {
          organizations: [
            {
              id: 'org-1',
              name: 'Test Organization',
              avatarURL: 'test.jpg',
              description: 'Test Description',
              addressLine1: '123 Test St',
            },
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
            {
              id: 'org-2',
              name: 'Search Term Organization',
              avatarURL: 'search.jpg',
              description: 'Search Term Description',
              addressLine1: '456 Search St',
            },
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
            createdOrganizations: [],
          },
        },
      },
    },
  ];

  render(
    <MockedProvider mocks={mocks} addTypename={false}>
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
  await user.type(searchInput, 'Search Term');
  await user.keyboard('{Enter}');

  await waitFor(() => {
    const orgCards = screen.getAllByTestId('organization-card');
    expect(orgCards.length).toBe(1);
  });
});

test('should search organizations when clicking search button', async () => {
  const TEST_USER_ID = 'test-user-123';
  setItem('userId', TEST_USER_ID);

  const mocks = [
    {
      request: {
        query: ORGANIZATION_FILTER_LIST,
        variables: { filter: '' },
      },
      result: {
        data: {
          organizations: [
            {
              id: 'org-1',
              name: 'Test Organization',
              avatarURL: 'test.jpg',
              description: 'Test Description',
              addressLine1: '123 Test St',
            },
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
            {
              id: 'org-3',
              name: 'Button Search Organization',
              avatarURL: 'button.jpg',
              description: 'Button Search Description',
              addressLine1: '789 Button St',
            },
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
            createdOrganizations: [],
          },
        },
      },
    },
  ];

  render(
    <MockedProvider mocks={mocks} addTypename={false}>
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
  await user.type(searchInput, 'Button Search');

  const searchButton = screen.getByTestId('searchBtn');
  await user.click(searchButton);

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
        query: USER_CREATED_ORGANIZATIONS,
        variables: { id: TEST_USER_ID, filter: searchValue },
      },
      result: {
        data: {
          user: {
            createdOrganizations: [],
          },
        },
      },
    },
  ];

  render(
    <MockedProvider mocks={mocks} addTypename={false}>
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

  await user.clear(searchInput);
  await user.type(searchInput, searchValue);
  await user.keyboard('{Enter}');

  await wait(300);

  const modeChangeBtn = screen.getByTestId('modeChangeBtn');

  await user.click(modeChangeBtn);
  await wait(100);

  const modeBtn1 = screen.getByTestId('modeBtn1');
  expect(modeBtn1).toBeInTheDocument();

  await user.click(modeBtn1);
  await wait(100);

  await user.clear(searchInput);
  await user.type(searchInput, searchValue);
  await user.keyboard('{Enter}');

  await wait(300);

  await user.click(modeChangeBtn);
  await wait(100);

  const modeBtn2 = screen.getByTestId('modeBtn2');
  expect(modeBtn2).toBeInTheDocument();

  await user.click(modeBtn2);
  await wait(100);

  await user.clear(searchInput);
  await user.type(searchInput, searchValue);
  await user.keyboard('{Enter}');

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
    <MockedProvider mocks={[loadingMock]} addTypename={false}>
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
          createdOrganizations: [],
        },
      },
    },
  };

  render(
    <MockedProvider
      mocks={[emptyMock, joinedOrgsMock, createdOrgsMock]}
      addTypename={false}
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
          {
            id: 'non-member-org-1',
            name: 'Non Member Organization',
            avatarURL: 'test.jpg',
            description: 'Test Description',
            addressLine1: '123 Test St',
            adminsCount: 5,
            membersCount: 100,
            isMember: false, // Explicitly set to false
          },
          {
            id: 'member-org-1',
            name: 'Member Organization',
            avatarURL: 'test.jpg',
            description: 'Test Description',
            addressLine1: '456 Test St',
            adminsCount: 3,
            membersCount: 50,
            isMember: true, // Set to true for comparison
          },
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

  const mocks = [organizationsMock, joinedOrgsMock, createdOrgsMock];
  const link = new StaticMockLink(mocks, true);

  render(
    <MockedProvider addTypename={false} link={link}>
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
    .map((_, index) => ({
      id: `org-id-${index}`,
      name: `Organization ${index + 1}`,
      avatarURL: '',
      description: `Description ${index + 1}`,
      addressLine1: 'Test Address',
      adminsCount: 5,
      membersCount: 100,
      isMember: true,
    }));

  const mocks = [
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
  const option = document.createElement('option');
  option.value = '0';
  rowsPerPageSelect.appendChild(option);
  await user.selectOptions(rowsPerPageSelect, '0');

  await waitFor(() => {
    // All organizations should be displayed when rowsPerPage <= 0
    const orgCards = screen.getAllByTestId('organization-card');
    expect(orgCards.length).toBe(15);
  });
});
