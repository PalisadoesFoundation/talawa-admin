import { renderHook, act } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { vi } from 'vitest';
import useSession from './useSession';
import { authClient } from 'lib/auth-client';
import { toast } from 'react-toastify';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});
const mockStorage = {
  clear: vi.fn(),
  getItem: vi.fn((key: string) => {
    const items: Record<string, string> = {
      name: JSON.stringify('Test User'),
    };
    return items[key] || null;
  }),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  length: 0,
  key: vi.fn(),
};

// Mock localStorage globally
beforeEach(() => {
  Object.defineProperty(global, 'localStorage', {
    value: mockStorage,
    configurable: true,
  });

  // Clear mock calls before each test
  mockStorage.clear.mockClear();
  mockStorage.getItem.mockClear();
  mockStorage.setItem.mockClear();
  mockStorage.removeItem.mockClear();
});

vi.mock('lib/auth-client', () => ({
  authClient: {
    listSessions: vi.fn(() => Promise.resolve([{ id: 'session1' }])),
    revokeOtherSessions: vi.fn().mockResolvedValue(undefined),
    revokeSessions: vi.fn().mockResolvedValue(undefined),
    signOut: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock('react-toastify', () => ({
  toast: {
    warning: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

describe('useSession Hook', () => {
  it('should list sessions', async () => {
    const { result } = renderHook(() => useSession());
    const sessions = await result.current.listSession();
    expect(sessions).toEqual([{ id: 'session1' }]);
  });

  it('should revoke other sessions except current', async () => {
    const { result } = renderHook(() => useSession(), {
      wrapper: MemoryRouter,
    });

    await act(async () => {
      await result.current.revokeOtherSessionExceptCurrentSession();
      expect(authClient.revokeOtherSessions).toHaveBeenCalled();
    });
  });

  it('should revoke all sessions', async () => {
    const { result } = renderHook(() => useSession(), {
      wrapper: MemoryRouter,
    });

    await act(async () => {
      await result.current.revokeAllSession();
      expect(authClient.revokeSessions).toHaveBeenCalled();
    });
  });

  it('should handle logout correctly', async () => {
    const mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    const { result } = renderHook(() => useSession(), {
      wrapper: MemoryRouter,
    });

    await act(async () => {
      await result.current.handleLogout();
      expect(mockStorage.clear).toHaveBeenCalled();
      expect(authClient.signOut).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('should handle errors when listing sessions fails', async () => {
    // Mock `authClient.listSessions` to throw an error
    vi.spyOn(authClient, 'listSessions').mockRejectedValue(
      new Error('Network Error'),
    );
    const { result } = renderHook(() => useSession());
    await expect(result.current.listSession()).rejects.toThrow('Network Error');
    // Check if the toast error message was displayed
    expect(toast.error).toHaveBeenCalledWith('sessionListingFailed');
  });

  it('should handle errors when revoke other sessions except current fails', async () => {
    // Mock `authClient.revokeOtherSessions` to throw an error
    vi.spyOn(authClient, 'revokeOtherSessions').mockRejectedValue(
      new Error('Network Error'),
    );
    const { result } = renderHook(() => useSession(), {
      wrapper: MemoryRouter,
    });
    await expect(
      result.current.revokeOtherSessionExceptCurrentSession(),
    ).rejects.toThrow('Network Error');
    // Check if the toast error message was displayed
    expect(toast.error).toHaveBeenCalledWith('revokeOtherSessionsFailed');
  });

  it('should handle errors when revoking all sessions fails', async () => {
    // Mock `authClient.revokeSessions` to throw an error
    vi.spyOn(authClient, 'revokeSessions').mockRejectedValue(
      new Error('Network Error'),
    );
    const { result } = renderHook(() => useSession(), {
      wrapper: MemoryRouter,
    });
    await expect(result.current.revokeAllSession()).rejects.toThrow(
      'Network Error',
    );
    // Ensure the correct toast error is triggered
    expect(toast.error).toHaveBeenCalledWith('revokeAllSessionsFailed');
  });
});
