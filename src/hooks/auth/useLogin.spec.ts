import React from 'react';
import { renderHook, act, waitFor, cleanup } from '@testing-library/react';
import { MockedProvider, type MockedResponse } from '@apollo/client/testing';
import { useLogin } from './useLogin';
import { SIGNIN_QUERY } from 'GraphQl/Queries/Queries';
import type { InterfaceSignInResult } from 'types/Auth/LoginForm/interface';

const createMockResult = (
  overrides?: Partial<InterfaceSignInResult>,
): InterfaceSignInResult => ({
  user: {
    id: 'test-user-id',
    name: 'Test User',
    emailAddress: 'test@example.com',
    role: 'USER',
    countryCode: 'US',
    avatarURL: null,
    isEmailAddressVerified: true,
  },
  authenticationToken: 'test-auth-token',
  refreshToken: 'test-refresh-token',
  ...overrides,
});

const createWrapper = (mocks: MockedResponse[]) =>
  function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(MockedProvider, {
      mocks,
      addTypename: false,
      children,
    });
  };

describe('useLogin', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('successful login', () => {
    it('should call onSuccess with result and return it', async () => {
      const mockResult = createMockResult();
      const mocks: MockedResponse[] = [
        {
          request: {
            query: SIGNIN_QUERY,
            variables: {
              email: 'test@example.com',
              password: 'password123',
            },
          },
          result: {
            data: {
              signIn: mockResult,
            },
          },
        },
      ];

      const onSuccess = vi.fn();
      const { result } = renderHook(() => useLogin({ onSuccess }), {
        wrapper: createWrapper(mocks),
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);

      let loginResult: InterfaceSignInResult | undefined;
      await act(async () => {
        loginResult = await result.current.login({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      expect(onSuccess).toHaveBeenCalledTimes(1);
      expect(onSuccess).toHaveBeenCalledWith(mockResult);
      expect(loginResult).toEqual(mockResult);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should work without callbacks', async () => {
      const mockResult = createMockResult();
      const mocks: MockedResponse[] = [
        {
          request: {
            query: SIGNIN_QUERY,
            variables: {
              email: 'test@example.com',
              password: 'password123',
            },
          },
          result: {
            data: {
              signIn: mockResult,
            },
          },
        },
      ];

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(mocks),
      });

      let loginResult: InterfaceSignInResult | undefined;
      await act(async () => {
        loginResult = await result.current.login({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      expect(loginResult).toEqual(mockResult);
      expect(result.current.error).toBe(null);
    });

    it('should pass recaptchaToken when provided', async () => {
      const mockResult = createMockResult();
      const mocks: MockedResponse[] = [
        {
          request: {
            query: SIGNIN_QUERY,
            variables: {
              email: 'test@example.com',
              password: 'password123',
              recaptchaToken: 'test-captcha-token',
            },
          },
          result: {
            data: {
              signIn: mockResult,
            },
          },
        },
      ];

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(mocks),
      });

      await act(async () => {
        await result.current.login({
          email: 'test@example.com',
          password: 'password123',
          recaptchaToken: 'test-captcha-token',
        });
      });

      expect(result.current.error).toBe(null);
    });
  });

  describe('error handling', () => {
    it('should call onError and throw on GraphQL error', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: SIGNIN_QUERY,
            variables: {
              email: 'test@example.com',
              password: 'wrongpassword',
            },
          },
          error: new Error('Invalid credentials'),
        },
      ];

      const onError = vi.fn();
      const { result } = renderHook(() => useLogin({ onError }), {
        wrapper: createWrapper(mocks),
      });

      await act(async () => {
        await expect(
          result.current.login({
            email: 'test@example.com',
            password: 'wrongpassword',
          }),
        ).rejects.toThrow();
      });

      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith(expect.any(Error));
      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.loading).toBe(false);
    });

    it('should throw error without callback', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: SIGNIN_QUERY,
            variables: {
              email: 'test@example.com',
              password: 'wrongpassword',
            },
          },
          error: new Error('Invalid credentials'),
        },
      ];

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(mocks),
      });

      await act(async () => {
        await expect(
          result.current.login({
            email: 'test@example.com',
            password: 'wrongpassword',
          }),
        ).rejects.toThrow();
      });

      expect(result.current.error).toBeInstanceOf(Error);
    });

    it('should throw error when no data returned', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: SIGNIN_QUERY,
            variables: {
              email: 'test@example.com',
              password: 'password123',
            },
          },
          result: {
            data: null,
          },
        },
      ];

      const onError = vi.fn();
      const { result } = renderHook(() => useLogin({ onError }), {
        wrapper: createWrapper(mocks),
      });

      await act(async () => {
        await expect(
          result.current.login({
            email: 'test@example.com',
            password: 'password123',
          }),
        ).rejects.toThrow('Login failed');
      });

      expect(onError).toHaveBeenCalledTimes(1);
      expect(result.current.error?.message).toBe('Login failed');
    });

    it('should reset error state on new login attempt', async () => {
      const errorMock: MockedResponse = {
        request: {
          query: SIGNIN_QUERY,
          variables: { email: 'test@example.com', password: 'wrong' },
        },
        error: new Error('First error'),
      };

      const successMock: MockedResponse = {
        request: {
          query: SIGNIN_QUERY,
          variables: { email: 'test@example.com', password: 'correct' },
        },
        result: { data: { signIn: createMockResult() } },
      };

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper([errorMock, successMock]),
      });

      await act(async () => {
        await expect(
          result.current.login({
            email: 'test@example.com',
            password: 'wrong',
          }),
        ).rejects.toThrow();
      });

      expect(result.current.error).not.toBe(null);

      await act(async () => {
        await result.current.login({
          email: 'test@example.com',
          password: 'correct',
        });
      });

      expect(result.current.error).toBe(null);
    });
  });

  describe('loading state', () => {
    it('should manage loading state correctly', async () => {
      const mocks: MockedResponse[] = [
        {
          request: {
            query: SIGNIN_QUERY,
            variables: { email: 'test@example.com', password: 'password123' },
          },
          result: { data: { signIn: createMockResult() } },
        },
      ];

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(mocks),
      });

      expect(result.current.loading).toBe(false);

      act(() => {
        result.current.login({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      expect(result.current.loading).toBe(true);

      await waitFor(() => expect(result.current.loading).toBe(false));
    });
  });
});
