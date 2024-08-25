import type { ReactNode } from 'react';
import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { MockedProvider } from '@apollo/client/testing';
import { toast } from 'react-toastify';
import useSession from './useSession';
import { GET_COMMUNITY_SESSION_TIMEOUT_DATA } from 'GraphQl/Queries/Queries';
import { REVOKE_REFRESH_TOKEN } from 'GraphQl/Mutations/mutations';
import { errorHandler } from 'utils/errorHandler';
import { BrowserRouter } from 'react-router-dom';

jest.mock('react-toastify', () => ({
  toast: {
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('utils/errorHandler', () => ({
  errorHandler: jest.fn(),
}));

const MOCKS = [
  {
    request: {
      query: GET_COMMUNITY_SESSION_TIMEOUT_DATA,
    },
    result: {
      data: {
        getCommunityData: {
          timeout: 30,
        },
      },
    },
    delay: 1000,
  },
  {
    request: {
      query: REVOKE_REFRESH_TOKEN,
    },
    result: {
      data: {
        revokeRefreshTokenForUser: true,
      },
    },
  },
];

describe('useSession Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(global, 'setTimeout');
    jest.spyOn(window, 'addEventListener').mockImplementation(jest.fn());
    jest.spyOn(window, 'removeEventListener').mockImplementation(jest.fn());
    Object.defineProperty(global, 'localStorage', {
      value: {
        clear: jest.fn(),
      },
      writable: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers(); // Reset timers after each test
    jest.restoreAllMocks();
  });

  test('should call handleLogout after session timeout', async (): Promise<void> => {
    jest.useFakeTimers(); // Control the passage of time

    // Custom hook wrapper
    const wrapper = ({
      children,
    }: {
      children?: React.ReactNode;
    }): JSX.Element => (
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <BrowserRouter>{children}</BrowserRouter>
      </MockedProvider>
    );

    // Render hook
    const { result, waitForNextUpdate } = renderHook(() => useSession(), {
      wrapper,
    });

    // Ensure handleLogout is called from the hook
    const { startSession } = result.current;

    // Start the session
    act(() => {
      startSession();
    });

    // Fast-forward time to simulate the session timeout
    act(() => {
      jest.advanceTimersByTime(31 * 60 * 1000); // Adjust this time based on the session timeout
    });

    await waitForNextUpdate();

    //might be able to repalce this with the handelogout funcito instead
    expect(global.localStorage.clear).toHaveBeenCalled();
    expect(toast.warning).toHaveBeenCalledWith(
      'Your session has expired due to inactivity. Please log in again to continue.',
      { autoClose: false },
    );
  });

  test('should show a warning toast before session expiration', async (): Promise<void> => {
    jest.useFakeTimers();

    const { result, waitFor } = renderHook(() => useSession(), {
      wrapper: ({ children }: { children?: ReactNode }) => (
        <MockedProvider mocks={MOCKS} addTypename={false}>
          <BrowserRouter>{children}</BrowserRouter>
        </MockedProvider>
      ),
    });

    act(() => {
      result.current.startSession();
    });

    // Fast forward to the time just before the session expires
    act(() => {
      jest.advanceTimersByTime(15 * 60 * 1000); // 15 minutes in milliseconds
    });

    await waitFor(() =>
      expect(toast.warning).toHaveBeenCalledWith(
        'Your session will expire soon due to inactivity. Please interact with the page to extend your session.',
      ),
    );

    jest.useRealTimers();
  });

  test('should handle error when revoking token fails', async (): Promise<void> => {
    // Mock the console.error to verify it was called
    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation();

    // Update MOCKS to simulate a mutation error
    const errorMocks = [
      {
        request: {
          query: GET_COMMUNITY_SESSION_TIMEOUT_DATA,
        },
        result: {
          data: {
            getCommunityData: {
              timeout: 30,
            },
          },
        },
        delay: 1000,
      },
      {
        request: {
          query: REVOKE_REFRESH_TOKEN,
        },
        error: new Error('Failed to revoke refresh token'),
      },
    ];

    const { result, waitForNextUpdate } = renderHook(() => useSession(), {
      wrapper: ({ children }: { children?: ReactNode }) => (
        <MockedProvider mocks={errorMocks} addTypename={false}>
          <BrowserRouter>{children}</BrowserRouter>
        </MockedProvider>
      ),
    });

    await act(async () => {
      await result.current.startSession();
      await result.current.handleLogout();
    });

    await waitForNextUpdate();

    // Verify that console.error was called with the expected error
    expect(consoleErrorMock).toHaveBeenCalledWith(
      'Error revoking refresh token:',
      expect.any(Error),
    );

    // Verify that toast.error was called with the expected message
    expect(toast.error).toHaveBeenCalledWith(
      'Failed to revoke session. Please try again.',
    );

    // Restore the original console.error implementation
    consoleErrorMock.mockRestore();
  });

  test('should set session timeout based on fetched data', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useSession(), {
      wrapper: ({ children }: { children?: ReactNode }) => (
        <MockedProvider mocks={MOCKS} addTypename={false}>
          <BrowserRouter>{children}</BrowserRouter>
        </MockedProvider>
      ),
    });

    await waitForNextUpdate();

    act(() => {
      result.current.startSession();
    });

    expect(global.setTimeout).toHaveBeenCalled();
  });

  test('should call errorHandler on query error', async () => {
    const errorMocks = [
      {
        request: {
          query: GET_COMMUNITY_SESSION_TIMEOUT_DATA,
        },
        error: new Error('An error occurred'),
      },
    ];

    const { waitForNextUpdate } = renderHook(() => useSession(), {
      wrapper: ({ children }: { children?: ReactNode }) => (
        <MockedProvider mocks={errorMocks} addTypename={false}>
          <BrowserRouter>{children}</BrowserRouter>
        </MockedProvider>
      ),
    });

    await waitForNextUpdate(); // Wait for the hook to process the update

    expect(errorHandler).toHaveBeenCalled();
  });

  test('should handle logout and revoke token', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useSession(), {
      wrapper: ({ children }: { children?: ReactNode }) => (
        <MockedProvider mocks={MOCKS} addTypename={false}>
          <BrowserRouter>{children}</BrowserRouter>
        </MockedProvider>
      ),
    });

    await act(async () => {
      await result.current.startSession();
      result.current.handleLogout();
    });

    await waitForNextUpdate();

    // Ensure clear was called
    expect(global.localStorage.clear).toHaveBeenCalled();
    expect(toast.warning).toHaveBeenCalledWith(
      'Your session has expired due to inactivity. Please log in again to continue.',
      { autoClose: false },
    );
  });

  test('should remove event listeners on endSession', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useSession(), {
      wrapper: ({ children }: { children?: ReactNode }) => (
        <MockedProvider mocks={MOCKS} addTypename={false}>
          <BrowserRouter>{children}</BrowserRouter>
        </MockedProvider>
      ),
    });

    await waitForNextUpdate();

    act(() => {
      result.current.startSession();
    });

    act(() => {
      result.current.endSession();
    });

    // No actual way to verify removal directly, so this verifies behavior
    expect(window.removeEventListener).toHaveBeenCalledWith(
      'mousemove',
      expect.any(Function),
    );
    expect(window.removeEventListener).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function),
    );
  });
});
