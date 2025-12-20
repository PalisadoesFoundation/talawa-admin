import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing/react';
import { BrowserRouter } from 'react-router';
import type { Mock } from 'vitest';
import { vi } from 'vitest';
import SignOut from './SignOut';
import { REVOKE_REFRESH_TOKEN } from 'GraphQl/Mutations/mutations';
import useSession from 'utils/useSession';

// Mock dependencies
vi.mock('utils/useSession', () => ({
  default: vi.fn(() => ({
    endSession: vi.fn(),
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

let mockLocalStorage: { clear: ReturnType<typeof vi.fn> };

describe('SignOut Component', () => {
  const mockRevokeRefreshToken = {
    request: {
      query: REVOKE_REFRESH_TOKEN,
    },
    result: {
      data: {
        revokeRefreshToken: true,
      },
    },
  };

  beforeEach(() => {
    mockNavigate = vi.fn();
    mockLocalStorage = {
      clear: vi.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      configurable: true,
    });
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

    render(
      <MockedProvider mocks={[mockRevokeRefreshToken]}>
        <BrowserRouter>
          <SignOut />
        </BrowserRouter>
      </MockedProvider>,
    );

    const signOutButton = screen.getByText('Sign Out');
    fireEvent.click(signOutButton);

    await waitFor(() => {
      // Verify revokeRefreshToken was called
      expect(mockRevokeRefreshToken.result).toBeTruthy();

      // Verify localStorage was cleared
      expect(mockLocalStorage.clear).toHaveBeenCalled();

      // Verify endSession was called
      expect(mockEndSession).toHaveBeenCalled();

      // Verify navigation to home page
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('handles error during refresh token revocation', async () => {
    const consoleErrorMock = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const mockErrorRevokeRefreshToken = {
      request: {
        query: REVOKE_REFRESH_TOKEN,
      },
      error: new Error('Failed to revoke refresh token'),
    };

    const mockEndSession = vi.fn();
    (useSession as Mock).mockReturnValue({
      endSession: mockEndSession,
    });

    render(
      <MockedProvider mocks={[mockErrorRevokeRefreshToken]}>
        <BrowserRouter>
          <SignOut />
        </BrowserRouter>
      </MockedProvider>,
    );

    const signOutButton = screen.getByText('Sign Out');
    fireEvent.click(signOutButton);

    await waitFor(() => {
      // Verify error was logged
      expect(consoleErrorMock).toHaveBeenCalledWith(
        'Error revoking refresh token:',
        expect.any(Error),
      );

      // Verify localStorage was cleared
      expect(mockLocalStorage.clear).toHaveBeenCalled();

      // Verify endSession was called
      expect(mockEndSession).toHaveBeenCalled();

      // Verify navigation to home page
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    consoleErrorMock.mockRestore();
  });

  test('retries token revocation when user confirms and succeeds', async () => {
    // Mock window.confirm to return true
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    const consoleErrorMock = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const mockEndSession = vi.fn();
    (useSession as Mock).mockReturnValue({
      endSession: mockEndSession,
    });

    // First call fails, second call succeeds
    const mocks = [
      {
        request: {
          query: REVOKE_REFRESH_TOKEN,
        },
        error: new Error('Failed to revoke refresh token'),
      },
      {
        request: {
          query: REVOKE_REFRESH_TOKEN,
        },
        result: {
          data: {
            revokeRefreshToken: true,
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks}>
        <BrowserRouter>
          <SignOut />
        </BrowserRouter>
      </MockedProvider>,
    );

    const signOutButton = screen.getByText('Sign Out');
    fireEvent.click(signOutButton);

    await waitFor(() => {
      // Verify confirm was called
      expect(window.confirm).toHaveBeenCalledWith(
        'Failed to revoke session. Retry?',
      );

      // Verify localStorage was cleared
      expect(mockLocalStorage.clear).toHaveBeenCalled();

      // Verify endSession was called
      expect(mockEndSession).toHaveBeenCalled();

      // Verify navigation to home page
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    consoleErrorMock.mockRestore();
  });

  test('handles failure during retry of token revocation', async () => {
    // Mock window.confirm to return true
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    const consoleErrorMock = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const mockEndSession = vi.fn();
    (useSession as Mock).mockReturnValue({
      endSession: mockEndSession,
    });

    // Both calls fail
    const mocks = [
      {
        request: {
          query: REVOKE_REFRESH_TOKEN,
        },
        error: new Error('First failure'),
      },
      {
        request: {
          query: REVOKE_REFRESH_TOKEN,
        },
        error: new Error('Retry failure'),
      },
    ];

    render(
      <MockedProvider mocks={mocks}>
        <BrowserRouter>
          <SignOut />
        </BrowserRouter>
      </MockedProvider>,
    );

    const signOutButton = screen.getByText('Sign Out');
    fireEvent.click(signOutButton);

    await waitFor(() => {
      // Verify error was logged for both attempts
      expect(consoleErrorMock).toHaveBeenCalledWith(
        'Error revoking refresh token:',
        expect.any(Error),
      );
      expect(consoleErrorMock).toHaveBeenCalledWith(
        'Token revocation retry failed',
      );

      // Verify localStorage was cleared
      expect(mockLocalStorage.clear).toHaveBeenCalled();

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

    const mocks = [
      {
        request: {
          query: REVOKE_REFRESH_TOKEN,
        },
        error: new Error('Failed to revoke refresh token'),
      },
    ];

    render(
      <MockedProvider mocks={mocks}>
        <BrowserRouter>
          <SignOut />
        </BrowserRouter>
      </MockedProvider>,
    );

    const signOutButton = screen.getByText('Sign Out');
    fireEvent.click(signOutButton);

    await waitFor(() => {
      // Verify confirm was called
      expect(window.confirm).toHaveBeenCalledWith(
        'Failed to revoke session. Retry?',
      );

      // Verify the second revoke token attempt was NOT made
      expect(consoleErrorMock).not.toHaveBeenCalledWith(
        'Token revocation retry failed',
      );

      // Verify localStorage was cleared
      expect(mockLocalStorage.clear).toHaveBeenCalled();

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

      render(
        <MockedProvider mocks={[mockRevokeRefreshToken]}>
          <BrowserRouter>
            <SignOut />
          </BrowserRouter>
        </MockedProvider>,
      );

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

      render(
        <MockedProvider mocks={[mockRevokeRefreshToken]}>
          <BrowserRouter>
            <SignOut />
          </BrowserRouter>
        </MockedProvider>,
      );

      const signOutButton = screen.getByTestId('signOutBtn');
      signOutButton.focus();

      await userEvent.keyboard('{Enter}');

      await waitFor(() => {
        expect(mockLocalStorage.clear).toHaveBeenCalled();
        expect(mockEndSession).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });

    test('sign out button responds to Space key press', async () => {
      const mockEndSession = vi.fn();
      (useSession as Mock).mockReturnValue({
        endSession: mockEndSession,
      });

      render(
        <MockedProvider mocks={[mockRevokeRefreshToken]}>
          <BrowserRouter>
            <SignOut />
          </BrowserRouter>
        </MockedProvider>,
      );

      const signOutButton = screen.getByTestId('signOutBtn');
      signOutButton.focus();

      await userEvent.keyboard(' ');

      await waitFor(() => {
        expect(mockLocalStorage.clear).toHaveBeenCalled();
        expect(mockEndSession).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });

    test('sign out button ignores other key presses', async () => {
      const mockEndSession = vi.fn();
      (useSession as Mock).mockReturnValue({
        endSession: mockEndSession,
      });

      render(
        <MockedProvider mocks={[mockRevokeRefreshToken]}>
          <BrowserRouter>
            <SignOut />
          </BrowserRouter>
        </MockedProvider>,
      );

      const signOutButton = screen.getByTestId('signOutBtn');
      signOutButton.focus();

      await userEvent.keyboard('{Escape}');
      await userEvent.keyboard('{Tab}');
      await userEvent.keyboard('{ArrowDown}');

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(mockLocalStorage.clear).not.toHaveBeenCalled();
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

      const mocks = [
        {
          request: {
            query: REVOKE_REFRESH_TOKEN,
          },
          error: new Error('Failed to revoke refresh token'),
        },
      ];

      render(
        <MockedProvider mocks={mocks}>
          <BrowserRouter>
            <SignOut />
          </BrowserRouter>
        </MockedProvider>,
      );

      const signOutButton = screen.getByTestId('signOutBtn');
      signOutButton.focus();

      await userEvent.keyboard('{Enter}');

      await waitFor(() => {
        expect(window.confirm).toHaveBeenCalledWith(
          'Failed to revoke session. Retry?',
        );
        expect(mockLocalStorage.clear).toHaveBeenCalled();
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

      render(
        <MockedProvider mocks={[mockRevokeRefreshToken]} addTypename={false}>
          <BrowserRouter>
            <SignOut />
          </BrowserRouter>
        </MockedProvider>,
      );

      const signOutButton = screen.getByTestId('signOutBtn');

      // Verify initial state
      expect(signOutButton).toHaveStyle({ opacity: '1' });
      expect(signOutButton).toHaveAttribute('aria-disabled', 'false');
      expect(screen.getByText('Sign Out')).toBeInTheDocument();

      // Click the button
      fireEvent.click(signOutButton);

      // Immediately check disabled state
      expect(signOutButton).toHaveStyle({ opacity: '0.5' });
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

      render(
        <MockedProvider mocks={[mockRevokeRefreshToken]} addTypename={false}>
          <BrowserRouter>
            <SignOut />
          </BrowserRouter>
        </MockedProvider>,
      );

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

      render(
        <MockedProvider mocks={[mockRevokeRefreshToken]} addTypename={false}>
          <BrowserRouter>
            <SignOut />
          </BrowserRouter>
        </MockedProvider>,
      );

      const signOutButton = screen.getByTestId('signOutBtn');

      // Click the button
      fireEvent.click(signOutButton);

      // Check that pointer events are none and cursor is not-allowed
      await waitFor(() => {
        expect(signOutButton).toHaveStyle({
          pointerEvents: 'none',
          cursor: 'not-allowed',
        });
      });
    });

    test('hideDrawer prop hides text but maintains disabled state', async () => {
      const mockEndSession = vi.fn();
      (useSession as Mock).mockReturnValue({
        endSession: mockEndSession,
      });

      render(
        <MockedProvider mocks={[mockRevokeRefreshToken]} addTypename={false}>
          <BrowserRouter>
            <SignOut hideDrawer={true} />
          </BrowserRouter>
        </MockedProvider>,
      );

      const signOutButton = screen.getByTestId('signOutBtn');

      // Initially, label text should be hidden when hideDrawer is true
      expect(screen.queryByText('Sign Out')).not.toBeInTheDocument();
      expect(screen.queryByText('Signing out...')).not.toBeInTheDocument();

      // Click the button
      fireEvent.click(signOutButton);

      // Verify disabled state is still applied and text remains hidden
      await waitFor(() => {
        expect(signOutButton).toHaveStyle({ opacity: '0.5' });
        expect(signOutButton).toHaveAttribute('aria-disabled', 'true');
        expect(screen.queryByText('Sign Out')).not.toBeInTheDocument();
        expect(screen.queryByText('Signing out...')).not.toBeInTheDocument();
      });
    });
  });
});
