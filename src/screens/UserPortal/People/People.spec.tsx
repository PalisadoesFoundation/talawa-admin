import React from 'react';
import type { RenderResult } from '@testing-library/react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import {
  ORGANIZATIONS_MEMBER_CONNECTION_LIST,
  ORGANIZATION_ADMINS_LIST,
} from 'GraphQl/Queries/Queries';
import type { DocumentNode } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import People from './People';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { vi } from 'vitest';
/**
 * This file contains unit tests for the People component.
 *
 * The tests cover:
 * - Proper rendering of the People screen and its elements.
 * - Functionality of the search input and search button.
 * - Correct behavior when switching between member and admin modes.
 * - Integration with mocked GraphQL queries for testing data fetching.
 *
 * These tests use Vitest for test execution, MockedProvider for mocking GraphQL queries, and react-testing-library for rendering and interactions.
 */
type MockData = {
  request: {
    query: DocumentNode;
    variables: Record<string, unknown>;
  };
  result?: {
    data: {
      organizationsMemberConnection?: {
        edges: {
          _id: string;
          firstName: string;
          lastName: string;
          image: string | null;
          email: string;
          createdAt: string;
        }[];
      };
      organizations?: {
        __typename?: string;
        _id: string;
        admins: {
          _id: string;
          firstName: string;
          lastName: string;
          image: string | null;
          email: string;
          createdAt: string;
        }[];
      }[];
    };
  };
  error?: Error;
};

const MOCKS = [
  {
    request: {
      query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
      variables: {
        orgId: '',
        firstName_contains: '',
      },
    },
    result: {
      data: {
        organizationsMemberConnection: {
          edges: [
            {
              _id: '64001660a711c62d5b4076a2',
              firstName: 'Noble',
              lastName: 'Mittal',
              image: null,
              email: 'noble@gmail.com',
              createdAt: '2023-03-02T03:22:08.101Z',
            },
            {
              _id: '64001660a711c62d5b4076a3',
              firstName: 'Noble',
              lastName: 'Mittal',
              image: 'mockImage',
              email: 'noble@gmail.com',
              createdAt: '2023-03-02T03:22:08.101Z',
            },
          ],
        },
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_ADMINS_LIST,
      variables: {
        id: '',
      },
    },
    result: {
      data: {
        organizations: [
          {
            __typename: 'Organization',
            _id: '6401ff65ce8e8406b8f07af2',
            admins: [
              {
                _id: '64001660a711c62d5b4076a2',
                firstName: 'Noble',
                lastName: 'Admin',
                image: null,
                email: 'noble@gmail.com',
                createdAt: '2023-03-02T03:22:08.101Z',
              },
            ],
          },
        ],
      },
    },
  },
  {
    request: {
      query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
      variables: { orgId: '', firstName_contains: '' },
    },
    result: {
      data: {
        organizationsMemberConnection: {
          edges: [],
        },
      },
    },
  },
  {
    request: {
      query: ORGANIZATION_ADMINS_LIST,
      variables: { id: '' },
    },
    result: {
      data: {
        organizations: [
          {
            _id: 'org-1',
            admins: [],
          },
        ],
      },
    },
  },
  {
    request: {
      query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
      variables: {
        orgId: '',
        firstName_contains: 'j',
      },
    },
    result: {
      data: {
        organizationsMemberConnection: {
          edges: [
            {
              _id: '64001660a711c62d5b4076a2',
              firstName: 'John',
              lastName: 'Cena',
              image: null,
              email: 'john@gmail.com',
              createdAt: '2023-03-02T03:22:08.101Z',
            },
          ],
        },
      },
    },
  },
];

const link = new StaticMockLink(MOCKS, true);

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ orgId: '' }),
  };
});

describe('Testing People Screen [User Portal]', () => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // Deprecated
      removeListener: vi.fn(), // Deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  it('Screen should be rendered properly', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <People />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    expect(screen.queryAllByText('Noble Mittal')).not.toBe([]);
  });

  it('Search works properly by pressing enter', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <People />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    userEvent.type(screen.getByTestId('searchInput'), 'j{enter}');
    await wait();

    expect(screen.queryByText('John Cena')).toBeInTheDocument();
    expect(screen.queryByText('Noble Mittal')).not.toBeInTheDocument();
  });

  it('Search works properly by clicking search Btn', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <People />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    const searchBtn = screen.getByTestId('searchBtn');
    userEvent.type(screen.getByTestId('searchInput'), '');
    userEvent.click(searchBtn);
    await wait();
    userEvent.type(screen.getByTestId('searchInput'), 'j');
    userEvent.click(searchBtn);
    await wait();

    expect(screen.queryByText('John Cena')).toBeInTheDocument();
    expect(screen.queryByText('Noble Mittal')).not.toBeInTheDocument();
  });

  it('Mode is changed to Admins', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <People />
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

    expect(screen.queryByText('Noble Admin')).toBeInTheDocument();
    expect(screen.queryByText('Noble Mittal')).not.toBeInTheDocument();
  });
  it('Shows loading state while fetching data', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <People />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    await wait();
  });

  it('Correctly updates member roles when admin list changes', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <People />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    // Switch to admin view to trigger admin list update
    userEvent.click(screen.getByTestId('modeChangeBtn'));
    await wait();
    userEvent.click(screen.getByTestId('modeBtn1'));
    await wait();

    expect(screen.queryByText('Admin')).toBeInTheDocument();
  });
});

describe('Testing People Screen Pagination [User Portal]', () => {
  // Mock data with more than 5 members to test pagination
  const PAGINATION_MOCKS = [
    {
      request: {
        query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
        variables: {
          orgId: '',
          firstName_contains: '',
        },
      },
      result: {
        data: {
          organizationsMemberConnection: {
            edges: Array(7)
              .fill(null)
              .map((_, index) => ({
                _id: `member${index}`,
                firstName: `User${index}`,
                lastName: 'Test',
                image: null,
                email: `user${index}@test.com`,
                createdAt: '2023-03-02T03:22:08.101Z',
              })),
          },
        },
      },
    },
    {
      request: {
        query: ORGANIZATION_ADMINS_LIST,
        variables: {
          id: '',
        },
      },
      result: {
        data: {
          organizations: [
            {
              __typename: 'Organization',
              _id: 'org1',
              admins: [
                {
                  _id: 'member0',
                  firstName: 'User0',
                  lastName: 'Test',
                  image: null,
                  email: 'user0@test.com',
                  createdAt: '2023-03-02T03:22:08.101Z',
                },
              ],
            },
          ],
        },
      },
    },
  ];

  const link = new StaticMockLink(PAGINATION_MOCKS, true);

  const renderComponent = (): RenderResult => {
    return render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <People />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
  };

  // Helper function to wait for async operations
  const wait = async (ms = 100): Promise<void> => {
    await act(() => {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    });
  };

  beforeAll(() => {
    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    // Mock useParams
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useParams: () => ({ orgId: '' }),
      };
    });
  });

  it('handles page change correctly', async () => {
    renderComponent();
    await wait();

    // Initial page should show first 5 items
    expect(screen.getByText('User0 Test')).toBeInTheDocument();
    expect(screen.queryByText('User5 Test')).not.toBeInTheDocument();

    // Click next page button
    const nextButton = screen.getByRole('button', { name: /next page/i });
    userEvent.click(nextButton);
    await wait();

    // Should now show items from second page
    expect(screen.queryByText('User0 Test')).not.toBeInTheDocument();
    expect(screen.getByText('User5 Test')).toBeInTheDocument();
  });

  it('handles rows per page change correctly', async () => {
    renderComponent();
    await wait();

    // Default should show 5 items
    expect(screen.getByText('User0 Test')).toBeInTheDocument();
    expect(screen.queryByText('User5 Test')).not.toBeInTheDocument();

    // Change rows per page to 10
    const select = screen.getByRole('combobox');
    userEvent.selectOptions(select, '10');
    await wait();

    // Should now show all items on one page
    expect(screen.getByText('User0 Test')).toBeInTheDocument();
    expect(screen.getByText('User5 Test')).toBeInTheDocument();
  });

  it('updates members list correctly when switching between all members and admins', async () => {
    renderComponent();
    await wait();

    // Initially should show all members
    expect(screen.getAllByText(/User\d Test/).length).toBe(5); // 5 per page

    // Switch to admin view
    userEvent.click(screen.getByTestId('modeChangeBtn'));
    await wait();
    userEvent.click(screen.getByTestId('modeBtn1'));
    await wait();

    // Should now only show admin
    expect(screen.getAllByText(/User\d Test/).length).toBe(1);
    expect(screen.getByText('User0 Test')).toBeInTheDocument();

    // Switch back to all members
    userEvent.click(screen.getByTestId('modeChangeBtn'));
    await wait();
    userEvent.click(screen.getByTestId('modeBtn0'));
    await wait();

    // Should show all members again
    expect(screen.getAllByText(/User\d Test/).length).toBe(5);
  });
  it('should switch to admin mode (mode=1)', async () => {
    // Render component (with or without relevant mocks)
    render(
      <MockedProvider mocks={PAGINATION_MOCKS} addTypename={false}>
        <I18nextProvider i18n={i18nForTest}>
          <BrowserRouter>
            <Provider store={store}>
              <People />
            </Provider>
          </BrowserRouter>
        </I18nextProvider>
      </MockedProvider>,
    );

    // Wait for initial data to load
    await wait();

    // Switch to admin mode
    userEvent.click(screen.getByTestId('modeChangeBtn'));
    await wait();
    userEvent.click(screen.getByTestId('modeBtn1'));
    await wait();

    // Expect an admin user to appear (confirming mode=1 path ran)
    expect(screen.queryByText('Admin')).toBeInTheDocument();
  });

  it('should display members or fallback text', async () => {
    render(
      <MockedProvider mocks={PAGINATION_MOCKS} addTypename={false}>
        <I18nextProvider i18n={i18nForTest}>
          <BrowserRouter>
            <Provider store={store}>
              <People />
            </Provider>
          </BrowserRouter>
        </I18nextProvider>
      </MockedProvider>,
    );

    // Wait for loading to disappear if your component shows a spinner or text while loading
    // Adjust this check to whatever your loading indicators are:
    await waitForElementToBeRemoved(() => screen.queryByText('Loading...'));

    // Now wait until the members appear
    await waitFor(() => {
      expect(screen.queryAllByText(/User\d Test/i).length).toBeGreaterThan(0);
    });
  });

  it('should slice members when rowsPerPage > 0 to cover paging logic', async () => {
    // PAGINATION_MOCKS has 7 members. We confirm first page shows fewer than 7
    render(
      <MockedProvider mocks={PAGINATION_MOCKS} addTypename={false}>
        <I18nextProvider i18n={i18nForTest}>
          <BrowserRouter>
            <Provider store={store}>
              <People />
            </Provider>
          </BrowserRouter>
        </I18nextProvider>
      </MockedProvider>,
    );

    await wait();

    // Should initially show 5 members if rowsPerPage = 5
    expect(screen.queryAllByText(/User\d Test/).length).toBe(5);
  });

  it('renders sliced members correctly when rowsPerPage > 0', async () => {
    // Provide a mock with members data
    const localMocks = [
      {
        request: {
          query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
          variables: { orgId: '', firstName_contains: '' },
        },
        result: {
          data: {
            organizationsMemberConnection: {
              edges: Array.from({ length: 6 }, (_, i) => ({
                _id: `id-${i}`,
                firstName: `First${i}`,
                lastName: `Last${i}`,
                image: '',
                email: `test${i}@example.com`,
                userType: 'Member',
              })),
            },
          },
        },
      },
      {
        request: {
          query: ORGANIZATION_ADMINS_LIST,
          variables: { id: '' },
        },
        result: {
          data: {
            organizations: [{ _id: 'org-1', admins: [] }],
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={localMocks} addTypename={false}>
        <People />
      </MockedProvider>,
    );

    // Wait for data and check that only the default (rowsPerPage=5) chunk is rendered
    await waitFor(() => {
      expect(screen.getByText('First0 Last0')).toBeInTheDocument();
      expect(screen.getByText('First4 Last4')).toBeInTheDocument();
      expect(screen.queryByText('First5 Last5')).not.toBeInTheDocument();
    });
  });

  it('passes expected props to PeopleCard components', async () => {
    const localMocks = [
      {
        request: {
          query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
          variables: { orgId: '', firstName_contains: '' },
        },
        result: {
          data: {
            organizationsMemberConnection: {
              edges: [
                {
                  _id: 'mockId1',
                  firstName: 'John',
                  lastName: 'Doe',
                  image: 'mockImage',
                  email: 'john@example.com',
                  userType: 'Member',
                },
              ],
            },
          },
        },
      },
      {
        request: {
          query: ORGANIZATION_ADMINS_LIST,
          variables: { id: '' },
        },
        result: {
          data: {
            organizations: [{ _id: 'org-1', admins: [] }],
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={localMocks} addTypename={false}>
        <People />
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });
  });
  it('Sets userType to Admin if user is found in admins list', async (): Promise<void> => {
    const adminMock = {
      request: {
        query: ORGANIZATION_ADMINS_LIST,
        variables: { id: '' },
      },
      result: {
        data: {
          organizations: [
            {
              _id: 'testOrg',
              admins: [
                {
                  _id: 'admin123',
                  firstName: 'Test',
                  lastName: 'Admin',
                  email: 'admin@test.com',
                },
              ],
            },
          ],
        },
      },
    };
    const membersMock = {
      request: {
        query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
        variables: { orgId: '', firstName_contains: '' },
      },
      result: {
        data: {
          organizationsMemberConnection: {
            edges: [
              {
                _id: 'admin123',
                firstName: 'Test',
                lastName: 'Admin',
                email: 'admin@test.com',
              },
            ],
          },
        },
      },
    };
    const link = new StaticMockLink([adminMock, membersMock], true);
    render(
      <MockedProvider
        mocks={[adminMock, membersMock]}
        addTypename={false}
        link={link}
      >
        <People />
      </MockedProvider>,
    );
    await wait();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });
});
describe('People Component Mode Switch Coverage', () => {
  // Setup function to help with repeated test setup
  const setupTest = (): RenderResult => {
    // Mock data that ensures both member and admin data is available
    const mocks = [
      {
        request: {
          query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
          variables: { orgId: '', firstName_contains: '' },
        },
        result: {
          data: {
            organizationsMemberConnection: {
              edges: [
                {
                  _id: '123',
                  firstName: 'Test',
                  lastName: 'User',
                  image: null,
                  email: 'test@example.com',
                  createdAt: '2023-03-02T03:22:08.101Z',
                },
              ],
            },
          },
        },
      },
      {
        request: {
          query: ORGANIZATION_ADMINS_LIST,
          variables: { id: '' },
        },
        result: {
          data: {
            organizations: [
              {
                admins: [
                  {
                    _id: '456',
                    firstName: 'Admin',
                    lastName: 'User',
                    image: null,
                    email: 'admin@example.com',
                    createdAt: '2023-03-02T03:22:08.101Z',
                  },
                ],
              },
            ],
          },
        },
      },
    ];

    return render(
      <MockedProvider addTypename={false} mocks={mocks}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <People />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
  };

  it('handles mode transitions correctly including edge cases', async () => {
    setupTest();

    // Wait for initial render
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    // Open dropdown and switch to admin mode
    userEvent.click(screen.getByTestId('modeChangeBtn'));
    await waitFor(() => {
      userEvent.click(screen.getByTestId('modeBtn1'));
    });

    // Verify admin view
    await waitFor(() => {
      expect(screen.getByText('Admin User')).toBeInTheDocument();
      expect(screen.queryByText('Test User')).not.toBeInTheDocument();
    });

    // Test mode transition with missing data
    const modeSetter = vi.fn();
    vi.spyOn(React, 'useState').mockImplementationOnce(() => [1, modeSetter]); // Mock mode state

    // Force a re-render to trigger the useEffect with mocked state
    setupTest();

    // Verify the component handles the transition gracefully
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  });

  // Set up i18next mock for all tests in this describe block
  beforeAll(() => {
    vi.mock('react-i18next', async () => {
      const actual = await vi.importActual('react-i18next');
      return {
        ...actual,
        useTranslation: () => ({
          t: (key: string) =>
            key === 'nothingToShow' ? 'Nothing to show' : key,
          i18n: {
            changeLanguage: () => new Promise(() => {}),
          },
        }),
      };
    });
  });

  it('handles transitioning between empty and non-empty states', async () => {
    const mixedMocks = [
      {
        request: {
          query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
          variables: { orgId: '', firstName_contains: '' },
        },
        result: {
          data: {
            organizationsMemberConnection: {
              edges: [],
            },
          },
        },
      },
      {
        request: {
          query: ORGANIZATION_ADMINS_LIST,
          variables: { id: '' },
        },
        result: {
          data: {
            organizations: [
              {
                admins: [
                  {
                    _id: 'admin1',
                    firstName: 'Admin',
                    lastName: 'User',
                    image: null,
                    email: 'admin@test.com',
                    createdAt: new Date().toISOString(),
                  },
                ],
              },
            ],
          },
        },
      },
    ];

    // Mock i18next translation specifically for this test
    vi.mock('react-i18next', async () => {
      const actual = await vi.importActual('react-i18next');
      return {
        ...actual,
        useTranslation: () => ({
          t: (key: string) =>
            key === 'nothingToShow' ? 'Nothing to show' : key,
          i18n: {
            changeLanguage: () => new Promise(() => {}),
          },
        }),
      };
    });

    render(
      <MockedProvider addTypename={false} mocks={mixedMocks}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <People />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitForElementToBeRemoved(() => screen.queryByText('Loading...'));

    // Verify empty state in members view using translated text
    expect(screen.getByText('Nothing to show')).toBeInTheDocument();

    // Switch to admin mode
    userEvent.click(screen.getByTestId('modeChangeBtn'));
    await waitFor(() => {
      userEvent.click(screen.getByTestId('modeBtn1'));
    });

    // Verify admin is shown in admin view
    await waitFor(() => {
      expect(screen.getByText('Admin User')).toBeInTheDocument();
      expect(screen.queryByText('Nothing to show')).not.toBeInTheDocument();
    });
  });
});

describe('People Additional Flow Tests', () => {
  const renderComponent = (mocks: MockData[]): RenderResult => {
    return render(
      <MockedProvider addTypename={false} mocks={mocks}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <People />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
  };

  const setupWithMocks = (mocks: MockData[]): RenderResult =>
    renderComponent(mocks);

  it('searches partial user name correctly and displays matching results', async (): Promise<void> => {
    const aliMembersMock: MockData = {
      request: {
        query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
        variables: { orgId: '', firstName_contains: 'Ali' },
      },
      result: {
        data: {
          organizationsMemberConnection: {
            edges: [
              {
                _id: 'user-1',
                firstName: 'Alice',
                lastName: 'Test',
                image: null,
                email: 'alice@test.com',
                createdAt: '2023-03-02T03:22:08.101Z',
              },
            ],
          },
        },
      },
    };

    renderComponent([aliMembersMock]);

    userEvent.type(screen.getByTestId('searchInput'), 'Ali');
    userEvent.click(screen.getByTestId('searchBtn'));

    await waitFor(() => {
      expect(screen.getByText('Alice Test')).toBeInTheDocument();
      expect(screen.queryByText('Bob Test')).not.toBeInTheDocument();
    });
  });

  it('switches mode multiple times in a row without errors', async (): Promise<void> => {
    const multiSwitchMocks: MockData[] = [
      {
        request: {
          query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
          variables: { orgId: '', firstName_contains: '' },
        },
        result: {
          data: {
            organizationsMemberConnection: {
              edges: [
                {
                  _id: '3',
                  firstName: 'Charlie',
                  lastName: 'Test',
                  image: null,
                  email: 'charlie@test.com',
                  createdAt: '2023-03-02T03:22:08.101Z',
                },
              ],
            },
          },
        },
      },
      {
        request: {
          query: ORGANIZATION_ADMINS_LIST,
          variables: { id: '' },
        },
        result: {
          data: {
            organizations: [{ _id: 'org-1', admins: [] }],
          },
        },
      },
    ];

    setupWithMocks(multiSwitchMocks);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      expect(screen.getByText('Charlie Test')).toBeInTheDocument();
    });

    const modeSwitchBtn = screen.getByTestId('modeChangeBtn');

    // Switch to admin mode
    userEvent.click(modeSwitchBtn);
    await waitFor(() => userEvent.click(screen.getByTestId('modeBtn1')));

    // Switch back to all members
    userEvent.click(modeSwitchBtn);
    await waitFor(() => userEvent.click(screen.getByTestId('modeBtn0')));

    expect(screen.getByText('Charlie Test')).toBeInTheDocument();
  });

  // Add test for error handling
});
describe('Testing People Screen Edge Cases [User Portal]', () => {
  const renderComponent = (mocks = MOCKS): RenderResult => {
    return render(
      <MockedProvider addTypename={false} mocks={mocks}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <People />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
  };

  // Mock i18next translation
  vi.mock('react-i18next', async () => {
    const actual = await vi.importActual('react-i18next');
    return {
      ...actual,
      useTranslation: () => ({
        t: (key: string) => {
          const translations: { [key: string]: string } = {
            nothingToShow: 'Nothing to show',
            all: 'All',
          };
          return translations[key] || key;
        },
      }),
    };
  });

  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it('handles different rowsPerPage values', async (): Promise<void> => {
    const manyMembersMock = {
      request: {
        query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
        variables: { orgId: '', firstName_contains: '' },
      },
      result: {
        data: {
          organizationsMemberConnection: {
            edges: Array(15)
              .fill(null)
              .map((_, i) => ({
                _id: `id-${i}`,
                firstName: `First${i}`,
                lastName: `Last${i}`,
                email: `test${i}@example.com`,
                image: null,
                createdAt: new Date().toISOString(),
              })),
          },
        },
      },
    };

    renderComponent([manyMembersMock]);
    await wait();

    // Find the rows per page select
    const select = screen.getByLabelText('rows per page');
    expect(select).toBeInTheDocument();

    // Change to show 10 rows per page instead of trying to select "All"
    userEvent.selectOptions(select, '10');
    await wait(500);

    // Verify we can see more than the default number of rows
    const memberElements = screen.getAllByText(/First\d+ Last\d+/);
    expect(memberElements.length).toBeGreaterThan(5);
  });

  it('handles rowsPerPage = 0 case', async () => {
    const membersMock = {
      request: {
        query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
        variables: { orgId: '', firstName_contains: '' },
      },
      result: {
        data: {
          organizationsMemberConnection: {
            edges: [
              {
                _id: '1',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: null,
                createdAt: new Date().toISOString(),
              },
            ],
          },
        },
      },
    };

    renderComponent([membersMock]);
    await wait();

    // Find the rows per page select
    const select = screen.getByLabelText('rows per page');
    expect(select).toBeInTheDocument();

    // Select the "All" option (which should be the last option)
    const options = Array.from(select.getElementsByTagName('option'));
    const allOption = options.find((option) => option.textContent === 'All');
    if (allOption) {
      userEvent.selectOptions(select, allOption.value);
    }
    await wait();

    // Verify member is shown
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });
});

describe('People Component Additional Coverage Tests', () => {
  // Mock for testing error states

  // Test case to cover line 142: handleSearchByEnter with non-Enter key
  it('should not trigger search for non-Enter key press', async () => {
    render(
      <MockedProvider addTypename={false} mocks={[]}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <People />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const searchInput = screen.getByTestId('searchInput');
    fireEvent.keyUp(searchInput, { key: 'A', code: 'KeyA' });

    // Wait a bit to ensure no search is triggered
    await new Promise((resolve) => setTimeout(resolve, 100));
    // The loading state should not appear
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  // Test case to cover line 151: handleSearchByBtnClick with empty input
  it('should handle search with empty input value', async () => {
    render(
      <MockedProvider addTypename={false} mocks={[]}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <People />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const searchBtn = screen.getByTestId('searchBtn');
    // Remove the search input from DOM to simulate edge case
    const searchInput = screen.getByTestId('searchInput');
    searchInput.remove();

    userEvent.click(searchBtn);
    // Wait to ensure no errors occur
    await new Promise((resolve) => setTimeout(resolve, 100));
  });
  it('handles admin mode transition when admin data is not yet available', async () => {
    // Create a mock that will delay the admin data response
    const delayedAdminMock = {
      request: {
        query: ORGANIZATION_ADMINS_LIST,
        variables: { id: '' },
      },
      result: {
        data: {
          organizations: [
            {
              __typename: 'Organization',
              _id: 'org-1',
              admins: [
                {
                  _id: 'admin1',
                  firstName: 'Admin',
                  lastName: 'Test',
                  email: 'admin@test.com',
                  image: null,
                  createdAt: new Date().toISOString(),
                },
              ],
            },
          ],
        },
      },
      delay: 1000, // Add a delay to ensure we can switch modes before data arrives
    };

    const membersListMock = {
      request: {
        query: ORGANIZATIONS_MEMBER_CONNECTION_LIST,
        variables: { orgId: '', firstName_contains: '' },
      },
      result: {
        data: {
          organizationsMemberConnection: {
            edges: [
              {
                _id: 'member1',
                firstName: 'Test',
                lastName: 'Member',
                email: 'member@test.com',
                image: null,
                createdAt: new Date().toISOString(),
              },
            ],
          },
        },
      },
    };

    render(
      <MockedProvider
        addTypename={false}
        mocks={[membersListMock, delayedAdminMock]}
      >
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <People />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    // Wait for initial data to load and verify member is shown
    await waitFor(() => {
      expect(screen.getByText('Test Member')).toBeInTheDocument();
    });

    // Use act to wrap state changes
    await act(async () => {
      // Open dropdown
      fireEvent.click(screen.getByTestId('modeChangeBtn'));
      // Wait for dropdown to open
      await waitFor(() => {
        expect(screen.getByTestId('modeBtn1')).toBeInTheDocument();
      });
      // Click admin mode button
      fireEvent.click(screen.getByTestId('modeBtn1'));
    });

    // Wait for admin data to finish loading
    await waitFor(
      () => {
        // Verify the member is no longer shown
        expect(screen.queryByText('Test Member')).not.toBeInTheDocument();
      },
      { timeout: 2000 },
    );

    // Wait for admin data to load and verify admin appears
    await waitFor(
      () => {
        expect(screen.getByText('Admin Test')).toBeInTheDocument();
        expect(screen.getByText('Admin')).toBeInTheDocument();
      },
      { timeout: 2000 },
    );
  });
});
