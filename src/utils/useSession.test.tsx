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
import { useTranslation } from 'react-i18next';

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

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
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

    const wrapper = ({
      children,
    }: {
      children?: React.ReactNode;
    }): JSX.Element => (
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <BrowserRouter>{children}</BrowserRouter>
      </MockedProvider>
    );

    const { result, waitForNextUpdate } = renderHook(() => useSession(), {
      wrapper,
    });

    const { startSession } = result.current;

    act(() => {
      startSession();
    });

    act(() => {
      jest.advanceTimersByTime(31 * 60 * 1000); // Adjust this time based on the session timeout
    });

    await waitForNextUpdate();

    expect(global.localStorage.clear).toHaveBeenCalled();
    expect(toast.warning).toHaveBeenCalledTimes(2);
    expect(toast.warning).toHaveBeenNthCalledWith(1, 'sessionWarning'); // First call for session warning
    expect(toast.warning).toHaveBeenNthCalledWith(2, 'sessionLogout', {
      autoClose: false,
    }); // Second call for session logout
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

    act(() => {
      jest.advanceTimersByTime(15 * 60 * 1000); // 15 minutes in milliseconds
    });

    await waitFor(() =>
      expect(toast.warning).toHaveBeenCalledWith('sessionWarning'),
    );

    jest.useRealTimers();
  });

  test('should handle error when revoking token fails', async (): Promise<void> => {
    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation();

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

    expect(consoleErrorMock).toHaveBeenCalledWith(
      'Error revoking refresh token:',
      expect.any(Error),
    );

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

    expect(global.localStorage.clear).toHaveBeenCalled();
    expect(toast.warning).toHaveBeenCalledWith('sessionLogout', {
      autoClose: false,
    });
  });

  test('should remove event listeners on endSession', async () => {
    // Mock the removeEventListener functions for both window and document
    const removeEventListenerMock = jest.fn();

    // Temporarily replace the real methods with the mock
    const originalWindowRemoveEventListener = window.removeEventListener;
    const originalDocumentRemoveEventListener = document.removeEventListener;

    window.removeEventListener = removeEventListenerMock;
    document.removeEventListener = removeEventListenerMock;

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

    // Test that event listeners were removed
    expect(removeEventListenerMock).toHaveBeenCalledWith(
      'mousemove',
      expect.any(Function),
    );
    expect(removeEventListenerMock).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function),
    );
    expect(removeEventListenerMock).toHaveBeenCalledWith(
      'visibilitychange',
      expect.any(Function),
    );

    // Restore the original removeEventListener functions
    window.removeEventListener = originalWindowRemoveEventListener;
    document.removeEventListener = originalDocumentRemoveEventListener;
  });
});
