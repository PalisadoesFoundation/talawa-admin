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
});
