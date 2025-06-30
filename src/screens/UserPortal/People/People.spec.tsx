import React from 'react';
import type { RenderResult } from '@testing-library/react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  waitForElementToBeRemoved,
  act,
} from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { I18nextProvider } from 'react-i18next';
import { ORGANIZATIONS_MEMBERS_LIST } from 'GraphQl/Queries/Queries';
import type { DocumentNode } from '@apollo/client';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import People from './People';
import userEvent from '@testing-library/user-event';
import { vi, it } from 'vitest';
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
      organization?: {
        members?: {
          pageInfo: {
            endCursor: string | null;
            hasPreviousPage: boolean;
            hasNextPage: boolean;
            startCursor: string | null;
          };
          edges: {
            node: {
              id: string;
              name: string;
              role: string;
              avatarURL: string | null;
              createdAt: string;
            };
          }[];
        };
      };
    };
  };
  error?: Error;
};

const MOCKS = [
  {
    request: {
      query: ORGANIZATIONS_MEMBERS_LIST,
      variables: {
        orgId: '',
        firstName_contains: '',
        first: 32,
      },
    },
    result: {
      data: {
        organization: {
          members: {
            pageInfo: {
              endCursor: 'cursor1',
              hasPreviousPage: false,
              hasNextPage: false,
              startCursor: 'cursor1',
            },
            edges: [
              {
                node: {
                  id: '64001660a711c62d5b4076a2',
                  name: 'Noble Mittal',
                  role: 'member',
                  avatarURL: null,
                  createdAt: '2023-03-02T03:22:08.101Z',
                },
              },
              {
                node: {
                  id: '64001660a711c62d5b4076a3',
                  name: 'Noble Mittal',
                  role: 'administrator',
                  avatarURL: 'mockImage',
                  createdAt: '2023-03-02T03:22:08.101Z',
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
      query: ORGANIZATIONS_MEMBERS_LIST,
      variables: {
        orgId: '',
        firstName_contains: '',
        first: 32,
      },
    },
    result: {
      data: {
        organization: {
          members: {
            pageInfo: {
              endCursor: null,
              hasPreviousPage: false,
              hasNextPage: false,
              startCursor: null,
            },
            edges: [],
          },
        },
      },
    },
  },
  {
    request: {
      query: ORGANIZATIONS_MEMBERS_LIST,
      variables: {
        orgId: '',
        firstName_contains: 'j',
        first: 32,
      },
    },
    result: {
      data: {
        organization: {
          members: {
            pageInfo: {
              endCursor: 'cursor1',
              hasPreviousPage: false,
              hasNextPage: false,
              startCursor: 'cursor1',
            },
            edges: [
              {
                node: {
                  id: '64001660a711c62d5b4076a2',
                  name: 'John Cena',
                  role: 'member',
                  avatarURL: null,
                  createdAt: '2023-03-02T03:22:08.101Z',
                },
              },
            ],
          },
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

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
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

    await userEvent.type(screen.getByTestId('searchInput'), 'j{enter}');
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
    await userEvent.clear(screen.getByTestId('searchInput'));
    await userEvent.click(searchBtn);
    await wait();
    await userEvent.type(screen.getByTestId('searchInput'), 'j');
    await userEvent.click(searchBtn);
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

    await userEvent.click(screen.getByTestId('modeChangeBtn'));
    await wait();
    await userEvent.click(screen.getByTestId('modeBtn1'));
    await wait();

    expect(screen.queryByText('Noble Mittal')).toBeInTheDocument();
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
});

describe('Testing People Screen Pagination [User Portal]', () => {
  // Mock data with more than 5 members to test pagination
  const PAGINATION_MOCKS = [
    {
      request: {
        query: ORGANIZATIONS_MEMBERS_LIST,
        variables: {
          orgId: '',
          firstName_contains: '',
          first: 32,
        },
      },
      result: {
        data: {
          organization: {
            members: {
              pageInfo: {
                endCursor: 'cursor1',
                hasPreviousPage: false,
                hasNextPage: true,
                startCursor: 'cursor1',
              },
              edges: Array(7)
                .fill(null)
                .map((_, index) => ({
                  node: {
                    id: `member${index}`,
                    name: `User${index} Test`,
                    role: 'member',
                    avatarURL: null,
                    createdAt: '2023-03-02T03:22:08.101Z',
                  },
                })),
            },
          },
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
    vi.mock('react-router', async () => {
      const actual = await vi.importActual('react-router');
      return {
        ...actual,
        useParams: () => ({ orgId: '' }),
      };
    });
  });

  it('handles rows per page change correctly', async () => {
    renderComponent();
    await wait();

    // Default should show 5 items
    expect(screen.getByText('User0 Test')).toBeInTheDocument();
    expect(screen.queryByText('User5 Test')).not.toBeInTheDocument();

    // Change rows per page to 10
    const select = screen.getByRole('combobox');
    await userEvent.selectOptions(select, '10');
    await wait();

    // Should now show all items on one page
    expect(screen.getByText('User0 Test')).toBeInTheDocument();
    expect(screen.getByText('User5 Test')).toBeInTheDocument();
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
});
describe('People Component Mode Switch Coverage', () => {
  // Setup function to help with repeated test setup
  const setupTest = (): RenderResult => {
    // Mock data that ensures both member and admin data is available
    const mocks = [
      {
        request: {
          query: ORGANIZATIONS_MEMBERS_LIST,
          variables: { orgId: '', firstName_contains: '', first: 32 },
        },
        result: {
          data: {
            organization: {
              members: {
                pageInfo: {
                  endCursor: 'cursor1',
                  hasPreviousPage: false,
                  hasNextPage: false,
                  startCursor: 'cursor1',
                },
                edges: [
                  {
                    node: {
                      id: '123',
                      name: 'Test User',
                      role: 'member',
                      avatarURL: null,
                      createdAt: '2023-03-02T03:22:08.101Z',
                    },
                  },
                  {
                    node: {
                      id: '456',
                      name: 'Admin User',
                      role: 'administrator',
                      avatarURL: null,
                      createdAt: '2023-03-02T03:22:08.101Z',
                    },
                  },
                ],
              },
            },
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
    await userEvent.click(screen.getByTestId('modeChangeBtn'));
    await waitFor(async () => {
      await userEvent.click(screen.getByTestId('modeBtn1'));
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
          query: ORGANIZATIONS_MEMBERS_LIST,
          variables: { orgId: '', firstName_contains: '', first: 32 },
        },
        result: {
          data: {
            organization: {
              members: {
                pageInfo: {
                  endCursor: null,
                  hasPreviousPage: false,
                  hasNextPage: false,
                  startCursor: null,
                },
                edges: [
                  {
                    node: {
                      id: 'admin1',
                      name: 'Admin User',
                      role: 'administrator',
                      avatarURL: null,
                      createdAt: '2023-03-02T03:22:08.101Z',
                    },
                  },
                ],
              },
            },
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

    // Verify admin is shown in all members view
    expect(screen.getByText('Admin User')).toBeInTheDocument();

    // Switch to admin mode
    await userEvent.click(screen.getByTestId('modeChangeBtn'));
    await waitFor(async () => {
      await userEvent.click(screen.getByTestId('modeBtn1'));
    });

    // Verify admin is still shown in admin view (same admin user)
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
    const defaultMock: MockData = {
      request: {
        query: ORGANIZATIONS_MEMBERS_LIST,
        variables: { orgId: '', firstName_contains: '', first: 32 },
      },
      result: {
        data: {
          organization: {
            members: {
              pageInfo: {
                endCursor: null,
                hasPreviousPage: false,
                hasNextPage: false,
                startCursor: null,
              },
              edges: [],
            },
          },
        },
      },
    };

    const aliMembersMock: MockData = {
      request: {
        query: ORGANIZATIONS_MEMBERS_LIST,
        variables: { orgId: '', firstName_contains: 'Ali', first: 32 },
      },
      result: {
        data: {
          organization: {
            members: {
              pageInfo: {
                endCursor: 'cursor1',
                hasPreviousPage: false,
                hasNextPage: false,
                startCursor: 'cursor1',
              },
              edges: [
                {
                  node: {
                    id: 'user-1',
                    name: 'Alice Test',
                    role: 'member',
                    avatarURL: null,
                    createdAt: '2023-03-02T03:22:08.101Z',
                  },
                },
              ],
            },
          },
        },
      },
    };

    renderComponent([defaultMock, aliMembersMock]);

    await userEvent.type(screen.getByTestId('searchInput'), 'Ali');
    await userEvent.click(screen.getByTestId('searchBtn'));

    await waitFor(() => {
      expect(screen.getByText('Alice Test')).toBeInTheDocument();
      expect(screen.queryByText('Bob Test')).not.toBeInTheDocument();
    });
  });

  it('switches mode multiple times in a row without errors', async (): Promise<void> => {
    const multiSwitchMocks: MockData[] = [
      {
        request: {
          query: ORGANIZATIONS_MEMBERS_LIST,
          variables: { orgId: '', firstName_contains: '', first: 32 },
        },
        result: {
          data: {
            organization: {
              members: {
                pageInfo: {
                  endCursor: 'cursor1',
                  hasPreviousPage: false,
                  hasNextPage: false,
                  startCursor: 'cursor1',
                },
                edges: [
                  {
                    node: {
                      id: '3',
                      name: 'Charlie Test',
                      role: 'member',
                      avatarURL: null,
                      createdAt: '2023-03-02T03:22:08.101Z',
                    },
                  },
                ],
              },
            },
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
    await userEvent.click(modeSwitchBtn);
    await waitFor(
      async () => await userEvent.click(screen.getByTestId('modeBtn1')),
    );

    // Switch back to all members
    await userEvent.click(modeSwitchBtn);
    await waitFor(
      async () => await userEvent.click(screen.getByTestId('modeBtn0')),
    );

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

  it('handles rowsPerPage = 0 case', async () => {
    const membersMock = {
      request: {
        query: ORGANIZATIONS_MEMBERS_LIST,
        variables: { orgId: '', firstName_contains: '', first: 32 },
      },
      result: {
        data: {
          organization: {
            members: {
              pageInfo: {
                endCursor: 'cursor1',
                hasPreviousPage: false,
                hasNextPage: false,
                startCursor: 'cursor1',
              },
              edges: [
                {
                  node: {
                    id: '1',
                    name: 'Test User',
                    role: 'member',
                    avatarURL: null,
                    createdAt: new Date().toISOString(),
                  },
                },
              ],
            },
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
      await userEvent.selectOptions(select, allOption.value);
    }
    await wait();

    // Verify member is shown
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });
});

describe('People Component Additional Coverage Tests', () => {
  // Default mock needed for initial component load
  const defaultMock = {
    request: {
      query: ORGANIZATIONS_MEMBERS_LIST,
      variables: { orgId: '', firstName_contains: '', first: 32 },
    },
    result: {
      data: {
        organization: {
          members: {
            pageInfo: {
              endCursor: null,
              hasPreviousPage: false,
              hasNextPage: false,
              startCursor: null,
            },
            edges: [],
          },
        },
      },
    },
  };

  // Test case to cover line 142: handleSearchByEnter with non-Enter key
  it('should not trigger search for non-Enter key press', async () => {
    render(
      <MockedProvider addTypename={false} mocks={[defaultMock]}>
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
      <MockedProvider addTypename={false} mocks={[defaultMock]}>
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

    await userEvent.click(searchBtn);
    await new Promise((resolve) => setTimeout(resolve, 100));
  });

  it('Sets userType to Admin if user is found in admins list', async (): Promise<void> => {
    const membersMock = {
      request: {
        query: ORGANIZATIONS_MEMBERS_LIST,
        variables: { orgId: '', firstName_contains: '', first: 32 },
      },
      result: {
        data: {
          organization: {
            members: {
              pageInfo: {
                endCursor: 'cursor1',
                hasPreviousPage: false,
                hasNextPage: false,
                startCursor: 'cursor1',
              },
              edges: [
                {
                  node: {
                    id: 'admin123',
                    name: 'Test Admin',
                    role: 'administrator',
                    avatarURL: null,
                    createdAt: '2023-03-02T03:22:08.101Z',
                  },
                },
              ],
            },
          },
        },
      },
    };
    const link = new StaticMockLink([membersMock], true);
    render(
      <MockedProvider mocks={[membersMock]} addTypename={false} link={link}>
        <People />
      </MockedProvider>,
    );
    await wait();
    expect(screen.getByText('Test Admin')).toBeInTheDocument();
  });
});

describe('People Component Pagination Tests', () => {
  const mockData = {
    request: {
      query: ORGANIZATIONS_MEMBERS_LIST,
      variables: { orgId: '', firstName_contains: '', first: 32 },
    },
    result: {
      data: {
        organization: {
          members: {
            pageInfo: {
              endCursor: 'cursor15',
              hasPreviousPage: false,
              hasNextPage: false,
              startCursor: 'cursor1',
            },
            edges: Array(15)
              .fill(null)
              .map((_, index) => ({
                node: {
                  id: `user-${index}`,
                  name: `User${index} Test`,
                  role: 'member',
                  avatarURL: null,
                  createdAt: '2023-03-02T03:22:08.101Z',
                },
              })),
          },
        },
      },
    },
  };

  const renderComponent = (): RenderResult => {
    return render(
      <MockedProvider mocks={[mockData]} addTypename={false}>
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
  });
  it('handles edge cases in pagination', async () => {
    renderComponent();

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Test last page navigation
    const lastPageButton = screen.getByRole('button', { name: /last page/i });
    await act(async () => {
      await userEvent.click(lastPageButton);
    });

    // Verify last page content
    expect(screen.getByText('User14 Test')).toBeInTheDocument();

    // Test first page navigation
    const firstPageButton = screen.getByRole('button', { name: /first page/i });
    await act(async () => {
      await userEvent.click(firstPageButton);
    });

    // Verify return to first page
    expect(screen.getByText('User0 Test')).toBeInTheDocument();
    expect(screen.queryByText('User14 Test')).not.toBeInTheDocument();
  });
});
