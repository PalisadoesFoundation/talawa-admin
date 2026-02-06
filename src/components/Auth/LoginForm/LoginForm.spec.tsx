import React from 'react';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider, type MockedResponse } from '@apollo/client/testing';
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
              props.onChange?.(e.target.value),
          }),
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

const _mockSignInNotFound: MockedResponse & {
  variableMatcher?: (vars: Record<string, unknown>) => boolean;
} = {
  request: {
    query: SIGNIN_QUERY,
    variables: {
      email: 'test@example.com',
      password: 'password123',
      recaptchaToken: 'recaptcha-token',
    },
  },
  variableMatcher: (vars) =>
    vars?.email === 'test@example.com' &&
    vars?.password === 'password123' &&
    vars?.recaptchaToken === 'recaptcha-token',
  result: {
    data: {
      signIn: null,
    },
  },
};

const _mockSignInSuccessWithRecaptcha: MockedResponse & {
  variableMatcher?: (vars: Record<string, unknown>) => boolean;
} = {
  request: {
    query: SIGNIN_QUERY,
    variables: {
      email: 'test@example.com',
      password: 'password123',
      recaptchaToken: 'recaptcha-token',
    },
  },
  variableMatcher: (vars) =>
    vars?.email === 'test@example.com' &&
    vars?.password === 'password123' &&
    vars?.recaptchaToken === 'recaptcha-token',
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

const _mockSignInErrorWithRecaptcha: MockedResponse & {
  variableMatcher?: (vars: Record<string, unknown>) => boolean;
} = {
  request: {
    query: SIGNIN_QUERY,
    variables: {
      email: 'wrong@example.com',
      password: 'wrongpassword',
      recaptchaToken: 'recaptcha-token',
    },
  },
  variableMatcher: (vars) =>
    vars?.email === 'wrong@example.com' &&
    vars?.password === 'wrongpassword' &&
    vars?.recaptchaToken === 'recaptcha-token',
  error: new Error('Invalid credentials'),
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
    recaptchaResetSpy.mockClear();
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
    test('calls onError when login fails with network error', async () => {
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

    test('calls onExpired and disables submit when reCAPTCHA expires', async () => {
      render(
        <MockedProvider link={new StaticMockLink([], true)}>
          <LoginForm {...defaultProps} enableRecaptcha={true} />
        </MockedProvider>,
      );

      const recaptchaInput = screen.getByTestId('mock-recaptcha-input');
      await user.type(recaptchaInput, 'token');

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
