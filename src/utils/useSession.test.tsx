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
    jest.restoreAllMocks();
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
