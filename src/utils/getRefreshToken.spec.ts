// SKIP_LOCALSTORAGE_CHECK
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { refreshToken } from './getRefreshToken';

const mockApolloClient = {
  mutate: vi.fn(() =>
    Promise.resolve({
      data: {
        refreshToken: {
          accessToken: 'newAccessToken',
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
  const { location } = window;

  interface TestInterfacePartialWindow {
    location?: Partial<Location>;
  }

  delete (window as TestInterfacePartialWindow).location;
  global.window.location = { ...location, reload: vi.fn() };

  // Create storage mock
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    clear: vi.fn(),
    removeItem: vi.fn(),
    length: 0,
    key: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
  });

  it('returns true when the token is refreshed successfully', async () => {
    const result = await refreshToken();

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'Talawa-admin_token',
      JSON.stringify('newAccessToken'),
    );
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'Talawa-admin_refreshToken',
      JSON.stringify('newRefreshToken'),
    );
    expect(result).toBe(true);
    expect(window.location.reload).toHaveBeenCalled();
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
});
