import { MockedProvider } from '@apollo/react-testing';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';

import userEvent from '@testing-library/user-event';
import {
  USER_CREATED_ORGANIZATIONS,
  USER_JOINED_ORGANIZATIONS,
  USER_JOINED_ORGANIZATIONS_PG,
  USER_ORGANIZATION_CONNECTION,
} from 'GraphQl/Queries/Queries';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18nForTest from 'utils/i18nForTest';
import useLocalStorage from 'utils/useLocalstorage';
import Organizations from './Organizations';
import React, { act } from 'react';
const { getItem, setItem } = useLocalStorage();
import '../../../style/app.module.css';
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
      query: USER_ORGANIZATION_CONNECTION,
      variables: {
        filter: '',
      },
    },
    result: {
      data: {
        organizationsConnection: [
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
              joinedOrganizations: [
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
      query: USER_ORGANIZATION_CONNECTION,
      variables: {
        filter: '2',
      },
    },
    result: {
      data: {
        organizationsConnection: [
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

/**
 * Custom Mock Link for handling static GraphQL mocks.
 */

const link = new StaticMockLink(MOCKS, true);

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

const resizeWindow = (width: number): void => {
  window.innerWidth = width;
  fireEvent(window, new Event('resize'));
};

describe('Testing Organizations Screen [User Portal]', () => {
  /**
   * Test to ensure the screen is rendered properly.
   */
  const TEST_USER_NAME = 'Noble Mittal';
  beforeEach(() => {
    setItem('name', TEST_USER_NAME);
  });
  test('Screen should be rendered properly', async () => {
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
    await wait();
    await userEvent.click(screen.getByTestId('modeBtn2'));
    await wait();

    expect(screen.queryAllByText('createdOrganization')).not.toBe([]);
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
  test('Rows per Page values', async () => {
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
    const dropdown = screen.getByTestId('table-pagination');
    await userEvent.click(dropdown);
    expect(screen.queryByText('-1')).not.toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('All')).toBeInTheDocument();
  });

  test('handles organizationsWhereMember edges data structure correctly', async () => {
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

    // Change to mode 0 (all organizations) to trigger the edges mapping code
    await userEvent.click(screen.getByTestId('modeChangeBtn'));
    await wait();
    await userEvent.click(screen.getByTestId('modeBtn0'));
    await wait();

    // Verify the organization from edges structure is rendered
    expect(screen.getByText('Test Edge Org')).toBeInTheDocument();

    // Verify membership status is correctly set
    const orgCard = screen
      .getByText('Test Edge Org')
      .closest('.organization-card');
    expect(orgCard).toHaveAttribute('data-membership-status', 'accepted');
  });

  // Add test for edge cases
  test('handles empty organizationsWhereMember edges correctly', async () => {
    const emptyEdgesMock = {
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
                  edges: [],
                },
              },
            },
          ],
        },
      },
    };

    const customLink = new StaticMockLink([emptyEdgesMock], true);

    render(
      <MockedProvider addTypename={false} link={customLink}>
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

    // Switch to all organizations mode
    await userEvent.click(screen.getByTestId('modeChangeBtn'));
    await wait();
    await userEvent.click(screen.getByTestId('modeBtn0'));
    await wait();

    // Verify empty state is handled
    expect(screen.getByText('nothingToShow')).toBeInTheDocument();
  });

  test('Search input has correct placeholder text', async () => {
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

    const searchInput = screen.getByPlaceholderText('Search Organization');
    expect(searchInput).toBeInTheDocument();
  });
});
