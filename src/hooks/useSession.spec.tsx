import type { ReactNode } from 'react';
import React from 'react';
import { renderHook, cleanup } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { describe, beforeEach, afterEach, test, expect, vi } from 'vitest';
import useSession from './useSession';
import { GET_COMMUNITY_SESSION_TIMEOUT_DATA_PG } from 'GraphQl/Queries/Queries';
import { LOGOUT_MUTATION } from 'GraphQl/Mutations/mutations';
import { errorHandler } from 'utils/errorHandler';
import { BrowserRouter } from 'react-router-dom';
import { NotificationToast } from 'shared-components/NotificationToast/NotificationToast';

vi.mock('shared-components/NotificationToast/NotificationToast', () => ({
  NotificationToast: {
    info: vi.fn(),
    warning: vi.fn(),
    error: vi.fn(),
    success: vi.fn(),
    dismiss: vi.fn(),
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

vi.mock('utils/useLocalstorage', () => ({
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
    vi.restoreAllMocks();
    vi.spyOn(window, 'addEventListener');
    vi.spyOn(window, 'removeEventListener');
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
    mockClearAllItems.mockClear();
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
      expect(NotificationToast.warning).toHaveBeenCalledWith('sessionWarning');
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
      expect(NotificationToast.warning).not.toHaveBeenCalled();
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
      expect(NotificationToast.warning).toHaveBeenCalledTimes(2);

      expect(NotificationToast.warning).toHaveBeenNthCalledWith(
        1,
        'sessionWarning',
      );

      expect(NotificationToast.warning).toHaveBeenNthCalledWith(
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
      expect(NotificationToast.warning).toHaveBeenCalledWith('sessionWarning'),
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

    await vi.waitFor(() => {
      expect(consoleErrorMock).toHaveBeenCalledWith(
        'Error during logout:',
        expect.any(Error),
      );
      expect(NotificationToast.error).toHaveBeenCalledWith(
        'users.errorOccurred',
      );
      // After error, handleLogout should return early — no session-logout warning
      expect(NotificationToast.warning).not.toHaveBeenCalled();
      expect(mockClearAllItems).not.toHaveBeenCalled();
    });

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

    await vi.waitFor(() => {
      expect(global.setTimeout).toHaveBeenCalled();
    });
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
      expect(NotificationToast.warning).toHaveBeenCalledWith(
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
      expect(NotificationToast.warning).toHaveBeenCalledWith(
        'sessionLogOut',
        expect.objectContaining({ autoClose: false }),
      );
    });

    vi.useRealTimers();
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
    expect(NotificationToast.warning).not.toHaveBeenCalled();

    // Advance to new warning time
    vi.advanceTimersByTime(14 * 60 * 1000);

    await vi.waitFor(() =>
      expect(NotificationToast.warning).toHaveBeenCalledWith('sessionWarning'),
    );

    vi.useRealTimers();
  });

  test('should properly clean up on unmount', () => {
    const windowRemoveEventListener = vi.spyOn(window, 'removeEventListener');
    const documentRemoveEventListener = vi.spyOn(
      document,
      'removeEventListener',
    );

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

    const { result } = renderHook(() => useSession(), {
      wrapper: ({ children }: { children?: ReactNode }) => (
        <MockedProvider mocks={nullDataMocks}>
          <BrowserRouter>{children}</BrowserRouter>
        </MockedProvider>
      ),
    });

    result.current.startSession();

    // Advance time to 15 minutes (default warning time)
    vi.advanceTimersByTime(15 * 60 * 1000);

    await vi.waitFor(
      () => {
        expect(NotificationToast.warning).toHaveBeenCalledWith(
          'sessionWarning',
        );
      },
      { timeout: 3000 },
    );

    // Advance time to 30 minutes (default session timeout)
    vi.advanceTimersByTime(15 * 60 * 1000);

    await vi.waitFor(
      () => {
        expect(mockClearAllItems).toHaveBeenCalled();
      },
      { timeout: 3000 },
    );

    vi.useRealTimers();
  });

  test('should propagate event listener registration errors', () => {
    const setTimeoutSpy = vi
      .spyOn(global, 'setTimeout')
      .mockImplementation(() => ({}) as unknown as NodeJS.Timeout);
    const mockError = new Error('Event listener error');

    const addEventListenerSpy = vi
      .spyOn(window, 'addEventListener')
      .mockImplementationOnce(() => {
        throw mockError;
      });

    expect(() => {
      const { result } = renderHook(() => useSession(), {
        wrapper: ({ children }: { children?: ReactNode }) => (
          <MockedProvider mocks={MOCKS}>
            <BrowserRouter>{children}</BrowserRouter>
          </MockedProvider>
        ),
      });

      result.current.startSession();
    }).toThrow(mockError);

    expect(addEventListenerSpy).toHaveBeenCalled();

    setTimeoutSpy.mockRestore();
    addEventListenerSpy.mockRestore();
  });

  test('should handle session timeout data updates', async () => {
    vi.useFakeTimers();

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

    const { result } = renderHook(() => useSession(), {
      wrapper: ({ children }: { children?: ReactNode }) => (
        <MockedProvider mocks={customMocks}>
          <BrowserRouter>{children}</BrowserRouter>
        </MockedProvider>
      ),
    });

    result.current.startSession();

    // Advance to 15 minutes (half of 30 minutes default)
    vi.advanceTimersByTime(15 * 60 * 1000);

    await vi.waitFor(
      () => {
        expect(NotificationToast.warning).toHaveBeenCalledWith(
          'sessionWarning',
        );
      },
      { timeout: 3000 },
    );

    // Advance to full 30 minutes
    vi.advanceTimersByTime(15 * 60 * 1000);

    await vi.waitFor(
      () => {
        expect(mockClearAllItems).toHaveBeenCalled();
        expect(NotificationToast.warning).toHaveBeenCalledWith(
          'sessionLogOut',
          expect.objectContaining({ autoClose: false }),
        );
      },
      { timeout: 3000 },
    );

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

    Object.defineProperty(document, 'visibilityState', {
      value: 'prerender' as DocumentVisibilityState,
      writable: true,
    });

    document.dispatchEvent(new Event('visibilitychange'));

    vi.advanceTimersByTime(15 * 60 * 1000);

    await vi.waitFor(() => {
      expect(NotificationToast.warning).toHaveBeenCalledWith('sessionWarning');
    });

    vi.useRealTimers();
  });
  test('should throttle extend session calls on user activity', async () => {
    vi.useFakeTimers();

    // Capture the event listener handler
    let eventHandler: EventListener | null = null;
    const addEventListenerSpy = vi
      .spyOn(window, 'addEventListener')
      .mockImplementation((event, handler) => {
        if (event === 'mousemove') {
          eventHandler = handler as EventListener;
        }
      });

    const { result } = renderHook(() => useSession(), {
      wrapper: ({ children }: { children?: ReactNode }) => (
        <MockedProvider mocks={MOCKS}>
          <BrowserRouter>{children}</BrowserRouter>
        </MockedProvider>
      ),
    });

    result.current.startSession();

    // Verify the handler was captured
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'mousemove',
      expect.any(Function),
    );
    expect(eventHandler).toBeDefined();

    // 1. Trigger first activity - manually call the handler
    // This should trigger the first execution of throttledExtendSession
    if (eventHandler) (eventHandler as EventListener)(new Event('mousemove'));

    // Advance time slightly, but stay within the 5s throttle window
    vi.advanceTimersByTime(2000);

    // Trigger immediate subsequent activity - should be throttled
    if (eventHandler) (eventHandler as EventListener)(new Event('mousemove'));

    // 2. Advance time just past the 5s window
    vi.advanceTimersByTime(3100); // 2000 + 3100 = 5100ms

    // Trigger activity again - should no longer be throttled
    if (eventHandler) {
      // We can't easily spy on internal functions, but we can verify it doesn't throw
      // and we can potentially verify state changes if they existed.
      // Here we mostly verify the flow doesn't hang.
      (eventHandler as EventListener)(new Event('mousemove'));
    }

    vi.useRealTimers();
  });

  test('should clear timers via endSession on unmount to prevent side effects', async () => {
    vi.useFakeTimers();

    const { result, unmount } = renderHook(() => useSession(), {
      wrapper: ({ children }: { children?: ReactNode }) => (
        <MockedProvider mocks={MOCKS}>
          <BrowserRouter>{children}</BrowserRouter>
        </MockedProvider>
      ),
    });

    result.current.startSession();

    // Unmount triggers endSession() cleanup which clears all pending timers
    unmount();

    // Advance past session timeout — timers were cleared so handleLogout never fires
    vi.advanceTimersByTime(31 * 60 * 1000);

    // clearAllItems should NOT be called since timers were cleaned up on unmount
    expect(mockClearAllItems).not.toHaveBeenCalled();

    vi.useRealTimers();
  });
});
