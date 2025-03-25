// Organizations.test.tsx
import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { act } from 'react-dom/test-utils';
import { describe, it, expect, vi } from 'vitest';
import i18nForTest from 'utils/i18nForTest';
import { store } from 'state/store';
import useLocalStorage from 'utils/useLocalstorage';
import Organizations from './Organizations';
import {
  ALL_ORGANIZATIONS,
  USER_JOINED_ORGANIZATIONS_PG,
  USER_CREATED_ORGANIZATIONS,
} from 'GraphQl/Queries/OrganizationQueries';
import { GET_COMMUNITY_DATA } from 'GraphQl/Queries/Queries';

const { setItem, getItem } = useLocalStorage();

const TEST_USER_ID = '01958985-600e-7cde-94a2-b3fc1ce66cf3';
const TEST_USER_NAME = 'Noble Mittal';

async function wait(ms = 100) {
  await act(() => new Promise((resolve) => setTimeout(resolve, ms)));
}

const mocks = [
  {
    request: { query: ALL_ORGANIZATIONS, variables: { filter: '' } },
    result: {
      data: {
        organizations: Array(10)
          .fill(null)
          .map((_, i) => ({
            id: `allOrgId${i}`,
            name: `All Org ${i}`,
            description: `Description ${i}`,
            avatarURL: null,
            city: 'City',
            countryCode: 'US',
            addressLine1: '123 Street',
            postalCode: '12345',
            state: 'State',
            membersCount: i + 1,
            adminsCount: 1,
            members: { edges: [{ node: { id: 'otherUserId' } }] },
          })),
      },
    },
  },
  {
    request: {
      query: USER_JOINED_ORGANIZATIONS_PG,
      variables: { id: TEST_USER_ID, first: 5, filter: '' },
    },
    result: {
      data: {
        user: {
          organizationsWhereMember: {
            edges: [
              {
                node: {
                  id: 'joinedOrgId1',
                  name: 'Joined Org 1',
                  description: 'Joined Desc',
                  avatarURL: null,
                  city: 'City',
                  countryCode: 'US',
                  addressLine1: '456 Avenue',
                  postalCode: '67890',
                  state: 'State',
                  membersCount: 2,
                  adminsCount: 1,
                  members: { edges: [{ node: { id: TEST_USER_ID } }] },
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
      query: USER_CREATED_ORGANIZATIONS,
      variables: { id: TEST_USER_ID, filter: '' },
    },
    result: {
      data: {
        user: {
          createdOrganizations: [
            {
              id: 'createdOrgId1',
              name: 'Created Org 1',
              description: 'Created Desc',
              avatarURL: null,
              city: 'City',
              countryCode: 'US',
              addressLine1: '789 Road',
              postalCode: '54321',
              state: 'State',
              membersCount: 3,
              adminsCount: 1,
              members: { edges: [{ node: { id: TEST_USER_ID } }] },
            },
          ],
        },
      },
    },
  },
  {
    request: { query: ALL_ORGANIZATIONS, variables: { filter: '2' } },
    result: {
      data: {
        organizations: [
          {
            id: 'allOrgId2',
            name: 'All Org 2',
            description: 'Description 2',
            avatarURL: null,
            city: 'City',
            countryCode: 'US',
            addressLine1: '123 Street',
            postalCode: '12345',
            state: 'State',
            membersCount: 3,
            adminsCount: 1,
            members: { edges: [{ node: { id: 'otherUserId' } }] },
          },
        ],
      },
    },
  },
  {
    request: {
      query: USER_JOINED_ORGANIZATIONS_PG,
      variables: { id: TEST_USER_ID, first: 5, filter: '2' },
    },
    result: {
      data: {
        user: {
          organizationsWhereMember: {
            edges: [
              {
                node: {
                  id: 'joinedOrgId2',
                  name: 'Joined Org 2',
                  description: 'Joined Desc 2',
                  avatarURL: null,
                  city: 'City',
                  countryCode: 'US',
                  addressLine1: '456 Avenue',
                  postalCode: '67890',
                  state: 'State',
                  membersCount: 2,
                  adminsCount: 1,
                  members: { edges: [{ node: { id: TEST_USER_ID } }] },
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
      query: USER_CREATED_ORGANIZATIONS,
      variables: { id: TEST_USER_ID, filter: '2' },
    },
    result: {
      data: {
        user: {
          createdOrganizations: [
            {
              id: 'createdOrgId2',
              name: 'Created Org 2',
              description: 'Created Desc 2',
              avatarURL: null,
              city: 'City',
              countryCode: 'US',
              addressLine1: '789 Road',
              postalCode: '54321',
              state: 'State',
              membersCount: 3,
              adminsCount: 1,
              members: { edges: [{ node: { id: TEST_USER_ID } }] },
            },
          ],
        },
      },
    },
  },
  {
    request: {
      query: ALL_ORGANIZATIONS,
      variables: { filter: 'Debounced Search' },
    },
    result: {
      data: {
        organizations: [
          {
            id: 'debounceOrgId1',
            name: 'Debounced Search Org',
            description: 'Debounced Desc',
            avatarURL: null,
            city: 'City',
            countryCode: 'US',
            addressLine1: '101 Debounce St',
            postalCode: '11111',
            state: 'State',
            membersCount: 1,
            adminsCount: 1,
            members: { edges: [{ node: { id: 'otherUserId' } }] },
          },
        ],
      },
    },
  },
  {
    request: {
      query: GET_COMMUNITY_DATA,
      variables: {},
    },
    result: {
      data: {
        community: {
          inactivityTimeoutDuration: 3600,
          __typename: 'Community',
        },
      },
    },
  },
];

describe('Organizations Component', () => {
  beforeEach(() => {
    setItem('name', TEST_USER_NAME);
    setItem('userId', TEST_USER_ID);
    vi.clearAllMocks();
  });
  it('displays a loading indicator while fetching', async () => {
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
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument(),
    );
  });

  it('shows all organizations by default', async () => {
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
      expect(screen.getByTestId('org-name-All Org 0')).toBeInTheDocument();
      expect(screen.getByTestId('org-name-All Org 1')).toBeInTheDocument();
      expect(screen.getAllByTestId('organization-card').length).toBe(5); // Default rowsPerPage = 5
    });
  });

  it('switches to joined organizations (mode=1)', async () => {
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
    await waitFor(() =>
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument(),
    );

    await userEvent.click(screen.getByTestId('modeChangeBtn'));
    await userEvent.click(screen.getByTestId('modeBtn1'));

    await waitFor(() => {
      expect(screen.getByTestId('org-name-Joined Org 1')).toBeInTheDocument();
      expect(
        screen.queryByTestId('org-name-All Org 0'),
      ).not.toBeInTheDocument();
    });
  });

  it('switches to created organizations (mode=2)', async () => {
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
    await waitFor(() =>
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument(),
    );

    await userEvent.click(screen.getByTestId('modeChangeBtn'));
    await userEvent.click(screen.getByTestId('modeBtn2'));

    await waitFor(() => {
      expect(screen.getByTestId('org-name-Created Org 1')).toBeInTheDocument();
      expect(
        screen.queryByTestId('org-name-All Org 0'),
      ).not.toBeInTheDocument();
    });
  });

  it('searches all organizations by filter text using Enter key', async () => {
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
    await waitFor(() =>
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument(),
    );

    const searchInput = screen.getByTestId('searchInput');
    await userEvent.type(searchInput, '2{enter}');

    await waitFor(() => {
      expect(screen.getByTestId('org-name-All Org 2')).toBeInTheDocument();
      expect(
        screen.queryByTestId('org-name-All Org 0'),
      ).not.toBeInTheDocument();
    });
  });

  it('searches joined organizations by filter text using search button', async () => {
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
    await waitFor(() =>
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument(),
    );

    await userEvent.click(screen.getByTestId('modeChangeBtn'));
    await userEvent.click(screen.getByTestId('modeBtn1'));

    const searchInput = screen.getByTestId('searchInput');
    await userEvent.type(searchInput, '2');
    await userEvent.click(screen.getByTestId('searchBtn'));

    await waitFor(() => {
      expect(screen.getByTestId('org-name-Joined Org 2')).toBeInTheDocument();
      expect(
        screen.queryByTestId('org-name-Joined Org 1'),
      ).not.toBeInTheDocument();
    });
  });

  it('searches created organizations by filter text using Enter key', async () => {
    const testMocks = [
      ...mocks,
      {
        request: {
          query: GET_COMMUNITY_DATA,
          variables: {},
        },
        result: {
          data: {
            community: {
              inactivityTimeoutDuration: 3600,
              __typename: 'Community',
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={testMocks}>
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
      () =>
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument(),
      { timeout: 2000 },
    );

    // Switch to created organizations mode
    await userEvent.click(screen.getByTestId('modeChangeBtn'));
    await userEvent.click(screen.getByTestId('modeBtn2'));
    await wait(500); // Ensure mode switch completes

    const searchInput = screen.getByTestId('searchInput');
    await userEvent.type(searchInput, '2{enter}'); // Type '2' and press Enter

    await waitFor(
      () => {
        expect(
          screen.getByTestId('org-name-Created Org 2'),
        ).toBeInTheDocument();
        expect(
          screen.queryByTestId('org-name-Created Org 1'),
        ).not.toBeInTheDocument();
      },
      { timeout: 5000 },
    );
  });

  it('debounces search input to prevent multiple rapid API calls', () => {
    setItem('userId', TEST_USER_ID);
    vi.useFakeTimers();

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

    const searchInput = screen.getByTestId('searchInput');

    userEvent.type(searchInput, 'Deb');
    vi.advanceTimersByTime(100);
    userEvent.type(searchInput, 'ounce');
    vi.advanceTimersByTime(100);
    userEvent.type(searchInput, 'd Search');

    vi.advanceTimersByTime(300);

    waitFor(() => {
      expect(screen.getByText(/Debounced Search Org/i)).toBeInTheDocument();
    });

    vi.useRealTimers();
  });

  it('paginates through the list of organizations', async () => {
    // Mock useLocalStorage
    vi.mock('utils/useLocalstorage', () => ({
      default: () => ({
        getItem: vi.fn(() => TEST_USER_ID),
        setItem: vi.fn(),
      }),
    }));

    render(
      <MockedProvider mocks={mocks} addTypename={true}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Organizations />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    // Wait for initial render
    await waitFor(
      () =>
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument(),
      { timeout: 2000 },
    );

    // Verify page 0 (All Org 0 - All Org 4)
    expect(screen.getByTestId('org-name-All Org 0')).toBeInTheDocument();
    expect(screen.getByTestId('org-name-All Org 4')).toBeInTheDocument();
    expect(screen.queryByTestId('org-name-All Org 5')).not.toBeInTheDocument();

    // Click next page
    const nextPageButton = screen.getByRole('button', { name: /next page/i });
    await userEvent.click(nextPageButton);

    // Wait for page update
    await waitFor(
      () =>
        expect(screen.getByTestId('org-name-All Org 5')).toBeInTheDocument(),
      { timeout: 2000 },
    );

    // Verify page 1 (All Org 5 - All Org 9)
    expect(screen.getByTestId('org-name-All Org 5')).toBeInTheDocument();
    expect(screen.queryByTestId('org-name-All Org 0')).not.toBeInTheDocument();
  });

  it('toggles the sidebar visibility', async () => {
    const testMocks = [...mocks];

    render(
      <MockedProvider mocks={testMocks}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Organizations />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    // Wait for initial render
    await waitFor(
      () =>
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument(),
      { timeout: 2000 },
    );

    // Initial state: hideDrawer is true (openMenu visible)
    expect(screen.getByTestId('openMenu')).toBeInTheDocument();
    expect(screen.queryByTestId('closeMenu')).not.toBeInTheDocument();

    // Click to toggle from true to false (openMenu -> closeMenu)
    await userEvent.click(screen.getByTestId('openMenu'));
    await wait(500);
    expect(screen.getByTestId('closeMenu')).toBeInTheDocument();
    expect(screen.queryByTestId('openMenu')).not.toBeInTheDocument();

    // Click to toggle back from false to true (closeMenu -> openMenu)
    await userEvent.click(screen.getByTestId('closeMenu'));
    await wait(500);
    expect(screen.getByTestId('openMenu')).toBeInTheDocument();
    expect(screen.queryByTestId('closeMenu')).not.toBeInTheDocument();
  });

  it('changes rows per page and resets pagination', async () => {
    vi.mock('utils/useLocalstorage', () => ({
      default: () => ({
        getItem: vi.fn(() => TEST_USER_ID),
        setItem: vi.fn(),
      }),
    }));

    render(
      <MockedProvider mocks={mocks} addTypename={true}>
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
      () =>
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument(),
      { timeout: 2000 },
    );

    // Verify initial state (5 rows per page)
    expect(screen.getAllByTestId('organization-card').length).toBe(5);
    expect(screen.getByTestId('org-name-All Org 0')).toBeInTheDocument();
    expect(screen.getByTestId('org-name-All Org 4')).toBeInTheDocument();
    expect(screen.queryByTestId('org-name-All Org 5')).not.toBeInTheDocument();

    // Change rows per page to 10
    const rowsPerPageSelect = screen.getByRole('combobox', {
      name: /rows per page/i,
    });
    await userEvent.selectOptions(rowsPerPageSelect, '10');

    await waitFor(
      () => expect(screen.getAllByTestId('organization-card').length).toBe(10),
      { timeout: 2000 },
    );
    expect(screen.getByTestId('org-name-All Org 5')).toBeInTheDocument();
    expect(screen.getByTestId('org-name-All Org 9')).toBeInTheDocument();
  });

  // Test empty state across all modes

  it('shows no organizations message when data is empty', async () => {
    const emptyMocks = [
      ...mocks.filter(
        (mock) =>
          mock.request.query !== ALL_ORGANIZATIONS &&
          mock.request.query !== USER_JOINED_ORGANIZATIONS_PG &&
          mock.request.query !== USER_CREATED_ORGANIZATIONS,
      ),
      {
        request: { query: ALL_ORGANIZATIONS, variables: { filter: '' } },
        result: { data: { organizations: [] } },
      },
      {
        request: {
          query: USER_JOINED_ORGANIZATIONS_PG,
          variables: { id: TEST_USER_ID, first: 5, filter: '' },
        },
        result: { data: { user: { organizationsWhereMember: { edges: [] } } } },
      },
      {
        request: {
          query: USER_CREATED_ORGANIZATIONS,
          variables: { id: TEST_USER_ID, filter: '' },
        },
        result: { data: { user: { createdOrganizations: [] } } },
      },
      {
        request: {
          query: GET_COMMUNITY_DATA,
          variables: {},
        },
        result: {
          data: {
            community: {
              inactivityTimeoutDuration: 3600,
              __typename: 'Community',
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={emptyMocks}>
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
      () =>
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument(),
      { timeout: 2000 },
    );
    expect(screen.getByTestId('no-organizations-message')).toBeInTheDocument();
    expect(screen.queryByTestId('organization-card')).not.toBeInTheDocument();

    await userEvent.click(screen.getByTestId('modeChangeBtn'));
    await userEvent.click(screen.getByTestId('modeBtn1'));
    await wait(1000); // Increase for mode switch
    expect(screen.getByTestId('no-organizations-message')).toBeInTheDocument();

    await userEvent.click(screen.getByTestId('modeChangeBtn'));
    await userEvent.click(screen.getByTestId('modeBtn2'));
    await wait(1000); // Increase for mode switch
    expect(screen.getByTestId('no-organizations-message')).toBeInTheDocument();
  });

  it('paginates through joined organizations', async () => {
    const testMocks = [
      ...mocks.filter(
        (mock) => mock.request.query !== USER_JOINED_ORGANIZATIONS_PG,
      ), // Remove original
      {
        request: {
          query: USER_JOINED_ORGANIZATIONS_PG,
          variables: { id: TEST_USER_ID, first: 5, filter: '' },
        },
        result: {
          data: {
            user: {
              organizationsWhereMember: {
                edges: Array(6)
                  .fill(null)
                  .map((_, i) => ({
                    node: {
                      id: `joinedOrgId${i}`,
                      name: `Joined Org ${i}`,
                      description: `Joined Desc ${i}`,
                      avatarURL: null,
                      city: 'City',
                      countryCode: 'US',
                      addressLine1: '456 Avenue',
                      postalCode: '67890',
                      state: 'State',
                      membersCount: 2,
                      adminsCount: 1,
                      members: { edges: [{ node: { id: TEST_USER_ID } }] },
                    },
                  })),
              },
            },
          },
        },
      },
      {
        request: {
          query: GET_COMMUNITY_DATA,
          variables: {},
        },
        result: {
          data: {
            community: {
              inactivityTimeoutDuration: 3600,
              __typename: 'Community',
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={testMocks}>
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
      () =>
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument(),
      { timeout: 2000 },
    );

    await userEvent.click(screen.getByTestId('modeChangeBtn'));
    await userEvent.click(screen.getByTestId('modeBtn1'));
    await wait(1000); // Increase for mode switch

    expect(screen.getByTestId('org-name-Joined Org 0')).toBeInTheDocument();
    expect(screen.getByTestId('org-name-Joined Org 4')).toBeInTheDocument();
    expect(
      screen.queryByTestId('org-name-Joined Org 5'),
    ).not.toBeInTheDocument();

    const nextPageButton = screen.getByRole('button', { name: /next page/i });
    await userEvent.click(nextPageButton);
    await wait(1000); // Increase for pagination update

    expect(screen.getByTestId('org-name-Joined Org 5')).toBeInTheDocument();
    expect(
      screen.queryByTestId('org-name-Joined Org 0'),
    ).not.toBeInTheDocument();
  });

  // Test pagination in created organizations mode
  it('paginates through created organizations', async () => {
    const testMocks = [
      ...mocks.filter(
        (mock) => mock.request.query !== USER_CREATED_ORGANIZATIONS,
      ), // Remove original
      {
        request: {
          query: USER_CREATED_ORGANIZATIONS,
          variables: { id: TEST_USER_ID, filter: '' },
        },
        result: {
          data: {
            user: {
              createdOrganizations: Array(6)
                .fill(null)
                .map((_, i) => ({
                  id: `createdOrgId${i}`,
                  name: `Created Org ${i}`,
                  description: `Created Desc ${i}`,
                  avatarURL: null,
                  city: 'City',
                  countryCode: 'US',
                  addressLine1: '789 Road',
                  postalCode: '54321',
                  state: 'State',
                  membersCount: 3,
                  adminsCount: 1,
                  members: { edges: [{ node: { id: TEST_USER_ID } }] },
                })),
            },
          },
        },
      },
      {
        request: {
          query: GET_COMMUNITY_DATA,
          variables: {},
        },
        result: {
          data: {
            community: {
              inactivityTimeoutDuration: 3600,
              __typename: 'Community',
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={testMocks}>
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
      () =>
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument(),
      { timeout: 2000 },
    );

    await userEvent.click(screen.getByTestId('modeChangeBtn'));
    await userEvent.click(screen.getByTestId('modeBtn2'));
    await wait(1000); // Increase for mode switch

    expect(screen.getByTestId('org-name-Created Org 0')).toBeInTheDocument();
    expect(screen.getByTestId('org-name-Created Org 4')).toBeInTheDocument();
    expect(
      screen.queryByTestId('org-name-Created Org 5'),
    ).not.toBeInTheDocument();

    const nextPageButton = screen.getByRole('button', { name: /next page/i });
    await userEvent.click(nextPageButton);
    await wait(1000); // Increase for pagination update

    expect(screen.getByTestId('org-name-Created Org 5')).toBeInTheDocument();
    expect(
      screen.queryByTestId('org-name-Created Org 0'),
    ).not.toBeInTheDocument();
  });

  it('handles query errors gracefully', async () => {
    const errorMocks = [
      ...mocks.filter((mock) => mock.request.query !== ALL_ORGANIZATIONS),
      {
        request: { query: ALL_ORGANIZATIONS, variables: { filter: '' } },
        error: new Error('Failed to fetch organizations'),
      },
      {
        request: { query: GET_COMMUNITY_DATA, variables: {} },
        result: {
          data: {
            community: {
              inactivityTimeoutDuration: 3600,
              __typename: 'Community',
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={errorMocks}>
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
      () =>
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument(),
      { timeout: 2000 },
    );
    expect(screen.getByTestId('no-organizations-message')).toBeInTheDocument();
  });

  // Test Resize Event Handling
  it('toggles drawer visibility on window resize', async () => {
    const testMocks = [...mocks];

    render(
      <MockedProvider mocks={testMocks}>
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
      () =>
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument(),
      { timeout: 2000 },
    );

    // Initial state: hideDrawer is true (openMenu visible) for >820px
    expect(screen.getByTestId('openMenu')).toBeInTheDocument();
    expect(screen.queryByTestId('closeMenu')).not.toBeInTheDocument();

    // Resize to <=820px to set false
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(800);
    fireEvent(window, new Event('resize'));
    await wait(500);
    expect(screen.getByTestId('closeMenu')).toBeInTheDocument();
    expect(screen.queryByTestId('openMenu')).not.toBeInTheDocument();

    // Resize to >820px to set true
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1000);
    fireEvent(window, new Event('resize'));
    await wait(500);
    expect(screen.getByTestId('openMenu')).toBeInTheDocument();
    expect(screen.queryByTestId('closeMenu')).not.toBeInTheDocument();

    vi.restoreAllMocks();
  });
  // Test Edge Case Pagination (Last Page)
  it('handles pagination to the last page correctly', async () => {
    const testMocks = [...mocks];

    render(
      <MockedProvider mocks={testMocks}>
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
      () =>
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument(),
      { timeout: 2000 },
    );

    // Initial page (0-4)
    expect(screen.getByTestId('org-name-All Org 0')).toBeInTheDocument();
    expect(screen.queryByTestId('org-name-All Org 5')).not.toBeInTheDocument();

    // Go to last page (5-9, total 10 items, 5 per page)
    const nextPageButton = screen.getByRole('button', { name: /next page/i });
    await userEvent.click(nextPageButton);
    await wait(1000);

    expect(screen.getByTestId('org-name-All Org 5')).toBeInTheDocument();
    expect(screen.getByTestId('org-name-All Org 9')).toBeInTheDocument();
    expect(screen.queryByTestId('org-name-All Org 0')).not.toBeInTheDocument();
  });

  // Test OrganizationCard Props Mapping
  it('correctly maps organization data to card props', async () => {
    const testMocks = [
      ...mocks.filter(
        (mock) =>
          mock.request.query !== ALL_ORGANIZATIONS &&
          mock.request.query !== USER_JOINED_ORGANIZATIONS_PG,
      ),
      {
        request: {
          query: ALL_ORGANIZATIONS,
          variables: { filter: '' }, // Match the current Organizations.tsx query
        },
        result: {
          data: {
            organizations: [
              {
                id: 'allOrgId0',
                name: 'All Org 0',
                description: 'Description 0',
                avatarURL: null,
                city: 'City',
                countryCode: 'US',
                addressLine1: '123 Street',
                postalCode: '12345',
                state: 'State',
                membersCount: 1,
                adminsCount: 1,
                members: { edges: [{ node: { id: 'otherUserId' } }] },
                isMember: false,
              },
            ],
          },
        },
      },
      {
        request: {
          query: USER_JOINED_ORGANIZATIONS_PG,
          variables: { id: TEST_USER_ID, first: 5, filter: '' }, // Match current query
        },
        result: {
          data: {
            user: {
              organizationsWhereMember: {
                edges: [
                  {
                    node: {
                      id: 'joinedOrgId1',
                      name: 'Joined Org 1',
                      description: 'Joined Desc',
                      avatarURL: null,
                      city: 'City',
                      countryCode: 'US',
                      addressLine1: '456 Avenue',
                      postalCode: '67890',
                      state: 'State',
                      membersCount: 2,
                      adminsCount: 1,
                      members: { edges: [{ node: { id: TEST_USER_ID } }] },
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        request: { query: GET_COMMUNITY_DATA, variables: {} },
        result: {
          data: {
            community: {
              inactivityTimeoutDuration: 3600,
              __typename: 'Community',
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={testMocks}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Organizations />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    // Wait for the organizations to render
    await waitFor(
      () =>
        expect(screen.getByTestId('org-name-All Org 0')).toBeInTheDocument(),
      { timeout: 2000 },
    );

    // Check all organizations mode
    const allCard = screen.getByTestId('organization-card');
    expect(allCard).toHaveAttribute('data-organization-name', 'All Org 0');
    expect(allCard).toHaveAttribute('data-membership-status', ''); // Not a member
    expect(screen.getByTestId('membership-status-All Org 0')).toHaveAttribute(
      'data-status',
      '',
    );

    // Switch to joined mode
    await userEvent.click(screen.getByTestId('modeChangeBtn'));
    await userEvent.click(screen.getByTestId('modeBtn1'));
    await waitFor(
      () =>
        expect(screen.getByTestId('org-name-Joined Org 1')).toBeInTheDocument(),
      { timeout: 2000 },
    );

    const joinedCard = screen.getByTestId('organization-card');
    expect(joinedCard).toHaveAttribute(
      'data-organization-name',
      'Joined Org 1',
    );
    expect(joinedCard).toHaveAttribute('data-membership-status', 'accepted');
    expect(
      screen.getByTestId('membership-status-Joined Org 1'),
    ).toHaveAttribute('data-status', 'accepted');
  });
});
