import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider, type MockedResponse } from '@apollo/client/testing';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
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
  const defaultProps = {
    onSuccess: vi.fn(),
    onError: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Basic Rendering', () => {
    test('renders with default user login heading', () => {
      render(
        <MockedProvider mocks={[]}>
          <LoginForm {...defaultProps} />
        </MockedProvider>,
      );

      expect(screen.getByTestId('login-form-heading')).toHaveTextContent(
        'User Login',
      );
    });

    test('renders with admin login heading when isAdmin is true', () => {
      render(
        <MockedProvider mocks={[]}>
          <LoginForm {...defaultProps} isAdmin={true} />
        </MockedProvider>,
      );

      expect(screen.getByTestId('login-form-heading')).toHaveTextContent(
        'Admin Login',
      );
    });

    test('renders email field', () => {
      render(
        <MockedProvider mocks={[]}>
          <LoginForm {...defaultProps} />
        </MockedProvider>,
      );

      expect(screen.getByTestId('login-form-email')).toBeInTheDocument();
    });

    test('renders password field', () => {
      render(
        <MockedProvider mocks={[]}>
          <LoginForm {...defaultProps} />
        </MockedProvider>,
      );

      expect(screen.getByTestId('login-form-password')).toBeInTheDocument();
    });

    test('renders submit button', () => {
      render(
        <MockedProvider mocks={[]}>
          <LoginForm {...defaultProps} />
        </MockedProvider>,
      );

      expect(screen.getByTestId('login-form-submit')).toBeInTheDocument();
    });

    test('applies custom testId', () => {
      render(
        <MockedProvider mocks={[]}>
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
    test('updates email field value on change', () => {
      render(
        <MockedProvider mocks={[]}>
          <LoginForm {...defaultProps} />
        </MockedProvider>,
      );

      const emailInput = screen.getByTestId('login-form-email');
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      expect(emailInput).toHaveValue('test@example.com');
    });

    test('updates password field value on change', () => {
      render(
        <MockedProvider mocks={[]}>
          <LoginForm {...defaultProps} />
        </MockedProvider>,
      );

      const passwordInput = screen.getByTestId('login-form-password');
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      expect(passwordInput).toHaveValue('password123');
    });
  });

  describe('Form Submission - Success', () => {
    test('calls onSuccess with token on successful login', async () => {
      const onSuccess = vi.fn();

      render(
        <MockedProvider mocks={[mockSignInSuccess]}>
          <LoginForm {...defaultProps} onSuccess={onSuccess} />
        </MockedProvider>,
      );

      const emailInput = screen.getByTestId('login-form-email');
      const passwordInput = screen.getByTestId('login-form-password');
      const submitButton = screen.getByTestId('login-form-submit');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalledWith('test-auth-token');
      });
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });

    test('calls onSuccess for admin login', async () => {
      const onSuccess = vi.fn();

      render(
        <MockedProvider mocks={[mockSignInAdminSuccess]}>
          <LoginForm {...defaultProps} isAdmin={true} onSuccess={onSuccess} />
        </MockedProvider>,
      );

      const emailInput = screen.getByTestId('login-form-email');
      const passwordInput = screen.getByTestId('login-form-password');
      const submitButton = screen.getByTestId('login-form-submit');

      fireEvent.change(emailInput, { target: { value: 'admin@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'adminpass123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalledWith('admin-auth-token');
      });
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });
  });

  describe('Form Submission - Error Handling', () => {
    test('calls onError when login fails with network error', async () => {
      const onError = vi.fn();

      render(
        <MockedProvider mocks={[mockSignInError]}>
          <LoginForm {...defaultProps} onError={onError} />
        </MockedProvider>,
      );

      const emailInput = screen.getByTestId('login-form-email');
      const passwordInput = screen.getByTestId('login-form-password');
      const submitButton = screen.getByTestId('login-form-submit');

      fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(onError).toHaveBeenCalled();
      });
      expect(onError).toHaveBeenCalledTimes(1);
    });

    test('calls onError when login fails with GraphQL error', async () => {
      const onError = vi.fn();

      render(
        <MockedProvider mocks={[mockSignInGraphQLError]}>
          <LoginForm {...defaultProps} onError={onError} />
        </MockedProvider>,
      );

      const emailInput = screen.getByTestId('login-form-email');
      const passwordInput = screen.getByTestId('login-form-password');
      const submitButton = screen.getByTestId('login-form-submit');

      fireEvent.change(emailInput, { target: { value: 'error@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'errorpassword' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(onError).toHaveBeenCalled();
      });
      expect(onError).toHaveBeenCalledTimes(1);
    });

    test('does not throw when onError is not provided', async () => {
      render(
        <MockedProvider mocks={[mockSignInError]}>
          <LoginForm onSuccess={vi.fn()} />
        </MockedProvider>,
      );

      const emailInput = screen.getByTestId('login-form-email');
      const passwordInput = screen.getByTestId('login-form-password');
      const submitButton = screen.getByTestId('login-form-submit');

      fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

      // Should not throw
      expect(() => fireEvent.click(submitButton)).not.toThrow();
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
        <MockedProvider mocks={[delayedMock]}>
          <LoginForm {...defaultProps} />
        </MockedProvider>,
      );

      const emailInput = screen.getByTestId('login-form-email');
      const passwordInput = screen.getByTestId('login-form-password');
      const submitButton = screen.getByTestId('login-form-submit');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

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
        <MockedProvider mocks={[delayedMock]}>
          <LoginForm {...defaultProps} />
        </MockedProvider>,
      );

      const emailInput = screen.getByTestId('login-form-email');
      const passwordInput = screen.getByTestId('login-form-password');
      const submitButton = screen.getByTestId('login-form-submit');
      const form = screen.getByTestId('login-form');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(form).toHaveAttribute('aria-busy', 'true');
      });
    });
  });

  describe('Portal Toggle (Admin/User Mode)', () => {
    test('displays user login heading when isAdmin is false', () => {
      render(
        <MockedProvider mocks={[]}>
          <LoginForm {...defaultProps} isAdmin={false} />
        </MockedProvider>,
      );

      expect(screen.getByTestId('login-form-heading')).toHaveTextContent(
        'User Login',
      );
    });
  });

  describe('Callback Handling', () => {
    test('does not throw when onSuccess is not provided', async () => {
      render(
        <MockedProvider mocks={[mockSignInSuccess]}>
          <LoginForm onError={vi.fn()} />
        </MockedProvider>,
      );

      const emailInput = screen.getByTestId('login-form-email');
      const passwordInput = screen.getByTestId('login-form-password');
      const submitButton = screen.getByTestId('login-form-submit');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      // Should not throw
      expect(() => fireEvent.click(submitButton)).not.toThrow();
    });

    test('callbacks are optional', () => {
      // Should render without throwing
      expect(() =>
        render(
          <MockedProvider mocks={[]}>
            <LoginForm />
          </MockedProvider>,
        ),
      ).not.toThrow();
    });
  });
});
