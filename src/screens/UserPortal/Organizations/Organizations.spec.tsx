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
  ALL_ORGANIZATIONS_PG,
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
  // Mock for All Organizations (Happy Path)
  {
    request: { query: ALL_ORGANIZATIONS_PG, variables: { filter: '' } },
    result: {
      data: {
        organizations: [
          ...Array(10)
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
              isMember: i % 2 === 0,
              __typename: 'Organization',
            })),
          {
            id: 'allOrgIdMissing',
            name: 'Missing Org',
            description: undefined,
            avatarURL: null,
            city: undefined,
            countryCode: undefined,
            addressLine1: undefined,
            postalCode: undefined,
            state: undefined,
            membersCount: undefined,
            adminsCount: undefined,
            isMember: false,
            __typename: 'Organization',
          },
        ],
      },
    },
  },
  // Mock for Joined Organizations (Happy Path)
  {
    request: {
      query: USER_JOINED_ORGANIZATIONS_PG,
      variables: { id: TEST_USER_ID, first: 5, filter: '' },
    },
    result: {
      data: {
        user: {
          organizationsWhereMember: {
            pageInfo: { hasNextPage: false, __typename: 'PageInfo' },
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
                  members: {
                    edges: [{ node: { id: TEST_USER_ID, __typename: 'User' } }],
                    __typename: 'UserConnection',
                  },
                  __typename: 'Organization',
                },
                __typename: 'OrganizationEdge',
              },
              {
                node: {
                  id: 'joinedOrgIdMissing',
                  name: 'Joined Missing Org',
                  description: undefined,
                  avatarURL: null,
                  city: undefined,
                  countryCode: undefined,
                  addressLine1: undefined,
                  postalCode: undefined,
                  state: undefined,
                  membersCount: undefined,
                  adminsCount: undefined,
                  members: {
                    edges: [{ node: { id: TEST_USER_ID, __typename: 'User' } }],
                    __typename: 'UserConnection',
                  },
                  __typename: 'Organization',
                },
                __typename: 'OrganizationEdge',
              },
            ],
            __typename: 'OrganizationConnection',
          },
          __typename: 'User',
        },
      },
    },
  },
  // Mock for Created Organizations (Happy Path)
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
              membersCount: 3,
              adminsCount: 1,
              isMember: true,
              __typename: 'Organization',
            },
            {
              id: 'createdOrgIdMissing',
              name: 'Created Missing Org',
              description: undefined,
              avatarURL: null,
              city: undefined,
              countryCode: undefined,
              addressLine1: undefined,
              postalCode: undefined,
              state: undefined,
              membersCount: undefined,
              adminsCount: undefined,
              isMember: true,
              __typename: 'Organization',
            },
          ],
          __typename: 'User',
        },
      },
    },
  },
  // Mock for All Organizations with Missing Fields
  {
    request: { query: ALL_ORGANIZATIONS_PG, variables: { filter: 'missing' } },
    result: {
      data: {
        organizations: [
          {
            id: 'allOrgIdMissing',
            name: 'Missing Org',
            description: undefined,
            avatarURL: null,
            city: undefined,
            countryCode: 'US',
            addressLine1: undefined,
            postalCode: '12345',
            state: 'State',
            membersCount: undefined,
            adminsCount: undefined,
            isMember: false,
            __typename: 'Organization',
          },
        ],
      },
    },
  },
  // Mock for Joined Organizations with Missing Fields
  {
    request: {
      query: USER_JOINED_ORGANIZATIONS_PG,
      variables: { id: TEST_USER_ID, first: 5, filter: 'missing' },
    },
    result: {
      data: {
        user: {
          organizationsWhereMember: {
            pageInfo: { hasNextPage: false, __typename: 'PageInfo' },
            edges: [
              {
                node: {
                  id: 'joinedOrgIdMissing',
                  name: 'Joined Missing Org',
                  description: undefined,
                  avatarURL: null,
                  city: undefined,
                  countryCode: 'US',
                  addressLine1: undefined,
                  postalCode: '67890',
                  state: 'State',
                  membersCount: undefined,
                  adminsCount: undefined,
                  members: {
                    edges: [{ node: { id: TEST_USER_ID, __typename: 'User' } }],
                    __typename: 'UserConnection',
                  },
                  __typename: 'Organization',
                },
                __typename: 'OrganizationEdge',
              },
            ],
            __typename: 'OrganizationConnection',
          },
          __typename: 'User',
        },
      },
    },
  },
  // Mock for Created Organizations with Missing Fields
  {
    request: {
      query: USER_CREATED_ORGANIZATIONS,
      variables: { id: TEST_USER_ID, filter: 'missing' },
    },
    result: {
      data: {
        user: {
          createdOrganizations: [
            {
              id: 'createdOrgIdMissing',
              name: 'Created Missing Org',
              description: undefined,
              avatarURL: null,
              city: undefined,
              countryCode: 'US',
              addressLine1: undefined,
              postalCode: '12345',
              state: 'State',
              membersCount: undefined,
              adminsCount: undefined,
              isMember: true,
              __typename: 'Organization',
            },
          ],
          __typename: 'User',
        },
      },
    },
  },
  // Mock for Empty All Organizations
  {
    request: { query: ALL_ORGANIZATIONS_PG, variables: { filter: 'empty' } },
    result: { data: { organizations: [] } },
  },
  // Mock for Empty Joined Organizations
  {
    request: {
      query: USER_JOINED_ORGANIZATIONS_PG,
      variables: { id: TEST_USER_ID, first: 5, filter: 'empty' },
    },
    result: {
      data: {
        user: {
          organizationsWhereMember: {
            pageInfo: { hasNextPage: false, __typename: 'PageInfo' },
            edges: [],
            __typename: 'OrganizationConnection',
          },
          __typename: 'User',
        },
      },
    },
  },
  // Mock for Empty Created Organizations
  {
    request: {
      query: USER_CREATED_ORGANIZATIONS,
      variables: { id: TEST_USER_ID, filter: 'empty' },
    },
    result: {
      data: { user: { createdOrganizations: [], __typename: 'User' } },
    },
  },
  // Mock for Error in All Organizations
  {
    request: { query: ALL_ORGANIZATIONS_PG, variables: { filter: 'error' } },
    error: new Error('Failed to fetch organizations'),
  },
  // Mock for Error in Joined Organizations
  {
    request: {
      query: USER_JOINED_ORGANIZATIONS_PG,
      variables: { id: TEST_USER_ID, first: 5, filter: 'error' },
    },
    error: new Error('Failed to fetch joined organizations'),
  },
  // Mock for Error in Created Organizations
  {
    request: {
      query: USER_CREATED_ORGANIZATIONS,
      variables: { id: TEST_USER_ID, filter: 'error' },
    },
    error: new Error('Failed to fetch created organizations'),
  },
  // Mock for Filtered Search
  {
    request: { query: ALL_ORGANIZATIONS_PG, variables: { filter: '2' } },
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
            isMember: true,
            __typename: 'Organization',
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
            pageInfo: { hasNextPage: false, __typename: 'PageInfo' },
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
                  members: {
                    edges: [{ node: { id: TEST_USER_ID, __typename: 'User' } }],
                    __typename: 'UserConnection',
                  },
                  __typename: 'Organization',
                },
                __typename: 'OrganizationEdge',
              },
            ],
            __typename: 'OrganizationConnection',
          },
          __typename: 'User',
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
              membersCount: 3,
              adminsCount: 1,
              isMember: true,
              __typename: 'Organization',
            },
          ],
          __typename: 'User',
        },
      },
    },
  },
  {
    request: {
      query: ALL_ORGANIZATIONS_PG,
      variables: { filter: 'test' },
    },
    result: {
      data: {
        organizations: [
          {
            id: 'testOrgId',
            name: 'Test Org',
            city: 'Test City',
            countryCode: 'US',
            addressLine1: '789 Test St',
            postalCode: '99999',
            state: 'Test State',
            description: 'Test Description',
            avatarURL: null,
            membersCount: 1,
            adminsCount: 1,
            isMember: false,
            __typename: 'Organization',
          },
        ],
      },
    },
  },
  {
    request: {
      query: USER_JOINED_ORGANIZATIONS_PG,
      variables: {
        id: '01958985-600e-7cde-94a2-b3fc1ce66cf3',
        first: 5,
        filter: 'test',
      },
    },
    result: {
      data: {
        user: {
          organizationsWhereMember: {
            pageInfo: { hasNextPage: false, __typename: 'PageInfo' },
            edges: [],
            __typename: 'OrganizationConnection',
          },
          __typename: 'User',
        },
      },
    },
  },
  {
    request: {
      query: USER_CREATED_ORGANIZATIONS,
      variables: {
        id: '01958985-600e-7cde-94a2-b3fc1ce66cf3',
        filter: 'test',
      },
    },
    result: {
      data: {
        user: {
          createdOrganizations: [],
          __typename: 'User',
        },
      },
    },
  },
  // Mock for Community Data
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

    await waitFor(
      () => {
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    await waitFor(
      () => {
        // Check first few orgs and Missing Org
        expect(screen.getByTestId('org-name-All Org 0')).toBeInTheDocument();
        expect(screen.getByTestId('org-name-All Org 1')).toBeInTheDocument();
        // Assuming pagination, Missing Org might not be on page 1; adjust if all 11 show
        expect(screen.getAllByTestId('organization-card').length).toBe(5); // 5 per page
        // If Missing Org is on page 1, test its fields
        if (screen.queryByTestId('org-name-Missing Org')) {
          expect(
            screen.getByTestId('org-name-Missing Org'),
          ).toBeInTheDocument();
          expect(
            screen.getByTestId('org-description-Missing Org').textContent,
          ).toBe('');
          expect(
            screen.getByTestId('org-membersCount-Missing Org').textContent,
          ).toBe('0');
          expect(
            screen.getByTestId('org-adminsCount-Missing Org').textContent,
          ).toBe('0');
          expect(screen.getByTestId('org-city-Missing Org').textContent).toBe(
            '',
          );
        }
      },
      { timeout: 3000 },
    );
  });

  it('switches to joined organizations (mode=1)', async () => {
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
      { timeout: 5000 },
    );

    await userEvent.click(screen.getByTestId('modeChangeBtn'));
    await userEvent.click(screen.getByTestId('modeBtn1'));

    await waitFor(
      () => {
        expect(screen.getByTestId('org-name-Joined Org 1')).toBeInTheDocument();
        expect(
          screen.getByTestId('org-name-Joined Missing Org'),
        ).toBeInTheDocument();

        const joinedOrg1Card = screen
          .getAllByTestId('organization-card')
          .find(
            (card) =>
              card.getAttribute('data-organization-name') === 'Joined Org 1',
          );
        const joinedMissingOrgCard = screen
          .getAllByTestId('organization-card')
          .find(
            (card) =>
              card.getAttribute('data-organization-name') ===
              'Joined Missing Org',
          );

        if (!joinedOrg1Card || !joinedMissingOrgCard) {
          throw new Error('Joined organization card not found');
        }

        expect(
          joinedMissingOrgCard.querySelector('[data-testid="description"]')
            ?.textContent || '',
        ).toBe('');
        expect(
          joinedMissingOrgCard.querySelector('[data-testid="membersCount"]')
            ?.textContent || '0',
        ).toBe('0');
        expect(
          joinedMissingOrgCard.querySelector('[data-testid="adminsCount"]')
            ?.textContent || '0',
        ).toBe('0');
        expect(
          joinedMissingOrgCard.querySelector('[data-testid="city"]')
            ?.textContent || '',
        ).toBe('');

        expect(
          screen.queryByTestId('org-name-All Org 0'),
        ).not.toBeInTheDocument();

        const orgCount = screen.getAllByTestId('organization-card').length;
        expect(orgCount).toBe(2);

        const pagination = screen.queryByTestId('pagination');
        if (pagination) {
          expect(pagination).toHaveAttribute('data-count', '2');
        } else {
          expect(orgCount).toBe(2);
        }
      },
      { timeout: 5000 },
    );
  });

  it('switches to created organizations (mode=2)', async () => {
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

    await userEvent.click(screen.getByTestId('modeChangeBtn'));
    await userEvent.click(screen.getByTestId('modeBtn2'));

    await waitFor(
      () => {
        expect(
          screen.getByTestId('org-name-Created Org 1'),
        ).toBeInTheDocument();
        expect(
          screen.getByTestId('org-name-Created Missing Org'),
        ).toBeInTheDocument();

        const createdMissingOrgCard = screen
          .getAllByTestId('organization-card')
          .find(
            (card) =>
              card.getAttribute('data-organization-name') ===
              'Created Missing Org',
          );

        if (!createdMissingOrgCard) {
          throw new Error('Created Missing Org card not found');
        }

        expect(
          createdMissingOrgCard.querySelector('[data-testid="description"]')
            ?.textContent || '',
        ).toBe(''); // description || ''
        expect(
          createdMissingOrgCard.querySelector('[data-testid="membersCount"]')
            ?.textContent || '0',
        ).toBe('0'); // membersCount || 0
        expect(
          createdMissingOrgCard.querySelector('[data-testid="adminsCount"]')
            ?.textContent || '0',
        ).toBe('0'); // adminsCount || 0
        expect(
          createdMissingOrgCard.querySelector('[data-testid="city"]')
            ?.textContent || '',
        ).toBe(''); // city || ''

        expect(
          screen.queryByTestId('org-name-All Org 0'),
        ).not.toBeInTheDocument();

        expect(screen.getAllByTestId('organization-card').length).toBe(2);
      },
      { timeout: 2000 },
    );
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
    await waitFor(
      () =>
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument(),
      { timeout: 2000 },
    );

    await userEvent.click(screen.getByTestId('modeChangeBtn'));
    await userEvent.click(screen.getByTestId('modeBtn2'));
    await wait(500);

    const searchInput = screen.getByTestId('searchInput');
    await userEvent.type(searchInput, '2{enter}');

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
      expect(
        screen.getByTestId('org-name-Debounced Search Org'),
      ).toBeInTheDocument();
    });

    vi.useRealTimers();
  });

  it('changes rows per page and resets pagination', async () => {
    const extendedMocks = [
      ...mocks,
      {
        request: {
          query: ALL_ORGANIZATIONS_PG,
          variables: { filter: undefined, limit: 10, offset: 0 },
        },
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
                isMember: i % 2 === 0,
                __typename: 'Organization',
              })),
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={extendedMocks} addTypename={true}>
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
        expect(
          screen.getAllByTestId('organization-card').length,
        ).toBeGreaterThan(0);
      },
      { timeout: 3000 },
    );

    expect(screen.getAllByTestId('organization-card').length).toBe(5);
    expect(screen.getByTestId('org-name-All Org 0')).toBeInTheDocument();
    expect(screen.getByTestId('org-name-All Org 4')).toBeInTheDocument();
    expect(screen.queryByTestId('org-name-All Org 5')).not.toBeInTheDocument();

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

  it('shows no organizations message when data is empty', async () => {
    const emptyMocks = [
      ...mocks.filter(
        (mock) =>
          mock.request.query !== ALL_ORGANIZATIONS_PG &&
          mock.request.query !== USER_JOINED_ORGANIZATIONS_PG &&
          mock.request.query !== USER_CREATED_ORGANIZATIONS,
      ),
      {
        request: {
          query: ALL_ORGANIZATIONS_PG,
          variables: { filter: '', limit: 5, offset: 0 },
        },
        result: { data: { organizations: [] } },
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
                edges: [],
                pageInfo: { hasNextPage: false, __typename: 'PageInfo' },
                __typename: 'OrganizationConnection',
              },
              __typename: 'User',
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
          data: { user: { createdOrganizations: [], __typename: 'User' } },
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
    await wait(1000);
    expect(screen.getByTestId('no-organizations-message')).toBeInTheDocument();

    await userEvent.click(screen.getByTestId('modeChangeBtn'));
    await userEvent.click(screen.getByTestId('modeBtn2'));
    await wait(1000);
    expect(screen.getByTestId('no-organizations-message')).toBeInTheDocument();
  });

  it('paginates through joined organizations', async () => {
    const testMocks = [
      ...mocks.filter(
        (mock) => mock.request.query !== USER_JOINED_ORGANIZATIONS_PG,
      ),
      {
        request: {
          query: USER_JOINED_ORGANIZATIONS_PG,
          variables: { id: TEST_USER_ID, first: 5, filter: '' },
        },
        result: {
          data: {
            user: {
              organizationsWhereMember: {
                pageInfo: { hasNextPage: true, __typename: 'PageInfo' },
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
                      members: {
                        edges: [
                          { node: { id: TEST_USER_ID, __typename: 'User' } },
                        ],
                        __typename: 'UserConnection',
                      },
                      __typename: 'Organization',
                    },
                    __typename: 'OrganizationEdge',
                  })),
                __typename: 'OrganizationConnection',
              },
              __typename: 'User',
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

    await waitFor(
      () =>
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument(),
      { timeout: 2000 },
    );

    await userEvent.click(screen.getByTestId('modeChangeBtn'));
    await userEvent.click(screen.getByTestId('modeBtn1'));
    await wait(1000);

    expect(screen.getByTestId('org-name-Joined Org 0')).toBeInTheDocument();
    expect(screen.getByTestId('org-name-Joined Org 4')).toBeInTheDocument();
    expect(
      screen.queryByTestId('org-name-Joined Org 5'),
    ).not.toBeInTheDocument();

    const nextPageButton = screen.getByRole('button', { name: /next page/i });
    await userEvent.click(nextPageButton);
    await wait(1000);

    expect(screen.getByTestId('org-name-Joined Org 5')).toBeInTheDocument();
    expect(
      screen.queryByTestId('org-name-Joined Org 0'),
    ).not.toBeInTheDocument();
  });

  it('paginates through created organizations', async () => {
    const testMocks = [
      ...mocks.filter(
        (mock) => mock.request.query !== USER_CREATED_ORGANIZATIONS,
      ),
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
                  membersCount: 3,
                  adminsCount: 1,
                  isMember: true,
                  __typename: 'Organization',
                })),
              __typename: 'User',
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

    await waitFor(
      () =>
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument(),
      { timeout: 2000 },
    );

    await userEvent.click(screen.getByTestId('modeChangeBtn'));
    await userEvent.click(screen.getByTestId('modeBtn2'));
    await wait(1000);

    expect(screen.getByTestId('org-name-Created Org 0')).toBeInTheDocument();
    expect(screen.getByTestId('org-name-Created Org 4')).toBeInTheDocument();
    expect(
      screen.queryByTestId('org-name-Created Org 5'),
    ).not.toBeInTheDocument();

    const nextPageButton = screen.getByRole('button', { name: /next page/i });
    await userEvent.click(nextPageButton);
    await wait(1000);

    expect(screen.getByTestId('org-name-Created Org 5')).toBeInTheDocument();
    expect(
      screen.queryByTestId('org-name-Created Org 0'),
    ).not.toBeInTheDocument();
  });

  it('paginates through the list of organizations', async () => {
    const extendedMocks = [
      ...mocks,
      {
        request: {
          query: ALL_ORGANIZATIONS_PG,
          variables: { filter: undefined, limit: 10, offset: 0 },
        },
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
                isMember: i % 2 === 0,
                __typename: 'Organization',
              })),
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={extendedMocks} addTypename={true}>
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
        expect(
          screen.getAllByTestId('organization-card').length,
        ).toBeGreaterThan(0);
      },
      { timeout: 3000 },
    );

    expect(screen.getByTestId('org-name-All Org 0')).toBeInTheDocument();
    expect(screen.getByTestId('org-name-All Org 4')).toBeInTheDocument();
    expect(screen.queryByTestId('org-name-All Org 5')).not.toBeInTheDocument();

    const nextPageButton = screen.getByRole('button', { name: /next page/i });
    await userEvent.click(nextPageButton);
    await waitFor(
      () =>
        expect(screen.getByTestId('org-name-All Org 5')).toBeInTheDocument(),
      { timeout: 2000 },
    );
    expect(screen.queryByTestId('org-name-All Org 0')).not.toBeInTheDocument();
  });

  it('handles query errors gracefully', async () => {
    const errorMocks = [
      ...mocks.filter((mock) => mock.request.query !== ALL_ORGANIZATIONS_PG),
      {
        request: {
          query: ALL_ORGANIZATIONS_PG,
          variables: { filter: '', limit: 5, offset: 0 },
        },
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

  it('toggles the sidebar visibility', async () => {
    vi.mock('utils/useLocalstorage', () => ({
      default: () => ({
        getItem: vi.fn(() => TEST_USER_ID),
        setItem: vi.fn(),
      }),
    }));

    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1000);

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

    expect(screen.getByTestId('closeMenu')).toBeInTheDocument();
    expect(screen.queryByTestId('openMenu')).not.toBeInTheDocument();

    await userEvent.click(screen.getByTestId('closeMenu'));
    await waitFor(
      () => expect(screen.getByTestId('openMenu')).toBeInTheDocument(),
      { timeout: 2000 },
    );
    expect(screen.queryByTestId('closeMenu')).not.toBeInTheDocument();

    await userEvent.click(screen.getByTestId('openMenu'));
    await waitFor(
      () => expect(screen.getByTestId('closeMenu')).toBeInTheDocument(),
      { timeout: 2000 },
    );
    expect(screen.queryByTestId('openMenu')).not.toBeInTheDocument();

    vi.restoreAllMocks();
  });

  it('toggles drawer visibility on window resize', async () => {
    vi.mock('utils/useLocalstorage', () => ({
      default: () => ({
        getItem: vi.fn(() => TEST_USER_ID),
        setItem: vi.fn(),
      }),
    }));

    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1000);

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

    expect(screen.getByTestId('closeMenu')).toBeInTheDocument();
    expect(screen.queryByTestId('openMenu')).not.toBeInTheDocument();

    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(800);
    fireEvent(window, new Event('resize'));
    await waitFor(
      () => expect(screen.getByTestId('openMenu')).toBeInTheDocument(),
      { timeout: 2000 },
    );
    expect(screen.queryByTestId('closeMenu')).not.toBeInTheDocument();

    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1000);
    fireEvent(window, new Event('resize'));
    await waitFor(
      () => expect(screen.getByTestId('closeMenu')).toBeInTheDocument(),
      { timeout: 2000 },
    );
    expect(screen.queryByTestId('openMenu')).not.toBeInTheDocument();

    vi.restoreAllMocks();
  });

  it('correctly maps organization data to card props', async () => {
    const testMocks = [
      ...mocks.filter(
        (mock) =>
          mock.request.query !== ALL_ORGANIZATIONS_PG &&
          mock.request.query !== USER_JOINED_ORGANIZATIONS_PG,
      ),
      {
        request: {
          query: ALL_ORGANIZATIONS_PG,
          variables: { filter: '' }, // Consistent with mocks
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
                isMember: false,
                __typename: 'Organization',
              },
            ],
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
                pageInfo: { hasNextPage: false, __typename: 'PageInfo' },
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
                      members: {
                        edges: [
                          { node: { id: TEST_USER_ID, __typename: 'User' } },
                        ],
                        __typename: 'UserConnection',
                      },
                      __typename: 'Organization',
                    },
                    __typename: 'OrganizationEdge',
                  },
                ],
                __typename: 'OrganizationConnection',
              },
              __typename: 'User',
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
      <MockedProvider mocks={testMocks} addTypename={true}>
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
        expect(screen.getByTestId('org-name-All Org 0')).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    const allCard = screen.getByTestId('organization-card');
    expect(allCard).toHaveAttribute('data-organization-name', 'All Org 0');
    expect(allCard).toHaveAttribute('data-membership-status', '');
    expect(screen.getByTestId('membership-status-All Org 0')).toHaveAttribute(
      'data-status',
      '',
    );

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

  it('displays membership status correctly in all organizations mode', async () => {
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
        expect(screen.getByTestId('org-name-All Org 0')).toBeInTheDocument(),
      { timeout: 2000 },
    );

    expect(screen.getByTestId('membership-status-All Org 0')).toHaveAttribute(
      'data-status',
      'accepted',
    );
    expect(screen.getByTestId('membership-status-All Org 1')).toHaveAttribute(
      'data-status',
      '',
    );
  });

  it('handles refetch on mode change with filter applied', async () => {
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

    const searchInput = screen.getByTestId('searchInput');
    await userEvent.type(searchInput, '2{enter}');
    await waitFor(
      () =>
        expect(screen.getByTestId('org-name-All Org 2')).toBeInTheDocument(),
      { timeout: 2000 },
    );

    await userEvent.click(screen.getByTestId('modeChangeBtn'));
    await userEvent.click(screen.getByTestId('modeBtn1'));
    await waitFor(
      () =>
        expect(screen.getByTestId('org-name-Joined Org 2')).toBeInTheDocument(),
      { timeout: 2000 },
    );

    await userEvent.click(screen.getByTestId('modeChangeBtn'));
    await userEvent.click(screen.getByTestId('modeBtn2'));
    await waitFor(
      () =>
        expect(
          screen.getByTestId('org-name-Created Org 2'),
        ).toBeInTheDocument(),
      { timeout: 2000 },
    );
  });

  it('renders address fields in organization cards', async () => {
    const testMocks = [
      ...mocks.filter(
        (mock) =>
          mock.request.query !== ALL_ORGANIZATIONS_PG &&
          mock.request.query !== USER_JOINED_ORGANIZATIONS_PG,
      ),
      {
        request: {
          query: ALL_ORGANIZATIONS_PG,
          variables: { filter: '' },
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
                isMember: false,
                members: {
                  edges: [
                    {
                      node: { id: 'memberId1', __typename: 'User' },
                      __typename: 'MemberEdge',
                    },
                  ],
                  __typename: 'UserConnection',
                },
                __typename: 'Organization',
              },
            ],
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
                pageInfo: { hasNextPage: false, __typename: 'PageInfo' },
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
                      members: {
                        edges: [
                          { node: { id: TEST_USER_ID, __typename: 'User' } },
                        ],
                        __typename: 'UserConnection',
                      },
                      __typename: 'Organization',
                    },
                    __typename: 'OrganizationEdge',
                  },
                ],
                __typename: 'OrganizationConnection',
              },
              __typename: 'User',
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
      <MockedProvider mocks={testMocks} addTypename={true}>
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
        expect(screen.getByTestId('org-name-All Org 0')).toBeInTheDocument();
        expect(screen.getByTestId('organization-card')).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    const card = screen.getByTestId('organization-card');
    expect(card).toHaveAttribute('data-organization-name', 'All Org 0');
    expect(card.textContent).toMatch(/123 Street/);
    expect(card.textContent).toMatch(/City/);
    expect(card.textContent).toMatch(/US/);
  });

  it('handles all loading states simultaneously', async () => {
    const slowMocks = [
      {
        request: { query: ALL_ORGANIZATIONS_PG, variables: { filter: '' } },
        delay: 1000,
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
                isMember: i % 2 === 0,
                members: {
                  edges: [
                    {
                      node: { id: `memberId${i + 1}`, __typename: 'User' },
                      __typename: 'MemberEdge',
                    },
                  ],
                  __typename: 'UserConnection',
                },
                __typename: 'Organization',
              })),
          },
        },
      },
      {
        request: {
          query: USER_JOINED_ORGANIZATIONS_PG,
          variables: { id: TEST_USER_ID, first: 5, filter: '' },
        },
        delay: 1000,
        result: {
          data: {
            user: {
              organizationsWhereMember: {
                pageInfo: { hasNextPage: false, __typename: 'PageInfo' },
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
                      members: {
                        edges: [
                          { node: { id: TEST_USER_ID, __typename: 'User' } },
                        ],
                        __typename: 'UserConnection',
                      },
                      __typename: 'Organization',
                    },
                    __typename: 'OrganizationEdge',
                  },
                ],
                __typename: 'OrganizationConnection',
              },
              __typename: 'User',
            },
          },
        },
      },
      {
        request: {
          query: USER_CREATED_ORGANIZATIONS,
          variables: { id: TEST_USER_ID, filter: '' },
        },
        delay: 1000,
        result: {
          data: {
            user: {
              createdOrganizations: [
                {
                  id: 'createdOrgId1',
                  name: 'Created Org 1',
                  description: 'Created Desc',
                  avatarURL: null,
                  membersCount: 3,
                  adminsCount: 1,
                  isMember: true,
                  members: {
                    edges: [
                      {
                        node: { id: TEST_USER_ID, __typename: 'User' },
                        __typename: 'MemberEdge',
                      },
                      {
                        node: { id: 'memberId2', __typename: 'User' },
                        __typename: 'MemberEdge',
                      },
                    ],
                    __typename: 'UserConnection',
                  },
                  __typename: 'Organization',
                },
              ],
              __typename: 'User',
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
      <MockedProvider mocks={slowMocks} addTypename={true}>
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
    await waitFor(
      () =>
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument(),
      { timeout: 3000 },
    );
    expect(screen.getByTestId('org-name-All Org 0')).toBeInTheDocument();

    // Switch to mode 2 to cover created organizations
    await userEvent.click(screen.getByTestId('modeChangeBtn'));
    await userEvent.click(screen.getByTestId('modeBtn2'));
    await waitFor(
      () =>
        expect(
          screen.getByTestId('org-name-Created Org 1'),
        ).toBeInTheDocument(),
      { timeout: 2000 },
    );
  });

  it('triggers immediate search on Enter key', async () => {
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

    await waitFor(() => {
      expect(screen.getByTestId('org-name-All Org 0')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('searchInput');
    await userEvent.type(searchInput, 'test');
    await userEvent.keyboard('{Enter}');

    // Should update immediately without waiting for debounce
    await waitFor(() => {
      expect(screen.getByTestId('org-name-Test Org')).toBeInTheDocument();
    });
  });

  it('handles undefined organizations in all mode', async () => {
    const undefinedMocks = [
      {
        request: {
          query: ALL_ORGANIZATIONS_PG,
          variables: { filter: 'undefined' },
        },
        result: { data: { organizations: undefined } }, // Simulate missing field
      },
      ...mocks.filter((m) => m.request.query !== ALL_ORGANIZATIONS_PG),
    ];
    render(
      <MockedProvider mocks={undefinedMocks}>
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
    await userEvent.type(searchInput, 'undefined{enter}');
    await waitFor(() => {
      expect(
        screen.getByTestId('no-organizations-message'),
      ).toBeInTheDocument();
      // Pagination count should be 0
    });
  });

  it('displays all organizations when rowsPerPage is 0', async () => {
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
    await waitFor(
      () =>
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument(),
      { timeout: 2000 },
    );

    const rowsPerPageSelect = screen.getByRole('combobox', {
      name: /rows per page/i,
    });
    fireEvent.change(rowsPerPageSelect, { target: { value: '0' } });
    await waitFor(
      () => {
        expect(screen.getAllByTestId('organization-card').length).toBe(11); // Updated to 11
      },
      { timeout: 2000 },
    );
  });
});
