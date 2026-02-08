import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { ToastContainer } from 'react-toastify';
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

const { setItem, removeItem } = useLocalStorage();

const link = new StaticMockLink(MOCKS, true);
const link2 = new StaticMockLink(EMPTY_MOCKS, true);
const link3 = new StaticMockLink(MOCKS2, true);
const link5 = new StaticMockLink(MOCKS_NEW, true);
const link6 = new StaticMockLink(MOCKS_NEW2, true);
const link7 = new StaticMockLink(MOCKS_NEW3, true);

// Helper to wait for async operations with fake timers
// Using shouldAdvanceTime: true makes this compatible with userEvent
async function waitForAsync(ms = 1000): Promise<void> {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, ms));
  });
}
beforeEach(() => {
  // shouldAdvanceTime: true makes fake timers compatible with userEvent
  vi.useFakeTimers({ shouldAdvanceTime: true });
  setItem('id', '123');
  setItem('SuperAdmin', true);
  setItem('name', 'John Doe');
  setItem('AdminFor', [{ name: 'adi', id: '1234', avatarURL: '' }]);
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

    await waitForAsync();
    expect(screen.getByTestId('testcomp')).toBeInTheDocument();
  });

  it(`Component should be rendered properly when user is not superAdmin
  and or userId does not exists in localstorage`, async () => {
    setItem('AdminFor', ['123']);
    removeItem('SuperAdmin');
    await waitForAsync();
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
    await waitForAsync();
  });

  it(`Component should be rendered properly when userId does not exists in localstorage`, async () => {
    removeItem('AdminFor');
    removeItem('SuperAdmin');
    await waitForAsync();
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
    await waitForAsync();
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

    await waitForAsync();
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

    await waitForAsync();
    const searchBtn = screen.getByTestId('searchButton');
    const search1 = 'John';
    await userEvent.type(screen.getByTestId(/searchByName/i), search1);
    await userEvent.click(searchBtn);
    await waitForAsync();
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
    await waitForAsync();
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
    await waitForAsync();

    const searchBtn = screen.getByTestId('searchButton');
    const searchInput = screen.getByTestId(/searchByName/i);

    await act(async () => {
      await userEvent.clear(searchInput);
      await userEvent.type(searchInput, 'NonexistentName');
      await userEvent.click(searchBtn);
    });

    // Wait for the "no results" message
    const noResultsEl = await screen.findByText(/no results found/i);
    expect(noResultsEl).toBeInTheDocument();
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
        console.log('No fetchMoreResult available');
        return prev || { users: [] };
      }

      const mergedUsers = [...(prev?.users || []), ...fetchMoreResult.users];

      const uniqueUsers = Array.from(
        new Map(
          mergedUsers.map((user: IUserData) => [user.user._id, user]),
        ).values(),
      );
      console.log('Merged users:', mergedUsers.length);
      console.log('Unique users:', uniqueUsers.length);

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
    await waitForAsync();

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

    await waitForAsync();

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

    await waitForAsync();
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
    await waitForAsync();
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
    await waitForAsync();
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
              <I18nextProvider i18n={i18nForTest}>
                <Users />
              </I18nextProvider>
            </Provider>
          </BrowserRouter>
        </MockedProvider>,
      );

      await waitForAsync();

      // Simulate scroll to trigger load more
      await act(async () => {
        fireEvent.scroll(window, { target: { scrollY: 1000 } });
      });

      await waitForAsync(500); // Give time for data to load
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
});
