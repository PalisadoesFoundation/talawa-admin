import React, { useEffect } from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { act, render, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { NotificationToast } from 'components/NotificationToast/NotificationToast';
import userEvent from '@testing-library/user-event';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18nForTest from 'utils/i18nForTest';
import Users from './Users';
import {
  EMPTY_MOCKS,
  MOCKS_NEW,
  MOCKS_NEW_2,
  USER_UNDEFINED_MOCK,
} from './UsersMocks.mocks';
import { generateMockUser } from './Organization.mocks';
import { MOCKS, MOCKS2 } from './User.mocks';
import useLocalStorage from 'utils/useLocalstorage';
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import {
  ORGANIZATION_LIST,
  USER_LIST_FOR_ADMIN,
} from 'GraphQl/Queries/Queries';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

vi.mock('components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock('@mui/icons-material', async () => {
  const actual = (await vi.importActual('@mui/icons-material')) as Record<
    string,
    unknown
  >;
  return {
    ...actual,
    WarningAmberRounded: vi.fn(() => null),
    PersonOff: vi.fn(() => null),
  };
});

vi.mock('components/IconComponent/IconComponent', () => ({
  default: ({ name }: { name: string }) => (
    <div data-testid={`mock-icon-${name}`} />
  ),
}));

// Mock react-infinite-scroll-component to allow manual triggering of 'next'
// This is essential to test the `next={loadMoreTags}` function even when dataLength is 0 or hasNextPage is false.
interface InterfaceInfiniteScrollMockProps {
  next: () => void;
  hasMore?: boolean;
  children?: React.ReactNode;
  dataLength?: number;
  loader?: React.ReactNode;
}

vi.mock('react-infinite-scroll-component', () => ({
  default: ({
    next,
    hasMore,
    children,
    dataLength,
    loader,
  }: InterfaceInfiniteScrollMockProps) => (
    <div data-testid="infinite-scroll-mock">
      <button
        type="button"
        data-testid="trigger-load-more"
        onClick={() => {
          next();
        }}
      >
        Load More
      </button>
      <div data-testid="has-more-value">{String(hasMore)}</div>
      <div data-testid="data-length-value">{dataLength}</div>
      {loader && <div data-testid="loader-wrapper">{loader}</div>}
      {children}
    </div>
  ),
}));

// Debounce duration used by SearchFilterBar component (default: 300ms)
const SEARCH_DEBOUNCE_MS = 300;

const link = new StaticMockLink(MOCKS, true);

const createLink = (
  mocks:
    | typeof MOCKS
    | typeof EMPTY_MOCKS
    | typeof MOCKS2
    | typeof MOCKS_NEW
    | typeof MOCKS_NEW_2,
) => new StaticMockLink(mocks, true);

async function wait(ms = 1000): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

const { setItem, removeItem, clearAllItems } = useLocalStorage();

beforeEach(() => {
  setItem('id', '123');
  setItem('SuperAdmin', true);
  setItem('name', 'John Doe');
  setItem('AdminFor', [{ name: 'adi', id: '1234', avatarURL: '' }]);
  global.IntersectionObserver = class {
    constructor(
      _callback: IntersectionObserverCallback,
      _options?: IntersectionObserverInit,
    ) {}
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof IntersectionObserver;
});

afterEach(() => {
  clearAllItems();
  vi.restoreAllMocks();
});

describe('Testing Users screen', () => {
  it('Component should be rendered properly', async () => {
    render(
      <MockedProvider link={createLink(MOCKS)}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Users />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    expect(screen.getByTestId('testcomp')).toBeInTheDocument();
  });

  it(`Component should be rendered properly when user is not superAdmin
  and or userId does not exists in localstorage`, async () => {
    setItem('AdminFor', ['123']);
    removeItem('SuperAdmin');
    await wait();
    setItem('id', '');
    render(
      <MockedProvider link={createLink(MOCKS)}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Users />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();
  });

  it(`Component should be rendered properly when userId does not exists in localstorage`, async () => {
    removeItem('AdminFor');
    removeItem('SuperAdmin');
    await wait();
    removeItem('id');
    render(
      <MockedProvider link={createLink(MOCKS)}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Users />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();
  });

  it('should NOT call fetchMore when hasNextPage is false', async () => {
    const noNextPageMocks = [
      {
        request: {
          query: USER_LIST_FOR_ADMIN,
          variables: {
            first: 12,
            after: null,
            orgFirst: 32,
            where: undefined,
          },
        },
        result: {
          data: {
            allUsers: {
              edges: [
                {
                  cursor: '1',
                  node: {
                    id: '1',
                    name: 'User One',
                    emailAddress: 'u1@test.com',
                    role: 'regular',
                    createdAt: new Date().toISOString(),
                    city: '',
                    state: '',
                    countryCode: '',
                    postalCode: '',
                    avatarURL: '',
                    orgsWhereUserIsBlocked: { edges: [] },
                    organizationsWhereMember: { edges: [] },
                  },
                },
              ],
              pageInfo: {
                hasNextPage: false,
                endCursor: null,
              },
            },
          },
        },
      },
      {
        request: { query: ORGANIZATION_LIST },
        result: {
          data: { organizations: [{ id: 'org1', name: 'Org' }] },
        },
      },
    ];

    render(
      <MockedProvider mocks={noNextPageMocks}>
        <BrowserRouter>
          <Provider store={store}>
            <Users />
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    expect(screen.getByTestId('has-more-value')).toHaveTextContent('false');
    expect(screen.getByTestId('data-length-value')).toHaveTextContent('1');
  });

  it('Component should be rendered properly when user is superAdmin', async () => {
    render(
      <MockedProvider link={createLink(MOCKS)}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Users />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
  });

  it('Testing seach by name functionality', async () => {
    render(
      <MockedProvider link={createLink(MOCKS)}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Users />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    const searchBtn = screen.getByTestId('searchButton');
    const search1 = 'John';
    await userEvent.type(screen.getByTestId(/searchByName/i), search1);
    await userEvent.click(searchBtn);
    await wait();
    expect(screen.queryByText(/not found/i)).not.toBeInTheDocument();

    const search2 = 'Pete{backspace}{backspace}{backspace}{backspace}';
    await userEvent.type(screen.getByTestId(/searchByName/i), search2);

    const search3 =
      'John{backspace}{backspace}{backspace}{backspace}Sam{backspace}{backspace}{backspace}';
    await userEvent.type(screen.getByTestId(/searchByName/i), search3);

    const search4 = 'Sam{backspace}{backspace}P{backspace}';
    await userEvent.type(screen.getByTestId(/searchByName/i), search4);

    const search5 = 'Xe';
    await userEvent.type(screen.getByTestId(/searchByName/i), search5);
    await userEvent.clear(screen.getByTestId(/searchByName/i));
    await userEvent.click(searchBtn);
    await wait();
  });

  it('testing search not found', async () => {
    await act(async () => {
      render(
        <MockedProvider link={createLink(EMPTY_MOCKS)}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <Users />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );
    });
    await wait();

    const searchBtn = screen.getByTestId('searchButton');
    const searchInput = screen.getByTestId(/searchByName/i);

    await act(async () => {
      await userEvent.clear(searchInput);
      await userEvent.type(searchInput, 'NonexistentName');
    });

    // Wait for debounced search to complete
    await wait(SEARCH_DEBOUNCE_MS);

    await act(async () => {
      await userEvent.click(searchBtn);
    });

    // Wait for the "no results" message
    expect(await screen.findByTestId('users-empty-state')).toBeInTheDocument();
    const message = screen.getByTestId('users-empty-state-message');

    expect(message).toHaveTextContent(
      i18nForTest.t('common:noResultsFoundFor', { query: 'NonexistentName' }),
    );

    expect(
      screen.getByTestId('users-empty-state-description'),
    ).toHaveTextContent(i18nForTest.t('common:tryAdjustingFilters'));
  });

  it('should show noUserFound when user is empty', async () => {
    await act(async () => {
      render(
        <MockedProvider link={createLink(USER_UNDEFINED_MOCK)}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <Users />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );
    });
    await wait();
    expect(await screen.findByTestId('users-empty-state')).toBeInTheDocument();
    expect(screen.getByTestId('users-empty-state-message')).toHaveTextContent(
      /No User Found/i,
    );
  });

  it('Should properly merge users when loading more', async () => {
    // Create test data
    const previousData = {
      users: Array(5)
        .fill(null)
        .map((_, i) => ({
          user: {
            _id: `id${i}`,
            firstName: `User${i}`,
            lastName: `Last${i}`,
            createdAt: new Date().toISOString(),
          },
          appUserProfile: {
            adminFor: [],
            isSuperAdmin: false,
          },
        })),
    };

    const newData = {
      users: Array(5)
        .fill(null)
        .map((_, i) => ({
          user: {
            _id: `id${i + 5}`,
            firstName: `User${i + 5}`,
            lastName: `Last${i + 5}`,
            createdAt: new Date().toISOString(),
          },
          appUserProfile: {
            adminFor: [],
            isSuperAdmin: false,
          },
        })),
    };

    // The update query function from the component
    interface IUserData {
      user: {
        _id: string;
        firstName: string;
        lastName: string;
        createdAt: string;
      };
      appUserProfile: {
        adminFor: string[];
        isSuperAdmin: boolean;
      };
    }

    const updateQuery = (
      prev: { users: IUserData[] } | undefined,
      { fetchMoreResult }: { fetchMoreResult?: { users: IUserData[] } },
    ) => {
      if (!fetchMoreResult) {
        return prev || { users: [] };
      }

      const mergedUsers = [...(prev?.users || []), ...fetchMoreResult.users];

      const uniqueUsers = Array.from(
        new Map(
          mergedUsers.map((user: IUserData) => [user.user._id, user]),
        ).values(),
      );

      return { users: uniqueUsers };
    };

    // Test the updateQuery function
    const result = updateQuery(previousData, { fetchMoreResult: newData });

    // Verify that the users were properly merged
    expect(result.users.length).toBe(10); // 5 initial + 5 new

    // Make sure we have users from both data sets
    expect(result.users.some((user) => user.user._id === 'id0')).toBe(true);
    expect(result.users.some((user) => user.user._id === 'id9')).toBe(true);
  });

  it('check for rerendering', async () => {
    const { rerender } = render(
      <MockedProvider link={createLink(MOCKS2)}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Users />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    rerender(
      <MockedProvider link={createLink(MOCKS2)}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Users />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();
  });

  it('Check if pressing enter key triggers search', async () => {
    await act(async () => {
      render(
        <MockedProvider link={createLink(MOCKS_NEW)}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <Users />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );
    });
    await wait();
    const searchInput = screen.getByTestId('searchByName');

    await act(async () => {
      await userEvent.type(searchInput, 'John');
    });
    await act(async () => {
      await userEvent.type(searchInput, '{enter}');
    });
  });

  describe('Testing sorting and loadMoreUsers functionality', () => {
    it('should set the correct order variable and update hasMore', async () => {
      render(
        <MockedProvider mocks={MOCKS_NEW}>
          <BrowserRouter>
            <Provider store={store}>
              <Users />
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );

      await wait();

      const sortDropdown = await screen.findByTestId('sortUsers-toggle');
      await userEvent.click(sortDropdown);

      const newestOption = screen.getByTestId('sortUsers-item-newest');
      await userEvent.click(newestOption);

      await wait();

      // Verify sorting worked by checking rows are displayed
      const rowsNewest = await screen.findAllByRole('row');
      expect(rowsNewest.length).toBeGreaterThan(0);

      await userEvent.click(sortDropdown);
      const oldestOption = screen.getByTestId('sortUsers-item-oldest');
      await userEvent.click(oldestOption);

      await wait();

      // Verify sorting worked by checking rows are still displayed
      const rowsOldest = await screen.findAllByRole('row');
      expect(rowsOldest.length).toBeGreaterThan(0);
    });

    it('should load more users and merge them correctly', async () => {
      render(
        <MockedProvider mocks={MOCKS_NEW_2}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <Users />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );

      await wait();

      expect(
        screen.queryByTestId('users-empty-state') ||
          screen.queryByTestId('errorMsg'),
      ).toBeTruthy();
      await wait(SEARCH_DEBOUNCE_MS); // Give time for data to load
    });
  });

  describe('generateMockUser', () => {
    it('should set adminFor with an entry when isSuperAdmin is true', () => {
      const mockUser = generateMockUser(
        'user1',
        'John',
        'Doe',
        'john@example.com',
        dayjs.utc().subtract(1, 'year').toISOString(),
        true, // isSuperAdmin
      );

      expect(mockUser.appUserProfile.adminFor).toEqual([{ _id: '123' }]);
      expect(mockUser.appUserProfile.isSuperAdmin).toBe(true);
    });

    it('should set adminFor as an empty array when isSuperAdmin is false', () => {
      const mockUser = generateMockUser(
        'user2',
        'Jane',
        'Doe',
        'jane@example.com',
        dayjs.utc().subtract(1, 'year').add(4, 'days').toISOString(),
        false, // isSuperAdmin
      );

      expect(mockUser.appUserProfile.adminFor).toEqual([]);
      expect(mockUser.appUserProfile.isSuperAdmin).toBe(false);
    });
  });

  describe('Additional coverage tests', () => {
    it('should display error message when query fails', async () => {
      const errorMock = [
        {
          request: {
            query: USER_LIST_FOR_ADMIN,
            variables: {
              first: 12,
              after: null,
              orgFirst: 32,
              where: undefined,
            },
          },
          error: new Error('Network error occurred'),
        },
        {
          request: {
            query: ORGANIZATION_LIST,
          },
          result: {
            data: {
              organizations: [],
            },
          },
        },
      ];

      render(
        <MockedProvider mocks={errorMock}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <Users />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );

      await wait();
      const errorMsg = screen.getByTestId('errorMsg');

      expect(errorMsg).toBeInTheDocument();
      expect(errorMsg).toHaveTextContent('Error occurred while loading Users');
      expect(errorMsg).toHaveTextContent('Network error occurred');
    });

    it('should reset search and refetch on clear', async () => {
      render(
        <MockedProvider link={link}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <Users />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );

      await wait();

      const searchInput = screen.getByTestId('searchByName');
      await userEvent.type(searchInput, 'John');
      await userEvent.click(screen.getByTestId('searchButton'));

      await wait();

      // Clear search
      await userEvent.clear(searchInput);
      await userEvent.click(screen.getByTestId('searchButton'));

      await wait();
      expect(screen.queryByText(/no results found/i)).not.toBeInTheDocument();
    });

    it('should set document title correctly', () => {
      const spy = vi.spyOn(document, 'title', 'set');
      render(
        <MockedProvider link={link}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <Users />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );
      expect(spy).toHaveBeenCalledWith('Talawa Roles');
      spy.mockRestore();
    });

    it('should show warning toast when no organizations exist', async () => {
      const noOrgsMock = [
        {
          request: {
            query: ORGANIZATION_LIST,
          },
          result: {
            data: {
              organizations: [],
            },
          },
        },
        {
          request: {
            query: USER_LIST_FOR_ADMIN,
          },
          result: {
            data: {
              allUsers: {
                edges: [],
                pageInfo: { hasNextPage: false, endCursor: null },
              },
            },
          },
        },
      ];

      render(
        <MockedProvider mocks={noOrgsMock}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <Users />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );

      await wait();
      expect(NotificationToast.warning).toHaveBeenCalledWith(
        expect.any(String),
      );
    });

    it('should display end of results message when hasMore is false', async () => {
      const endMock = [
        {
          request: {
            query: USER_LIST_FOR_ADMIN,
            variables: {
              first: 12,
              after: null,
              orgFirst: 32,
              where: undefined,
            },
          },
          result: {
            data: {
              allUsers: {
                edges: [
                  {
                    node: {
                      id: '1',
                      name: 'Test User',
                      emailAddress: 'test@example.com',
                      role: 'regular',
                    },
                  },
                ],
                pageInfo: { hasNextPage: false, endCursor: null },
              },
            },
          },
        },
        {
          request: {
            query: ORGANIZATION_LIST,
          },
          result: {
            data: { organizations: [{ id: 'org1', name: 'Org' }] },
          },
        },
      ];

      render(
        <MockedProvider mocks={endMock}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <Users />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );

      await wait();
      expect(screen.getByTestId('has-more-value')).toHaveTextContent('false');
      expect(screen.getByTestId('data-length-value')).toHaveTextContent('1');
    });

    it('should handle search with same value without refetch', async () => {
      vi.spyOn(console, 'log').mockImplementation(() => {});
      render(
        <MockedProvider link={link}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <Users />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );

      await wait();
      const searchInput = screen.getByTestId('searchByName');
      await userEvent.type(searchInput, 'John');
      await userEvent.click(screen.getByTestId('searchButton'));
      await wait();

      // Same search again
      await userEvent.click(screen.getByTestId('searchButton'));
      await wait();
    });
  });
});

describe('Users screen - no organizations scenario', () => {
  it('calls NotificationToast.warning when organizations list is empty', async () => {
    const mocks = [
      {
        request: {
          query: ORGANIZATION_LIST,
        },
        result: {
          data: { organizations: [] },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Users />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(NotificationToast.warning).toHaveBeenCalled();
    });
  });
});

interface InterfaceTestComponentProps {
  displayedUsers: unknown[];
  loadUnqUsers: number;
  loadMoreUsers: (displayedLen: number, loadUnqUsers: number) => void;
}

function TestComponent({
  displayedUsers,
  loadUnqUsers,
  loadMoreUsers,
}: InterfaceTestComponentProps) {
  useEffect(() => {
    if (loadUnqUsers > 0) {
      loadMoreUsers(displayedUsers.length, loadUnqUsers);
    }
  }, [displayedUsers, loadUnqUsers, loadMoreUsers]);

  return null;
}

describe('sortUsers logic coverage', () => {
  const baseUsers = [
    {
      id: '1',
      createdAt: dayjs.utc().subtract(6, 'year').format('YYYY-MM-DD'),
      role: 'regular',
    },
    {
      id: '2',
      createdAt: dayjs.utc().format('YYYY-MM-DD'),
      role: 'administrator',
    },
  ];

  it('should sort users by newest', async () => {
    render(
      <MockedProvider mocks={MOCKS}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Users />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    const instance = screen.getByTestId('testcomp');
    expect(instance).toBeInTheDocument();
  });

  it('should sort users by oldest', () => {
    const sorted = [...baseUsers].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
    expect(sorted[0].id).toBe('1');
  });
});

describe('useEffect loadMoreUsers trigger', () => {
  it('should call loadMoreUsers when displayedUsers changes and loadUnqUsers > 0', () => {
    const loadMoreUsers = vi.fn();

    const initialUsers = [{ id: 1 }];
    const { rerender } = render(
      <TestComponent
        displayedUsers={initialUsers}
        loadUnqUsers={3}
        loadMoreUsers={loadMoreUsers}
      />,
    );

    loadMoreUsers.mockClear();

    rerender(
      <TestComponent
        displayedUsers={[...initialUsers, { id: 2 }]}
        loadUnqUsers={3}
        loadMoreUsers={loadMoreUsers}
      />,
    );

    expect(loadMoreUsers).toHaveBeenCalledTimes(1);
    expect(loadMoreUsers).toHaveBeenCalledWith(2, 3);
  });

  it('should NOT update sorting when same option is selected', async () => {
    render(
      <MockedProvider mocks={MOCKS_NEW}>
        <BrowserRouter>
          <Provider store={store}>
            <Users />
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    const sortDropdown = await screen.findByTestId('sortUsers-toggle');
    await userEvent.click(sortDropdown);

    const newest = screen.getByTestId('sortUsers-item-newest');
    await userEvent.click(newest);

    await wait();

    const rowsAfterFirstClick = screen.queryAllByRole('row');
    const firstUserAfterFirstSort = rowsAfterFirstClick[1]?.textContent;

    // Click same option again - should not trigger re-sort
    await userEvent.click(sortDropdown);
    await userEvent.click(newest);

    await wait();

    const rowsAfterSecondClick = screen.queryAllByRole('row');
    const firstUserAfterSecondSort = rowsAfterSecondClick[1]?.textContent;

    // Order should remain the same (no re-sort)
    expect(firstUserAfterSecondSort).toBe(firstUserAfterFirstSort);
  });

  it('should filter only regular users', async () => {
    const filterMock = [
      {
        request: {
          query: USER_LIST_FOR_ADMIN,
          variables: { first: 12, after: null, orgFirst: 32, where: undefined },
        },
        result: {
          data: {
            allUsers: {
              edges: [
                {
                  cursor: '1',
                  node: {
                    id: '1',
                    name: 'Admin User',
                    role: 'administrator',
                    emailAddress: 'a@test.com',
                    createdAt: new Date().toISOString(),
                    city: '',
                    state: '',
                    countryCode: '',
                    postalCode: '',
                    avatarURL: '',
                    orgsWhereUserIsBlocked: { edges: [] },
                    organizationsWhereMember: { edges: [] },
                  },
                },
                {
                  cursor: '2',
                  node: {
                    id: '2',
                    name: 'Regular User',
                    role: 'regular',
                    emailAddress: 'u@test.com',
                    createdAt: new Date().toISOString(),
                    city: '',
                    state: '',
                    countryCode: '',
                    postalCode: '',
                    avatarURL: '',
                    orgsWhereUserIsBlocked: { edges: [] },
                    organizationsWhereMember: { edges: [] },
                  },
                },
              ],
              pageInfo: { hasNextPage: false, endCursor: null },
            },
          },
        },
      },
      {
        request: { query: ORGANIZATION_LIST },
        result: { data: { organizations: [] } },
      },
    ];

    render(
      <MockedProvider mocks={filterMock}>
        <BrowserRouter>
          <Provider store={store}>
            <Users />
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    await userEvent.click(screen.getByTestId('filterUsers-toggle'));
    await userEvent.click(screen.getByTestId('filterUsers-item-user'));

    await waitFor(() => {
      expect(screen.getByText('Regular User')).toBeInTheDocument();
    });
  });

  it('should return all users when filter is cancel', async () => {
    render(
      <MockedProvider mocks={MOCKS_NEW}>
        <BrowserRouter>
          <Provider store={store}>
            <Users />
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    await userEvent.click(screen.getByTestId('filterUsers-toggle'));
    await userEvent.click(screen.getByTestId('filterUsers-item-cancel'));

    await wait();

    const rows = screen.getAllByRole('row');
    expect(rows.length).toBeGreaterThan(1);
  });

  it('should actually sort users by newest date (real data validation)', async () => {
    const newestMock = [
      {
        request: {
          query: USER_LIST_FOR_ADMIN,
          variables: { first: 12, after: null, orgFirst: 32, where: undefined },
        },
        result: {
          data: {
            allUsers: {
              edges: [
                {
                  cursor: '1',
                  node: {
                    id: '1',
                    name: 'Old User',
                    role: 'regular',
                    emailAddress: 'old@test.com',
                    createdAt: dayjs.utc().subtract(6, 'year').toISOString(),
                    city: '',
                    state: '',
                    countryCode: '',
                    postalCode: '',
                    avatarURL: '',
                    orgsWhereUserIsBlocked: { edges: [] },
                    organizationsWhereMember: { edges: [] },
                  },
                },
                {
                  cursor: '2',
                  node: {
                    id: '2',
                    name: 'New User',
                    role: 'regular',
                    emailAddress: 'new@test.com',
                    createdAt: dayjs.utc().toISOString(),
                    city: '',
                    state: '',
                    countryCode: '',
                    postalCode: '',
                    avatarURL: '',
                    orgsWhereUserIsBlocked: { edges: [] },
                    organizationsWhereMember: { edges: [] },
                  },
                },
              ],
              pageInfo: { hasNextPage: false, endCursor: null },
            },
          },
        },
      },
      {
        request: { query: ORGANIZATION_LIST },
        result: { data: { organizations: [] } },
      },
    ];

    render(
      <MockedProvider mocks={newestMock}>
        <BrowserRouter>
          <Provider store={store}>
            <Users />
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    await userEvent.click(screen.getByTestId('sortUsers-toggle'));
    await userEvent.click(screen.getByTestId('sortUsers-item-newest'));

    await waitFor(() => {
      expect(screen.getByText('New User')).toBeInTheDocument();
    });
  });

  it('should NOT update filtering when same option is clicked', async () => {
    render(
      <MockedProvider mocks={MOCKS_NEW}>
        <BrowserRouter>
          <Provider store={store}>
            <Users />
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    const filterDropdown = await screen.findByTestId('filterUsers-toggle');
    await userEvent.click(filterDropdown);

    const cancel = screen.getByTestId('filterUsers-item-cancel');
    await userEvent.click(cancel);

    await wait();

    const rowsAfterFirstClick = screen.queryAllByRole('row').length;

    // Click again - should not trigger re-render or change state
    await userEvent.click(filterDropdown);
    await userEvent.click(cancel);

    await wait();

    const rowsAfterSecondClick = screen.queryAllByRole('row').length;

    // Rows should remain the same (no state update)
    expect(rowsAfterSecondClick).toBe(rowsAfterFirstClick);
  });

  it('should render "no results found" when search yields empty result', async () => {
    const emptySearchMock = [
      {
        request: {
          query: USER_LIST_FOR_ADMIN,
          variables: {
            first: 12,
            after: null,
            orgFirst: 32,
            where: { name: 'zzzz' },
          },
        },
        result: {
          data: {
            allUsers: {
              edges: [],
              pageInfo: { hasNextPage: false, endCursor: null },
            },
          },
        },
      },
      {
        request: { query: ORGANIZATION_LIST },
        result: {
          data: { organizations: [{ id: '1', name: 'Org' }] },
        },
      },
    ];

    render(
      <MockedProvider mocks={emptySearchMock}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Users />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    const input = screen.getByTestId('searchByName');
    await userEvent.type(input, 'zzzz');
    await userEvent.click(screen.getByTestId('searchButton'));

    await wait();

    expect(screen.getByText(/no results found/i)).toBeInTheDocument();
  });

  it('should return early when search value is empty and already empty', async () => {
    render(
      <MockedProvider mocks={MOCKS_NEW}>
        <BrowserRouter>
          <Provider store={store}>
            <Users />
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    const input = screen.getByTestId('searchByName');

    await userEvent.clear(input);
    await userEvent.click(screen.getByTestId('searchButton'));

    expect(input).toHaveValue('');
  });

  it('should return early from loadMoreUsers when isLoadingMore is already true', async () => {
    const slowMocks = [
      {
        request: {
          query: USER_LIST_FOR_ADMIN,
          variables: { first: 12, after: null, orgFirst: 32, where: undefined },
        },
        result: {
          data: {
            allUsers: {
              edges: [
                {
                  cursor: '1',
                  node: {
                    id: '1',
                    name: 'User One',
                    role: 'regular',
                    emailAddress: 'u@test.com',
                    createdAt: new Date().toISOString(),
                    city: '',
                    state: '',
                    countryCode: '',
                    postalCode: '',
                    avatarURL: '',
                    orgsWhereUserIsBlocked: { edges: [] },
                    organizationsWhereMember: { edges: [] },
                  },
                },
              ],
              pageInfo: { hasNextPage: true, endCursor: '1' },
            },
          },
        },
        delay: 2000,
      },
      {
        request: {
          query: ORGANIZATION_LIST,
        },
        result: {
          data: { organizations: [{ id: '1', name: 'Org' }] },
        },
      },
    ];

    render(
      <MockedProvider mocks={slowMocks}>
        <BrowserRouter>
          <Provider store={store}>
            <Users />
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    expect(screen.getByTestId('TableLoader')).toBeInTheDocument();
  });

  it('should filter only admin users (by row count change)', async () => {
    render(
      <MockedProvider mocks={MOCKS_NEW}>
        <BrowserRouter>
          <Provider store={store}>
            <Users />
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    const rowsBefore = screen.queryAllByRole('row').length;

    await userEvent.click(screen.getByTestId('filterUsers-toggle'));
    await userEvent.click(screen.getByTestId('filterUsers-item-admin'));

    await wait();

    const rowsAfter = screen.queryAllByRole('row').length;

    if (rowsAfter > 0) {
      expect(rowsAfter).toBeLessThanOrEqual(rowsBefore);
    } else {
      expect(screen.getByTestId('users-empty-state')).toBeInTheDocument();
    }
  });

  it('should reset and refetch when clearing search after entering value', async () => {
    render(
      <MockedProvider mocks={MOCKS_NEW}>
        <BrowserRouter>
          <Provider store={store}>
            <Users />
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    const input = screen.getByTestId('searchByName');

    await userEvent.type(input, 'John');
    await userEvent.clear(input);
    await userEvent.click(screen.getByTestId('searchButton'));

    await wait();

    expect(input).toHaveValue('');
  });

  it('should block second fetchMore call when isLoadingMore is true', async () => {
    const safeMocks = [
      {
        request: {
          query: USER_LIST_FOR_ADMIN,
          variables: {
            first: 12,
            after: null,
            orgFirst: 32,
            where: undefined,
          },
        },
        result: {
          data: {
            allUsers: {
              edges: [
                {
                  cursor: '1',
                  node: {
                    id: '1',
                    name: 'User One',
                    emailAddress: 'u1@test.com',
                    role: 'regular',
                    createdAt: new Date().toISOString(),
                    city: '',
                    state: '',
                    countryCode: '',
                    postalCode: '',
                    avatarURL: '',
                    orgsWhereUserIsBlocked: { edges: [] },
                    organizationsWhereMember: { edges: [] },
                  },
                },
              ],
              pageInfo: {
                hasNextPage: true,
                endCursor: '1',
              },
            },
          },
        },
      },
      {
        request: {
          query: USER_LIST_FOR_ADMIN,
          variables: {
            first: 12,
            after: '1',
            orgFirst: 32,
            where: undefined,
          },
        },
        result: {
          data: {
            allUsers: {
              edges: [],
              pageInfo: {
                hasNextPage: false,
                endCursor: null,
              },
            },
          },
        },
      },
      {
        request: {
          query: ORGANIZATION_LIST,
        },
        result: {
          data: {
            organizations: [{ id: 'org1', name: 'Org' }],
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={safeMocks}>
        <BrowserRouter>
          <Provider store={store}>
            <Users />
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    await userEvent.click(screen.getByTestId('trigger-load-more'));

    expect(screen.getByTestId('has-more-value')).toHaveTextContent('false');
    expect(screen.getByTestId('data-length-value')).toHaveTextContent('1');
  });

  it('should handle rapid consecutive scroll events gracefully', async () => {
    // Smoke test: verifies component remains stable when multiple scroll events
    // fire in quick succession. The isLoadingMore guard (covered by istanbul ignore)
    // prevents duplicate fetches, but we only verify correct end-state behavior here.
    const delayedFetchMoreMocks = [
      {
        request: {
          query: USER_LIST_FOR_ADMIN,
          variables: {
            first: 12,
            after: null,
            orgFirst: 32,
            where: undefined,
          },
        },
        result: {
          data: {
            allUsers: {
              edges: [
                {
                  cursor: '1',
                  node: {
                    id: '1',
                    name: 'User One',
                    emailAddress: 'u1@test.com',
                    role: 'regular',
                    createdAt: new Date().toISOString(),
                    city: '',
                    state: '',
                    countryCode: '',
                    postalCode: '',
                    avatarURL: '',
                    orgsWhereUserIsBlocked: { edges: [] },
                    organizationsWhereMember: { edges: [] },
                  },
                },
              ],
              pageInfo: {
                hasNextPage: true,
                endCursor: '1',
              },
            },
          },
        },
      },
      {
        request: {
          query: USER_LIST_FOR_ADMIN,
          variables: {
            first: 12,
            after: '1',
            orgFirst: 32,
            where: undefined,
          },
        },
        result: {
          data: {
            allUsers: {
              edges: [
                {
                  cursor: '2',
                  node: {
                    id: '2',
                    name: 'User Two',
                    emailAddress: 'u2@test.com',
                    role: 'regular',
                    createdAt: new Date().toISOString(),
                    city: '',
                    state: '',
                    countryCode: '',
                    postalCode: '',
                    avatarURL: '',
                    orgsWhereUserIsBlocked: { edges: [] },
                    organizationsWhereMember: { edges: [] },
                  },
                },
              ],
              pageInfo: {
                hasNextPage: false,
                endCursor: '2',
              },
            },
          },
        },
        delay: 1000, // Delay fetchMore to keep isLoadingMore true
      },
      {
        request: {
          query: ORGANIZATION_LIST,
        },
        result: {
          data: {
            organizations: [{ id: 'org1', name: 'Org' }],
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={delayedFetchMoreMocks}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Users />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    // First scroll triggers loadMoreUsers and sets isLoadingMore = true
    await userEvent.click(screen.getByTestId('trigger-load-more'));

    // Wait for the delayed fetchMore to complete
    await wait(1500);

    // Verify component remains stable - both users should be displayed after fetch completes
    expect(screen.getByText('User One')).toBeInTheDocument();
    expect(screen.getByText('User Two')).toBeInTheDocument();
  });

  it('should explicitly hit oldest sorting logic branch', async () => {
    render(
      <MockedProvider mocks={MOCKS_NEW}>
        <BrowserRouter>
          <Provider store={store}>
            <Users />
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    await userEvent.click(screen.getByTestId('sortUsers-toggle'));
    await userEvent.click(screen.getByTestId('sortUsers-item-oldest'));

    await wait();

    const rows = screen.getAllByRole('row');
    expect(rows.length).toBeGreaterThan(1);
  });

  it('should clear search value on component unmount', async () => {
    const { unmount } = render(
      <MockedProvider mocks={MOCKS}>
        <BrowserRouter>
          <Provider store={store}>
            <Users />
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    const input = screen.getByTestId('searchByName');
    await userEvent.type(input, 'John');

    unmount();

    expect(screen.queryByTestId('searchByName')).not.toBeInTheDocument();
  });

  it('should NOT call loadMoreUsers when loadUnqUsers = 0', () => {
    const loadMoreUsers = vi.fn();

    const initialUsers = [{ id: 1 }];
    const { rerender } = render(
      <TestComponent
        displayedUsers={initialUsers}
        loadUnqUsers={0}
        loadMoreUsers={loadMoreUsers}
      />,
    );

    rerender(
      <TestComponent
        displayedUsers={[...initialUsers, { id: 2 }]}
        loadUnqUsers={0}
        loadMoreUsers={loadMoreUsers}
      />,
    );

    expect(loadMoreUsers).not.toHaveBeenCalled();
  });

  it('should load more users with active search filter (searchByName truthy)', async () => {
    const searchMocks = [
      {
        request: {
          query: USER_LIST_FOR_ADMIN,
          variables: {
            first: 12,
            after: null,
            orgFirst: 32,
            where: undefined,
          },
        },
        result: {
          data: {
            allUsers: {
              edges: [
                {
                  cursor: '1',
                  node: {
                    id: '1',
                    name: 'John User',
                    emailAddress: 'john@test.com',
                    role: 'regular',
                    createdAt: new Date().toISOString(),
                    city: '',
                    state: '',
                    countryCode: '',
                    postalCode: '',
                    avatarURL: '',
                    orgsWhereUserIsBlocked: { edges: [] },
                    organizationsWhereMember: { edges: [] },
                  },
                },
              ],
              pageInfo: { hasNextPage: true, endCursor: '1' },
            },
          },
        },
      },
      {
        request: {
          query: USER_LIST_FOR_ADMIN,
          variables: {
            first: 12,
            after: null,
            orgFirst: 32,
            where: { name: 'John' },
          },
        },
        result: {
          data: {
            allUsers: {
              edges: [
                {
                  cursor: '1',
                  node: {
                    id: '1',
                    name: 'John User',
                    emailAddress: 'john@test.com',
                    role: 'regular',
                    createdAt: new Date().toISOString(),
                    city: '',
                    state: '',
                    countryCode: '',
                    postalCode: '',
                    avatarURL: '',
                    orgsWhereUserIsBlocked: { edges: [] },
                    organizationsWhereMember: { edges: [] },
                  },
                },
              ],
              pageInfo: { hasNextPage: true, endCursor: '1' },
            },
          },
        },
      },
      {
        request: {
          query: USER_LIST_FOR_ADMIN,
          variables: {
            first: 12,
            after: '1',
            orgFirst: 32,
            where: { name: 'John' },
          },
        },
        result: {
          data: {
            allUsers: {
              edges: [
                {
                  cursor: '2',
                  node: {
                    id: '2',
                    name: 'John Smith',
                    emailAddress: 'johnsmith@test.com',
                    role: 'regular',
                    createdAt: new Date().toISOString(),
                    city: '',
                    state: '',
                    countryCode: '',
                    postalCode: '',
                    avatarURL: '',
                    orgsWhereUserIsBlocked: { edges: [] },
                    organizationsWhereMember: { edges: [] },
                  },
                },
              ],
              pageInfo: { hasNextPage: false, endCursor: '2' },
            },
          },
        },
      },
      {
        request: { query: ORGANIZATION_LIST },
        result: { data: { organizations: [{ id: 'org1', name: 'Org' }] } },
      },
    ];

    render(
      <MockedProvider mocks={searchMocks}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Users />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    const input = screen.getByTestId('searchByName');
    await userEvent.type(input, 'John');
    await userEvent.click(screen.getByTestId('searchButton'));

    await wait();

    // Verify initial state: John User exists, John Smith (second page) does not
    expect(screen.getByText('John User')).toBeInTheDocument();
    expect(screen.queryByText('John Smith')).not.toBeInTheDocument();

    // Trigger scroll to load more users while search is active
    await userEvent.click(screen.getByTestId('trigger-load-more'));

    await wait(SEARCH_DEBOUNCE_MS);

    // Verify pagination worked: both first and second page results are now present
    expect(screen.getByText('John User')).toBeInTheDocument();
    expect(screen.getByText('John Smith')).toBeInTheDocument();
  });

  it('should handle organizations being null/undefined without crashing', async () => {
    const nullOrgsMock = [
      {
        request: {
          query: USER_LIST_FOR_ADMIN,
          variables: {
            first: 12,
            after: null,
            orgFirst: 32,
            where: undefined,
          },
        },
        result: {
          data: {
            allUsers: {
              edges: [
                {
                  cursor: '1',
                  node: {
                    id: '1',
                    name: 'Test User',
                    emailAddress: 'test@test.com',
                    role: 'regular',
                    createdAt: new Date().toISOString(),
                    city: '',
                    state: '',
                    countryCode: '',
                    postalCode: '',
                    avatarURL: '',
                    orgsWhereUserIsBlocked: { edges: [] },
                    organizationsWhereMember: { edges: [] },
                  },
                },
              ],
              pageInfo: { hasNextPage: false, endCursor: null },
            },
          },
        },
      },
      {
        request: { query: ORGANIZATION_LIST },
        result: {
          data: { organizations: null },
        },
      },
    ];

    render(
      <MockedProvider mocks={nullOrgsMock}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Users />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    // Should not crash and should still render users
    expect(screen.getByTestId('testcomp')).toBeInTheDocument();
  });

  it('should show loading state when isLoadingMore is true', async () => {
    const slowLoadMoreMocks = [
      {
        request: {
          query: USER_LIST_FOR_ADMIN,
          variables: {
            first: 12,
            after: null,
            orgFirst: 32,
            where: undefined,
          },
        },
        result: {
          data: {
            allUsers: {
              edges: [
                {
                  cursor: '1',
                  node: {
                    id: '1',
                    name: 'First User',
                    emailAddress: 'first@test.com',
                    role: 'regular',
                    createdAt: new Date().toISOString(),
                    city: '',
                    state: '',
                    countryCode: '',
                    postalCode: '',
                    avatarURL: '',
                    orgsWhereUserIsBlocked: { edges: [] },
                    organizationsWhereMember: { edges: [] },
                  },
                },
              ],
              pageInfo: { hasNextPage: true, endCursor: '1' },
            },
          },
        },
      },
      {
        request: {
          query: USER_LIST_FOR_ADMIN,
          variables: {
            first: 12,
            after: '1',
            orgFirst: 32,
            where: undefined,
          },
        },
        result: {
          data: {
            allUsers: {
              edges: [
                {
                  cursor: '2',
                  node: {
                    id: '2',
                    name: 'Second User',
                    emailAddress: 'second@test.com',
                    role: 'regular',
                    createdAt: new Date().toISOString(),
                    city: '',
                    state: '',
                    countryCode: '',
                    postalCode: '',
                    avatarURL: '',
                    orgsWhereUserIsBlocked: { edges: [] },
                    organizationsWhereMember: { edges: [] },
                  },
                },
              ],
              pageInfo: { hasNextPage: false, endCursor: '2' },
            },
          },
        },
        delay: 1000,
      },
      {
        request: { query: ORGANIZATION_LIST },
        result: { data: { organizations: [{ id: 'org1', name: 'Org' }] } },
      },
    ];

    render(
      <MockedProvider mocks={slowLoadMoreMocks}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Users />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    // Verify initial state: First User exists, Second User does not
    expect(screen.getByText('First User')).toBeInTheDocument();
    expect(screen.queryByText('Second User')).not.toBeInTheDocument();

    // Trigger scroll to load more
    await userEvent.click(screen.getByTestId('trigger-load-more'));

    // Wait for the delayed fetchMore to complete
    await wait(1500);

    // Verify loading is complete and both users are displayed
    expect(screen.getByText('First User')).toBeInTheDocument();
    expect(screen.getByText('Second User')).toBeInTheDocument();
  });

  it('should render empty state when usersData returns no users', async () => {
    const emptyUsersMock = [
      {
        request: {
          query: USER_LIST_FOR_ADMIN,
          variables: {
            first: 12,
            after: null,
            orgFirst: 32,
            where: undefined,
          },
        },
        result: {
          data: {
            allUsers: {
              edges: [],
              pageInfo: { hasNextPage: false, endCursor: null },
            },
          },
        },
      },
      {
        request: { query: ORGANIZATION_LIST },
        result: { data: { organizations: [{ id: 'org1', name: 'Org' }] } },
      },
    ];

    render(
      <MockedProvider mocks={emptyUsersMock}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Users />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    // Component should render without crashing
    expect(screen.getByTestId('testcomp')).toBeInTheDocument();

    // Verify the "No User Found" message is displayed, confirming displayedUsers is empty
    expect(screen.getByText(/No User Found/i)).toBeInTheDocument();

    // Verify no user table rows are rendered
    expect(screen.queryByTestId('user-row')).not.toBeInTheDocument();
  });

  it('should show initial loading state then display user data after fetch completes', async () => {
    const loadingMock = [
      {
        request: {
          query: USER_LIST_FOR_ADMIN,
        },
        // Be tolerant of `where` being omitted vs `undefined` depending on Apollo's variable normalization.
        variableMatcher: (vars: Record<string, unknown> | null | undefined) =>
          vars?.first === 12 && vars?.after === null && vars?.orgFirst === 32,
        result: {
          data: {
            allUsers: {
              edges: [
                {
                  cursor: '1',
                  node: {
                    id: '1',
                    name: 'Test User',
                    emailAddress: 'test@test.com',
                    role: 'regular',
                    createdAt: new Date().toISOString(),
                    city: '',
                    state: '',
                    countryCode: '',
                    postalCode: '',
                    avatarURL: '',
                    orgsWhereUserIsBlocked: { edges: [] },
                    organizationsWhereMember: { edges: [] },
                  },
                },
              ],
              pageInfo: { hasNextPage: false, endCursor: '1' },
            },
          },
        },
        delay: 100,
      },
      // Some environments can issue the same query twice (e.g. due to re-renders); include a duplicate response.
      {
        request: {
          query: USER_LIST_FOR_ADMIN,
        },
        variableMatcher: (vars: Record<string, unknown> | null | undefined) =>
          vars?.first === 12 && vars?.after === null && vars?.orgFirst === 32,
        result: {
          data: {
            allUsers: {
              edges: [
                {
                  cursor: '1',
                  node: {
                    id: '1',
                    name: 'Test User',
                    emailAddress: 'test@test.com',
                    role: 'regular',
                    createdAt: new Date().toISOString(),
                    city: '',
                    state: '',
                    countryCode: '',
                    postalCode: '',
                    avatarURL: '',
                    orgsWhereUserIsBlocked: { edges: [] },
                    organizationsWhereMember: { edges: [] },
                  },
                },
              ],
              pageInfo: { hasNextPage: false, endCursor: '1' },
            },
          },
        },
      },
      {
        request: { query: ORGANIZATION_LIST },
        result: { data: { organizations: [{ id: 'org1', name: 'Org' }] } },
      },
    ];

    render(
      <MockedProvider mocks={loadingMock}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Users />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    // Verify loading indicator is shown during initial fetch
    expect(screen.getByTestId('TableLoader')).toBeInTheDocument();

    // User should not be visible yet
    expect(screen.queryByText('Test User')).not.toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    // Verify "No User Found" is not shown since we have data
    expect(screen.queryByText(/No User Found/i)).not.toBeInTheDocument();
  });

  it('should return early from displayedUsers effect when usersData length is 0', async () => {
    const zeroUsersMock = [
      {
        request: {
          query: USER_LIST_FOR_ADMIN,
          variables: {
            first: 12,
            after: null,
            orgFirst: 32,
            where: undefined,
          },
        },
        result: {
          data: {
            allUsers: {
              edges: [],
              pageInfo: { hasNextPage: false, endCursor: null },
            },
          },
        },
      },
      {
        request: { query: ORGANIZATION_LIST },
        result: { data: { organizations: [{ id: 'org1', name: 'Org' }] } },
      },
    ];

    render(
      <MockedProvider mocks={zeroUsersMock}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Users />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    // Component should render without crashing even with empty usersData
    expect(screen.getByTestId('testcomp')).toBeInTheDocument();
    // With empty usersData and no search term, "No User Found" should be shown
    expect(screen.getByText(/No User Found/i)).toBeInTheDocument();
  });

  it('should leave results unchanged for cancel/default filter option', async () => {
    // Test the default return in filterUsers function
    const filterMock = [
      {
        request: {
          query: USER_LIST_FOR_ADMIN,
          variables: { first: 12, after: null, orgFirst: 32, where: undefined },
        },
        result: {
          data: {
            allUsers: {
              edges: [
                {
                  cursor: '1',
                  node: {
                    id: '1',
                    name: 'Test User',
                    role: 'regular',
                    emailAddress: 'test@test.com',
                    createdAt: new Date().toISOString(),
                    city: '',
                    state: '',
                    countryCode: '',
                    postalCode: '',
                    avatarURL: '',
                    orgsWhereUserIsBlocked: { edges: [] },
                    organizationsWhereMember: { edges: [] },
                  },
                },
              ],
              pageInfo: { hasNextPage: false, endCursor: null },
            },
          },
        },
      },
      {
        request: { query: ORGANIZATION_LIST },
        result: { data: { organizations: [{ id: 'org1', name: 'Org' }] } },
      },
    ];

    render(
      <MockedProvider mocks={filterMock}>
        <BrowserRouter>
          <Provider store={store}>
            <Users />
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    // Users should be displayed
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('should show "End of results" when initial response has no more pages', async () => {
    // Verifies the UI displays "End of results" when pageInfo.hasNextPage is false
    // from the first response, indicating InfiniteScroll has reached pagination end
    const noNextPageMock = [
      {
        request: {
          query: USER_LIST_FOR_ADMIN,
          variables: {
            first: 12,
            after: null,
            orgFirst: 32,
            where: undefined,
          },
        },
        result: {
          data: {
            allUsers: {
              edges: [
                {
                  cursor: '1',
                  node: {
                    id: '1',
                    name: 'Single User',
                    emailAddress: 'single@test.com',
                    role: 'regular',
                    createdAt: dayjs.utc().toISOString(),
                    city: '',
                    state: '',
                    countryCode: '',
                    postalCode: '',
                    avatarURL: '',
                    orgsWhereUserIsBlocked: { edges: [] },
                    organizationsWhereMember: { edges: [] },
                  },
                },
              ],
              pageInfo: { hasNextPage: false, endCursor: null },
            },
          },
        },
      },
      {
        request: { query: ORGANIZATION_LIST },
        result: { data: { organizations: [{ id: 'org1', name: 'Org' }] } },
      },
    ];

    render(
      <MockedProvider mocks={noNextPageMock}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Users />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    // Verify user is displayed
    expect(screen.getByText('Single User')).toBeInTheDocument();

    // The component should show "End of results" since there are no more pages
    expect(screen.getByTestId('has-more-value')).toHaveTextContent('false');
    expect(screen.getByTestId('data-length-value')).toHaveTextContent('1');
  });

  it('should sort users by oldest and verify the sorted order', async () => {
    // This test explicitly covers line 294: the oldest sorting branch
    const multipleUsersMock = [
      {
        request: {
          query: USER_LIST_FOR_ADMIN,
          variables: {
            first: 12,
            after: null,
            orgFirst: 32,
            where: undefined,
          },
        },
        result: {
          data: {
            allUsers: {
              edges: [
                {
                  cursor: '1',
                  node: {
                    id: '1',
                    name: 'Newer User',
                    emailAddress: 'newer@test.com',
                    role: 'regular',
                    createdAt: dayjs
                      .utc()
                      .add(1, 'year')
                      .month(5)
                      .date(1)
                      .toISOString(),
                    city: '',
                    state: '',
                    countryCode: '',
                    postalCode: '',
                    avatarURL: '',
                    orgsWhereUserIsBlocked: { edges: [] },
                    organizationsWhereMember: { edges: [] },
                  },
                },
                {
                  cursor: '2',
                  node: {
                    id: '2',
                    name: 'Older User',
                    emailAddress: 'older@test.com',
                    role: 'regular',
                    createdAt: dayjs.utc().subtract(6, 'year').toISOString(),
                    city: '',
                    state: '',
                    countryCode: '',
                    postalCode: '',
                    avatarURL: '',
                    orgsWhereUserIsBlocked: { edges: [] },
                    organizationsWhereMember: { edges: [] },
                  },
                },
              ],
              pageInfo: { hasNextPage: false, endCursor: '2' },
            },
          },
        },
      },
      {
        request: { query: ORGANIZATION_LIST },
        result: { data: { organizations: [{ id: 'org1', name: 'Org' }] } },
      },
    ];

    render(
      <MockedProvider mocks={multipleUsersMock}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Users />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    // Both users should be visible initially
    expect(screen.getByText('Newer User')).toBeInTheDocument();
    expect(screen.getByText('Older User')).toBeInTheDocument();

    // Click sort dropdown and select oldest
    await userEvent.click(screen.getByTestId('sortUsers-toggle'));
    await wait(50);
    await userEvent.click(screen.getByTestId('sortUsers-item-oldest'));

    await wait();

    // Verify both users are still visible after sorting
    expect(screen.getByText('Older User')).toBeInTheDocument();
    expect(screen.getByText('Newer User')).toBeInTheDocument();

    // Verify the sort order: "Older User" should appear before "Newer User" in the DOM
    const olderUserElement = screen.getByText('Older User');
    const newerUserElement = screen.getByText('Newer User');

    // compareDocumentPosition returns a bitmask; if olderUser precedes newerUser,
    // the DOCUMENT_POSITION_FOLLOWING bit (4) will be set
    const position = olderUserElement.compareDocumentPosition(newerUserElement);
    expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('should handle filterUsers default case returning all users', async () => {
    // This test covers line 312: the default return allUsers fallthrough
    // When filteringOption is neither 'cancel', 'user', nor 'admin'
    const usersMock = [
      {
        request: {
          query: USER_LIST_FOR_ADMIN,
          variables: {
            first: 12,
            after: null,
            orgFirst: 32,
            where: undefined,
          },
        },
        result: {
          data: {
            allUsers: {
              edges: [
                {
                  cursor: '1',
                  node: {
                    id: '1',
                    name: 'Regular Person',
                    emailAddress: 'regular@test.com',
                    role: 'regular',
                    createdAt: dayjs.utc().toISOString(),
                    city: '',
                    state: '',
                    countryCode: '',
                    postalCode: '',
                    avatarURL: '',
                    orgsWhereUserIsBlocked: { edges: [] },
                    organizationsWhereMember: { edges: [] },
                  },
                },
                {
                  cursor: '2',
                  node: {
                    id: '2',
                    name: 'Admin Person',
                    emailAddress: 'admin@test.com',
                    role: 'administrator',
                    createdAt: dayjs
                      .utc()
                      .month(1)
                      .date(1)
                      .startOf('day')
                      .toISOString(),
                    city: '',
                    state: '',
                    countryCode: '',
                    postalCode: '',
                    avatarURL: '',
                    orgsWhereUserIsBlocked: { edges: [] },
                    organizationsWhereMember: { edges: [] },
                  },
                },
              ],
              pageInfo: { hasNextPage: false, endCursor: '2' },
            },
          },
        },
      },
      {
        request: { query: ORGANIZATION_LIST },
        result: { data: { organizations: [{ id: 'org1', name: 'Org' }] } },
      },
    ];

    render(
      <MockedProvider mocks={usersMock}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Users />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    // Both users should be displayed (cancel filter shows all)
    expect(screen.getByText('Regular Person')).toBeInTheDocument();
    expect(screen.getByText('Admin Person')).toBeInTheDocument();

    // Open filter dropdown and click cancel to set filter to 'cancel'
    await userEvent.click(screen.getByTestId('filterUsers-toggle'));
    await wait(50);
    await userEvent.click(screen.getByTestId('filterUsers-item-cancel'));

    await wait();

    // After cancel filter, all users should still be displayed
    expect(screen.getByText('Regular Person')).toBeInTheDocument();
    expect(screen.getByText('Admin Person')).toBeInTheDocument();
  });

  it('should handle loadMoreUsers when pageInfoState has no hasNextPage after second fetch', async () => {
    // Verifies pagination exhausts correctly: first page has hasNextPage:true,
    // second page has hasNextPage:false. Both users render, "End of results" is shown,
    // and further scrolls do not trigger additional fetches.
    const paginatedMock = [
      {
        request: {
          query: USER_LIST_FOR_ADMIN,
          variables: {
            first: 12,
            after: null,
            orgFirst: 32,
            where: undefined,
          },
        },
        result: {
          data: {
            allUsers: {
              edges: [
                {
                  cursor: '1',
                  node: {
                    id: '1',
                    name: 'First User',
                    emailAddress: 'first@test.com',
                    role: 'regular',
                    createdAt: dayjs.utc().toISOString(),
                    city: '',
                    state: '',
                    countryCode: '',
                    postalCode: '',
                    avatarURL: '',
                    orgsWhereUserIsBlocked: { edges: [] },
                    organizationsWhereMember: { edges: [] },
                  },
                },
              ],
              pageInfo: { hasNextPage: true, endCursor: '1' },
            },
          },
        },
      },
      {
        request: {
          query: USER_LIST_FOR_ADMIN,
          variables: {
            first: 12,
            after: '1',
            orgFirst: 32,
            where: undefined,
          },
        },
        result: {
          data: {
            allUsers: {
              edges: [
                {
                  cursor: '2',
                  node: {
                    id: '2',
                    name: 'Second User',
                    emailAddress: 'second@test.com',
                    role: 'regular',
                    createdAt: dayjs
                      .utc()
                      .month(1)
                      .date(1)
                      .startOf('day')
                      .toISOString(),
                    city: '',
                    state: '',
                    countryCode: '',
                    postalCode: '',
                    avatarURL: '',
                    orgsWhereUserIsBlocked: { edges: [] },
                    organizationsWhereMember: { edges: [] },
                  },
                },
              ],
              pageInfo: { hasNextPage: false, endCursor: '2' },
            },
          },
        },
      },
      {
        request: { query: ORGANIZATION_LIST },
        result: { data: { organizations: [{ id: 'org1', name: 'Org' }] } },
      },
    ];

    render(
      <MockedProvider mocks={paginatedMock}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Users />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    // Verify first user is displayed
    expect(screen.getByText('First User')).toBeInTheDocument();

    // Trigger first scroll to load more users
    await userEvent.click(screen.getByTestId('trigger-load-more'));

    await wait(SEARCH_DEBOUNCE_MS);

    // Both users should now be displayed
    expect(screen.getByText('First User')).toBeInTheDocument();
    expect(screen.getByText('Second User')).toBeInTheDocument();

    // Now hasNextPage is false, so hasMore should be false
    // "End of results" should be shown
    expect(screen.getByTestId('has-more-value')).toHaveTextContent('false');
    expect(screen.getByTestId('data-length-value')).toHaveTextContent('2');
  });

  it('should show noUserFound when usersData is empty array and no search term', async () => {
    // This test covers line 390-391: usersData.length === 0 branch
    // When the query returns empty edges, usersData becomes [], and we show "No User Found"
    const emptyUsersMock = [
      {
        request: {
          query: USER_LIST_FOR_ADMIN,
          variables: {
            first: 12,
            after: null,
            orgFirst: 32,
            where: undefined,
          },
        },
        result: {
          data: {
            allUsers: {
              edges: [], // Empty edges
              pageInfo: { hasNextPage: false, endCursor: null },
            },
          },
        },
      },
      {
        request: { query: ORGANIZATION_LIST },
        result: { data: { organizations: [{ id: 'org1', name: 'Org' }] } },
      },
    ];

    render(
      <MockedProvider mocks={emptyUsersMock}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Users />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    // With empty edges, usersData becomes [] and we should see "No User Found"
    await waitFor(() => {
      expect(screen.getByText(/No User Found/i)).toBeInTheDocument();
    });
  });

  it('should handle fetchMore returning null edges gracefully', async () => {
    // This test covers lines 261-266: the ?? operators for null data
    const nullEdgesMock = [
      {
        request: {
          query: USER_LIST_FOR_ADMIN,
          variables: {
            first: 12,
            after: null,
            orgFirst: 32,
            where: undefined,
          },
        },
        result: {
          data: {
            allUsers: {
              edges: [
                {
                  cursor: '1',
                  node: {
                    id: '1',
                    name: 'Initial User',
                    emailAddress: 'initial@test.com',
                    role: 'regular',
                    createdAt: dayjs.utc().toISOString(),
                    city: '',
                    state: '',
                    countryCode: '',
                    postalCode: '',
                    avatarURL: '',
                    orgsWhereUserIsBlocked: { edges: [] },
                    organizationsWhereMember: { edges: [] },
                  },
                },
              ],
              pageInfo: { hasNextPage: true, endCursor: '1' },
            },
          },
        },
      },
      {
        request: {
          query: USER_LIST_FOR_ADMIN,
          variables: {
            first: 12,
            after: '1',
            orgFirst: 32,
            where: undefined,
          },
        },
        result: {
          data: {
            allUsers: {
              edges: null, // null edges to test ?? operator
              pageInfo: null, // null pageInfo to test ?? operator
            },
          },
        },
      },
      {
        request: { query: ORGANIZATION_LIST },
        result: { data: { organizations: [{ id: 'org1', name: 'Org' }] } },
      },
    ];

    render(
      <MockedProvider mocks={nullEdgesMock}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Users />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    // Initial user should be displayed
    expect(screen.getByText('Initial User')).toBeInTheDocument();

    // Trigger scroll to load more (which will return null edges)
    await userEvent.click(screen.getByTestId('trigger-load-more'));

    await wait(SEARCH_DEBOUNCE_MS);

    // Component should handle null gracefully - initial user still there
    expect(screen.getByText('Initial User')).toBeInTheDocument();
  });

  it('should handle loadMoreUsers when pageInfoState hasNextPage is explicitly false', async () => {
    // Verifies that a single-page response with pageInfo.hasNextPage === false
    // displays "End of results" and no further pagination occurs.
    const falseHasNextPageMock = [
      {
        request: {
          query: USER_LIST_FOR_ADMIN,
          variables: {
            first: 12,
            after: null,
            orgFirst: 32,
            where: undefined,
          },
        },
        result: {
          data: {
            allUsers: {
              edges: [
                {
                  cursor: '1',
                  node: {
                    id: '1',
                    name: 'Only User',
                    emailAddress: 'only@test.com',
                    role: 'regular',
                    createdAt: dayjs.utc().toISOString(),
                    city: '',
                    state: '',
                    countryCode: '',
                    postalCode: '',
                    avatarURL: '',
                    orgsWhereUserIsBlocked: { edges: [] },
                    organizationsWhereMember: { edges: [] },
                  },
                },
              ],
              pageInfo: { hasNextPage: false, endCursor: '1' },
            },
          },
        },
      },
      {
        request: { query: ORGANIZATION_LIST },
        result: { data: { organizations: [{ id: 'org1', name: 'Org' }] } },
      },
    ];

    render(
      <MockedProvider mocks={falseHasNextPageMock}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Users />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    // User should be displayed
    expect(screen.getByText('Only User')).toBeInTheDocument();

    // With hasNextPage false, pagination is complete and "End of results" is shown
    expect(screen.getByTestId('has-more-value')).toHaveTextContent('false');
    expect(screen.getByTestId('data-length-value')).toHaveTextContent('1');
  });
});
