// SKIP_LOCALSTORAGE_CHECK
import { refreshToken } from './getRefreshToken';

jest.mock('@apollo/client', () => {
  const originalModule = jest.requireActual('@apollo/client');

  return {
    __esModule: true,
    ...originalModule,
    ApolloClient: jest.fn(() => ({
      mutate: jest.fn(() =>
        Promise.resolve({
          data: {
            refreshToken: {
              accessToken: 'newAccessToken',
              refreshToken: 'newRefreshToken',
            },
          },
        })
      ),
    })),
  };
});

describe('refreshToken', () => {
  // Mock window.location.reload()
  const { location } = window;
  delete (global.window as any).location;
  global.window.location = { ...location, reload: jest.fn() };

  // Mock localStorage.setItem() and localStorage.clear()

  Storage.prototype.setItem = jest.fn();
  Storage.prototype.clear = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns true when the token is refreshed successfully', async () => {
    const result = await refreshToken();

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'Talawa-admin_token',
      JSON.stringify('newAccessToken')
    );
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'Talawa-admin_refreshToken',
      JSON.stringify('newRefreshToken')
    );
    expect(result).toBe(true);
    expect(window.location.reload).toHaveBeenCalled();
  });
});
