import { renderHook, act, waitFor } from '@testing-library/react';
import { useRegistration } from './useRegistration';

describe('useRegistration', () => {
  afterEach(() => {
    vi.restoreAllMocks();
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
    vi.spyOn(global, 'setTimeout').mockImplementation(() => {
      throw new Error('Registration failed');
    });

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
    vi.spyOn(global, 'setTimeout').mockImplementation(() => {
      throw new Error('Registration failed');
    });

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

    expect(result.current.loading).toBe(false);
  });

  it('should set loading state during registration', async () => {
    const { result } = renderHook(() => useRegistration({}));

    expect(result.current.loading).toBe(false);

    // Start registration and check loading state immediately
    act(() => {
      result.current.register({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        organizationId: '1',
      });
    });

    // Should be loading now
    expect(result.current.loading).toBe(true);

    // Wait for completion
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('should throw error if registration data is missing', async () => {
    const mockOnError = vi.fn();
    const { result } = renderHook(() =>
      useRegistration({ onError: mockOnError }),
    );

    await act(async () => {
      await result.current.register({
        name: '',
        email: 'test@example.com',
        password: 'password123',
        organizationId: '1',
      });
    });

    expect(mockOnError).toHaveBeenCalledTimes(1);
    expect(mockOnError.mock.calls[0][0].message).toBe(
      'Missing required registration data',
    );
    expect(result.current.loading).toBe(false);

    await act(async () => {
      await result.current.register({
        name: 'Test User',
        email: '',
        password: 'password123',
        organizationId: '1',
      });
    });

    expect(mockOnError).toHaveBeenCalledTimes(2);
    expect(mockOnError.mock.calls[1][0].message).toBe(
      'Missing required registration data',
    );
    expect(result.current.loading).toBe(false);

    await act(async () => {
      await result.current.register({
        name: 'Test User',
        email: 'test@example.com',
        password: '',
        organizationId: '1',
      });
    });

    expect(mockOnError).toHaveBeenCalledTimes(3);
    expect(mockOnError.mock.calls[2][0].message).toBe(
      'Missing required registration data',
    );
    expect(result.current.loading).toBe(false);
  });

  it('should handle registration with organizationId correctly', async () => {
    const mockOnSuccess = vi.fn();
    const { result } = renderHook(() =>
      useRegistration({ onSuccess: mockOnSuccess }),
    );

    await act(async () => {
      await result.current.register({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        organizationId: 'org-123',
      });
    });

    expect(mockOnSuccess).toHaveBeenCalledTimes(1);
    expect(result.current.loading).toBe(false);
    await act(async () => {
      await result.current.register({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        organizationId: '',
      });
    });

    expect(mockOnSuccess).toHaveBeenCalledTimes(2);
    expect(result.current.loading).toBe(false);
  });
});
