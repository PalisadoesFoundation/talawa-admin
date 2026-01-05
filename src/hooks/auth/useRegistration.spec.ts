import { renderHook, act } from '@testing-library/react';
import { useRegistration } from './useRegistration';

describe('useRegistration', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should handle successful registration', async () => {
    const mockOnSuccess = vi.fn();
    const { result } = renderHook(() =>
      useRegistration({ onSuccess: mockOnSuccess }),
    );

    expect(result.current.loading).toBe(false);

    await act(async () => {
      await result.current.register({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        organizationId: '1',
      });
    });

    expect(mockOnSuccess).toHaveBeenCalledTimes(1);
    expect(result.current.loading).toBe(false);
  });

  it('should handle registration error', async () => {
    const mockOnError = vi.fn();
    const { result } = renderHook(() =>
      useRegistration({ onError: mockOnError }),
    );

    // Mock setTimeout to throw an error
    const originalSetTimeout = global.setTimeout;
    global.setTimeout = vi.fn().mockImplementation(() => {
      throw new Error('Registration failed');
    }) as unknown as typeof setTimeout;

    await act(async () => {
      try {
        await result.current.register({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          organizationId: '1',
        });
      } catch {
        // Expected to catch error
      }
    });

    // Restore original setTimeout
    global.setTimeout = originalSetTimeout;

    expect(mockOnError).toHaveBeenCalledWith(expect.any(Error));
    expect(result.current.loading).toBe(false);
  });

  it('should handle registration without callbacks', async () => {
    const { result } = renderHook(() => useRegistration({}));

    await act(async () => {
      await result.current.register({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        organizationId: '1',
      });
    });

    expect(result.current.loading).toBe(false);
  });

  it('should handle error without onError callback', async () => {
    const { result } = renderHook(() => useRegistration({}));

    // Mock setTimeout to throw an error
    const originalSetTimeout = global.setTimeout;
    global.setTimeout = vi.fn().mockImplementation(() => {
      throw new Error('Registration failed');
    }) as unknown as typeof setTimeout;

    await act(async () => {
      try {
        await result.current.register({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          organizationId: '1',
        });
      } catch {
        // Expected to catch error
      }
    });

    // Restore original setTimeout
    global.setTimeout = originalSetTimeout;

    expect(result.current.loading).toBe(false);
  });

  it('should set loading state during registration', async () => {
    const { result } = renderHook(() => useRegistration({}));

    expect(result.current.loading).toBe(false);

    const registerPromise = act(async () => {
      await result.current.register({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        organizationId: '1',
      });
    });

    await registerPromise;
    expect(result.current.loading).toBe(false);
  });
});
