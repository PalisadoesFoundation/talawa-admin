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
    delay: 100,
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
    // delay: 100,
  },
];

const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

describe('useSession Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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

  test('should handle visibility change to visible', async () => {
    jest.useFakeTimers();

    const { result, waitForNextUpdate } = renderHook(() => useSession(), {
      wrapper: ({ children }: { children?: ReactNode }) => (
        <MockedProvider mocks={MOCKS} addTypename={false}>
          <BrowserRouter>{children}</BrowserRouter>
        </MockedProvider>
      ),
    });

    Object.defineProperty(document, 'visibilityState', {
      value: 'visible',
      writable: true,
    });

    // await waitForNextUpdate();

    act(() => {
      result.current.startSession();
    });

    // Simulate visibility change
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });

    act(() => {
      jest.advanceTimersByTime(15 * 60 * 1000);
    });

    await waitForNextUpdate();

    expect(window.addEventListener).toHaveBeenCalledWith(
      'mousemove',
      expect.any(Function),
    );
    expect(window.addEventListener).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function),
    );

    expect(toast.warning).toHaveBeenCalledWith('sessionWarning'); // Toast warning should be shown

    jest.useRealTimers();
  });

  test('should handle visibility change to hidden and ensure no warning appears in 15 minutes', async () => {
    // Use Jest's fake timers to control time
    jest.useFakeTimers();

    const { result, waitForNextUpdate } = renderHook(() => useSession(), {
      wrapper: ({ children }: { children?: ReactNode }) => (
        <MockedProvider mocks={MOCKS} addTypename={false}>
          <BrowserRouter>{children}</BrowserRouter>
        </MockedProvider>
      ),
    });

    // Mock the visibility state to 'hidden'
    Object.defineProperty(document, 'visibilityState', {
      value: 'hidden',
      writable: true,
    });

    act(() => {
      result.current.startSession();
    });

    // Simulate visibility change
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });

    // Fast-forward time by 15 minutes (900,000 milliseconds)
    act(() => {
      jest.advanceTimersByTime(15 * 60 * 1000);
    });

    await waitForNextUpdate();

    // Assertions to check listeners and warning toast
    expect(window.removeEventListener).toHaveBeenCalledWith(
      'mousemove',
      expect.any(Function),
    );
    expect(window.removeEventListener).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function),
    );
    expect(toast.warning).not.toHaveBeenCalled(); // Ensure no toast warnings in 15 minutes

    // Restore the real timers after the test
    jest.useRealTimers();
  });

  test('should register event listeners on startSession', async () => {
    // Mock the removeEventListener functions for both window and document
    const addEventListenerMock = jest.fn();

    // Temporarily replace the real methods with the mock
    const originalWindowAddEventListener = window.addEventListener;
    const originalDocumentAddEventListener = document.addEventListener;

    window.addEventListener = addEventListenerMock;
    document.addEventListener = addEventListenerMock;

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

    // Test that event listeners were removed
    expect(addEventListenerMock).toHaveBeenCalledWith(
      'mousemove',
      expect.any(Function),
    );
    expect(addEventListenerMock).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function),
    );
    expect(addEventListenerMock).toHaveBeenCalledWith(
      'visibilitychange',
      expect.any(Function),
    );

    window.addEventListener = originalWindowAddEventListener;
    document.addEventListener = originalDocumentAddEventListener;
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

    act(() => {
      result.current.startSession();
      result.current.handleLogout();
    });

    await waitForNextUpdate();

    expect(consoleErrorMock).toHaveBeenCalledWith(
      'Error revoking refresh token:',
      expect.any(Error),
    );

    consoleErrorMock.mockRestore();
  });

  test('should set session timeout based on fetched data', async () => {
    jest.spyOn(global, 'setTimeout');

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

    // await wait(600);
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

    act(() => {
      result.current.startSession();
      result.current.handleLogout();
    });

    await waitForNextUpdate();

    expect(global.localStorage.clear).toHaveBeenCalled();
    expect(toast.warning).toHaveBeenCalledWith('sessionLogout', {
      autoClose: false,
    });
  });

  test('should remove event listeners on endSession', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useSession(), {
      wrapper: ({ children }: { children?: ReactNode }) => (
        <MockedProvider mocks={MOCKS} addTypename={false}>
          <BrowserRouter>{children}</BrowserRouter>
        </MockedProvider>
      ),
    });

    // Mock the removeEventListener functions for both window and document
    const removeEventListenerMock = jest.fn();

    // Temporarily replace the real methods with the mock
    const originalWindowRemoveEventListener = window.removeEventListener;
    const originalDocumentRemoveEventListener = document.removeEventListener;

    window.removeEventListener = removeEventListenerMock;
    document.removeEventListener = removeEventListenerMock;

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

  test('should call initialize timers when session is still active when the user returns to the tab', async () => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout').mockImplementation(jest.fn());

    const { result } = renderHook(() => useSession(), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={MOCKS} addTypename={false}>
          <BrowserRouter>{children}</BrowserRouter>
        </MockedProvider>
      ),
    });

    jest.advanceTimersByTime(1000);

    // Set initial visibility state to visible
    Object.defineProperty(document, 'visibilityState', {
      value: 'visible',
      writable: true,
    });

    // Start the session
    act(() => {
      result.current.startSession();
      jest.advanceTimersByTime(10 * 60 * 1000); // Fast-forward
    });

    // Simulate the user leaving the tab (set visibility to hidden)
    Object.defineProperty(document, 'visibilityState', {
      value: 'hidden',
      writable: true,
    });

    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });

    // Fast-forward time by more than the session timeout
    act(() => {
      jest.advanceTimersByTime(5 * 60 * 1000); // Fast-forward
    });

    // Simulate the user returning to the tab
    Object.defineProperty(document, 'visibilityState', {
      value: 'visible',
      writable: true,
    });

    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });

    jest.advanceTimersByTime(1000);

    expect(global.setTimeout).toHaveBeenCalled();

    // Restore real timers
    jest.useRealTimers();
  });

  test('should call handleLogout when session expires due to inactivity away from tab', async () => {
    jest.useFakeTimers(); // Use fake timers to control time

    const { result, waitFor } = renderHook(() => useSession(), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={MOCKS} addTypename={false}>
          <BrowserRouter>{children}</BrowserRouter>
        </MockedProvider>
      ),
    });

    jest.advanceTimersByTime(1000);

    // Set initial visibility state to visible
    Object.defineProperty(document, 'visibilityState', {
      value: 'visible',
      writable: true,
    });

    // Start the session
    act(() => {
      result.current.startSession();
      jest.advanceTimersByTime(10 * 60 * 1000); // Fast-forward
    });

    // Simulate the user leaving the tab (set visibility to hidden)
    Object.defineProperty(document, 'visibilityState', {
      value: 'hidden',
      writable: true,
    });

    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });

    // Fast-forward time by more than the session timeout
    act(() => {
      jest.advanceTimersByTime(32 * 60 * 1000); // Fast-forward by 32 minutes
    });

    // Simulate the user returning to the tab
    Object.defineProperty(document, 'visibilityState', {
      value: 'visible',
      writable: true,
    });

    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });

    jest.advanceTimersByTime(250);

    await waitFor(() => {
      expect(global.localStorage.clear).toHaveBeenCalled();
      expect(toast.warning).toHaveBeenCalledWith('sessionLogout', {
        autoClose: false,
      });
    });

    // Restore real timers
    jest.useRealTimers();
  });
});
