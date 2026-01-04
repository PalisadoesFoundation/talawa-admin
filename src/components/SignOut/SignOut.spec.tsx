import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider, MockedResponse } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import type { Mock } from 'vitest';
import { vi } from 'vitest';
import SignOut from './SignOut';
import { LOGOUT_MUTATION } from 'GraphQl/Mutations/mutations';
import useSession from 'utils/useSession';
import useLocalStorage from 'utils/useLocalstorage';
import i18n from 'utils/i18nForTest';

// Mock dependencies
vi.mock('utils/useSession', () => ({
  default: vi.fn(() => ({
    endSession: vi.fn(),
  })),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        signOut: 'Sign out',
        signingOut: 'Signing out...',
        retryPrompt: 'Logout failed. Would you like to retry?',
      };
      return translations[key] || key;
    },
  }),
  I18nextProvider: ({ children }: { children: React.ReactNode }) => children,
  initReactI18next: { type: '3rdParty', init: () => {} },
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

let mockNavigate: ReturnType<typeof vi.fn>;
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const createMock = () => {
  const mockClearAllItems = vi.fn();
  (useLocalStorage as Mock).mockReturnValue({
    clearAllItems: mockClearAllItems,
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    getStorageKey: vi.fn((key: string) => key),
  });

  return {
    mockClearAllItems,
  };
};

const renderWithProviders = (
  component: React.ReactElement,
  mocks: MockedResponse[] = [],
) => {
  const mockProviderProps = { mocks };
  return render(
    <MockedProvider {...mockProviderProps}>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>{component}</BrowserRouter>
      </I18nextProvider>
    </MockedProvider>,
  );
};

describe('SignOut Component', () => {
  const mockLogoutMutation = {
    request: {
      query: LOGOUT_MUTATION,
    },
    result: {
      data: {
        logout: { success: true },
      },
    },
  };

  beforeEach(() => {
    mockNavigate = vi.fn();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('calls logout functionality when sign out button is clicked', async () => {
    const mockEndSession = vi.fn();
    (useSession as Mock).mockReturnValue({
      endSession: mockEndSession,
    });

    const { mockClearAllItems } = createMock();

    renderWithProviders(<SignOut />, [mockLogoutMutation]);

    const signOutButton = screen.getByText('Sign out');
    fireEvent.click(signOutButton);

    await waitFor(() => {
      // Verify localStorage was cleared
      expect(mockClearAllItems).toHaveBeenCalled();

      // Verify endSession was called
      expect(mockEndSession).toHaveBeenCalled();

      // Verify navigation to home page
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('handles error during logout', async () => {
    const consoleErrorMock = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const mockErrorLogout = {
      request: {
        query: LOGOUT_MUTATION,
      },
      error: new Error('Failed to logout'),
    };

    const mockEndSession = vi.fn();
    (useSession as Mock).mockReturnValue({
      endSession: mockEndSession,
    });

    const { mockClearAllItems } = createMock();

    renderWithProviders(<SignOut />, [mockErrorLogout]);

    const signOutButton = screen.getByText('Sign out');
    fireEvent.click(signOutButton);

    await waitFor(() => {
      // Verify error was logged
      expect(consoleErrorMock).toHaveBeenCalledWith(
        'Error during logout:',
        expect.any(Error),
      );

      // Verify localStorage was cleared
      expect(mockClearAllItems).toHaveBeenCalled();

      // Verify endSession was called
      expect(mockEndSession).toHaveBeenCalled();

      // Verify navigation to home page
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    consoleErrorMock.mockRestore();
  });

  test('retries logout when user confirms and succeeds', async () => {
    // Mock window.confirm to return true
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    const consoleErrorMock = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const mockEndSession = vi.fn();
    (useSession as Mock).mockReturnValue({
      endSession: mockEndSession,
    });

    const { mockClearAllItems } = createMock();

    // First call fails, second call succeeds
    const mocks = [
      {
        request: {
          query: LOGOUT_MUTATION,
        },
        error: new Error('Failed to logout'),
      },
      {
        request: {
          query: LOGOUT_MUTATION,
        },
        result: {
          data: {
            logout: { success: true },
          },
        },
      },
    ];

    renderWithProviders(<SignOut />, mocks);

    const signOutButton = screen.getByText('Sign out');
    fireEvent.click(signOutButton);

    await waitFor(() => {
      // Verify confirm was called
      expect(window.confirm).toHaveBeenCalledWith(
        'Logout failed. Would you like to retry?',
      );

      // Verify localStorage was cleared
      expect(mockClearAllItems).toHaveBeenCalled();

      // Verify endSession was called
      expect(mockEndSession).toHaveBeenCalled();

      // Verify navigation to home page
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    consoleErrorMock.mockRestore();
  });

  test('handles failure during retry of logout', async () => {
    // Mock window.confirm to return true
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    const consoleErrorMock = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const mockEndSession = vi.fn();
    (useSession as Mock).mockReturnValue({
      endSession: mockEndSession,
    });

    const { mockClearAllItems } = createMock();

    // Both calls fail
    const mocks = [
      {
        request: {
          query: LOGOUT_MUTATION,
        },
        error: new Error('First failure'),
      },
      {
        request: {
          query: LOGOUT_MUTATION,
        },
        error: new Error('Retry failure'),
      },
    ];

    renderWithProviders(<SignOut />, mocks);

    const signOutButton = screen.getByText('Sign out');
    fireEvent.click(signOutButton);

    await waitFor(() => {
      // Verify error was logged for both attempts
      expect(consoleErrorMock).toHaveBeenCalledWith(
        'Error during logout:',
        expect.any(Error),
      );
      expect(consoleErrorMock).toHaveBeenCalledWith('Logout retry failed');

      // Verify localStorage was cleared
      expect(mockClearAllItems).toHaveBeenCalled();

      // Verify endSession was called
      expect(mockEndSession).toHaveBeenCalled();

      // Verify navigation to home page
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    consoleErrorMock.mockRestore();
  });

  test('proceeds with local logout when user declines retry', async () => {
    // Mock window.confirm to return false
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    const consoleErrorMock = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const mockEndSession = vi.fn();
    (useSession as Mock).mockReturnValue({
      endSession: mockEndSession,
    });

    const { mockClearAllItems } = createMock();

    const mocks = [
      {
        request: {
          query: LOGOUT_MUTATION,
        },
        error: new Error('Failed to logout'),
      },
    ];

    renderWithProviders(<SignOut />, mocks);

    const signOutButton = screen.getByText('Sign out');
    fireEvent.click(signOutButton);

    await waitFor(() => {
      // Verify confirm was called
      expect(window.confirm).toHaveBeenCalledWith(
        'Logout failed. Would you like to retry?',
      );

      // Verify the second logout attempt was NOT made
      expect(consoleErrorMock).not.toHaveBeenCalledWith('Logout retry failed');

      // Verify localStorage was cleared
      expect(mockClearAllItems).toHaveBeenCalled();

      // Verify endSession was called
      expect(mockEndSession).toHaveBeenCalled();

      // Verify navigation to home page
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    consoleErrorMock.mockRestore();
  });

  describe('Keyboard Accessibility Tests', () => {
    test('sign out button is accessible and has proper attributes', async () => {
      const mockEndSession = vi.fn();
      (useSession as Mock).mockReturnValue({
        endSession: mockEndSession,
      });

      renderWithProviders(<SignOut />, [mockLogoutMutation]);

      const signOutButton = screen.getByTestId('signOutBtn');
      expect(signOutButton).toBeInTheDocument();
      expect(signOutButton).toHaveAttribute('role', 'button');
      expect(signOutButton).toHaveAttribute('tabIndex', '0');
      expect(signOutButton).toHaveAttribute('aria-label', 'Sign out');
    });

    test('sign out button responds to Enter key press', async () => {
      const mockEndSession = vi.fn();
      (useSession as Mock).mockReturnValue({
        endSession: mockEndSession,
      });

      const { mockClearAllItems } = createMock();

      renderWithProviders(<SignOut />, [mockLogoutMutation]);

      const signOutButton = screen.getByTestId('signOutBtn');
      signOutButton.focus();

      await userEvent.keyboard('{Enter}');

      await waitFor(() => {
        expect(mockClearAllItems).toHaveBeenCalled();
        expect(mockEndSession).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });

    test('sign out button responds to Space key press', async () => {
      const mockEndSession = vi.fn();
      (useSession as Mock).mockReturnValue({
        endSession: mockEndSession,
      });

      const { mockClearAllItems } = createMock();

      renderWithProviders(<SignOut />, [mockLogoutMutation]);

      const signOutButton = screen.getByTestId('signOutBtn');
      signOutButton.focus();

      await userEvent.keyboard(' ');

      await waitFor(() => {
        expect(mockClearAllItems).toHaveBeenCalled();
        expect(mockEndSession).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });

    test('sign out button ignores other key presses', async () => {
      const mockEndSession = vi.fn();
      (useSession as Mock).mockReturnValue({
        endSession: mockEndSession,
      });

      const { mockClearAllItems } = createMock();

      renderWithProviders(<SignOut />, [mockLogoutMutation]);

      const signOutButton = screen.getByTestId('signOutBtn');
      signOutButton.focus();

      await userEvent.keyboard('{Escape}');
      await userEvent.keyboard('{Tab}');
      await userEvent.keyboard('{ArrowDown}');

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(mockClearAllItems).not.toHaveBeenCalled();
      expect(mockEndSession).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    test('sign out button keyboard navigation with Enter key handles errors', async () => {
      vi.spyOn(window, 'confirm').mockReturnValue(false);

      const consoleErrorMock = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const mockEndSession = vi.fn();
      (useSession as Mock).mockReturnValue({
        endSession: mockEndSession,
      });

      const { mockClearAllItems } = createMock();

      const mocks = [
        {
          request: {
            query: LOGOUT_MUTATION,
          },
          error: new Error('Failed to logout'),
        },
      ];

      renderWithProviders(<SignOut />, mocks);

      const signOutButton = screen.getByTestId('signOutBtn');
      signOutButton.focus();

      await userEvent.keyboard('{Enter}');

      await waitFor(() => {
        expect(window.confirm).toHaveBeenCalledWith(
          'Logout failed. Would you like to retry?',
        );
        expect(mockClearAllItems).toHaveBeenCalled();
        expect(mockEndSession).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });

      consoleErrorMock.mockRestore();
    });
  });

  describe('Disabled State and Spam Prevention', () => {
    test('button shows disabled state when logout is in progress', async () => {
      const mockEndSession = vi.fn();
      (useSession as Mock).mockReturnValue({
        endSession: mockEndSession,
      });

      renderWithProviders(<SignOut />, [mockLogoutMutation]);

      const signOutButton = screen.getByTestId('signOutBtn');

      // Verify initial state - no disabled class
      expect(signOutButton).toHaveAttribute('aria-disabled', 'false');
      expect(screen.getByText('Sign out')).toBeInTheDocument();

      // Click the button
      fireEvent.click(signOutButton);

      // Immediately check disabled state via aria-disabled
      expect(signOutButton).toHaveAttribute('aria-disabled', 'true');

      // Check for "Signing out..." text
      await waitFor(() => {
        expect(screen.getByText('Signing out...')).toBeInTheDocument();
      });
    });

    test('prevents multiple clicks during logout', async () => {
      const mockEndSession = vi.fn();
      (useSession as Mock).mockReturnValue({
        endSession: mockEndSession,
      });

      renderWithProviders(<SignOut />, [mockLogoutMutation]);

      const signOutButton = screen.getByTestId('signOutBtn');

      // Click multiple times rapidly
      fireEvent.click(signOutButton);
      fireEvent.click(signOutButton);
      fireEvent.click(signOutButton);

      await waitFor(() => {
        // Verify logout was only called once
        expect(mockEndSession).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledTimes(1);
      });
    });

    test('button style prevents pointer events when disabled', async () => {
      const mockEndSession = vi.fn();
      (useSession as Mock).mockReturnValue({
        endSession: mockEndSession,
      });

      renderWithProviders(<SignOut />, [mockLogoutMutation]);

      const signOutButton = screen.getByTestId('signOutBtn');

      // Click the button
      fireEvent.click(signOutButton);

      // Check that disabled state is set via aria-disabled
      await waitFor(() => {
        expect(signOutButton).toHaveAttribute('aria-disabled', 'true');
      });
    });

    test('hideDrawer prop hides text but maintains disabled state', async () => {
      const mockEndSession = vi.fn();
      (useSession as Mock).mockReturnValue({
        endSession: mockEndSession,
      });

      renderWithProviders(<SignOut hideDrawer={true} />, [mockLogoutMutation]);

      const signOutButton = screen.getByTestId('signOutBtn');

      // Initially, label text should be hidden when hideDrawer is true
      expect(screen.queryByText('Sign out')).not.toBeInTheDocument();
      expect(screen.queryByText('Signing out...')).not.toBeInTheDocument();

      // Click the button
      fireEvent.click(signOutButton);

      // Verify disabled state is still applied and text remains hidden
      await waitFor(() => {
        expect(signOutButton).toHaveAttribute('aria-disabled', 'true');
        expect(screen.queryByText('Sign out')).not.toBeInTheDocument();
        expect(screen.queryByText('Signing out...')).not.toBeInTheDocument();
      });
    });
  });
});
