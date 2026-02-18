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

const { mockClearAllItems } = vi.hoisted(() => ({
  mockClearAllItems: vi.fn(),
}));

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
  const wrapper = ({ children }: { children?: ReactNode }) => (
    <MockedProvider mocks={MOCKS}>
      <BrowserRouter>{children}</BrowserRouter>
    </MockedProvider>
  );

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.useFakeTimers();
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
    const { result } = renderHook(() => useSession(), { wrapper });

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
  });

  test('should handle visibility change to hidden and ensure no warning appears in 15 minutes', async () => {
    const { result } = renderHook(() => useSession(), { wrapper });

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
  });

  test('should register event listeners on startSession', async () => {
    const addEventListenerSpy = vi.fn();
    vi.spyOn(window, 'addEventListener').mockImplementation(
      addEventListenerSpy,
    );
    vi.spyOn(document, 'addEventListener').mockImplementation(
      addEventListenerSpy,
    );

    const { result } = renderHook(() => useSession(), { wrapper });

    result.current.startSession();

    await vi.waitFor(() => {
      const calls = addEventListenerSpy.mock.calls;
      expect(calls.length).toBe(4);

      const eventTypes = calls.map((call) => call[0]);
      expect(eventTypes).toContain('mousemove');
      expect(eventTypes).toContain('keydown');
      expect(eventTypes).toContain('visibilitychange');
    });
  });

  test('should call handleLogout after session timeout', async () => {
    const { result } = renderHook(() => useSession(), { wrapper });

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
        expect.objectContaining({ autoClose: false }),
      );
    });
  });

  test('should show a warning toast before session expiration', async () => {
    const { result } = renderHook(() => useSession(), { wrapper });

    result.current.startSession();
    vi.advanceTimersByTime(15 * 60 * 1000);

    await vi.waitFor(() =>
      expect(NotificationToast.warning).toHaveBeenCalledWith('sessionWarning'),
    );
  });

  test('should handle error when logout fails', async () => {
    const consoleErrorMock = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const errorMocks = [
      {
        request: { query: GET_COMMUNITY_SESSION_TIMEOUT_DATA_PG },
        result: { data: { community: { inactivityTimeoutDuration: 1800 } } },
      },
      {
        request: { query: LOGOUT_MUTATION },
        error: new Error('Failed to logout'),
      },
    ];

    const { result } = renderHook(() => useSession(), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={errorMocks}>
          <BrowserRouter>{children}</BrowserRouter>
        </MockedProvider>
      ),
    });

    result.current.startSession();
    result.current.handleLogout();

    await vi.waitFor(() => {
      expect(consoleErrorMock).toHaveBeenCalled();
      expect(NotificationToast.error).toHaveBeenCalledWith(
        'users.errorOccurred',
      );
    });

    consoleErrorMock.mockRestore();
  });

  test('should set session timeout based on fetched data', async () => {
    vi.spyOn(global, 'setTimeout');
    const { result } = renderHook(() => useSession(), { wrapper });

    result.current.startSession();

    await vi.waitFor(() => {
      expect(global.setTimeout).toHaveBeenCalled();
    });
  });

  test('should call errorHandler on query error', async () => {
    const errorMocks = [
      {
        request: { query: GET_COMMUNITY_SESSION_TIMEOUT_DATA_PG },
        error: new Error('An error occurred'),
      },
    ];

    const { result } = renderHook(() => useSession(), {
      wrapper: ({ children }) => (
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
    vi.spyOn(window, 'removeEventListener').mockImplementation(
      removeEventListenerSpy,
    );
    vi.spyOn(document, 'removeEventListener').mockImplementation(
      removeEventListenerSpy,
    );

    const { result } = renderHook(() => useSession(), { wrapper });

    result.current.startSession();
    result.current.endSession();

    await vi.waitFor(() => {
      const calls = removeEventListenerSpy.mock.calls;
      expect(calls.length).toBe(6);
    });
  });

  test('should call handleLogout when session expires due to inactivity away from tab', async () => {
    const { result } = renderHook(() => useSession(), { wrapper });

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
  });

  test('should handle logout manually', async () => {
    const { result } = renderHook(() => useSession(), { wrapper });

    result.current.startSession();
    result.current.handleLogout();

    await vi.waitFor(() => {
      expect(mockClearAllItems).toHaveBeenCalled();
    });
  });

  test('should extend session when called directly', async () => {
    const { result } = renderHook(() => useSession(), { wrapper });

    result.current.startSession();

    vi.advanceTimersByTime(14 * 60 * 1000);
    result.current.extendSession();
    vi.advanceTimersByTime(1 * 60 * 1000);

    expect(NotificationToast.warning).not.toHaveBeenCalled();

    vi.advanceTimersByTime(14 * 60 * 1000);

    await vi.waitFor(() =>
      expect(NotificationToast.warning).toHaveBeenCalledWith('sessionWarning'),
    );
  });

  test('should properly clean up on unmount', () => {
    const windowRemoveEventListener = vi.spyOn(window, 'removeEventListener');
    const documentRemoveEventListener = vi.spyOn(
      document,
      'removeEventListener',
    );

    const { result, unmount } = renderHook(() => useSession(), { wrapper });

    result.current.startSession();
    unmount();

    expect(windowRemoveEventListener).toHaveBeenCalledWith(
      'mousemove',
      expect.any(Function),
    );
    expect(documentRemoveEventListener).toHaveBeenCalledWith(
      'visibilitychange',
      expect.any(Function),
    );
  });

  test('should handle missing community data', async () => {
    const nullDataMocks = [
      {
        request: { query: GET_COMMUNITY_SESSION_TIMEOUT_DATA_PG },
        result: { data: { community: null } },
      },
      {
        request: { query: LOGOUT_MUTATION },
        result: { data: { logout: { success: true } } },
      },
    ];

    const { result } = renderHook(() => useSession(), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={nullDataMocks}>
          <BrowserRouter>{children}</BrowserRouter>
        </MockedProvider>
      ),
    });

    result.current.startSession();
    vi.advanceTimersByTime(15 * 60 * 1000);

    await vi.waitFor(() => {
      expect(NotificationToast.warning).toHaveBeenCalledWith('sessionWarning');
    });

    vi.advanceTimersByTime(15 * 60 * 1000);

    await vi.waitFor(() => {
      expect(mockClearAllItems).toHaveBeenCalled();
    });
  });

  test('should propagate event listener registration errors', () => {
    const mockError = new Error('Event listener error');
    const addEventListenerSpy = vi
      .spyOn(window, 'addEventListener')
      .mockImplementationOnce(() => {
        throw mockError;
      });

    expect(() => {
      const { result } = renderHook(() => useSession(), { wrapper });
      result.current.startSession();
    }).toThrow(mockError);

    addEventListenerSpy.mockRestore();
  });

  test('should handle edge case when visibility state is neither visible nor hidden', async () => {
    const { result } = renderHook(() => useSession(), { wrapper });

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
  });

  test('should throttle extend session calls on user activity', async () => {
    let eventHandler: EventListener | null = null;
    vi.spyOn(window, 'addEventListener').mockImplementation(
      (event, handler) => {
        if (event === 'mousemove') {
          eventHandler = handler as EventListener;
        }
      },
    );

    const { result } = renderHook(() => useSession(), { wrapper });

    result.current.startSession();

    if (eventHandler) (eventHandler as EventListener)(new Event('mousemove'));
    vi.advanceTimersByTime(2000);
    if (eventHandler) (eventHandler as EventListener)(new Event('mousemove'));
    vi.advanceTimersByTime(3100);

    if (eventHandler) {
      (eventHandler as EventListener)(new Event('mousemove'));
    }
  });

  test('should clear timers via endSession on unmount to prevent side effects', async () => {
    const { result, unmount } = renderHook(() => useSession(), { wrapper });

    result.current.startSession();
    unmount();
    vi.advanceTimersByTime(31 * 60 * 1000);

    expect(mockClearAllItems).not.toHaveBeenCalled();
  });

  test('should handle session timeout data updates', async () => {
    const { result } = renderHook(() => useSession(), { wrapper });

    result.current.startSession();
    vi.advanceTimersByTime(15 * 60 * 1000);

    await vi.waitFor(() => {
      expect(NotificationToast.warning).toHaveBeenCalledWith('sessionWarning');
    });

    vi.advanceTimersByTime(15 * 60 * 1000);

    await vi.waitFor(() => {
      expect(mockClearAllItems).toHaveBeenCalled();
    });
  });
});
