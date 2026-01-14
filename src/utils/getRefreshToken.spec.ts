// SKIP_LOCALSTORAGE_CHECK
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { refreshToken, handleTokenRefresh } from './getRefreshToken';

const mockApolloClient = {
  mutate: vi.fn(() =>
    Promise.resolve({
      data: {
        refreshToken: {
          authenticationToken: 'newAccessToken',
          refreshToken: 'newRefreshToken',
        },
      },
    }),
  ),
};

vi.mock('@apollo/client', async () => {
  const actual = await vi.importActual('@apollo/client');
  return {
    ...actual,
    ApolloClient: vi.fn(() => mockApolloClient),
  };
});

describe('refreshToken', () => {
  let localStorageMock: Storage;
  let mockReload: () => void;
  let mockLocationHref: string;

  beforeEach(() => {
    mockReload = vi.fn();
    mockLocationHref = '';

    localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      clear: vi.fn(),
      removeItem: vi.fn(),
      length: 0,
      key: vi.fn(),
    };

    // Use Object.defineProperty for TypeScript compatibility
    Object.defineProperty(window, 'location', {
      value: {
        ...window.location,
        reload: mockReload,
        get href() {
          return mockLocationHref;
        },
        set href(value: string) {
          mockLocationHref = value;
        },
      },
      writable: true,
    });

    vi.clearAllMocks();
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns true when the token is refreshed successfully via HTTP-Only cookies', async () => {
    const result = await refreshToken();

    // Verify mutation was called without refreshToken variable (uses cookie)
    expect(mockApolloClient.mutate).toHaveBeenCalled();

    // No localStorage calls for tokens - they're in HTTP-Only cookies now
    expect(localStorage.setItem).not.toHaveBeenCalledWith(
      'Talawa-admin_token',
      expect.any(String),
    );
    expect(localStorage.setItem).not.toHaveBeenCalledWith(
      'Talawa-admin_refreshToken',
      expect.any(String),
    );

    expect(result).toBe(true);
  });

  it('returns false and logs error when token refresh fails', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const errorMock = new Error('Failed to refresh token');
    mockApolloClient.mutate.mockRejectedValueOnce(errorMock);

    const result = await refreshToken();

    expect(result).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to refresh token',
      errorMock,
    );

    consoleErrorSpy.mockRestore();
  });

  it('returns false when mutation returns no data', async () => {
    mockApolloClient.mutate.mockResolvedValueOnce({
      data: null as unknown as {
        refreshToken: { authenticationToken: string; refreshToken: string };
      },
    });

    const result = await refreshToken();

    expect(result).toBe(false);
  });
});

describe('handleTokenRefresh', () => {
  let localStorageMock: Storage;
  let mockReload: () => void;
  let mockLocationHref: string;

  beforeEach(() => {
    mockReload = vi.fn();
    mockLocationHref = '';

    localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      clear: vi.fn(),
      removeItem: vi.fn(),
      length: 0,
      key: vi.fn(),
    };

    Object.defineProperty(window, 'location', {
      value: {
        ...window.location,
        reload: mockReload,
        get href() {
          return mockLocationHref;
        },
        set href(value: string) {
          mockLocationHref = value;
        },
      },
      writable: true,
    });

    vi.clearAllMocks();
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('reloads page on successful token refresh', async () => {
    mockApolloClient.mutate.mockResolvedValueOnce({
      data: {
        refreshToken: {
          authenticationToken: 'newAccessToken',
          refreshToken: 'newRefreshToken',
        },
      },
    });

    await handleTokenRefresh();

    expect(mockReload).toHaveBeenCalled();
  });

  it('clears storage and redirects on failed refresh', async () => {
    // Set up localStorage to have prefixed items that clearAllItems will remove
    const storedKeys = [
      'Talawa-admin_IsLoggedIn',
      'Talawa-admin_name',
      'Talawa-admin_email',
    ];

    mockApolloClient.mutate.mockRejectedValueOnce(new Error('Refresh failed'));

    Object.defineProperty(localStorageMock, 'length', {
      value: storedKeys.length,
      writable: true,
    });
    localStorageMock.key = vi.fn((index: number) => storedKeys[index] || null);

    await handleTokenRefresh();

    // clearAllItems calls removeItem for each prefixed key
    expect(localStorageMock.removeItem).toHaveBeenCalled();
    expect(mockLocationHref).toBe('/');
  });
});
