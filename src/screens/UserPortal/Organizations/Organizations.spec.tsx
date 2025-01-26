import { MockedProvider } from '@apollo/react-testing';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';

import userEvent from '@testing-library/user-event';
import {
  USER_CREATED_ORGANIZATIONS,
  USER_JOINED_ORGANIZATIONS,
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
const { getItem } = useLocalStorage();

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
                    firstName: 'John',
                    lastName: 'Doe',
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
            creator: { __typename: 'User', firstName: 'John', lastName: 'Doe' },
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
            creator: { __typename: 'User', firstName: 'John', lastName: 'Doe' },
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
                    firstName: 'John',
                    lastName: 'Doe',
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
            creator: { __typename: 'User', firstName: 'John', lastName: 'Doe' },
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
];
// Error mocks
const ERROR_MOCKS = [
  {
    request: {
      query: USER_ORGANIZATION_CONNECTION,
      variables: { filter: '' },
    },
    error: new Error('Failed to fetch organizations'),
  },
  {
    request: {
      query: USER_JOINED_ORGANIZATIONS,
      variables: { id: getItem('userId') },
    },
    error: new Error('Failed to fetch joined organizations'),
  },
];

// Empty data mocks
const EMPTY_MOCKS = [
  {
    request: {
      query: USER_ORGANIZATION_CONNECTION,
      variables: { filter: '' },
    },
    result: {
      data: {
        organizationsConnection: [],
      },
    },
  },
  {
    request: {
      query: USER_JOINED_ORGANIZATIONS,
      variables: { id: getItem('userId') },
    },
    result: {
      data: {
        users: [],
      },
    },
  },
];

// Loading state mock
const LOADING_MOCKS = [
  {
    request: {
      query: USER_ORGANIZATION_CONNECTION,
      variables: { filter: '' },
    },
    result: {
      data: {
        organizationsConnection: [],
      },
    },
    delay: 2000, // Simulates loading state
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

    await wait();
    const searchBtn = screen.getByTestId('searchBtn');
    userEvent.type(screen.getByTestId('searchInput'), '2{enter}');
    await wait();

    expect(screen.queryByText('anyOrganization2')).toBeInTheDocument();

    userEvent.clear(screen.getByTestId('searchInput'));
    userEvent.click(searchBtn);
    await wait();
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

    userEvent.click(screen.getByTestId('modeChangeBtn'));
    await wait();
    userEvent.click(screen.getByTestId('modeBtn1'));
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

    userEvent.click(screen.getByTestId('modeChangeBtn'));
    await wait();
    userEvent.click(screen.getByTestId('modeBtn2'));
    await wait();

    expect(screen.queryAllByText('createdOrganization')).not.toBe([]);
  });

  /**
   * Test case to check if the "Join Now" button renders correctly on the page.
   */

  test('Join Now button render correctly', async () => {
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

    // Assert "Join Now" button
    const joinNowButtons = screen.getAllByTestId('joinBtn');
    expect(joinNowButtons.length).toBeGreaterThan(0);
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

    userEvent.click(screen.getByTestId('modeChangeBtn'));
    await wait();
    userEvent.click(screen.getByTestId('modeBtn2'));
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
    userEvent.click(dropdown);
    expect(screen.queryByText('-1')).not.toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('All')).toBeInTheDocument();
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
  // New test cases
  test('handles pagination changes correctly', async () => {
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
    const rowsPerPageSelect = screen.getByTestId('table-pagination');
    fireEvent.change(rowsPerPageSelect, { target: { value: '10' } });
    expect(screen.getByText('10')).toBeInTheDocument();

    const nextPageButton = screen.getByLabelText('Go to next page');
    fireEvent.click(nextPageButton);
  });

  test('handles loading state correctly', async () => {
    const loadingLink = new StaticMockLink(LOADING_MOCKS, true);
    render(
      <MockedProvider addTypename={false} link={loadingLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Organizations />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('handles empty state correctly', async () => {
    const emptyLink = new StaticMockLink(EMPTY_MOCKS, true);
    render(
      <MockedProvider addTypename={false} link={emptyLink}>
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
    expect(screen.getByText('nothingToShow')).toBeInTheDocument();
  });

  test('handles error state correctly', async () => {
    const errorLink = new StaticMockLink(ERROR_MOCKS, true);
    render(
      <MockedProvider addTypename={false} link={errorLink}>
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
    expect(
      screen.getByText('Failed to fetch organizations'),
    ).toBeInTheDocument();
  });

  test('handles window resize events correctly', async () => {
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
    resizeWindow(1000);
    expect(screen.getByTestId('closeMenu')).toBeInTheDocument();
    resizeWindow(800);
    expect(screen.getByTestId('openMenu')).toBeInTheDocument();
  });
});
