import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
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

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockLocalStorage = {
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

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
    vi.clearAllMocks();
  });

  test('calls logout functionality when sign out button is clicked', async () => {
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
      <MockedProvider mocks={[mockErrorRevokeRefreshToken]} addTypename={false}>
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
      <MockedProvider mocks={mocks} addTypename={false}>
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
      <MockedProvider mocks={mocks} addTypename={false}>
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
      <MockedProvider mocks={mocks} addTypename={false}>
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
});
