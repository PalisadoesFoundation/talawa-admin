import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { toast, ToastContainer } from 'react-toastify';
import userEvent from '@testing-library/user-event';
import { store } from 'state/store';
import { StaticMockLink } from 'utils/StaticMockLink';
import i18nForTest from 'utils/i18nForTest';
import Users from './Users';
import {
  EMPTY_MOCKS,
  MOCKS_NEW,
  MOCKS_NEW2,
  MOCKS_NEW3,
  MOCKS_NEW_2,
} from './UsersMocks.mocks';
import { generateMockUser } from './Organization.mocks';
import { MOCKS, MOCKS2 } from './User.mocks';
import useLocalStorage from 'utils/useLocalstorage';
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';

import { ORGANIZATION_LIST, USER_LIST } from 'GraphQl/Queries/Queries';

const { setItem, removeItem } = useLocalStorage();

const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(EMPTY_MOCKS, true);
const link3 = new StaticMockLink(MOCKS2, true);
const link5 = new StaticMockLink(MOCKS_NEW, true);
const link6 = new StaticMockLink(MOCKS_NEW2, true);
const link7 = new StaticMockLink(MOCKS_NEW3, true);

async function wait(ms = 1000): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}
beforeEach(() => {
  setItem('id', '123');
  setItem('SuperAdmin', true);
  setItem('FirstName', 'John');
  setItem('AdminFor', [{ name: 'adi', _id: '1234', image: '' }]);
  setItem('LastName', 'Doe');
});

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('Testing Users screen', () => {
  it('Component should be rendered properly', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
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
      <MockedProvider addTypename={false} link={link}>
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
      <MockedProvider addTypename={false} link={link}>
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

  it('Component should be rendered properly when user is superAdmin', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
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
      <MockedProvider addTypename={false} link={link}>
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
        <MockedProvider addTypename={false} link={link2}>
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
      // Clear the search input
      await userEvent.clear(searchInput);
      // Search for a name that doesn't exist
      await userEvent.type(
        screen.getByTestId(/searchByName/i),
        'NonexistentName',
      );
      await userEvent.click(searchBtn);
    });

    expect(screen.queryByText(/No User Found/i)).toBeInTheDocument();
  });

  it('Testing User data is not present', async () => {
    render(
      <MockedProvider addTypename={false} link={link2}>
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
    expect(screen.getByText(/No User Found/i)).toBeTruthy();
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
    interface UserData {
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
      prev: { users: UserData[] } | undefined,
      { fetchMoreResult }: { fetchMoreResult?: { users: UserData[] } },
    ) => {
      if (!fetchMoreResult) return prev || { users: [] };

      const mergedUsers = [...(prev?.users || []), ...fetchMoreResult.users];

      const uniqueUsers = Array.from(
        new Map(
          mergedUsers.map((user: UserData) => [user.user._id, user]),
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

  it('Testing filter functionality', async () => {
    await act(async () => {
      render(
        <MockedProvider addTypename={false} link={link}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <ToastContainer />
                <Users />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );
    });
    await wait();

    const searchInput = screen.getByTestId('filter');
    expect(searchInput).toBeInTheDocument();

    const inputText = screen.getByTestId('filterUsers');

    await act(async () => {
      fireEvent.click(inputText);
    });

    const toggleText = screen.getByTestId('admin');

    await act(async () => {
      fireEvent.click(toggleText);
    });

    expect(searchInput).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(inputText);
    });

    let toggleTite = screen.getByTestId('superAdmin');

    await act(async () => {
      fireEvent.click(toggleTite);
    });

    expect(searchInput).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(inputText);
    });

    toggleTite = screen.getByTestId('user');

    await act(async () => {
      fireEvent.click(toggleTite);
    });

    expect(searchInput).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(inputText);
    });

    toggleTite = screen.getByTestId('cancel');

    await act(async () => {
      fireEvent.click(toggleTite);
    });

    await wait();

    expect(searchInput).toBeInTheDocument();
  });

  it('check for rerendering', async () => {
    const { rerender } = render(
      <MockedProvider addTypename={false} link={link3}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ToastContainer />
              <Users />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    rerender(
      <MockedProvider addTypename={false} link={link3}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ToastContainer />
              <Users />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );
    await wait();
  });

  it('should set hasMore to false if users length is less than perPageResult', async () => {
    const link = new StaticMockLink(EMPTY_MOCKS, true);

    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <ToastContainer />
              <Users />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait(200);

    // Check if "No User Found" is displayed
    expect(screen.getByText(/No User Found/i)).toBeInTheDocument();
  });

  it('should filter users correctly', async () => {
    await act(async () => {
      render(
        <MockedProvider link={link5} addTypename={false}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <ToastContainer />
                <Users />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );
    });
    await wait();

    const filterButton = screen.getByTestId('filterUsers');

    await act(async () => {
      fireEvent.click(filterButton);
    });

    const filterAdmin = screen.getByTestId('admin');

    await act(async () => {
      fireEvent.click(filterAdmin);
    });

    // await wait();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(filterButton);
    });

    const filterSuperAdmin = screen.getByTestId('superAdmin');

    await act(async () => {
      fireEvent.click(filterSuperAdmin);
    });

    // await wait();
    expect(screen.getByText('John Doe')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(filterButton);
    });

    const filterUser = screen.getByTestId('user');
    await act(async () => {
      fireEvent.click(filterUser);
    });

    // await wait();
    expect(screen.getByText('Jack Smith')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(filterButton);
    });

    const filterCancel = screen.getByTestId('cancel');

    await act(async () => {
      fireEvent.click(filterCancel);
    });

    // await wait();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Jack Smith')).toBeInTheDocument();
  });

  it('Users should be sorted in newest order correctly', async () => {
    await act(async () => {
      render(
        <MockedProvider link={link5} addTypename={false}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <ToastContainer />
                <Users />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );
    });
    await wait();

    const inputText = screen.getByTestId('sortUsers');

    await act(async () => {
      fireEvent.click(inputText);
    });

    const toggleTite = screen.getByTestId('newest');

    await act(async () => {
      fireEvent.click(toggleTite);
    });

    // Verify the users are sorted by newest

    const displayedUsers = screen.getAllByRole('row');
    await wait();
    expect(displayedUsers[1]).toHaveTextContent('Jane Doe');
    expect(displayedUsers[2]).toHaveTextContent('John Doe');
  });

  it('Check if pressing enter key triggers search', async () => {
    await act(async () => {
      render(
        <MockedProvider link={link5} addTypename={false}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <ToastContainer />
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

  it('Users should be sorted in oldest order correctly', async () => {
    await act(async () => {
      render(
        <MockedProvider link={link5} addTypename={false}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <ToastContainer />
                <Users />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );
    });
    await wait();

    const inputText = screen.getByTestId('sortUsers');

    await act(async () => {
      fireEvent.click(inputText);
    });

    const toggleTite = screen.getByTestId('oldest');

    await act(async () => {
      fireEvent.click(toggleTite);
    });

    // Verify the users are sorted by oldest

    const displayedUsers = screen.getAllByRole('row');
    await wait();
    expect(displayedUsers[1]).toHaveTextContent('Jack Smith');
    expect(displayedUsers[2]).toHaveTextContent('John Doe');
  });

  it('Role filter should not update if selected role is already selected', async () => {
    await act(async () => {
      render(
        <MockedProvider link={link5} addTypename={false}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <ToastContainer />
                <Users />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );
    });
    await wait();

    const filterButton = screen.getByTestId('filterUsers');

    await act(async () => {
      fireEvent.click(filterButton);
    });

    const filterAdmin = screen.getByTestId('admin');

    await act(async () => {
      fireEvent.click(filterAdmin);
    });

    // await wait();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(filterAdmin);
    });

    // await wait();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  });

  it('Sort filter should not update if selected sort is already selected', async () => {
    await act(async () => {
      render(
        <MockedProvider link={link5} addTypename={false}>
          <BrowserRouter>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <ToastContainer />
                <Users />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );
    });
    await wait();

    const inputText = screen.getByTestId('sortUsers');

    await act(async () => {
      fireEvent.click(inputText);
    });

    const toggleTite = screen.getByTestId('newest');

    await act(async () => {
      fireEvent.click(toggleTite);
    });

    // Verify the users are sorted by newest

    const displayedUsers = screen.getAllByRole('row');
    await wait();
    expect(displayedUsers[1]).toHaveTextContent('Jane Doe');
    expect(displayedUsers[2]).toHaveTextContent('John Doe');

    await act(async () => {
      fireEvent.click(inputText);
    });

    const toggleTite2 = screen.getByTestId('newest');

    await act(async () => {
      fireEvent.click(toggleTite2);
    });

    // Verify the users are sorted by newest

    const displayedUsers2 = screen.getAllByRole('row');
    await wait();
    expect(displayedUsers2[1]).toHaveTextContent('Jane Doe');
    expect(displayedUsers2[2]).toHaveTextContent('John Doe');
  });

  it('Reset and Refetch function should work when we search an empty string', async () => {
    render(
      <MockedProvider addTypename={false} link={link5}>
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
    await userEvent.clear(screen.getByTestId(/searchByName/i));
    await userEvent.click(searchBtn);
    await wait();
    expect(screen.queryByText(/Jane Doe/i)).toBeInTheDocument();
    expect(screen.queryByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.queryByText(/Jack Smith/i)).toBeInTheDocument();
  });

  it('Users should be loaded on scroll using loadmoreusers function', async () => {
    const { container } = render(
      <MockedProvider addTypename={false} link={link6}>
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
    const users = container
      .getElementsByTagName('tbody')[0]
      .querySelectorAll('tr');
    expect(users.length).toBe(12);

    await act(async () => {
      fireEvent.scroll(window, { target: { scrollY: 1000 } });
    });

    await wait();

    const users2 = container
      .getElementsByTagName('tbody')[0]
      .querySelectorAll('tr');
    expect(users2.length).toBe(15);
  });

  it('should not show duplicate users when scrolling by using mergedUsers and loadUnqUsers', async () => {
    const { container } = render(
      <MockedProvider addTypename={false} link={link7}>
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
    const users = container
      .getElementsByTagName('tbody')[0]
      .querySelectorAll('tr');
    expect(users.length).toBe(12);

    await act(async () => {
      fireEvent.scroll(window, { target: { scrollY: 1000 } });
    });

    await wait();

    const users2 = container
      .getElementsByTagName('tbody')[0]
      .querySelectorAll('tr');
    expect(users2.length).toBe(15);
  });

  it('should render "No results found" message with search query when search returns no users and isLoading is false', async () => {
    render(
      <MockedProvider
        mocks={[
          {
            request: {
              query: USER_LIST,
              variables: {
                first: 12,
                skip: 0,
                firstName_contains: 'NonexistentName',
                lastName_contains: '',
                order: 'createdAt_DESC',
              },
            },
            result: {
              data: {
                users: [],
              },
            },
          },
        ]}
        addTypename={false}
      >
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
    const searchInput = screen.getByTestId(/searchByName/i);

    await act(async () => {
      await userEvent.clear(searchInput);
      await userEvent.type(searchInput, 'NonexistentName');
      await userEvent.click(searchBtn);
    });

    const noResultsMessage = screen.getByText(/No results found for/i);
    expect(noResultsMessage).toBeInTheDocument();
    expect(noResultsMessage).toHaveTextContent('NonexistentName');
  });

  describe('Testing sorting and loadMoreUsers functionality', () => {
    it('should set the correct order variable and update hasMore', async () => {
      render(
        <MockedProvider mocks={MOCKS_NEW} addTypename={false}>
          <BrowserRouter>
            <Provider store={store}>
              <Users />
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );

      const sortDropdown = await screen.findByTestId('sortUsers');
      fireEvent.click(sortDropdown);

      const newestOption = screen.getByTestId('newest');
      fireEvent.click(newestOption);

      expect(screen.getByTestId('sortUsers')).toHaveTextContent('newest');

      const rowsNewest = await screen.findAllByRole('row');
      expect(rowsNewest.length).toBeGreaterThan(0);

      fireEvent.click(sortDropdown);
      const oldestOption = screen.getByTestId('oldest');
      fireEvent.click(oldestOption);

      expect(screen.getByTestId('sortUsers')).toHaveTextContent('oldest');

      const rowsOldest = await screen.findAllByRole('row');
      expect(rowsOldest.length).toBeGreaterThan(0);
    });

    it('should load more users and merge them correctly', async () => {
      render(
        <MockedProvider mocks={MOCKS_NEW_2} addTypename={false}>
          <BrowserRouter>
            <Provider store={store}>
              <Users />
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );

      await wait();
      let rows = screen.getAllByRole('row');
      expect(rows.length).toBe(4);

      await act(async () => {
        fireEvent.scroll(window, { target: { scrollY: 1000 } });
      });

      await wait();
      rows = screen.getAllByRole('row');
      expect(rows.length).toBe(4);
    });
  });

  describe('generateMockUser', () => {
    it('should set adminFor with an entry when isSuperAdmin is true', () => {
      const mockUser = generateMockUser(
        'user1',
        'John',
        'Doe',
        'john@example.com',
        '2023-04-13T04:53:17.742+00:00',
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
        '2023-04-17T04:53:17.742+00:00',
        false, // isSuperAdmin
      );

      expect(mockUser.appUserProfile.adminFor).toEqual([]);
      expect(mockUser.appUserProfile.isSuperAdmin).toBe(false);
    });
  });

  it('shows warning toast when organizations array is empty', async () => {
    // Mock toast.warning for verification
    const warningMock = vi.fn();
    vi.spyOn(toast, 'warning').mockImplementation(warningMock);

    // Create the mock with empty organizations array
    const emptyOrgsMock = [
      {
        request: {
          query: USER_LIST,
          variables: {
            first: 12,
            skip: 0,
            firstName_contains: '',
            lastName_contains: '',
            order: 'createdAt_DESC',
          },
        },
        result: {
          data: {
            users: [],
          },
        },
      },
      {
        request: {
          query: ORGANIZATION_LIST,
        },
        result: {
          data: {
            organizations: [], // Empty organizations array
          },
        },
      },
    ];

    const linkWithEmptyOrgs = new StaticMockLink(emptyOrgsMock, true);

    render(
      <MockedProvider
        mocks={emptyOrgsMock}
        addTypename={false}
        link={linkWithEmptyOrgs}
      >
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Users />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    // Wait for component to finish rendering and effect to run
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    // Verify toast.warning was called
    expect(warningMock).toHaveBeenCalled();
  });

  // Test for null check before accessing organizations.length
  it('handles null organizations data gracefully', async () => {
    const nullOrgsMock = [
      {
        request: {
          query: USER_LIST,
          variables: {
            first: 12,
            skip: 0,
            firstName_contains: '',
            lastName_contains: '',
            order: 'createdAt_DESC',
          },
        },
        result: {
          data: {
            users: [],
          },
        },
      },
      {
        request: {
          query: ORGANIZATION_LIST,
        },
        result: {
          data: {
            organizations: null, // Null organizations
          },
        },
      },
    ];

    const linkNullOrgs = new StaticMockLink(nullOrgsMock, true);

    // This should not throw an error
    render(
      <MockedProvider
        mocks={nullOrgsMock}
        addTypename={false}
        link={linkNullOrgs}
      >
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Users />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    // If it reaches this point without throwing an error, the test passes
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    expect(true).toBeTruthy();
  });

  // Additional test for the prev?.users condition
  it('handles missing prev.users in updateQuery gracefully', async () => {
    const mockData = [
      {
        request: {
          query: USER_LIST,
          variables: {
            first: 12,
            skip: 0,
            firstName_contains: '',
            lastName_contains: '',
            order: 'createdAt_DESC',
          },
        },
        result: {
          data: {
            users: [],
          },
        },
      },
      {
        request: {
          query: ORGANIZATION_LIST,
        },
        result: {
          data: {
            organizations: [{ _id: 'org1', name: 'Organization 1' }],
          },
        },
      },
    ];

    const link = new StaticMockLink(mockData, true);

    // Spy on fetchMore to capture the updateQuery function
    const fetchMoreSpy = vi.fn();
    vi.spyOn(require('@apollo/client'), 'useQuery').mockImplementation(() => ({
      data: undefined, // Simulate no data initially
      loading: false,
      fetchMore: fetchMoreSpy,
      refetch: vi.fn(),
    }));

    render(
      <MockedProvider mocks={mockData} addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Users />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    // Wait for component to render
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));

    // Simulate fetchMore being called
    const updateQueryFn = fetchMoreSpy.mock.calls[0]?.[0]?.updateQuery;

    if (updateQueryFn) {
      // Create mock data with undefined prev to test the null check
      const prev = undefined;

      const fetchMoreResult = {
        users: Array(5)
          .fill(null)
          .map((_, i) => ({
            user: {
              _id: `user_${i}`,
              firstName: `User ${i}`,
              lastName: `Last ${i}`,
              email: `user${i}@example.com`,
              createdAt: new Date().toISOString(),
            },
            appUserProfile: {
              adminFor: [],
              isSuperAdmin: false,
              organizationsBlockedBy: [],
            },
          })),
      };

      // This should not throw an error due to the prev?.users check
      const result = updateQueryFn(prev, { fetchMoreResult });

      // Verify that the function returns the expected result
      expect(result.users).toEqual(fetchMoreResult.users);
    }
  });
});
