import type { ReactNode } from 'react';
import React from 'react';
import { renderHook } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { toast } from 'react-toastify';
import { describe, beforeEach, afterEach, test, expect, vi } from 'vitest';
import useSession from './useSession';
import { GET_COMMUNITY_SESSION_TIMEOUT_DATA_PG } from 'GraphQl/Queries/Queries';
import { LOGOUT_MUTATION } from 'GraphQl/Mutations/mutations';
import { errorHandler } from 'utils/errorHandler';
import { BrowserRouter } from 'react-router';

vi.mock('react-toastify', () => ({
  toast: {
    info: vi.fn(),
    warning: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('utils/errorHandler', () => ({
  errorHandler: vi.fn(),
}));

vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-i18next')>();

  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => key,
      i18n: { changeLanguage: vi.fn() },
    }),
    initReactI18next: {
      type: '3rdParty',
      init: vi.fn(),
    },
  };
});

const mockClearAllItems = vi.fn();

vi.mock('./useLocalstorage', () => ({
  default: vi.fn(() => ({
    clearAllItems: mockClearAllItems,
    getItem: vi.fn((key: string) => {
      if (key === 'refreshToken') return 'test-refresh-token';
      return null;
    }),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    getStorageKey: vi.fn((key: string) => key),
  })),
}));

const MOCKS = [
  {
    request: {
      query: GET_COMMUNITY_SESSION_TIMEOUT_DATA_PG,
    },
    result: {
      data: {
        community: {
          inactivityTimeoutDuration: 1800,
        },
      },
    },
    delay: 100,
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
describe('useSession Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'addEventListener').mockImplementation(vi.fn());
    vi.spyOn(window, 'removeEventListener').mockImplementation(vi.fn());
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  test('should handle visibility change to visible', async () => {
    vi.useFakeTimers();

    const { result } = renderHook(() => useSession(), {
      wrapper: ({ children }: { children?: ReactNode }) => (
        <MockedProvider mocks={MOCKS}>
          <BrowserRouter>{children}</BrowserRouter>
        </MockedProvider>
      ),
    });

    Object.defineProperty(document, 'visibilityState', {
      value: 'visible',
      writable: true,
    });

    result.current.startSession();

    document.dispatchEvent(new Event('visibilitychange'));

    vi.advanceTimersByTime(15 * 60 * 1000);

    await vi.waitFor(() => {
      expect(window.addEventListener).toHaveBeenCalledWith(
        'mousemove',
        expect.any(Function),
      );
      expect(window.addEventListener).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function),
      );
      expect(toast.warning).toHaveBeenCalledWith(
        'sessionWarning',
        expect.any(Object),
      );
    });

    vi.useRealTimers();
  });

  test('should handle visibility change to hidden and ensure no warning appears in 15 minutes', async () => {
    vi.useFakeTimers();

    const { result } = renderHook(() => useSession(), {
      wrapper: ({ children }: { children?: ReactNode }) => (
        <MockedProvider mocks={MOCKS}>
          <BrowserRouter>{children}</BrowserRouter>
        </MockedProvider>
      ),
    });

    Object.defineProperty(document, 'visibilityState', {
      value: 'hidden',
      writable: true,
    });

    result.current.startSession();

    document.dispatchEvent(new Event('visibilitychange'));

    vi.advanceTimersByTime(15 * 60 * 1000);

    await vi.waitFor(() => {
      expect(window.removeEventListener).toHaveBeenCalledWith(
        'mousemove',
        expect.any(Function),
      );
      expect(window.removeEventListener).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function),
      );
      expect(toast.warning).not.toHaveBeenCalled();
    });

    vi.useRealTimers();
  });

  test('should register event listeners on startSession', async () => {
    const addEventListenerSpy = vi.fn();
    const windowAddEventListenerSpy = vi
      .spyOn(window, 'addEventListener')
      .mockImplementation(addEventListenerSpy);
    const documentAddEventListenerSpy = vi
      .spyOn(document, 'addEventListener')
      .mockImplementation(addEventListenerSpy);

    const { result } = renderHook(() => useSession(), {
      wrapper: ({ children }: { children?: ReactNode }) => (
        <MockedProvider mocks={MOCKS}>
          <BrowserRouter>{children}</BrowserRouter>
        </MockedProvider>
      ),
    });

    result.current.startSession();

    await vi.waitFor(() => {
      const calls = addEventListenerSpy.mock.calls;
      expect(calls.length).toBe(4);

      const eventTypes = calls.map((call) => call[0]);
      expect(eventTypes).toContain('mousemove');
      expect(eventTypes).toContain('keydown');
      expect(eventTypes).toContain('visibilitychange');

      calls.forEach((call) => {
        expect(call[1]).toBeTypeOf('function');
      });
    });

    windowAddEventListenerSpy.mockRestore();
    documentAddEventListenerSpy.mockRestore();
  });

  test('should call handleLogout after session timeout', async () => {
    vi.useFakeTimers();

    const { result } = renderHook(() => useSession(), {
      wrapper: ({ children }: { children?: ReactNode }) => (
        <MockedProvider mocks={MOCKS}>
          <BrowserRouter>{children}</BrowserRouter>
        </MockedProvider>
      ),
    });

    result.current.startSession();

    vi.advanceTimersByTime(31 * 60 * 1000);

    await vi.waitFor(() => {
      expect(mockClearAllItems).toHaveBeenCalled();
      expect(toast.warning).toHaveBeenCalledTimes(2);

      expect(toast.warning).toHaveBeenNthCalledWith(
        1,
        'sessionWarning',
        expect.any(Object),
      );

      expect(toast.warning).toHaveBeenNthCalledWith(
        2,
        'sessionLogOut',
        expect.objectContaining({
          autoClose: false,
        }),
      );
    });
  });

  test('should show a warning toast before session expiration', async () => {
    vi.useFakeTimers();

    const { result } = renderHook(() => useSession(), {
      wrapper: ({ children }: { children?: ReactNode }) => (
        <MockedProvider mocks={MOCKS}>
          <BrowserRouter>{children}</BrowserRouter>
        </MockedProvider>
      ),
    });

    result.current.startSession();

    vi.advanceTimersByTime(15 * 60 * 1000);

    await vi.waitFor(() =>
      expect(toast.warning).toHaveBeenCalledWith(
        'sessionWarning',
        expect.any(Object),
      ),
    );

    vi.useRealTimers();
  });

  test('should handle error when logout fails', async () => {
    const consoleErrorMock = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const errorMocks = [
      {
        request: {
          query: GET_COMMUNITY_SESSION_TIMEOUT_DATA_PG,
        },
        result: {
          data: {
            community: {
              inactivityTimeoutDuration: 1800,
            },
          },
        },
        delay: 1000,
      },
      {
        request: {
          query: LOGOUT_MUTATION,
        },
        error: new Error('Failed to logout'),
      },
    ];

    const { result } = renderHook(() => useSession(), {
      wrapper: ({ children }: { children?: ReactNode }) => (
        <MockedProvider mocks={errorMocks}>
          <BrowserRouter>{children}</BrowserRouter>
        </MockedProvider>
      ),
    });

    result.current.startSession();
    result.current.handleLogout();

    await vi.waitFor(() =>
      expect(consoleErrorMock).toHaveBeenCalledWith(
        'Error during logout:',
        expect.any(Error),
      ),
    );

    consoleErrorMock.mockRestore();
  });

  test('should set session timeout based on fetched data', async () => {
    vi.spyOn(global, 'setTimeout');

    const { result } = renderHook(() => useSession(), {
      wrapper: ({ children }: { children?: ReactNode }) => (
        <MockedProvider mocks={MOCKS}>
          <BrowserRouter>{children}</BrowserRouter>
        </MockedProvider>
      ),
    });

    result.current.startSession();

    expect(global.setTimeout).toHaveBeenCalled();
  });

  test('should call errorHandler on query error', async () => {
    const errorMocks = [
      {
        request: {
          query: GET_COMMUNITY_SESSION_TIMEOUT_DATA_PG,
        },
        error: new Error('An error occurred'),
      },
    ];

    const { result } = renderHook(() => useSession(), {
      wrapper: ({ children }: { children?: ReactNode }) => (
        <MockedProvider mocks={errorMocks}>
          <BrowserRouter>{children}</BrowserRouter>
        </MockedProvider>
      ),
    });

    result.current.startSession();

    await vi.waitFor(() => expect(errorHandler).toHaveBeenCalled());
  });

  test('should remove event listeners on endSession', async () => {
    const removeEventListenerSpy = vi.fn();
    const windowRemoveEventListenerSpy = vi
      .spyOn(window, 'removeEventListener')
      .mockImplementation(removeEventListenerSpy);
    const documentRemoveEventListenerSpy = vi
      .spyOn(document, 'removeEventListener')
      .mockImplementation(removeEventListenerSpy);

    const { result } = renderHook(() => useSession(), {
      wrapper: ({ children }: { children?: ReactNode }) => (
        <MockedProvider mocks={MOCKS}>
          <BrowserRouter>{children}</BrowserRouter>
        </MockedProvider>
      ),
    });

    result.current.startSession();
    result.current.endSession();

    await vi.waitFor(() => {
      const calls = removeEventListenerSpy.mock.calls;
      expect(calls.length).toBe(6);

      const eventTypes = calls.map((call) => call[0]);
      expect(eventTypes).toContain('mousemove');
      expect(eventTypes).toContain('keydown');
      expect(eventTypes).toContain('visibilitychange');

      calls.forEach((call) => {
        expect(call[1]).toBeTypeOf('function');
      });
    });

    windowRemoveEventListenerSpy.mockRestore();
    documentRemoveEventListenerSpy.mockRestore();
  });

  test('should call initialize timers when session is still active when the user returns to the tab', async () => {
    vi.useFakeTimers();
    vi.spyOn(global, 'setTimeout').mockImplementation(vi.fn());

    const { result } = renderHook(() => useSession(), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={MOCKS}>
          <BrowserRouter>{children}</BrowserRouter>
        </MockedProvider>
      ),
    });

    vi.advanceTimersByTime(1000);

    Object.defineProperty(document, 'visibilityState', {
      value: 'visible',
      writable: true,
    });

    result.current.startSession();
    vi.advanceTimersByTime(10 * 60 * 1000);

    Object.defineProperty(document, 'visibilityState', {
      value: 'hidden',
      writable: true,
    });

    document.dispatchEvent(new Event('visibilitychange'));

    vi.advanceTimersByTime(5 * 60 * 1000);

    Object.defineProperty(document, 'visibilityState', {
      value: 'visible',
      writable: true,
    });

    document.dispatchEvent(new Event('visibilitychange'));

    vi.advanceTimersByTime(1000);

    expect(global.setTimeout).toHaveBeenCalled();

    vi.useRealTimers();
  });

  test('should call handleLogout when session expires due to inactivity away from tab', async () => {
    vi.useFakeTimers();

    const { result } = renderHook(() => useSession(), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={MOCKS}>
          <BrowserRouter>{children}</BrowserRouter>
        </MockedProvider>
      ),
    });

    vi.advanceTimersByTime(1000);

    Object.defineProperty(document, 'visibilityState', {
      value: 'visible',
      writable: true,
    });

    result.current.startSession();
    vi.advanceTimersByTime(10 * 60 * 1000);

    Object.defineProperty(document, 'visibilityState', {
      value: 'hidden',
      writable: true,
    });

    document.dispatchEvent(new Event('visibilitychange'));

    vi.advanceTimersByTime(32 * 60 * 1000);

    Object.defineProperty(document, 'visibilityState', {
      value: 'visible',
      writable: true,
    });

    document.dispatchEvent(new Event('visibilitychange'));

    vi.advanceTimersByTime(250);

    await vi.waitFor(() => {
      expect(mockClearAllItems).toHaveBeenCalled();
      expect(toast.warning).toHaveBeenCalledWith(
        'sessionLogOut',
        expect.objectContaining({ autoClose: false }),
      );
    });

    vi.useRealTimers();
  });

  test('should handle logout', async () => {
    vi.useFakeTimers();

    const { result } = renderHook(() => useSession(), {
      wrapper: ({ children }: { children?: ReactNode }) => (
        <MockedProvider mocks={MOCKS}>
          <BrowserRouter>{children}</BrowserRouter>
        </MockedProvider>
      ),
    });

    result.current.startSession();
    result.current.handleLogout();

    await vi.waitFor(() => {
      expect(mockClearAllItems).toHaveBeenCalled();
      expect(toast.warning).toHaveBeenCalledWith(
        'sessionLogOut',
        expect.objectContaining({ autoClose: false }),
      );
    });

    vi.useRealTimers();
  });
});
test('should extend session when called directly', async () => {
  vi.useFakeTimers();

  const { result } = renderHook(() => useSession(), {
    wrapper: ({ children }: { children?: ReactNode }) => (
      <MockedProvider mocks={MOCKS}>
        <BrowserRouter>{children}</BrowserRouter>
      </MockedProvider>
    ),
  });

  result.current.startSession();

  // Advance time to just before warning
  vi.advanceTimersByTime(14 * 60 * 1000);

  // Extend session
  result.current.extendSession();

  // Advance time to where warning would have been
  vi.advanceTimersByTime(1 * 60 * 1000);

  // Warning shouldn't have been called yet since we extended
  expect(toast.warning).not.toHaveBeenCalled();

  // Advance to new warning time
  vi.advanceTimersByTime(14 * 60 * 1000);

  await vi.waitFor(() =>
    expect(toast.warning).toHaveBeenCalledWith(
      'sessionWarning',
      expect.any(Object),
    ),
  );

  vi.useRealTimers();
});

test('should properly clean up on unmount', () => {
  // Mock window.removeEventListener
  const windowRemoveEventListener = vi.spyOn(window, 'removeEventListener');
  const documentRemoveEventListener = vi.spyOn(document, 'removeEventListener');

  const { result, unmount } = renderHook(() => useSession(), {
    wrapper: ({ children }: { children?: ReactNode }) => (
      <MockedProvider mocks={MOCKS}>
        <BrowserRouter>{children}</BrowserRouter>
      </MockedProvider>
    ),
  });

  result.current.startSession();
  unmount();

  expect(windowRemoveEventListener).toHaveBeenCalledWith(
    'mousemove',
    expect.any(Function),
  );
  expect(windowRemoveEventListener).toHaveBeenCalledWith(
    'keydown',
    expect.any(Function),
  );
  expect(documentRemoveEventListener).toHaveBeenCalledWith(
    'visibilitychange',
    expect.any(Function),
  );

  documentRemoveEventListener.mockRestore();
});
test('should handle missing community data', async () => {
  vi.useFakeTimers();
  const setTimeoutSpy = vi.spyOn(global, 'setTimeout');

  const nullDataMocks = [
    {
      request: {
        query: GET_COMMUNITY_SESSION_TIMEOUT_DATA_PG,
      },
      result: {
        data: {
          community: null,
        },
      },
    },
  ];

  const { result } = renderHook(() => useSession(), {
    wrapper: ({ children }: { children?: ReactNode }) => (
      <MockedProvider mocks={nullDataMocks}>
        <BrowserRouter>{children}</BrowserRouter>
      </MockedProvider>
    ),
  });

  result.current.startSession();

  // Wait for timers to be set
  await vi.waitFor(() => {
    expect(setTimeoutSpy).toHaveBeenCalled();
  });

  // Get all setTimeout calls
  const timeoutCalls = setTimeoutSpy.mock.calls;

  // Check for warning timeout (15 minutes = 900000ms)
  const hasWarningTimeout = timeoutCalls.some(
    (call: Parameters<typeof setTimeout>) => {
      const [, ms] = call;
      return typeof ms === 'number' && ms === (30 * 60 * 1000) / 2;
    },
  );

  // Check for session timeout (30 minutes = 1800000ms)
  const hasSessionTimeout = timeoutCalls.some(
    (call: Parameters<typeof setTimeout>) => {
      const [, ms] = call;
      return typeof ms === 'number' && ms === 30 * 60 * 1000;
    },
  );

  expect(hasWarningTimeout).toBe(true);
  expect(hasSessionTimeout).toBe(true);

  setTimeoutSpy.mockRestore();
  vi.useRealTimers();
});

test('should handle event listener errors gracefully', async () => {
  const consoleErrorSpy = vi.spyOn(global, 'setTimeout');
  const mockError = new Error('Event listener error');

  // Mock addEventListener to throw an error
  const addEventListenerSpy = vi
    .spyOn(window, 'addEventListener')
    .mockImplementationOnce(() => {
      throw mockError;
    });

  try {
    const { result } = renderHook(() => useSession(), {
      wrapper: ({ children }: { children?: ReactNode }) => (
        <MockedProvider mocks={MOCKS}>
          <BrowserRouter>{children}</BrowserRouter>
        </MockedProvider>
      ),
    });

    result.current.startSession();
  } catch {
    // Error should be caught and logged
    expect(consoleErrorSpy).toHaveBeenCalled();
  }

  consoleErrorSpy.mockRestore();
  addEventListenerSpy.mockRestore();
});

test('should handle session timeout data updates', async () => {
  vi.useFakeTimers();
  const setTimeoutSpy = vi.spyOn(global, 'setTimeout');

  const customMocks = [
    {
      request: {
        query: GET_COMMUNITY_SESSION_TIMEOUT_DATA_PG,
      },
      result: {
        data: {
          community: {
            inactivityTimeoutDuration: 1800,
          },
        },
      },
    },
  ];

  const { result } = renderHook(() => useSession(), {
    wrapper: ({ children }: { children?: ReactNode }) => (
      <MockedProvider mocks={customMocks}>
        <BrowserRouter>{children}</BrowserRouter>
      </MockedProvider>
    ),
  });

  result.current.startSession();

  // Wait for the query and timers
  await vi.waitFor(() => {
    expect(setTimeoutSpy).toHaveBeenCalled();
  });

  const timeoutCalls = setTimeoutSpy.mock.calls;
  const expectedWarningTime = (45 * 60 * 1000) / 2;
  const expectedSessionTime = 45 * 60 * 1000;

  const hasWarningTimeout = timeoutCalls.some((call) => {
    const duration = call[1] as number;
    return (
      Math.abs(duration - expectedWarningTime) <= expectedWarningTime * 0.05
    ); // ±5%
  });

  const hasSessionTimeout = timeoutCalls.some((call) => {
    const duration = call[1] as number;
    return (
      Math.abs(duration - expectedSessionTime) <= expectedSessionTime * 0.05
    ); // ±5%
  });

  expect(hasWarningTimeout).toBe(false);
  expect(hasSessionTimeout).toBe(false);

  setTimeoutSpy.mockRestore();
  vi.useRealTimers();
});

test('should handle edge case when visibility state is neither visible nor hidden', async () => {
  vi.useFakeTimers();

  const { result } = renderHook(() => useSession(), {
    wrapper: ({ children }: { children?: ReactNode }) => (
      <MockedProvider mocks={MOCKS}>
        <BrowserRouter>{children}</BrowserRouter>
      </MockedProvider>
    ),
  });

  result.current.startSession();

  // Simulate a rare visibility state (e.g., 'prerender')
  Object.defineProperty(document, 'visibilityState', {
    value: 'prerender' as DocumentVisibilityState, // Type assertion needed for edge-case value
    writable: true,
  });

  // Trigger visibility change event
  document.dispatchEvent(new Event('visibilitychange'));

  // Fast forward time to trigger session warning
  vi.advanceTimersByTime(15 * 60 * 1000);

  await vi.waitFor(() => {
    expect(toast.warning).toHaveBeenCalledWith(
      'sessionWarning',
      expect.any(Object),
    );
  });

  vi.useRealTimers();
});
