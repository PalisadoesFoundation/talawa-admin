import React from 'react';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider, type MockedResponse } from '@apollo/client/testing';
import { ApolloLink } from '@apollo/client/link/core';
import { Observable } from '@apollo/client/utilities';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { StaticMockLink } from '../../../utils/StaticMockLink';
import { LoginForm } from './LoginForm';
import { SIGNIN_QUERY } from '../../../GraphQl/Queries/Queries';
import { GraphQLError } from 'graphql';

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        adminLogin: 'Admin Login',
        userLogin: 'User Login',
        loading: 'Loading...',
      };
      return translations[key] || key;
    },
  }),
}));

vi.mock('Constant/constant', async () => ({
  ...(await vi.importActual<object>('Constant/constant')),
  RECAPTCHA_SITE_KEY: 'test-recaptcha-site-key',
}));

const recaptchaResetSpy = vi.fn();
vi.mock('react-google-recaptcha', async () => {
  const React = await import('react');
  return {
    __esModule: true,
    default: React.default.forwardRef(
      (
        props: {
          onChange?: (token: string) => void;
          onExpired?: () => void;
        } & Record<string, unknown>,
        ref: React.Ref<{ reset: () => void }>,
      ) => {
        React.default.useImperativeHandle(ref, () => ({
          reset: recaptchaResetSpy,
        }));
        return React.default.createElement(
          'div',
          { 'data-testid': 'mock-recaptcha-reset' as const, ...props },
          React.default.createElement('input', {
            'data-testid': 'mock-recaptcha-input',
            'aria-label': 'Complete reCAPTCHA',
            onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
              props.onChange?.(String(e.target.value)),
          }),
          React.default.createElement(
            'button',
            {
              type: 'button',
              'data-testid': 'mock-recaptcha-complete',
              'aria-label': 'Complete reCAPTCHA',
              onClick: () => props.onChange?.('token'),
            },
            'Complete',
          ),
          React.default.createElement(
            'button',
            {
              type: 'button',
              'data-testid': 'mock-recaptcha-expire',
              'aria-label': 'Expire reCAPTCHA',
              onClick: () => props.onExpired?.(),
            },
            'Expire',
          ),
        );
      },
    ),
  };
});

const mockSignInSuccess: MockedResponse = {
  request: {
    query: SIGNIN_QUERY,
    variables: {
      email: 'test@example.com',
      password: 'password123',
    },
  },
  result: {
    data: {
      signIn: {
        user: {
          id: '1',
          name: 'Test User',
          emailAddress: 'test@example.com',
          role: 'user',
          countryCode: 'US',
          avatarURL: null,
          isEmailAddressVerified: true,
        },
        authenticationToken: 'test-auth-token',
        refreshToken: 'test-refresh-token',
      },
    },
  },
};

const mockSignInAdminSuccess: MockedResponse = {
  request: {
    query: SIGNIN_QUERY,
    variables: {
      email: 'admin@example.com',
      password: 'adminpass123',
    },
  },
  result: {
    data: {
      signIn: {
        user: {
          id: '2',
          name: 'Admin User',
          emailAddress: 'admin@example.com',
          role: 'administrator',
          countryCode: 'US',
          avatarURL: null,
          isEmailAddressVerified: true,
        },
        authenticationToken: 'admin-auth-token',
        refreshToken: 'admin-refresh-token',
      },
    },
  },
};

const mockSignInError: MockedResponse = {
  request: {
    query: SIGNIN_QUERY,
    variables: {
      email: 'wrong@example.com',
      password: 'wrongpassword',
    },
  },
  error: new Error('Invalid credentials'),
};

const mockSignInGraphQLError: MockedResponse = {
  request: {
    query: SIGNIN_QUERY,
    variables: {
      email: 'error@example.com',
      password: 'errorpassword',
    },
  },
  result: {
    errors: [new GraphQLError('User not found')],
  },
};

describe('LoginForm', () => {
  let user: ReturnType<typeof userEvent.setup>;
  const defaultProps = {
    onSuccess: vi.fn(),
    onError: vi.fn(),
  };

  beforeEach(() => {
    user = userEvent.setup();
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    test('renders with default user login heading', () => {
      render(
        <MockedProvider link={new StaticMockLink([], true)}>
          <LoginForm {...defaultProps} />
        </MockedProvider>,
      );

      expect(screen.getByTestId('login-form-heading')).toHaveTextContent(
        'User Login',
      );
    });

    test('renders with admin login heading when isAdmin is true', () => {
      render(
        <MockedProvider link={new StaticMockLink([], true)}>
          <LoginForm {...defaultProps} isAdmin={true} />
        </MockedProvider>,
      );

      expect(screen.getByTestId('login-form-heading')).toHaveTextContent(
        'Admin Login',
      );
    });

    test('renders email field', () => {
      render(
        <MockedProvider link={new StaticMockLink([], true)}>
          <LoginForm {...defaultProps} />
        </MockedProvider>,
      );

      expect(screen.getByTestId('login-form-email')).toBeInTheDocument();
    });

    test('renders password field', () => {
      render(
        <MockedProvider link={new StaticMockLink([], true)}>
          <LoginForm {...defaultProps} />
        </MockedProvider>,
      );

      expect(screen.getByTestId('login-form-password')).toBeInTheDocument();
    });

    test('renders submit button', () => {
      render(
        <MockedProvider link={new StaticMockLink([], true)}>
          <LoginForm {...defaultProps} />
        </MockedProvider>,
      );

      expect(screen.getByTestId('login-form-submit')).toBeInTheDocument();
    });

    test('applies custom testId', () => {
      render(
        <MockedProvider link={new StaticMockLink([], true)}>
          <LoginForm {...defaultProps} testId="custom-login" />
        </MockedProvider>,
      );

      expect(screen.getByTestId('custom-login')).toBeInTheDocument();
      expect(screen.getByTestId('custom-login-heading')).toBeInTheDocument();
      expect(screen.getByTestId('custom-login-email')).toBeInTheDocument();
      expect(screen.getByTestId('custom-login-password')).toBeInTheDocument();
      expect(screen.getByTestId('custom-login-submit')).toBeInTheDocument();
    });
  });

  describe('Form Input Handling', () => {
    test('updates email field value on change', async () => {
      render(
        <MockedProvider link={new StaticMockLink([], true)}>
          <LoginForm {...defaultProps} />
        </MockedProvider>,
      );

      const emailInput = screen.getByTestId('login-form-email');
      await user.type(emailInput, 'test@example.com');

      expect(emailInput).toHaveValue('test@example.com');
    });

    test('updates password field value on change', async () => {
      render(
        <MockedProvider link={new StaticMockLink([], true)}>
          <LoginForm {...defaultProps} />
        </MockedProvider>,
      );

      const passwordInput = screen.getByTestId('login-form-password');
      await user.type(passwordInput, 'password123');

      expect(passwordInput).toHaveValue('password123');
    });
  });

  describe('Form Submission - Success', () => {
    test('calls onSuccess with full signIn result on successful login', async () => {
      const onSuccess = vi.fn();

      render(
        <MockedProvider link={new StaticMockLink([mockSignInSuccess], true)}>
          <LoginForm {...defaultProps} onSuccess={onSuccess} />
        </MockedProvider>,
      );

      const emailInput = screen.getByTestId('login-form-email');
      const passwordInput = screen.getByTestId('login-form-password');
      const submitButton = screen.getByTestId('login-form-submit');

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        const expected = (
          mockSignInSuccess.result as { data?: { signIn: unknown } } | undefined
        )?.data?.signIn;
        expect(onSuccess).toHaveBeenCalledWith(expected);
      });
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });

    test('calls onSuccess with full signIn result for admin login', async () => {
      const onSuccess = vi.fn();

      render(
        <MockedProvider
          link={new StaticMockLink([mockSignInAdminSuccess], true)}
        >
          <LoginForm {...defaultProps} isAdmin={true} onSuccess={onSuccess} />
        </MockedProvider>,
      );

      const emailInput = screen.getByTestId('login-form-email');
      const passwordInput = screen.getByTestId('login-form-password');
      const submitButton = screen.getByTestId('login-form-submit');

      await user.type(emailInput, 'admin@example.com');
      await user.type(passwordInput, 'adminpass123');
      await user.click(submitButton);

      await waitFor(() => {
        const expected = (
          mockSignInAdminSuccess.result as
            | { data?: { signIn: unknown } }
            | undefined
        )?.data?.signIn;
        expect(onSuccess).toHaveBeenCalledWith(expected);
      });
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });
  });

  describe('Form Submission - Error Handling', () => {
    test('calls onError when login fails with network error (catch block exercises reset/onError)', async () => {
      const onError = vi.fn();

      render(
        <MockedProvider link={new StaticMockLink([mockSignInError], true)}>
          <LoginForm {...defaultProps} onError={onError} />
        </MockedProvider>,
      );

      const emailInput = screen.getByTestId('login-form-email');
      const passwordInput = screen.getByTestId('login-form-password');
      const submitButton = screen.getByTestId('login-form-submit');

      await user.type(emailInput, 'wrong@example.com');
      await user.type(passwordInput, 'wrongpassword');
      await user.click(submitButton);

      await waitFor(() => {
        expect(onError).toHaveBeenCalled();
      });
      expect(onError).toHaveBeenCalledTimes(1);
      expect((onError.mock.calls[0][0] as Error).message).toBe(
        'Invalid credentials',
      );
    });

    test('calls onError when login fails with GraphQL error', async () => {
      const onError = vi.fn();

      render(
        <MockedProvider
          link={new StaticMockLink([mockSignInGraphQLError], true)}
        >
          <LoginForm {...defaultProps} onError={onError} />
        </MockedProvider>,
      );

      const emailInput = screen.getByTestId('login-form-email');
      const passwordInput = screen.getByTestId('login-form-password');
      const submitButton = screen.getByTestId('login-form-submit');

      await user.type(emailInput, 'error@example.com');
      await user.type(passwordInput, 'errorpassword');
      await user.click(submitButton);

      await waitFor(() => {
        expect(onError).toHaveBeenCalled();
      });
      expect(onError).toHaveBeenCalledTimes(1);
    });

    test('on error with recaptcha enabled, resets reCAPTCHA and calls onError', async () => {
      const onError = vi.fn();
      const link = new ApolloLink(
        () =>
          new Observable((observer) => {
            observer.error(new Error('Network failed'));
          }),
      );

      render(
        <MockedProvider link={link}>
          <LoginForm
            {...defaultProps}
            onError={onError}
            enableRecaptcha={true}
          />
        </MockedProvider>,
      );

      const completeButton = screen.getByTestId('mock-recaptcha-complete');
      await user.click(completeButton);

      await user.type(
        screen.getByTestId('login-form-email'),
        'test@example.com',
      );
      await user.type(screen.getByTestId('login-form-password'), 'password123');
      await user.click(screen.getByTestId('login-form-submit'));

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(expect.any(Error));
        expect(recaptchaResetSpy).toHaveBeenCalled();
      });
      expect((onError.mock.calls[0][0] as Error).message).toBe(
        'Network failed',
      );
    });

    test('handles AbortError from signin (catch returns early; useEffect ignores AbortError)', async () => {
      const onError = vi.fn();
      const link = new ApolloLink(
        () =>
          new Observable((observer) => {
            observer.error(new DOMException('aborted', 'AbortError'));
          }),
      );

      render(
        <MockedProvider link={link}>
          <LoginForm
            {...defaultProps}
            enableRecaptcha={false}
            onError={onError}
          />
        </MockedProvider>,
      );

      await user.type(
        screen.getByTestId('login-form-email'),
        'test@example.com',
      );
      await user.type(screen.getByTestId('login-form-password'), 'password123');
      await user.click(screen.getByTestId('login-form-submit'));

      // Catch block returns early for AbortError; useEffect ignores AbortError and does not call onError
      await waitFor(() => {
        expect(onError).not.toHaveBeenCalled();
      });
    });

    test('AbortError in catch: returns early without resetting reCAPTCHA or calling onError', async () => {
      const onError = vi.fn();
      const link = new ApolloLink(
        () =>
          new Observable((observer) => {
            observer.error(new DOMException('aborted', 'AbortError'));
          }),
      );

      render(
        <MockedProvider link={link}>
          <LoginForm
            {...defaultProps}
            onError={onError}
            enableRecaptcha={true}
          />
        </MockedProvider>,
      );

      const completeButton = screen.getByTestId('mock-recaptcha-complete');
      await user.click(completeButton);
      await user.type(
        screen.getByTestId('login-form-email'),
        'test@example.com',
      );
      await user.type(screen.getByTestId('login-form-password'), 'password123');
      await user.click(screen.getByTestId('login-form-submit'));

      await waitFor(() => {
        expect(onError).not.toHaveBeenCalled();
        expect(recaptchaResetSpy).not.toHaveBeenCalled();
      });
    });

    test('on signin rejection (non-Abort), catch block calls onError with thrown error', async () => {
      const onError = vi.fn();
      const link = new ApolloLink(
        () =>
          new Observable((observer) => {
            observer.error(new Error('Network failed'));
          }),
      );

      render(
        <MockedProvider link={link}>
          <LoginForm
            {...defaultProps}
            enableRecaptcha={false}
            onError={onError}
          />
        </MockedProvider>,
      );

      await user.type(
        screen.getByTestId('login-form-email'),
        'test@example.com',
      );
      await user.type(screen.getByTestId('login-form-password'), 'password123');
      await user.click(screen.getByTestId('login-form-submit'));

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(expect.any(Error));
        expect(onError).toHaveBeenCalledTimes(1);
      });
      const [callArg] = onError.mock.calls[0];
      expect((callArg as Error).message).toBe('Network failed');
    });

    test('does not throw when onError is not provided', async () => {
      render(
        <MockedProvider link={new StaticMockLink([mockSignInError], true)}>
          <LoginForm onSuccess={vi.fn()} />
        </MockedProvider>,
      );

      const emailInput = screen.getByTestId('login-form-email');
      const passwordInput = screen.getByTestId('login-form-password');
      const submitButton = screen.getByTestId('login-form-submit');

      await user.type(emailInput, 'wrong@example.com');
      await user.type(passwordInput, 'wrongpassword');
      await user.click(submitButton);
    });
  });

  describe('Loading State', () => {
    test('submit button is disabled during loading', async () => {
      // Use a mock that delays the response
      const delayedMock: MockedResponse = {
        ...mockSignInSuccess,
        delay: 100,
      };

      render(
        <MockedProvider link={new StaticMockLink([delayedMock], true)}>
          <LoginForm {...defaultProps} />
        </MockedProvider>,
      );

      const emailInput = screen.getByTestId('login-form-email');
      const passwordInput = screen.getByTestId('login-form-password');
      const submitButton = screen.getByTestId('login-form-submit');

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      // Button should be disabled immediately after click
      await waitFor(() => {
        expect(submitButton).toBeDisabled();
        expect(submitButton).toHaveTextContent('Loading...');
      });
    });

    test('form shows aria-busy during loading', async () => {
      const delayedMock: MockedResponse = {
        ...mockSignInSuccess,
        delay: 100,
      };

      render(
        <MockedProvider link={new StaticMockLink([delayedMock], true)}>
          <LoginForm {...defaultProps} />
        </MockedProvider>,
      );

      const emailInput = screen.getByTestId('login-form-email');
      const passwordInput = screen.getByTestId('login-form-password');
      const submitButton = screen.getByTestId('login-form-submit');
      const form = screen.getByTestId('login-form');

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(form).toHaveAttribute('aria-busy', 'true');
      });
    });
  });

  describe('Portal Toggle (Admin/User Mode)', () => {
    test('displays user login heading when isAdmin is false', () => {
      render(
        <MockedProvider link={new StaticMockLink([], true)}>
          <LoginForm {...defaultProps} isAdmin={false} />
        </MockedProvider>,
      );

      expect(screen.getByTestId('login-form-heading')).toHaveTextContent(
        'User Login',
      );
    });
  });

  describe('reCAPTCHA gating', () => {
    test('submit button is disabled when enableRecaptcha is true and no token', () => {
      render(
        <MockedProvider link={new StaticMockLink([], true)}>
          <LoginForm {...defaultProps} enableRecaptcha={true} />
        </MockedProvider>,
      );

      const submitButton = screen.getByTestId('login-form-submit');
      expect(submitButton).toBeDisabled();
    });

    test('handleSubmit returns early when enableRecaptcha is true and no token (no signin call)', async () => {
      const link = new StaticMockLink([], true);

      render(
        <MockedProvider link={link}>
          <LoginForm {...defaultProps} enableRecaptcha={true} />
        </MockedProvider>,
      );

      const form = screen.getByTestId('login-form') as HTMLFormElement;
      form.requestSubmit();

      await waitFor(() => {
        expect(link.operation).toBeUndefined();
      });
    });

    test('calls onExpired and disables submit when reCAPTCHA expires', async () => {
      render(
        <MockedProvider link={new StaticMockLink([], true)}>
          <LoginForm {...defaultProps} enableRecaptcha={true} />
        </MockedProvider>,
      );

      const completeButton = screen.getByTestId('mock-recaptcha-complete');
      await user.click(completeButton);

      const submitButton = screen.getByTestId('login-form-submit');
      expect(submitButton).not.toBeDisabled();

      const expireButton = screen.getByTestId('mock-recaptcha-expire');
      await user.click(expireButton);

      expect(submitButton).toBeDisabled();
    });

    // TODO: Re-enable when Apollo QueryManager canonicalStringify (HTMLInputElement ref) is resolved. Track: https://github.com/apollographql/apollo-client/issues
    test.todo(
      'when enableRecaptcha is true and signIn returns null, calls onError with "Not found" and resets reCAPTCHA',
    );

    test.todo(
      'with recaptcha token in variables, on success calls onSuccess with signIn payload',
    );

    test.todo(
      'with recaptcha token in variables, on error calls onError and resets reCAPTCHA',
    );
  });

  describe('Callback Handling', () => {
    test('does not throw when onSuccess is not provided', async () => {
      render(
        <MockedProvider link={new StaticMockLink([mockSignInSuccess], true)}>
          <LoginForm onError={vi.fn()} />
        </MockedProvider>,
      );

      const emailInput = screen.getByTestId('login-form-email');
      const passwordInput = screen.getByTestId('login-form-password');
      const submitButton = screen.getByTestId('login-form-submit');

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);
    });

    test('callbacks are optional', () => {
      // Should render without throwing
      expect(() =>
        render(
          <MockedProvider link={new StaticMockLink([], true)}>
            <LoginForm />
          </MockedProvider>,
        ),
      ).not.toThrow();
    });
  });
});
