import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { MockedProvider, type MockedResponse } from '@apollo/client/testing';
import { useRegistration } from './useRegistration';
import { SIGNUP_MUTATION } from 'GraphQl/Mutations/mutations';

const SUCCESS_MOCK: MockedResponse[] = [
  {
    request: {
      query: SIGNUP_MUTATION,
      variables: {
        ID: '1',
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      },
    },
    result: {
      data: {
        signUp: {
          user: { id: 'user-1' },
          authenticationToken: 'token',
          refreshToken: 'refresh',
        },
      },
    },
  },
];

const ERROR_MOCK: MockedResponse[] = [
  {
    request: {
      query: SIGNUP_MUTATION,
      variables: {
        ID: '1',
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      },
    },
    error: new Error('Registration failed'),
  },
];

const createWrapper = (mocks: MockedResponse[]) =>
  function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(MockedProvider, {
      mocks,
      addTypename: false,
      children,
    });
  };

describe('useRegistration', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it('should handle successful registration', async () => {
    const mockOnSuccess = vi.fn();
    const { result } = renderHook(
      () => useRegistration({ onSuccess: mockOnSuccess }),
      {
        wrapper: createWrapper(SUCCESS_MOCK),
      },
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

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
      const call = mockOnSuccess.mock.calls[0][0];
      expect(call.signUp.user.id).toBe('user-1');
      expect(call.name).toBe('Test User');
      expect(call.email).toBe('test@example.com');
    });
    expect(result.current.loading).toBe(false);
  });

  it('should handle registration error', async () => {
    const mockOnError = vi.fn();
    const { result } = renderHook(
      () => useRegistration({ onError: mockOnError }),
      {
        wrapper: createWrapper(ERROR_MOCK),
      },
    );

    await act(async () => {
      await result.current.register({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        organizationId: '1',
      });
    });

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith(expect.any(Error));
    });
    expect(result.current.loading).toBe(false);
  });

  it('should handle registration without callbacks', async () => {
    const { result } = renderHook(() => useRegistration({}), {
      wrapper: createWrapper(SUCCESS_MOCK),
    });

    await act(async () => {
      await result.current.register({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        organizationId: '1',
      });
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('should handle error without onError callback', async () => {
    const { result } = renderHook(() => useRegistration({}), {
      wrapper: createWrapper(ERROR_MOCK),
    });

    await act(async () => {
      await result.current.register({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        organizationId: '1',
      });
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('should set loading state during registration', async () => {
    const { result } = renderHook(() => useRegistration({}), {
      wrapper: createWrapper(SUCCESS_MOCK),
    });

    expect(result.current.loading).toBe(false);

    act(() => {
      result.current.register({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        organizationId: '1',
      });
    });

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('should throw error if registration data is missing', async () => {
    const mockOnError = vi.fn();
    const { result } = renderHook(
      () => useRegistration({ onError: mockOnError }),
      { wrapper: createWrapper(SUCCESS_MOCK) },
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
    const orgMocks: MockedResponse[] = [
      {
        request: {
          query: SIGNUP_MUTATION,
          variables: {
            ID: 'org-123',
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
          },
        },
        result: {
          data: {
            signUp: {
              user: { id: 'user-1' },
              authenticationToken: 'token',
              refreshToken: 'refresh',
            },
          },
        },
      },
      {
        request: {
          query: SIGNUP_MUTATION,
          variables: {
            ID: '',
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
          },
        },
        result: {
          data: {
            signUp: {
              user: { id: 'user-2' },
              authenticationToken: 'token2',
              refreshToken: 'refresh2',
            },
          },
        },
      },
    ];
    const { result } = renderHook(
      () => useRegistration({ onSuccess: mockOnSuccess }),
      { wrapper: createWrapper(orgMocks) },
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
