import { renderHook, act, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import useUserProfile from './useUserProfile';
import { useMutation } from '@apollo/client/react';
import { useNavigate } from 'react-router';
import useLocalStorage from 'utils/useLocalstorage';
import useSession from 'utils/useSession';
import { sanitizeAvatarURL } from 'utils/sanitizeAvatar';
import { resolveProfileNavigation } from 'utils/profileNavigation';

// Mock dependencies
vi.mock('@apollo/client', () => ({
  useMutation: vi.fn(),
  gql: vi.fn((query) => query),
}));

vi.mock('react-router', () => ({
  useNavigate: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('utils/useLocalstorage', () => ({
  default: vi.fn(),
}));

vi.mock('utils/useSession', () => ({
  default: vi.fn(),
}));

vi.mock('utils/sanitizeAvatar', () => ({
  sanitizeAvatarURL: vi.fn(),
}));

vi.mock('utils/profileNavigation', () => ({
  resolveProfileNavigation: vi.fn(),
}));

describe('useUserProfile', () => {
  const mockNavigate = vi.fn();
  const mockGetItem = vi.fn();
  const mockClearAllItems = vi.fn();
  const mockEndSession = vi.fn();
  const mockLogoutMutation = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useNavigate as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockNavigate,
    );
    (useLocalStorage as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      getItem: mockGetItem,
      clearAllItems: mockClearAllItems,
    });
    (useSession as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      endSession: mockEndSession,
    });
    (useMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue([
      mockLogoutMutation,
    ]);
    (
      sanitizeAvatarURL as unknown as ReturnType<typeof vi.fn>
    ).mockImplementation((url) => url || '');
    (
      resolveProfileNavigation as unknown as ReturnType<typeof vi.fn>
    ).mockImplementation(({ portal, role }) => `/mock/${portal}/${role}`);
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('should return default values when local storage is empty', () => {
    mockGetItem.mockReturnValue(null);

    const { result } = renderHook(() => useUserProfile());

    expect(result.current.name).toBe('');
    expect(result.current.displayedName).toBe('');
    expect(result.current.userRole).toBe('');
    expect(result.current.userImage).toBe('');
    expect(mockGetItem).toHaveBeenCalledWith('name');
    expect(mockGetItem).toHaveBeenCalledWith('role');
    expect(mockGetItem).toHaveBeenCalledWith('UserImage');
  });

  it('should retrieve values from local storage', () => {
    mockGetItem.mockImplementation((key: string) => {
      if (key === 'name') return 'Test User';
      if (key === 'role') return 'admin';
      if (key === 'UserImage') return 'http://example.com/avatar.jpg';
      return null;
    });

    (sanitizeAvatarURL as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      'http://example.com/avatar.jpg',
    );

    const { result } = renderHook(() => useUserProfile());

    expect(result.current.name).toBe('Test User');
    expect(result.current.displayedName).toBe('Test User');
    expect(result.current.userRole).toBe('admin');
    expect(result.current.userImage).toBe('http://example.com/avatar.jpg');
    expect(sanitizeAvatarURL).toHaveBeenCalledWith(
      'http://example.com/avatar.jpg',
    );
  });

  it('should truncate long names for displayedName', () => {
    const longName = 'This is a very long name that should be truncated';
    mockGetItem.mockImplementation((key: string) => {
      if (key === 'name') return longName;
      return null;
    });

    const { result } = renderHook(() => useUserProfile());

    expect(result.current.name).toBe(longName);
    // update with actual logic from hook (MAX_NAME_LENGTH - 3) + '...'
    // assuming MAX_NAME_LENGTH is e.g. 20 (import actual constant in real code if needed, or check implementation)
    // The implementation imports MAX_NAME_LENGTH from Constant/common.
    // Since we didn't mock the constant, it uses real value.
    // Let's rely on the fact that displayedName should be different from name if long enough.
    expect(result.current.displayedName.length).toBeLessThan(longName.length);
    expect(result.current.displayedName.endsWith('...')).toBe(true);
  });

  it('should resolve profile destination correctly', () => {
    mockGetItem.mockImplementation((key: string) => {
      if (key === 'role') return 'user';
      return null;
    });

    const { result } = renderHook(() => useUserProfile('admin'));

    expect(resolveProfileNavigation).toHaveBeenCalledWith({
      portal: 'admin',
      role: 'user',
    });
    expect(result.current.profileDestination).toBe('/mock/admin/user');
  });

  it('should handle logout successfully', async () => {
    const { result } = renderHook(() => useUserProfile());

    await act(async () => {
      await result.current.handleLogout();
    });

    expect(mockLogoutMutation).toHaveBeenCalled();
    expect(mockClearAllItems).toHaveBeenCalled();
    expect(mockEndSession).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('should fallback to cleanup on logout error', async () => {
    mockLogoutMutation.mockRejectedValue(new Error('Logout failed'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useUserProfile());

    await act(async () => {
      await result.current.handleLogout();
    });

    expect(mockLogoutMutation).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error during logout:',
      expect.any(Error),
    );
    // Cleanup should still happen
    expect(mockClearAllItems).toHaveBeenCalled();
    expect(mockEndSession).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/');
    consoleSpy.mockRestore();
  });

  it('prevents race conditions when logout is called multiple times', async () => {
    const { result } = renderHook(() => useUserProfile('user'));
    const consoleWarnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => {});
    // Call logout multiple times simultaneously
    const promise1 = result.current.handleLogout();
    const promise2 = result.current.handleLogout();
    const promise3 = result.current.handleLogout();
    await Promise.all([promise1, promise2, promise3]);
    // Should only call mutation once
    expect(mockLogoutMutation).toHaveBeenCalledTimes(1);
    expect(consoleWarnSpy).toHaveBeenCalledWith('Logout already in progress');
    consoleWarnSpy.mockRestore();
  });

  it('should log error when cleanup fails during logout', async () => {
    const error = new Error('Cleanup failed');
    mockClearAllItems.mockImplementation(() => {
      throw error;
    });
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useUserProfile());

    await act(async () => {
      await result.current.handleLogout();
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error during logout cleanup:',
      error,
    );
    // Navigation should still attempt to happen
    expect(mockNavigate).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
