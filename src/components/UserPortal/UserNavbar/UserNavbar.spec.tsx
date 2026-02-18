import React, { act } from 'react';
import { MockedProvider, MockedResponse } from '@apollo/react-testing';
import { render, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import cookies from 'js-cookie';
import { StaticMockLink } from 'utils/StaticMockLink';
import { vi } from 'vitest';
import type { Mock } from 'vitest';
import UserNavbar from './UserNavbar';
import userEvent from '@testing-library/user-event';
import { LOGOUT_MUTATION } from 'GraphQl/Mutations/mutations';
import { GET_USER_NOTIFICATIONS } from 'GraphQl/Queries/NotificationQueries';
import useLocalStorage from 'utils/useLocalstorage';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';

/**
 * Unit tests for UserNavbar component [User Portal]:
 *
 * 1. *Rendering UserNavbar*: Verifies that the UserNavbar component renders correctly.
 * 2. *Switching language to English*: Ensures that clicking the language dropdown and selecting 'English' updates the language cookie to 'en'.
 * 3. *Switching language to French*: Verifies that selecting 'French' updates the language cookie to 'fr'.
 * 4. *Switching language to Hindi*: Confirms that choosing 'Hindi' updates the language cookie to 'hi'.
 * 5. *Switching language to Spanish*: Ensures that selecting 'Spanish' sets the language cookie to 'sp'.
 * 6. *Switching language to Chinese*: Verifies that selecting 'Chinese' changes the language cookie to 'zh'.
 * 7. *Interacting with the dropdown menu*: Ensures the user can open the dropdown and see available options like 'Settings' and 'Logout'.
 * 8. *Navigating to the 'Settings' page*: Confirms that clicking 'Settings' in the dropdown correctly navigates the user to the "/user/settings" page.
 *
 * The tests simulate interactions with the language dropdown and the user dropdown menu to ensure proper functionality of language switching and navigation.
 * Mocked GraphQL mutation (LOGOUT_MUTATION) and mock store are used to test the component in an isolated environment.
 */

vi.mock('shared-components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock('utils/useLocalstorage', () => ({
  default: vi.fn(() => ({
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    getStorageKey: vi.fn((key: string) => key),
    clearAllItems: vi.fn(),
  })),
}));

const createMock = () => {
  const mockGetItem = vi.fn(() => 'Test user');
  const mockSetItem = vi.fn();
  const mockRemoveItem = vi.fn();
  const mockGetStorageKey = vi.fn((key: string) => key);
  const mockClearAllItems = vi.fn();

  (useLocalStorage as Mock).mockReturnValue({
    getItem: mockGetItem,
    setItem: mockSetItem,
    removeItem: mockRemoveItem,
    getStorageKey: mockGetStorageKey,
    clearAllItems: mockClearAllItems,
  });

  return {
    mockGetItem,
    mockSetItem,
    mockRemoveItem,
    mockGetStorageKey,
    mockClearAllItems,
  };
};

async function wait(ms = 100): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

const MOCKS = [
  {
    request: {
      query: LOGOUT_MUTATION,
    },
    result: { data: { logout: { success: true } } },
  },
  // Add a minimal mock for NotificationIcon's GET_USER_NOTIFICATIONS query
  {
    request: {
      query: GET_USER_NOTIFICATIONS,
      variables: { userId: '123', input: { first: 5, skip: 0 } },
    },
    result: {
      data: {
        user: {
          __typename: 'User',
          notifications: [],
        },
      },
    },
  },
];

const link = new StaticMockLink(MOCKS, true);

describe('Testing UserNavbar Component [User Portal]', () => {
  afterEach(async () => {
    await act(async () => {
      await i18nForTest.changeLanguage('en');
    });
    vi.clearAllMocks();
  });

  it('Component should be rendered properly', async () => {
    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserNavbar />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();
    // NotificationIcon should render (bell); assert presence by aria or role if available
    // We just check that the language icon exists and notification icon is present as a button
    expect(screen.getByTestId('languageIcon')).toBeInTheDocument();
    expect(screen.getByTestId('brandLogo')).toBeInTheDocument();
  });

  it('The language is switched to English', async () => {
    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserNavbar />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    await userEvent.click(screen.getByTestId('language-toggle'));

    await userEvent.click(screen.getByTestId('language-item-en'));

    await wait();

    expect(cookies.get('i18next')).toBe('en');
  });

  it('The language is switched to fr', async () => {
    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserNavbar />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    await userEvent.click(screen.getByTestId('language-toggle'));
    await userEvent.click(screen.getByTestId('language-item-fr'));

    await wait();

    expect(cookies.get('i18next')).toBe('fr');
  });

  it('The language is switched to hi', async () => {
    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserNavbar />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    await userEvent.click(screen.getByTestId('language-toggle'));
    await userEvent.click(screen.getByTestId('language-item-hi'));

    await wait();

    expect(cookies.get('i18next')).toBe('hi');
  });

  it('The language is switched to sp', async () => {
    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserNavbar />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    await userEvent.click(screen.getByTestId('language-toggle'));
    await userEvent.click(screen.getByTestId('language-item-es'));

    await wait();

    expect(cookies.get('i18next')).toBe('es');
  });

  it('The language is switched to zh', async () => {
    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserNavbar />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    await userEvent.click(screen.getByTestId('language-toggle'));
    await userEvent.click(screen.getByTestId('language-item-zh'));

    await wait();

    expect(cookies.get('i18next')).toBe('zh');
  });

  it('User can see and interact with the dropdown menu', async () => {
    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserNavbar />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    await userEvent.click(screen.getByTestId('user-toggle'));

    expect(screen.getByTestId('user-item-settings')).toBeInTheDocument();
    expect(screen.getByTestId('user-item-logout')).toBeInTheDocument();
  });

  it('User can navigate to the "Settings" page', async () => {
    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserNavbar />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    await userEvent.click(screen.getByTestId('user-toggle'));
    await userEvent.click(screen.getByTestId('user-item-settings'));

    await waitFor(() => {
      expect(window.location.pathname).toBe('/user/settings');
    });
  });

  it('Logs out the user and clears local storage', async () => {
    // Create a fresh mock and extract clearAllItems for assertion
    const { mockClearAllItems } = createMock();

    render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserNavbar />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    await userEvent.click(screen.getByTestId('user-toggle'));
    await userEvent.click(screen.getByTestId('user-item-logout'));

    await waitFor(() => {
      expect(mockClearAllItems).toHaveBeenCalled();
    });

    await wait();

    expect(window.location.pathname).toBe('/');
  });

  /**
   * Helper to simulate logout error and verify error handling (console log, toast, cleanup, navigation).
   * @param logoutMock - The mock response for the logout mutation (error or GraphQL error).
   */
  const testLogoutError = async (logoutMock: MockedResponse) => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { mockClearAllItems } = createMock();

    const mocks = [
      logoutMock,
      {
        request: {
          query: GET_USER_NOTIFICATIONS,
          variables: { userId: '123', input: { first: 5, skip: 0 } },
        },
        result: {
          data: {
            user: {
              __typename: 'User',
              notifications: [],
            },
          },
        },
      },
    ];

    const errorLink = new StaticMockLink(mocks, true);

    render(
      <MockedProvider link={errorLink}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <UserNavbar />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await wait();

    await userEvent.click(screen.getByTestId('user-toggle'));
    await userEvent.click(screen.getByTestId('user-item-logout'));

    await wait();

    // Verify error was logged
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error during logout:',
      expect.any(Error),
    );
    // Verify toast was shown
    expect(NotificationToast.error).toHaveBeenCalledWith('errorOccurred');
    // Verify cleanup still happens even on error
    expect(mockClearAllItems).toHaveBeenCalled();
    expect(window.location.pathname).toBe('/');

    consoleSpy.mockRestore();
  };

  it('handles logout error and still clears local storage', async () => {
    const logoutMock = {
      request: { query: LOGOUT_MUTATION },
      error: new Error('Network error'),
    };

    await testLogoutError(logoutMock);
  });

  it('handles logout GraphQL error and still clears local storage', async () => {
    const logoutMock = {
      request: { query: LOGOUT_MUTATION },
      result: {
        errors: [{ message: 'Logout failed' }],
      },
    };

    await testLogoutError(logoutMock);
  });
});
