import React from 'react';
import { useMutation } from '@apollo/client';
import { renderHook, act, waitFor, cleanup } from '@testing-library/react';
import { MockedProvider, type MockedResponse } from '@apollo/client/testing';
import {
  useRegistration,
  RegistrationError,
  RegistrationErrorCode,
} from 'hooks/auth/useRegistration';
import { SIGNUP_MUTATION } from 'GraphQl/Mutations/mutations';

const apolloUseMutationRef = vi.hoisted(() => ({
  actual: undefined as unknown as typeof useMutation,
}));

vi.mock('@apollo/client', async () => {
  const actual =
    await vi.importActual<typeof import('@apollo/client')>('@apollo/client');
  apolloUseMutationRef.actual = actual.useMutation;

  return {
    ...actual,
    // Mock at module level so this test is not coupled to how useRegistration imports useMutation.
    useMutation: vi.fn(actual.useMutation),
  };
});

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
    cleanup();
    vi.restoreAllMocks();
    vi.mocked(useMutation).mockImplementation(apolloUseMutationRef.actual);
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
    expect(result.current.error).toBeNull();

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
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  it('should handle registration error and set error state', async () => {
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
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeInstanceOf(Error);
    });
  });

  it('should normalize thrown object errors with a message property', async () => {
    const mockOnError = vi.fn();
    const mockSignup = vi
      .fn()
      .mockRejectedValue({ message: 'Registration failed from object' });
    const mockedMutationTuple = [
      mockSignup,
      { loading: false },
    ] as unknown as ReturnType<typeof useMutation>;

    vi.mocked(useMutation).mockReturnValue(mockedMutationTuple);

    const { result } = renderHook(() =>
      useRegistration({ onError: mockOnError }),
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
      expect(mockSignup).toHaveBeenCalledTimes(1);
      expect(mockOnError).toHaveBeenCalledTimes(1);
      expect(mockOnError).toHaveBeenCalledWith(expect.any(Error));
      expect((mockOnError.mock.calls[0][0] as Error).message).toBe(
        'Registration failed from object',
      );
      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe(
        'Registration failed from object',
      );
    });
  });

  it('should normalize non-object thrown values using String coercion', async () => {
    const mockOnError = vi.fn();
    const mockSignup = vi.fn().mockRejectedValue(404);
    const mockedMutationTuple = [
      mockSignup,
      { loading: false },
    ] as unknown as ReturnType<typeof useMutation>;

    vi.mocked(useMutation).mockReturnValue(mockedMutationTuple);

    const { result } = renderHook(() =>
      useRegistration({ onError: mockOnError }),
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
      expect(mockSignup).toHaveBeenCalledTimes(1);
      expect(mockOnError).toHaveBeenCalledTimes(1);
      expect((mockOnError.mock.calls[0][0] as Error).message).toBe('404');
      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('404');
    });
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

  it('should set error state even without onError callback', async () => {
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
      expect(result.current.error).toBeInstanceOf(Error);
    });
  });

  it('should set loading state during registration', async () => {
    const { result } = renderHook(() => useRegistration({}), {
      wrapper: createWrapper(SUCCESS_MOCK),
    });

    expect(result.current.loading).toBe(false);

    act(() => {
      void result.current.register({
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

  it('should call onError with RegistrationError (MISSING_REQUIRED_FIELDS) when registration data is missing', async () => {
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

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledTimes(1);
      const err0 = mockOnError.mock.calls[0][0];
      expect(err0).toBeInstanceOf(RegistrationError);
      expect((err0 as RegistrationError).code).toBe(
        RegistrationErrorCode.MISSING_REQUIRED_FIELDS,
      );
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeInstanceOf(RegistrationError);
    });

    await act(async () => {
      await result.current.register({
        name: 'Test User',
        email: '',
        password: 'password123',
        organizationId: '1',
      });
    });

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledTimes(2);
      const err1 = mockOnError.mock.calls[1][0];
      expect(err1).toBeInstanceOf(RegistrationError);
      expect((err1 as RegistrationError).code).toBe(
        RegistrationErrorCode.MISSING_REQUIRED_FIELDS,
      );
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeInstanceOf(RegistrationError);
    });

    await act(async () => {
      await result.current.register({
        name: 'Test User',
        email: 'test@example.com',
        password: '',
        organizationId: '1',
      });
    });

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledTimes(3);
      const err2 = mockOnError.mock.calls[2][0];
      expect(err2).toBeInstanceOf(RegistrationError);
      expect((err2 as RegistrationError).code).toBe(
        RegistrationErrorCode.MISSING_REQUIRED_FIELDS,
      );
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeInstanceOf(RegistrationError);
    });
  });

  it('should treat whitespace-only name, email, and password as missing required fields', async () => {
    const mockOnError = vi.fn();
    const { result } = renderHook(
      () => useRegistration({ onError: mockOnError }),
      { wrapper: createWrapper(SUCCESS_MOCK) },
    );

    await act(async () => {
      await result.current.register({
        name: '   ',
        email: 'test@example.com',
        password: 'password123',
        organizationId: '1',
      });
    });

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledTimes(1);
      expect((mockOnError.mock.calls[0][0] as RegistrationError).code).toBe(
        RegistrationErrorCode.MISSING_REQUIRED_FIELDS,
      );
    });

    await act(async () => {
      await result.current.register({
        name: 'Test User',
        email: '   ',
        password: 'password123',
        organizationId: '1',
      });
    });

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledTimes(2);
      expect((mockOnError.mock.calls[1][0] as RegistrationError).code).toBe(
        RegistrationErrorCode.MISSING_REQUIRED_FIELDS,
      );
    });

    await act(async () => {
      await result.current.register({
        name: 'Test User',
        email: 'test@example.com',
        password: '   ',
        organizationId: '1',
      });
    });

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledTimes(3);
      expect((mockOnError.mock.calls[2][0] as RegistrationError).code).toBe(
        RegistrationErrorCode.MISSING_REQUIRED_FIELDS,
      );
    });
  });

  it('should call onError with RegistrationError (MISSING_ORGANIZATION_ID) when organizationId is missing or empty', async () => {
    const mockOnError = vi.fn();
    const { result } = renderHook(
      () => useRegistration({ onError: mockOnError }),
      { wrapper: createWrapper(SUCCESS_MOCK) },
    );

    await act(async () => {
      await result.current.register({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        organizationId: '',
      });
    });

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledTimes(1);
      const err = mockOnError.mock.calls[0][0];
      expect(err).toBeInstanceOf(RegistrationError);
      expect((err as RegistrationError).code).toBe(
        RegistrationErrorCode.MISSING_ORGANIZATION_ID,
      );
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeInstanceOf(RegistrationError);
    });

    await act(async () => {
      await result.current.register({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        organizationId: '   ',
      });
    });

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledTimes(2);
      const err2 = mockOnError.mock.calls[1][0];
      expect(err2).toBeInstanceOf(RegistrationError);
      expect((err2 as RegistrationError).code).toBe(
        RegistrationErrorCode.MISSING_ORGANIZATION_ID,
      );
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeInstanceOf(RegistrationError);
    });
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

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
      expect(result.current.loading).toBe(false);
    });
  });

  it('should call onError when signUp is missing from the mutation response', async () => {
    const mockOnError = vi.fn();
    const noSignUpMock: MockedResponse[] = [
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
          data: { signUp: null },
        },
      },
    ];

    const { result } = renderHook(
      () => useRegistration({ onError: mockOnError }),
      {
        wrapper: createWrapper(noSignUpMock),
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
      expect(mockOnError).toHaveBeenCalledTimes(1);
      expect(mockOnError).toHaveBeenCalledWith(expect.any(Error));
      expect((mockOnError.mock.calls[0][0] as Error).message).toBe(
        'Sign-up returned no data',
      );
      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('Sign-up returned no data');
    });
  });

  it('should pass valid organizationId to signup (no empty string)', async () => {
    const mockOnSuccess = vi.fn();
    const mockOnError = vi.fn();
    const orgMocks: MockedResponse[] = [
      {
        request: {
          query: SIGNUP_MUTATION,
          variables: {
            ID: 'valid-org-id',
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
    const { result } = renderHook(
      () => useRegistration({ onSuccess: mockOnSuccess, onError: mockOnError }),
      { wrapper: createWrapper(orgMocks) },
    );

    await act(async () => {
      await result.current.register({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        organizationId: '  valid-org-id  ',
      });
    });

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
      expect(mockOnError).not.toHaveBeenCalled();
      expect(result.current.loading).toBe(false);
    });
  });

  it('should include recaptchaToken in signup variables when provided', async () => {
    const mockOnSuccess = vi.fn();
    const recaptchaToken = 'test-recaptcha-token-value';
    const recaptchaMocks: MockedResponse[] = [
      {
        request: {
          query: SIGNUP_MUTATION,
          variables: {
            ID: 'org-1',
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            recaptchaToken,
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
    const { result } = renderHook(
      () => useRegistration({ onSuccess: mockOnSuccess }),
      { wrapper: createWrapper(recaptchaMocks) },
    );

    await act(async () => {
      await result.current.register({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        organizationId: 'org-1',
        recaptchaToken,
      });
    });

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
      expect(result.current.loading).toBe(false);
    });
  });

  it('should clear error state on subsequent register call', async () => {
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

    await waitFor(() => {
      expect(result.current.error).toBeInstanceOf(RegistrationError);
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
      expect(result.current.error).toBeNull();
    });
  });
});
