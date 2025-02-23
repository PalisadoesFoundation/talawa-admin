// Organizations.test.tsx

import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  USER_CREATED_ORGANIZATIONS,
  USER_JOINED_ORGANIZATIONS,
  USER_JOINED_ORGANIZATIONS_PG,
  USER_ORGANIZATION_CONNECTION,
} from 'GraphQl/Queries/Queries';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { act } from 'react-dom/test-utils';
import { describe, it, expect, vi } from 'vitest';
import i18nForTest from 'utils/i18nForTest';
import { store } from 'state/store';
import useLocalStorage from 'utils/useLocalstorage';
import {
  ALL_ORGANIZATIONS,
  USER_JOINED_ORGANIZATIONS,
  USER_CREATED_ORGANIZATIONS,
} from 'GraphQl/Queries/Queries';
import Organizations from './Organizations';

// In your real code, you might import getItem/setItem from "utils/useLocalstorage" directly
const { setItem, getItem } = useLocalStorage();

const TEST_USER_ID = '01958985-600e-7cde-94a2-b3fc1ce66cf3';

const mocks = [
  {
    request: { query: ALL_ORGANIZATIONS, variables: { filter: '' } },
    result: {
      data: {
        organizations: [
          {
            _id: 'allOrgId1',
            name: 'All Org 1',
            description: 'desc 1',
            image: null,
          },
          {
            _id: 'allOrgId2',
            name: 'All Org 2',
            description: 'desc 2',
            image: null,
          },
          {
            _id: 'allOrgId3',
            name: 'All Org 3',
            description: 'desc 3',
            image: null,
          },
          {
            _id: 'allOrgId4',
            name: 'All Org 4',
            description: 'desc 4',
            image: null,
          },
          {
            _id: 'allOrgId5',
            name: 'All Org 5',
            description: 'desc 5',
            image: null,
          },
          {
            _id: 'allOrgId6',
            name: 'All Org 6',
            description: 'desc 6',
            image: null,
          },
        ],
      },
    },
  },
  {
    request: {
      query: USER_JOINED_ORGANIZATIONS,
      variables: { id: TEST_USER_ID, first: 5, filter: '' },
    },
    result: {
      data: {
        user: {
          organizationsWhereMember: {
            edges: [
              {
                node: {
                  _id: 'joinedOrgId1',
                  name: 'Joined Org 1',
                  description: 'Joined Desc',
                  isJoined: true,
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
              _id: 'createdOrgId1',
              name: 'Created Org 1',
              description: 'Created Desc',
              isJoined: true,
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
            _id: 'allOrgId2',
            name: 'All Org 2',
            description: 'desc 2',
            image: null,
          },
        ],
      },
    },
  },
  {
    request: {
      query: USER_JOINED_ORGANIZATIONS,
      variables: { id: TEST_USER_ID, first: 5, filter: '2' },
    },
    result: {
      data: {
        user: {
          organizationsWhereMember: {
            edges: [
              {
                node: {
                  _id: 'joinedOrgId2',
                  name: 'Joined Org 2',
                  description: 'Joined Desc 2',
                  isJoined: true,
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
              _id: 'createdOrgId2',
              name: 'Created Org 2',
              description: 'Created Desc 2',
              isJoined: true,
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
            _id: 'debserorgid1',
            name: 'Debounced Search Org',
            description: 'desc 123',
            image: null,
          },
        ],
      },
    },
  },
  {
    request: {
      query: USER_JOINED_ORGANIZATIONS_PG,
      variables: {
        id: getItem('userId'),
        first: 5,
      },
    },
    result: {
      data: {
        UserJoinedOrganizations: [
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
            userRegistrationRequired: true,
            members: [],
            admins: [],
            membershipRequests: [],
            isJoined: false,
          },
          {
            __typename: 'Organization',
            _id: '6401ff65ce8e8406b8f07af3',
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
            members: [],
            admins: [],
            membershipRequests: [],
            isJoined: false,
          },
        ],
      },
    },
  },
  // New mock for search query
  {
    request: {
      query: USER_JOINED_ORGANIZATIONS_PG,
      variables: {
        id: getItem('userId'),
        first: 5,
        filter: '2',
      },
    },
    result: {
      data: {
        UserJoinedOrganizations: [
          {
            __typename: 'Organization',
            _id: '6401ff65ce8e8406b8f07af3',
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
            members: [],
            admins: [],
            membershipRequests: [],
            isJoined: false,
          },
        ],
      },
    },
  },
  // Mock for empty search (when search is cleared)
  {
    request: {
      query: USER_JOINED_ORGANIZATIONS_PG,
      variables: {
        id: getItem('userId'),
        first: 5,
        filter: '',
      },
    },
    result: {
      data: {
        UserJoinedOrganizations: [
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
            userRegistrationRequired: true,
            members: [],
            admins: [],
            membershipRequests: [],
            isJoined: false,
          },
          {
            __typename: 'Organization',
            _id: '6401ff65ce8e8406b8f07af3',
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
            members: [],
            admins: [],
            membershipRequests: [],
            isJoined: false,
          },
        ],
      },
    },
  },
  {
    request: {
      query: USER_JOINED_ORGANIZATIONS,
      variables: {
        id: getItem('userId'),
      },
    },
    result: {
      data: {
        users: [
          {
            user: {
              organizationsWhereMember: {
                edges: [
                  {
                    node: {
                      __typename: 'Organization',
                      _id: '6401ff65ce8e8406b8f07af2',
                      image: '',
                      name: 'Test Edge Org',
                      description: 'Test Description',
                      address: {
                        city: 'Test City',
                        countryCode: '123',
                        postalCode: '456',
                        state: 'Test State',
                        dependentLocality: 'Test Locality',
                        line1: 'Test Line 1',
                        line2: 'Test Line 2',
                        sortingCode: '4567',
                      },
                      createdAt: '1234567890',
                      userRegistrationRequired: true,
                      creator: {
                        __typename: 'User',
                        name: 'Test Creator',
                      },
                      members: [
                        {
                          _id: 'member1',
                          user: {
                            _id: getItem('userId'),
                          },
                        },
                      ],
                      admins: [],
                      membershipRequests: [],
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    },
  },
];

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

describe('Organizations Screen Tests', () => {
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
      expect(screen.queryByTestId('loading-spinner')).toBeNull(),
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

    // Wait for initial data load
    await wait();

    // Verify initial state
    expect(screen.getByText('anyOrganization1')).toBeInTheDocument();
    expect(screen.getByText('anyOrganization2')).toBeInTheDocument();

    // Perform search
    const searchInput = screen.getByTestId('searchInput');
    await userEvent.type(searchInput, '2');

    // Get and click search button
    const searchBtn = screen.getByTestId('searchBtn');
    await userEvent.click(searchBtn);

    // Wait for search results to update
    await wait();

    // Clear search
    await userEvent.clear(searchInput);
    await userEvent.click(searchBtn);

    // Wait again for results to update
    await wait();

    // Perform search again
    await userEvent.type(searchInput, '2');
    await userEvent.keyboard('{Enter}');

    // Wait for final search results
    await wait();

    // Verify final state
    expect(screen.getByText('anyOrganization2')).toBeInTheDocument();
  });

  it('switches to joined organizations (mode=1)', async () => {
    setItem('userId', TEST_USER_ID);
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
    await waitMs();

    await userEvent.click(screen.getByTestId('modeChangeBtn'));
    await waitMs();
    await userEvent.click(screen.getByTestId('modeBtn1'));

    await waitMs();
    expect(screen.getByText('Joined Org 1')).toBeInTheDocument();
  });

  it('switches to created organizations (mode=2)', async () => {
    setItem('userId', TEST_USER_ID);
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
    await waitMs();
    await userEvent.click(screen.getByTestId('modeChangeBtn'));
    await waitMs();
    await userEvent.click(screen.getByTestId('modeBtn2'));
    await waitMs();
    expect(screen.getByText('Created Org 1')).toBeInTheDocument();
  });

  it('searches All organizations by filter text using keystroke', async () => {
    setItem('userId', TEST_USER_ID);
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
    await waitMs();

    await userEvent.click(screen.getByTestId('modeChangeBtn'));
    await waitMs();
    await userEvent.click(screen.getByTestId('modeBtn0'));

    await waitMs();

    const searchInput = screen.getByTestId('searchInput');
    await userEvent.type(searchInput, '2');
    await userEvent.keyboard('{Enter}');
    await waitMs(500);
    expect(screen.getByText(/All Org 2/i)).toBeInTheDocument();
    expect(screen.queryByText(/All Org 1/i)).not.toBeInTheDocument();
  });

  /**
   * Test case to check if the "Join Now" button renders correctly on the page.
   */

  test('Join Now button renders correctly', async () => {
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

    // Wait for organizations to load
    await waitFor(() => {
      expect(screen.getByText('anyOrganization1')).toBeInTheDocument();
    });

    // Check for join buttons
    await waitFor(() => {
      const joinButtons = screen.getAllByTestId('joinBtn');
      expect(joinButtons.length).toBe(2); // We expect 2 buttons since we have 2 organizations
    });
  });

  test('Mode is changed to created organisations', async () => {
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

    await userEvent.click(screen.getByTestId('modeChangeBtn'));
    await waitMs();
    await userEvent.click(screen.getByTestId('modeBtn1'));

    await waitMs();

    const searchInput = screen.getByTestId('searchInput');
    await userEvent.type(searchInput, '2');
    await userEvent.keyboard('{Enter}');
    await waitMs(50);
    expect(screen.getByText(/Joined Org 2/i)).toBeInTheDocument();
    expect(screen.queryByText(/Joined Org 1/i)).not.toBeInTheDocument();
  });

  it('searches Created organizations by filter text by search button', async () => {
    setItem('userId', TEST_USER_ID);
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
    await waitMs();

    await userEvent.click(screen.getByTestId('modeChangeBtn'));
    await waitMs();
    await userEvent.click(screen.getByTestId('modeBtn2'));

    await waitMs();

    const searchInput = screen.getByTestId('searchInput');
    const searchBtn = screen.getByTestId('searchBtn');
    await userEvent.type(searchInput, '2');
    await userEvent.click(searchBtn);
    await waitMs(50);
    expect(screen.getByText(/Created Org 2/i)).toBeInTheDocument();
    expect(screen.queryByText(/Created Org 1/i)).not.toBeInTheDocument();
  });

  it('paginates through the list of organizations', async () => {
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

    await waitMs();

    // Ensure the first 5 organizations are shown
    expect(screen.getByText(/All Org 1/i)).toBeInTheDocument();
    expect(screen.getByText(/All Org 2/i)).toBeInTheDocument();
    expect(screen.getByText(/All Org 3/i)).toBeInTheDocument();
    expect(screen.getByText(/All Org 4/i)).toBeInTheDocument();
    expect(screen.getByText(/All Org 5/i)).toBeInTheDocument();

    // Ensure the 6th organization is NOT visible initially
    expect(screen.queryByText(/All Org 6/i)).toBeNull();

    // Click "Next Page" button using aria-label
    await userEvent.click(screen.getByRole('button', { name: /next page/i }));
    await waitMs();

    // Now, All Org 6 should be visible, and All Org 1 should be gone
    expect(screen.getByText(/All Org 6/i)).toBeInTheDocument();
    expect(screen.queryByText(/All Org 1/i)).toBeNull();
  });
  it('toggles the sidebar visibility', async () => {
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

    await waitMs();

    expect(screen.getByTestId('closeMenu')).toBeInTheDocument();

    await userEvent.click(screen.getByTestId('closeMenu'));
    await waitMs();

    expect(screen.getByTestId('openMenu')).toBeInTheDocument();

    await userEvent.click(screen.getByTestId('openMenu'));
    await waitMs();

    expect(screen.getByTestId('closeMenu')).toBeInTheDocument();
  });

  it('toggles the sidebar multiple times correctly', async () => {
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

    const closeBtn = screen.getByTestId('closeMenu');

    expect(closeBtn).toBeInTheDocument();

    await userEvent.click(closeBtn);
    await waitMs();
    const openBtn = screen.getByTestId('openMenu');

    expect(openBtn).toBeInTheDocument();

    await userEvent.click(openBtn);
    await waitMs();

    expect(closeBtn).toBeInTheDocument();
  });

  it('changing rows per page resets pagination', async () => {
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

    await waitMs();

    expect(screen.getByText(/All Org 1/i)).toBeInTheDocument();
    expect(screen.getByText(/All Org 5/i)).toBeInTheDocument();
    expect(screen.queryByText(/All Org 6/i)).toBeNull();

    const rowsPerPageDropdown = screen.getByLabelText(/rows per page/i);
    await userEvent.selectOptions(rowsPerPageDropdown, '10');
    await waitMs();

    expect(screen.getByText(/All Org 6/i)).toBeInTheDocument();
  });

  it('Debounce providing time to write', async () => {
    setItem('userId', TEST_USER_ID);
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

    await waitMs();

    const searchInput = screen.getByTestId('searchInput');
    await userEvent.type(searchInput, 'Deb');
    await waitMs(50);
    await userEvent.type(searchInput, 'ounce');
    await waitMs(50);
    await userEvent.type(searchInput, 'd Search');
    await waitMs(50);
    await userEvent.keyboard('{Enter}');
    await waitMs(50);
    expect(screen.getByText(/Debounced Search Org/i)).toBeInTheDocument();
    expect(screen.queryByText(/All Org 1/i)).not.toBeInTheDocument();
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
  const link = new StaticMockLink(MOCKS, true);
});

describe('Testing Organizations Edge/Node Data Structure', async () => {
  test('processes edge/node data structure correctly', async () => {
    const TEST_USER_NAME = 'Noble Mittal';

    beforeEach(() => {
      setItem('name', TEST_USER_NAME);
    });

    const EDGE_MOCK = {
      request: {
        query: USER_JOINED_ORGANIZATIONS_PG,
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
              edges: [
                {
                  node: {
                    __typename: 'Organization',
                    _id: '6401ff65ce8e8406b8f07af2',
                    image: '',
                    name: 'Test Edge Org',
                    description: 'Test Description',
                    address: {
                      city: 'Test City',
                      countryCode: '123',
                      postalCode: '456',
                      state: 'Test State',
                      dependentLocality: 'Test Locality',
                      line1: 'Test Line 1',
                      line2: 'Test Line 2',
                      sortingCode: '4567',
                    },
                    userRegistrationRequired: true,
                    members: [
                      {
                        _id: 'member1',
                        user: {
                          _id: getItem('userId'),
                        },
                      },
                    ],
                    admins: [],
                    membershipRequests: [],
                  },
                },
              ],
            },
          },
        },
      },
    };
    const linkWithEdge = new StaticMockLink([EDGE_MOCK], true);
    render(
      <MockedProvider addTypename={false} link={linkWithEdge}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Organizations />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    // Wait for loading state
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Wait for initial load and UI interactions
    await waitFor(
      () => {
        expect(screen.getByTestId('modeChangeBtn')).toBeInTheDocument();
      },
      { timeout: 2000 },
    );

    // Change mode to test edge/node data structure
    await userEvent.click(screen.getByTestId('modeChangeBtn'));
    await userEvent.click(screen.getByTestId('modeBtn0'));

    // Wait for the query to complete and data to be displayed
    await waitFor(
      () => {
        expect(screen.getByText('Test Edge Org')).toBeInTheDocument();
      },
      { timeout: 2000 },
    );
  });
});
