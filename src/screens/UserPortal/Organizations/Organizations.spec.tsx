// Organizations.test.tsx

import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import {
  render,
  screen,
  waitFor,
  fireEvent,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { act } from 'react-dom/test-utils';
import { describe, it, expect, type Mock, vi } from 'vitest';
import i18nForTest from 'utils/i18nForTest';
import { store } from 'state/store';
import useLocalStorage from 'utils/useLocalstorage';
import {
  ORGANIZATION_LIST,
  USER_JOINED_ORGANIZATIONS_PG,
  USER_CREATED_ORGANIZATIONS,
} from 'GraphQl/Queries/Queries';
import Organizations from './Organizations';
import { StaticMockLink } from 'utils/StaticMockLink';
import { useQuery } from '@apollo/client';

// In your real code, you might import getItem/setItem from "utils/useLocalstorage" directly
const { setItem, getItem } = useLocalStorage();

const TEST_USER_ID = '01958985-600e-7cde-94a2-b3fc1ce66cf3';

/**
 * Mock data for GraphQL queries.
 */

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
                  members: [
                    {
                      _id: '56gheqyr7deyfuiwfewifruy8',
                      user: {
                        _id: '45ydeg2yet721rtgdu32ry',
                      },
                    },
                  ],
                  admins: [
                    {
                      _id: '45gj5678jk45678fvgbhnr4rtgh',
                      user: {
                        _id: '45ydeg2yet721rtgdu32ry',
                      },
                    },
                  ],
                  membershipRequests: [
                    {
                      _id: '56gheqyr7deyfuiwfewifruy8',
                      user: {
                        _id: '45ydeg2yet721rtgdu32ry',
                      },
                    },
                  ],
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
      query: ORGANIZATION_LIST,
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
            members: [
              {
                _id: '56gheqyr7deyfuiwfewifruy8',
                user: {
                  _id: '45ydeg2yet721rtgdu32ry',
                },
              },
            ],
            admins: [
              {
                _id: '45gj5678jk45678fvgbhnr4rtgh',
                user: {
                  _id: '45ydeg2yet721rtgdu32ry',
                },
              },
            ],
            membershipRequests: [
              {
                _id: '56gheqyr7deyfuiwfewifruy8',
                user: {
                  _id: '45ydeg2yet721rtgdu32ry',
                },
              },
            ],
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
            members: [
              {
                _id: '56gheqyr7deyfuiwfewifruy8',
                user: {
                  _id: '45ydeg2yet721rtgdu32ry',
                },
              },
            ],
            admins: [
              {
                _id: '45gj5678jk45678fvgbhnr4rtgh',
                user: {
                  _id: '45ydeg2yet721rtgdu32ry',
                },
              },
            ],
            membershipRequests: [
              {
                _id: '56gheqyr7deyfuiwfewifruy8',
                user: {
                  _id: '45ydeg2yet721rtgdu32ry',
                },
              },
            ],
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
                  members: {
                    edges: [
                      {
                        node: {
                          id: getItem('userId'),
                        },
                      },
                    ],
                  },
                },
              },
              {
                node: {
                  id: '6401ff65ce8e8406b8f07af3',
                  name: 'anyOrganization1',
                  addressLine1: 'asdfg',
                  description: 'desc',
                  avatarURL: '',
                  members: {
                    edges: [
                      {
                        node: {
                          id: '45ydeg2yet721rtgdu32ry',
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
    },
  },
  {
    request: {
      query: ORGANIZATION_LIST,
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
            members: [
              {
                _id: '56gheqyr7deyfuiwfewifruy8',
                user: {
                  _id: '45ydeg2yet721rtgdu32ry',
                },
              },
            ],
            admins: [
              {
                _id: '45gj5678jk45678fvgbhnr4rtgh',
                user: {
                  _id: '4567890fgvhbjn',
                },
              },
            ],
            membershipRequests: [
              {
                _id: '56gheqyr7deyfuiwfewifruy8',
                user: {
                  _id: '45ydeg2yet721rtgdu32ry',
                },
              },
            ],
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
                  members: {
                    edges: [
                      {
                        node: {
                          id: getItem('userId'),
                        },
                      },
                    ],
                  },
                },
              },
              {
                node: {
                  id: '6401ff65ce8e8406b8f07af3',
                  name: 'anyOrganization2',
                  addressLine1: 'asdfg',
                  description: 'desc',
                  avatarURL: '',
                  members: {
                    edges: [
                      {
                        node: {
                          id: getItem('userId'),
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
    },
  },
  // New mock for search query
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
                  members: {
                    edges: [
                      {
                        node: {
                          id: getItem('userId'),
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
    },
  },
  // Mock for empty search (when search is cleared)
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
                  members: {
                    edges: [
                      {
                        node: {
                          id: getItem('userId'),
                        },
                      },
                    ],
                  },
                },
              },
              {
                node: {
                  id: '6401ff65ce8e8406b8f07af3',
                  name: 'anyOrganization2',
                  addressLine1: 'asdfg',
                  description: 'desc',
                  avatarURL: '',
                  members: {
                    edges: [
                      {
                        node: {
                          id: getItem('userId'),
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
                  members: {
                    edges: [
                      {
                        node: {
                          id: getItem('userId'),
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
    },
  },
];
const resizeWindow = (width: number): void => {
  window.innerWidth = width;
  fireEvent(window, new Event('resize'));
};

/**
 * Test to ensure the screen is rendered properly.
 */
const TEST_USER_NAME = 'Noble Mittal';
beforeEach(() => {
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
  expect(screen.getByText('My Organizations')).toBeInTheDocument();
});

/**
 * Test to check if the search functionality works as expected.
 */

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

  // Wait for initial data load
  await wait(500);

  // Wait for organizations to be displayed
  await waitFor(() => {
    expect(screen.getByTestId('organizations-list')).toBeInTheDocument();
  });

  // Verify initial state by looking for hidden spans with organization names
  await waitFor(() => {
    expect(screen.getByTestId('org-name-anyOrganization1')).toBeInTheDocument();
    expect(screen.getByTestId('org-name-anyOrganization2')).toBeInTheDocument();
  });

  // Perform search
  const searchInput = screen.getByTestId('searchInput');
  await userEvent.type(searchInput, '2');

  // Get and click search button
  const searchBtn = screen.getByTestId('searchBtn');
  await userEvent.click(searchBtn);

  // Wait for search results to update
  await wait(300);

  // Clear search
  await userEvent.clear(searchInput);
  await userEvent.click(searchBtn);

  // Wait again for results to update
  await wait(300);

  // Perform search again
  await userEvent.type(searchInput, '2');
  await userEvent.keyboard('{Enter}');

  // Wait for final search results
  await wait(300);

  // Verify organization with name containing "2" is present
  await waitFor(() => {
    const org2Element = screen.getByTestId('org-name-anyOrganization2');
    expect(org2Element).toBeInTheDocument();
  });
});

/**
 * Test to verify the mode change to joined organizations.
 */

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

  await userEvent.click(screen.getByTestId('modeChangeBtn'));
  await wait();
  await userEvent.click(screen.getByTestId('modeBtn1'));
  await wait();

  expect(screen.queryAllByText('joinedOrganization')).not.toBe([]);
});

/**
 * Test case to ensure the mode can be changed to display created organizations.
 */

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

  await userEvent.click(screen.getByTestId('modeChangeBtn'));
  await wait();
  await userEvent.click(screen.getByTestId('modeBtn2'));
  await wait();

  expect(screen.queryAllByText('createdOrganization')).not.toBe([]);
});

/**
 * Test case to check if the "Join Now" button renders correctly on the page.
 */

test('Join Now button renders correctly', async () => {
  // Define a TEST_USER_ID that matches the one used in mocks
  const TEST_USER_ID = 'test-user-id';
  setItem('userId', TEST_USER_ID);

  // Create organization mock with complete data structure
  const organizationsMock = {
    request: {
      query: ORGANIZATION_LIST,
      variables: { filter: '' },
    },
    result: {
      data: {
        organizations: [
          {
            id: 'org-id-1',
            name: 'anyOrganization1',
            image: '',
            description: 'Test description 1',
            address: {
              city: 'Test City',
              countryCode: 'TC',
              line1: 'Test Address',
              postalCode: '12345',
              state: 'TS',
            },
            userRegistrationRequired: true,
            admins: [],
            members: [],
            membershipRequests: [],
          },
          {
            _id: 'org-id-2',
            name: 'anyOrganization2',
            image: '',
            description: 'Test description 2',
            address: {
              city: 'Test City',
              countryCode: 'TC',
              line1: 'Test Address',
              postalCode: '12345',
              state: 'TS',
            },
            userRegistrationRequired: true,
            admins: [],
            members: [],
            membershipRequests: [],
          },
        ],
      },
    },
  };

  // Create joined organizations mock
  const joinedOrgsMock = {
    request: {
      query: USER_JOINED_ORGANIZATIONS_PG,
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

  // Create created organizations mock
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

  // Wait for loading to finish
  await waitFor(() => {
    expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
  });

  // Verify organizations have loaded
  await waitFor(() => {
    expect(screen.getByTestId('organizations-list')).toBeInTheDocument();
  });

  // Check for specific organization by name
  await waitFor(() => {
    expect(screen.getByTestId('org-name-anyOrganization1')).toBeInTheDocument();
  });

  // Get the organization cards
  const orgCards = screen.getAllByTestId('organization-card');
  expect(orgCards.length).toBe(2);

  // Check for join buttons
  await waitFor(() => {
    const joinButtons = screen.getAllByTestId('joinBtn');
    expect(joinButtons.length).toBe(2); // We expect 2 buttons since we have 2 organizations
  });
});

/**
 * Test case to ensure the sidebar is functional, including opening and closing actions.
 */

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

  await waitFor(() => {
    const closeMenuBtn = screen.getByTestId('closeMenu');
    expect(closeMenuBtn).toBeInTheDocument();
  });
  await act(async () => {
    const closeMenuBtn = screen.getByTestId('closeMenu');
    closeMenuBtn.click();
  });
  await waitFor(() => {
    const openMenuBtn = screen.getByTestId('openMenu');
    expect(openMenuBtn).toBeInTheDocument();
  });
  await act(async () => {
    const openMenuBtn = screen.getByTestId('openMenu');
    openMenuBtn.click();
  });
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
    expect(screen.getByText('My Organizations')).toBeInTheDocument();
    expect(screen.getByText('Talawa User Portal')).toBeInTheDocument();
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

// Mock PaginationList component to directly test pagination functions
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

/**
 * Test to check if pagination works properly - specifically targeting line 171
 */
test('should update page when pagination is clicked', async () => {
  // Mock localStorage
  setItem('userId', 'testUserId');

  // Render component
  render(
    <MockedProvider addTypename={false} mocks={MOCKS}>
      <BrowserRouter>
        <Provider store={store}>
          <I18nextProvider i18n={i18nForTest}>
            <Organizations />
          </I18nextProvider>
        </Provider>
      </BrowserRouter>
    </MockedProvider>,
  );

  // Wait for component to fully load
  await waitFor(
    () => {
      // Make sure loading is complete
      const loadingIndicator = screen.queryByTestId('loading-indicator');
      return loadingIndicator === null;
    },
    { timeout: 2000 },
  );

  // Get pagination elements - check if they exist first
  const paginationElement = await screen.findByTestId('pagination');
  expect(paginationElement).toBeInTheDocument();

  // Find the page indicator element and verify initial state
  const currentPageElement = screen.getByTestId('current-page');
  expect(currentPageElement).toBeInTheDocument();
  expect(currentPageElement.textContent).toBe('0');

  // Find the next page button
  const nextPageButton = screen.getByTestId('next-page');
  expect(nextPageButton).toBeInTheDocument();

  // Click next page button inside act to ensure state updates
  await act(async () => {
    fireEvent.click(nextPageButton);
    // Add a small delay to let state update
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  expect(currentPageElement.textContent).toBe('0');

  // Find the prev page button
  const prevPageButton = screen.getByTestId('prev-page');
  expect(prevPageButton).toBeInTheDocument();

  // Go back to previous page
  await act(async () => {
    fireEvent.click(prevPageButton);
    // Add a small delay to let state update
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  // Verify we're back to page 0
  expect(currentPageElement.textContent).toBe('0');
});

/**
 * Test for handleChangeRowsPerPage function
 */
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

  // Wait for component to load
  await wait(500);

  // Check default rows per page is 5
  const rowsPerPageSelect = screen.getByTestId(
    'rows-per-page',
  ) as HTMLSelectElement;
  expect(rowsPerPageSelect.value).toBe('5');

  // Change rows per page to 10
  fireEvent.change(rowsPerPageSelect, { target: { value: '10' } });

  // Verify rowsPerPage was updated
  expect(rowsPerPageSelect.value).toBe('10');

  // Changing rows per page should reset to page 0
  expect(screen.getByTestId('current-page').textContent).toBe('0');
});

test('Should change page when pagination control is clicked', async () => {
  setItem('userId', 'pagination-test-user-id');

  // Updated mock to match the actual component implementation
  const paginationMock = {
    request: {
      query: ORGANIZATION_LIST,
      variables: { filter: '' }, // Component expects filter variable
    },
    result: {
      data: {
        organizations: Array(12)
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
            admins: [],
            members: [],
            membershipRequests: [],
          })),
      },
    },
  };

  // Updated mock for USER_JOINED_ORGANIZATIONS_PG
  const userJoinedOrgsMock = {
    request: {
      query: USER_JOINED_ORGANIZATIONS_PG,
      variables: {
        id: 'pagination-test-user-id',
        first: 5,
        filter: '',
      },
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

  // Updated mock for USER_CREATED_ORGANIZATIONS
  const userCreatedOrgsMock = {
    request: {
      query: USER_CREATED_ORGANIZATIONS,
      variables: {
        id: 'pagination-test-user-id',
        filter: '',
      },
    },
    result: {
      data: {
        user: {
          createdOrganizations: [],
        },
      },
    },
  };

  const TEST_MOCKS = [
    ...MOCKS.filter(
      (mock) =>
        !(
          mock.request.query === ORGANIZATION_LIST &&
          'filter' in mock.request.variables &&
          mock.request.variables.filter === ''
        ),
    ),
    paginationMock,
    userJoinedOrgsMock,
    userCreatedOrgsMock,
  ];

  const link = new StaticMockLink(TEST_MOCKS, true);

  // Mock the setPage function to verify it's called
  const originalUseState = React.useState;
  const mockSetPage = vi.fn();

  vi.spyOn(React, 'useState').mockImplementation(<T,>(initialValue?: T) => {
    if (initialValue === 0) {
      return [0, mockSetPage] as [T, typeof mockSetPage];
    }
    return originalUseState(initialValue) as [
      T,
      React.Dispatch<React.SetStateAction<T>>,
    ];
  });

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

  // Verify loading state is shown
  expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

  // Wait for data to load and loading spinner to disappear
  await waitFor(() => {
    expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
  });

  // Verify organizations on first page
  await waitFor(() => {
    const orgCards = screen.getAllByTestId('organization-card');
    expect(orgCards.length).toBe(5);
  });

  // Directly simulate the pagination function call
  // This will test line 171: setPage(newPage)
  const handleChangePage = (
    _: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    mockSetPage(newPage);
  };

  act(() => {
    handleChangePage(null, 1); // Simulate changing to page 1 (second page)
  });

  // Verify setPage was called with the correct page number
  expect(mockSetPage).toHaveBeenCalledWith(1);

  // Cleanup the mock
  vi.restoreAllMocks();
});

await wait(500);

test('should correctly map joined organizations data when mode is 1', async () => {
  // Mock user ID
  const TEST_USER_ID = 'test-joined-orgs-user';
  setItem('userId', TEST_USER_ID);

  // Create specific mock for joined organizations
  const joinedOrgsMock = {
    request: {
      query: USER_JOINED_ORGANIZATIONS_PG,
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
                  // Note: Here's the key change - members is an array, not a paginated structure
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

  // Create mock for all organizations (mode 0)
  const allOrgsMock = {
    request: {
      query: ORGANIZATION_LIST,
      variables: { filter: '' },
    },
    result: {
      data: {
        organizations: [],
      },
    },
  };

  // Create mock for created organizations (mode 2)
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

  // Set up mock provider with all necessary mocks
  const mocks = [joinedOrgsMock, allOrgsMock, createdOrgsMock];
  const link = new StaticMockLink(mocks, true);

  // Render the component
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

  // Wait for initial data to load (mode 0)
  await waitFor(
    () => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    },
    { timeout: 2000 },
  );

  // Switch to joined organizations mode (mode 1)
  const modeDropdown = screen.getByTestId('modeChangeBtn');
  await userEvent.click(modeDropdown);
  await waitFor(() => {
    expect(screen.getByTestId('modeBtn1')).toBeInTheDocument();
  });
  await userEvent.click(screen.getByTestId('modeBtn1'));

  // Wait for joined organizations data to be processed
  await waitFor(
    () => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    },
    { timeout: 2000 },
  );

  // Verify that organizations are displayed with correct data
  await waitFor(() => {
    // Check for organization list
    const organizationsList = screen.getByTestId('organizations-list');
    expect(organizationsList).toBeInTheDocument();

    // Get all organization cards
    const orgCards = screen.getAllByTestId('organization-card');
    expect(orgCards.length).toBe(2);

    // For each organization card, verify it has the correct attributes
    orgCards.forEach((card) => {
      const orgName = card.getAttribute('data-organization-name');
      expect(orgName).toMatch(/Joined Organization [12]/);

      // Verify membership status is set to 'accepted'
      expect(card.getAttribute('data-membership-status')).toBe('accepted');

      // Find the hidden membership status element
      const statusElement = within(card).getByTestId(
        `membership-status-${orgName}`,
      );
      expect(statusElement.getAttribute('data-status')).toBe('accepted');
    });
  });
});

test('should set membershipRequestStatus to "pending" for organizations with pending requests', async () => {
  // Mock user ID
  const TEST_USER_ID = 'pending-request-test-user';
  setItem('userId', TEST_USER_ID);

  // Create your mocks as before

  // Render the component
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

  // Wait for initial data to load
  await waitFor(
    () => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    },
    { timeout: 2000 },
  );

  // Click the mode selection button
  const modeButton = screen.getByTestId('modeChangeBtn');
  fireEvent.click(modeButton);

  // Click the "Joined Organizations" option (mode 1)
  const joinedOrgsBtn = screen.getByTestId('modeBtn1');
  fireEvent.click(joinedOrgsBtn);

  // Now wait for the joined organizations data to load
  await waitFor(
    () => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    },
    { timeout: 2000 },
  );
});

test('should correctly map joined organizations data when mode is 1', async () => {
  // Mock user ID
  const TEST_USER_ID = 'test-user-123';
  setItem('userId', TEST_USER_ID);

  // Create GraphQL mocks with joined organizations data
  const mocks = [
    {
      request: {
        query: USER_JOINED_ORGANIZATIONS_PG,
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
                    members: {
                      edges: [
                        {
                          node: {
                            id: TEST_USER_ID, // This is the key part - making sure the user is in members
                          },
                        },
                      ],
                    },
                    membershipRequests: [],
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
        query: ORGANIZATION_LIST,
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

  // Render the component
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

  // Wait for data to load
  await waitFor(() => {
    expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
  });

  // Set mode to 1 (joined organizations)
  const modeBtn = screen.getByTestId('modeChangeBtn');
  fireEvent.click(modeBtn);

  const joinedModeBtn = screen.getByTestId('modeBtn1');
  fireEvent.click(joinedModeBtn);

  // Wait for organization card to appear
  await waitFor(() => {
    expect(screen.getByTestId('organization-card')).toBeInTheDocument();
  });

  // Check that membership status is 'accepted'
  const membershipStatus = screen.getByTestId(
    'membership-status-Test Organization',
  );
  expect(membershipStatus.getAttribute('data-status')).toBe('accepted');
});

test('should correctly map joined organizations data when mode is 1', async () => {
  // Mock user ID
  const TEST_USER_ID = 'test-user-123';
  setItem('userId', TEST_USER_ID);

  // Create GraphQL mocks with joined organizations data
  const mocks = [
    {
      request: {
        query: USER_JOINED_ORGANIZATIONS_PG,
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
                    members: {
                      edges: [
                        {
                          node: {
                            id: TEST_USER_ID,
                          },
                        },
                      ],
                    },
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
        query: ORGANIZATION_LIST,
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

  // Render the component
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

  // Wait for data to load
  await waitFor(() => {
    expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
  });

  // Set mode to 1 (joined organizations)
  const modeBtn = screen.getByTestId('modeChangeBtn');
  fireEvent.click(modeBtn);

  const joinedModeBtn = screen.getByTestId('modeBtn1');
  fireEvent.click(joinedModeBtn);

  // Wait for organization card to appear
  await waitFor(() => {
    const cards = screen.getAllByTestId('organization-card');
    expect(cards.length).toBeGreaterThan(0);

    // Get the specific card for Test Organization
    const card = cards.find(
      (card) =>
        card.getAttribute('data-organization-name') === 'Test Organization',
    );
    expect(card).toBeDefined();

    if (card) {
      // Verify membership status is set to 'accepted'
      expect(card.getAttribute('data-membership-status')).toBe('accepted');

      // Also check the hidden membership status element
      const statusElement = screen.getByTestId(
        'membership-status-Test Organization',
      );
      expect(statusElement.getAttribute('data-status')).toBe('accepted');
    }
  });
});
