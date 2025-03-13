// Organizations.test.tsx

import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { act } from 'react-dom/test-utils';

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

// Create mocks that match your new queries and data shapes
const mocks = [
  // 1. Mock for ALL_ORGANIZATIONS (mode=0)
  {
    request: {
      query: ALL_ORGANIZATIONS,
    },
    result: {
      data: {
        organizations: [
          {
            id: 'allOrgId1',
            name: 'All Org 1',
            addressLine1: 'Street 123',
            description: 'desc 1',
            avatarURL: null,
          },
          {
            id: 'allOrgId2',
            name: 'All Org 2',
            addressLine1: 'Street 234',
            description: 'desc 2',
            avatarURL: null,
          },
        ],
      },
    },
  },

  // 2. Mock for USER_JOINED_ORGANIZATIONS (mode=1)
  {
    request: {
      query: USER_JOINED_ORGANIZATIONS,
      variables: {
        id: TEST_USER_ID,
        first: 5, // same default used in Organizations.tsx
        filter: '', // same default used in Organizations.tsx
      },
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
                  image: null,
                  description: 'Joined Org Description',
                  admins: [],
                  members: [{ _id: TEST_USER_ID }],
                  address: {
                    city: 'Some City',
                    countryCode: 'XX',
                    line1: '123 Lane',
                    postalCode: '99999',
                    state: 'StateX',
                  },
                  // The new code extracts membershipRequestStatus, etc.
                  membershipRequestStatus: '',
                  userRegistrationRequired: false,
                  membershipRequests: [],
                  isJoined: true,
                },
              },
            ],
          },
        },
      },
    },
  },

  // 3. Mock for USER_CREATED_ORGANIZATIONS (mode=2)
  {
    request: {
      query: USER_CREATED_ORGANIZATIONS,
      variables: {
        id: TEST_USER_ID,
      },
    },
    result: {
      data: {
        user: {
          createdOrganizations: [
            {
              id: 'createdOrgId1',
              name: 'Created Org 1',
              description: 'Created Org Description',
              image: null,
              admins: [],
              members: [],
              address: {
                city: 'Creator City',
                countryCode: 'CC',
                line1: '999 Creator St',
                postalCode: '12345',
                state: 'CreatorState',
              },
              membershipRequestStatus: 'created',
              userRegistrationRequired: false,
              membershipRequests: [],
              isJoined: true,
            },
          ],
        },
      },
    },
  },

  // Mock for searching joined organizations with filter='2'
  {
    request: {
      query: USER_JOINED_ORGANIZATIONS,
      variables: {
        id: TEST_USER_ID,
        first: 5,
        filter: '2',
      },
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
                  image: null,
                  description: 'Joined Org Description 2',
                  admins: [],
                  members: [{ _id: TEST_USER_ID }],
                  address: {
                    city: 'City2',
                    countryCode: 'XX2',
                    line1: '456 Lane2',
                    postalCode: '88888',
                    state: 'StateY',
                  },
                  membershipRequestStatus: '',
                  userRegistrationRequired: false,
                  membershipRequests: [],
                  isJoined: true,
                },
              },
            ],
          },
        },
      },
    },
  },
];

// A small helper for time-based or asynchronous tests
async function wait(ms = 100) {
  await act(() => new Promise((resolve) => setTimeout(resolve, ms)));
}

describe('Organizations Screen Tests (Updated)', () => {
  beforeAll(() => {
    // Place userId in localStorage so the queries can pick it up
    setItem('userId', TEST_USER_ID);
  });

  afterAll(() => {
    // Clear your localStorage if needed
    // localStorage.clear();
  });

  test('Renders screen with default mode=0 (All Organizations)', async () => {
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

    // Wait for data load
    await wait();

    // The default mode in your code is 0 => "All Organizations"
    // So we should see organizations from the ALL_ORGANIZATIONS mock
    expect(await screen.findByText('All Org 1')).toBeInTheDocument();
    expect(screen.getByText('All Org 2')).toBeInTheDocument();

    // The heading from the code i.e. t('selectOrganization')
    // In English, it might appear as "Select Organization" or "My Organizations"
    // This depends on your translation. Adjust accordingly.
    expect(screen.getByText(/my organizations/i)).toBeInTheDocument();
  });

  test('Switch to Joined Organizations (mode=1)', async () => {
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

    await wait();

    // Open the mode dropdown
    const modeChangeBtn = screen.getByTestId('modeChangeBtn');
    await userEvent.click(modeChangeBtn);

    // modeBtn1 corresponds to joined organizations
    const joinedOrgsBtn = screen.getByTestId('modeBtn1');
    await userEvent.click(joinedOrgsBtn);

    // Wait for the joined org data to load
    await wait();

    // The mock for joined orgs returns "Joined Org 1" by default (filter='')
    expect(screen.getByText('Joined Org 1')).toBeInTheDocument();
  });

  test('Switch to Created Organizations (mode=2)', async () => {
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

    await wait();

    // Open the mode dropdown
    await userEvent.click(screen.getByTestId('modeChangeBtn'));

    // modeBtn2 corresponds to created organizations
    await userEvent.click(screen.getByTestId('modeBtn2'));

    await wait();

    // The mock returns "Created Org 1"
    expect(screen.getByText('Created Org 1')).toBeInTheDocument();
  });

  test('Sidebar opens and closes', async () => {
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

    // Wait for initial load
    await wait();

    // Check that the close menu button is in the document
    const closeMenuBtn = screen.getByTestId('closeMenu');
    expect(closeMenuBtn).toBeInTheDocument();

    // Close the sidebar
    fireEvent.click(closeMenuBtn);

    // Wait for the open menu button to appear
    await waitFor(() => {
      expect(screen.getByTestId('openMenu')).toBeInTheDocument();
    });

    // Re-open the sidebar
    fireEvent.click(screen.getByTestId('openMenu'));

    // The closeMenu should come back
    await waitFor(() => {
      expect(screen.getByTestId('closeMenu')).toBeInTheDocument();
    });
  });

  test('Rows per page dropdown displays expected values', async () => {
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

    await wait();

    // The paginationList component typically has a dropdown for rows per page
    // In your older tests, you used data-testid="table-pagination".
    // Make sure your new code has something similar or adjust the test ID accordingly.
    const paginationDropdown = screen.getByTestId('table-pagination');
    await userEvent.click(paginationDropdown);

    // Check the typical per-page options you used: 5, 10, 30, All
    expect(screen.queryByText('5')).toBeInTheDocument();
    expect(screen.queryByText('10')).toBeInTheDocument();
    expect(screen.queryByText('30')).toBeInTheDocument();
    expect(screen.queryByText('All')).toBeInTheDocument();
    // "All" presumably sets rowsPerPage to something like -1 or 9999
  });

  test('Search input has correct placeholder text', async () => {
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

    await wait();

    // In your code, the placeholder is t('searchOrganizations') => "Search Organization"
    // If your translation is different, adapt accordingly
    const searchInput = screen.getByPlaceholderText('Search Organization');
    expect(searchInput).toBeInTheDocument();
  });
});
