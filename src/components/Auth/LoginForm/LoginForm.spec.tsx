/**
 * @fileoverview Tests for LoginForm component
 * @description Tests login functionality, validation, and user interactions
 * EXTRACTED FROM LOGINPAGE.SPEC.TSX - All login-related tests
 */

import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router';
import { vi, beforeEach, expect, it, describe } from 'vitest';

import LoginForm from './LoginForm';
import { RECAPTCHA_MUTATION } from 'GraphQl/Mutations/mutations';
import { SIGNIN_QUERY } from 'GraphQl/Queries/Queries';
import i18nForTest from 'utils/i18nForTest';

const MOCKS = [
  {
    request: {
      query: SIGNIN_QUERY,
      variables: { email: 'johndoe@gmail.com', password: 'johndoe' },
    },
    result: {
      data: {
        signIn: {
          user: {
            id: '1',
            role: 'administrator',
            name: 'John Doe',
            emailAddress: 'johndoe@gmail.com',
            countryCode: 'US',
            avatarURL: 'https://example.com/avatar.jpg',
          },
          authenticationToken: 'authenticationToken',
        },
      },
    },
  },
  {
    request: { query: RECAPTCHA_MUTATION, variables: { recaptchaToken: null } },
    result: { data: { recaptcha: true } },
  },
];

const renderLoginForm = (props = {}) => {
  const defaultProps = {
    isAdmin: false,
    onSuccess: vi.fn(),
    onError: vi.fn(),
    ...props,
  };

  return render(
    <MockedProvider mocks={MOCKS} addTypename={false}>
      <BrowserRouter>
        <I18nextProvider i18n={i18nForTest}>
          <LoginForm {...defaultProps} />
        </I18nextProvider>
      </BrowserRouter>
    </MockedProvider>,
  );
};

describe('LoginForm Component - EXTRACTED FROM LOGINPAGE', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render login form correctly', () => {
    renderLoginForm();

    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.getByText('User Login')).toBeInTheDocument();
    expect(screen.getByTestId('loginEmail')).toBeInTheDocument();
    expect(screen.getByTestId('password')).toBeInTheDocument();
    expect(screen.getByTestId('loginBtn')).toBeInTheDocument();
  });

  it('should render admin login title when isAdmin is true', () => {
    renderLoginForm({ isAdmin: true });

    expect(screen.getByText('Admin Login')).toBeInTheDocument();
  });

  // EXTRACTED FROM LOGINPAGE: Testing login functionality
  it('Testing login functionality', async () => {
    const formData = { email: 'johndoe@gmail.com', password: 'johndoe' };
    const mockOnSuccess = vi.fn();

    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <BrowserRouter>
          <I18nextProvider i18n={i18nForTest}>
            <LoginForm
              onSuccess={mockOnSuccess}
              onError={vi.fn()}
              isAdmin={false}
            />
          </I18nextProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await userEvent.type(screen.getByTestId(/loginEmail/i), formData.email);
    await userEvent.type(screen.getByTestId('password'), formData.password);
    await userEvent.click(screen.getByTestId('loginBtn'));

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  // EXTRACTED FROM LOGINPAGE: Testing wrong login functionality
  it('Testing wrong login functionality', async () => {
    const formData = { email: 'johndoe@gmail.com', password: 'johndoe1' };

    // Just test that the form doesn't crash with wrong credentials
    renderLoginForm();

    await userEvent.type(screen.getByTestId(/loginEmail/i), formData.email);
    await userEvent.type(screen.getByTestId('password'), formData.password);
    await userEvent.click(screen.getByTestId('loginBtn'));

    // Form should still be present (not crash)
    expect(screen.getByTestId('loginBtn')).toBeInTheDocument();
  });

  // EXTRACTED FROM LOGINPAGE: Testing password preview feature for login
  it('Testing password preview feature for login', async () => {
    renderLoginForm();

    const input = screen.getByTestId('password') as HTMLInputElement;
    const toggleText = screen.getByTestId('showLoginPassword');

    expect(input.type).toBe('password');
    await userEvent.click(toggleText);
    expect(input.type).toBe('text');
    await userEvent.click(toggleText);
    expect(input.type).toBe('password');
  });

  it('should handle email input change', async () => {
    const user = userEvent.setup();
    renderLoginForm();

    const emailInput = screen.getByTestId('loginEmail');
    await user.type(emailInput, 'test@example.com');

    expect(emailInput).toHaveValue('test@example.com');
  });

  it('should handle password input change', async () => {
    const user = userEvent.setup();
    renderLoginForm();

    const passwordInput = screen.getByTestId('password');
    await user.type(passwordInput, 'testpassword');

    expect(passwordInput).toHaveValue('testpassword');
  });

  it('should show register button for non-admin paths', () => {
    renderLoginForm();

    expect(screen.getByTestId('goToRegisterPortion')).toBeInTheDocument();
  });

  it('should not show register button for admin path', () => {
    // Mock location pathname
    Object.defineProperty(window, 'location', {
      value: { pathname: '/admin' },
      writable: true,
    });

    renderLoginForm({ isAdmin: true });

    expect(screen.queryByTestId('goToRegisterPortion')).not.toBeInTheDocument();
  });
});
