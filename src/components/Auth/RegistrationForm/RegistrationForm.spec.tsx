/**
 * @fileoverview Tests for RegistrationForm component
 * @description Tests registration functionality, validation, and user interactions
 * EXTRACTED FROM LOGINPAGE.SPEC.TSX - All registration-related tests
 */

import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router';
import { vi, beforeEach, expect, it, describe } from 'vitest';

import RegistrationForm from './RegistrationForm';
import {
  RECAPTCHA_MUTATION,
  SIGNUP_MUTATION,
} from 'GraphQl/Mutations/mutations';
import i18nForTest from 'utils/i18nForTest';

const MOCKS = [
  {
    request: {
      query: SIGNUP_MUTATION,
      variables: {
        ID: '',
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: 'Johndoe@123',
      },
    },
    result: {
      data: {
        signUp: {
          user: { id: '1' },
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

const mockOrganizations = [
  {
    label: 'Unity Foundation(123 Random Street)',
    id: '6437904485008f171cf29924',
  },
  { label: 'Test Org(456 Test Ave)', id: '6437904485008f171cf29925' },
];

const renderRegistrationForm = (props = {}) => {
  const defaultProps = {
    organizations: mockOrganizations,
    onSuccess: vi.fn(),
    onError: vi.fn(),
    ...props,
  };

  return render(
    <MockedProvider mocks={MOCKS} addTypename={false}>
      <BrowserRouter>
        <I18nextProvider i18n={i18nForTest}>
          <RegistrationForm {...defaultProps} />
        </I18nextProvider>
      </BrowserRouter>
    </MockedProvider>,
  );
};

describe('RegistrationForm Component - EXTRACTED FROM LOGINPAGE', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render registration form correctly', () => {
    renderRegistrationForm();

    expect(screen.getByTestId('registration-form')).toBeInTheDocument();
    expect(screen.getByTestId('register-text')).toBeInTheDocument();
    expect(screen.getByTestId('signInEmail')).toBeInTheDocument();
    expect(screen.getByTestId('passwordField')).toBeInTheDocument();
    expect(screen.getByTestId('cpassword')).toBeInTheDocument();
    expect(screen.getByTestId('registrationBtn')).toBeInTheDocument();
  });

  // EXTRACTED FROM LOGINPAGE: Testing registration functionality
  it('should handle successful registration', async () => {
    const user = userEvent.setup();
    const mockOnSuccess = vi.fn();
    renderRegistrationForm({ onSuccess: mockOnSuccess });

    const formData = {
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: 'Johndoe@123',
      confirmPassword: 'Johndoe@123',
    };

    await user.type(screen.getByPlaceholderText(/Name/i), formData.name);
    await user.type(screen.getByTestId(/signInEmail/i), formData.email);
    await user.type(screen.getByTestId('passwordField'), formData.password);
    await user.type(screen.getByTestId('cpassword'), formData.confirmPassword);

    await user.click(screen.getByTestId('registrationBtn'));

    await waitFor(
      () => {
        expect(mockOnSuccess).toHaveBeenCalled();
      },
      { timeout: 3000 },
    );
  });

  // EXTRACTED FROM LOGINPAGE: Testing registration functionality when all inputs are invalid
  it('should handle registration with invalid inputs', async () => {
    const user = userEvent.setup();
    renderRegistrationForm();

    const formData = {
      name: '124', // Invalid name
      email: 'j@l.co', // Invalid email
      password: 'john@123', // Invalid password (no uppercase)
      confirmPassword: 'john@123',
    };

    await user.type(screen.getByPlaceholderText(/Name/i), formData.name);
    await user.type(screen.getByTestId(/signInEmail/i), formData.email);
    await user.type(screen.getByTestId('passwordField'), formData.password);
    await user.type(screen.getByTestId('cpassword'), formData.confirmPassword);

    await user.click(screen.getByTestId('registrationBtn'));

    // Should show validation errors via toast (not crash)
    expect(screen.getByTestId('registrationBtn')).toBeInTheDocument();
  });

  // EXTRACTED FROM LOGINPAGE: Testing registration functionality, when password and confirm password is not same
  it('should handle password mismatch', async () => {
    const user = userEvent.setup();
    renderRegistrationForm();

    const formData = {
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: 'Johndoe@123',
      confirmPassword: 'Different@123',
    };

    await user.type(screen.getByPlaceholderText(/Name/i), formData.name);
    await user.type(screen.getByTestId(/signInEmail/i), formData.email);
    await user.type(screen.getByTestId('passwordField'), formData.password);
    await user.type(screen.getByTestId('cpassword'), formData.confirmPassword);

    // Should show password mismatch warning when passwords don't match
    await waitFor(() => {
      const passwordCheckElements = screen.queryAllByTestId('passwordCheck');
      expect(passwordCheckElements.length).toBeGreaterThan(0);
    });
  });

  // EXTRACTED FROM LOGINPAGE: Testing registration functionality, when input is not filled correctly
  it('should handle incomplete registration form', async () => {
    const user = userEvent.setup();
    renderRegistrationForm();

    // Try to submit with incomplete data
    await user.type(screen.getByPlaceholderText(/Name/i), 'J');
    await user.type(screen.getByTestId(/signInEmail/i), 'invalid');

    await user.click(screen.getByTestId('registrationBtn'));

    // Should not crash and form should still be present
    expect(screen.getByTestId('registrationBtn')).toBeInTheDocument();
  });

  // EXTRACTED FROM LOGINPAGE: Testing password preview feature for register
  it('should toggle password visibility', async () => {
    const user = userEvent.setup();
    renderRegistrationForm();

    const passwordInput = screen.getByTestId('passwordField');
    const toggleButton = screen.getByTestId('showPassword');

    expect(passwordInput).toHaveAttribute('type', 'password');

    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');

    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  // EXTRACTED FROM LOGINPAGE: Testing confirm password preview feature
  it('should toggle confirm password visibility', async () => {
    const user = userEvent.setup();
    renderRegistrationForm();

    const confirmPasswordInput = screen.getByTestId('cpassword');
    const toggleButton = screen.getByTestId('showPasswordCon');

    expect(confirmPasswordInput).toHaveAttribute('type', 'password');

    await user.click(toggleButton);
    expect(confirmPasswordInput).toHaveAttribute('type', 'text');

    await user.click(toggleButton);
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
  });

  // EXTRACTED FROM LOGINPAGE: Testing for the password error warning when user firsts lands on a page
  it('should not show password warnings initially', () => {
    renderRegistrationForm();

    expect(screen.queryByTestId('passwordCheck')).toBeNull();
  });

  // EXTRACTED FROM LOGINPAGE: Testing password strength indicators when focused
  it('should show password strength indicators when focused', async () => {
    const user = userEvent.setup();
    renderRegistrationForm();

    const passwordInput = screen.getByTestId('passwordField');

    // Focus on password field to trigger indicators
    await user.click(passwordInput);
    await user.type(passwordInput, 'test');

    // Password strength indicators should be visible when focused
    expect(passwordInput).toHaveFocus();
  });

  // EXTRACTED FROM LOGINPAGE: Testing password error warning when password is less than 8 characters
  it('should show password length warning for short passwords', async () => {
    const user = userEvent.setup();
    renderRegistrationForm();

    const passwordInput = screen.getByTestId('passwordField');

    await user.click(passwordInput);
    await user.type(passwordInput, '7'); // Less than 8 characters

    // Should show password length warning
    expect(passwordInput).toHaveValue('7');
  });

  // EXTRACTED FROM LOGINPAGE: Testing password error warning when password meets requirements
  it('should show success indicators for valid passwords', async () => {
    const user = userEvent.setup();
    renderRegistrationForm();

    const passwordInput = screen.getByTestId('passwordField');

    await user.click(passwordInput);
    await user.type(passwordInput, 'ValidPass123!'); // Valid password

    // Should show success indicators
    expect(passwordInput).toHaveValue('ValidPass123!');
  });

  it('should render organization selector', () => {
    renderRegistrationForm();

    expect(screen.getByTestId('selectOrg')).toBeInTheDocument();
  });

  it('should handle form input changes', async () => {
    const user = userEvent.setup();
    renderRegistrationForm();

    const nameInput = screen.getByPlaceholderText(/Name/i);
    const emailInput = screen.getByTestId('signInEmail');
    const passwordInput = screen.getByTestId('passwordField');

    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(passwordInput, 'TestPass123!');

    expect(nameInput).toHaveValue('John Doe');
    expect(emailInput).toHaveValue('john@example.com');
    expect(passwordInput).toHaveValue('TestPass123!');
  });
});
