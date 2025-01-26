import type { SetStateAction } from 'react';
import React, { act } from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { SIGNUP_MUTATION } from 'GraphQl/Mutations/mutations';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import i18nForTest from 'utils/i18nForTest';
import { StaticMockLink } from 'utils/StaticMockLink';
import Register from './Register';
import { toast } from 'react-toastify';
import { vi } from 'vitest';

/**
 * Unit tests for the Register component.
 *
 * 1. **Render test**: Verifies proper rendering of the Register component.
 * 2. **Mode switch to Login**: Ensures that clicking the "setLoginBtn" changes mode to 'login'.
 * 3. **Empty email validation**: Checks if toast.error is triggered for empty email.
 * 4. **Empty password validation**: Ensures toast.error is called for empty password.
 * 5. **Empty first name validation**: Ensures toast.error is called if first name is missing.
 * 6. **Empty last name validation**: Verifies toast.error is triggered if last name is missing.
 * 7. **Password mismatch validation**: Verifies toast.error is shown if confirm password doesn't match.
 * 8. **Successful registration**: Confirms that toast.success is called when valid credentials are entered.
 *
 * GraphQL mock data is used for testing user registration functionality.
 */

// GraphQL Mock Data
const MOCKS = [
  {
    request: {
      query: SIGNUP_MUTATION,
      variables: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@gmail.com',
        password: 'johnDoe',
      },
    },
    result: {
      data: {
        signUp: {
          user: {
            _id: '1',
          },
          accessToken: 'accessToken',
          refreshToken: 'refreshToken',
        },
      },
    },
  },
];

// Form Data
const formData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoe@gmail.com',
  password: 'johnDoe',
  confirmPassword: 'johnDoe',
};

// Additional GraphQL Mock Data for Error Handling
const ERROR_MOCKS = [
  {
    request: {
      query: SIGNUP_MUTATION,
      variables: {
        firstName: 'Error',
        lastName: 'Test',
        email: 'error@test.com',
        password: 'password',
      },
    },
    error: new Error('GraphQL error occurred'),
  },
];

// Static Mock Link
const link = new StaticMockLink(MOCKS, true);

// Mock toast
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock setCurrentMode function
const setCurrentMode: React.Dispatch<SetStateAction<string>> = vi.fn();

// Test setup props
const props = {
  setCurrentMode,
};

async function waitForAsync(): Promise<void> {
  await act(() => new Promise((resolve) => setTimeout(resolve, 100)));
}

describe('Testing Register Component [User Portal]', () => {
  it('Component should be rendered properly', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Register {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitForAsync();
  });

  it('Expect the mode to be changed to Login', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Register {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitForAsync();

    userEvent.click(screen.getByTestId('setLoginBtn'));

    expect(setCurrentMode).toHaveBeenCalledWith('login');
  });

  it('Expect toast.error to be called if email input is empty', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Register {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitForAsync();

    userEvent.click(screen.getByTestId('registerBtn'));

    expect(toast.error).toHaveBeenCalledWith('Please enter valid details.');
  });

  it('Expect toast.error to be called if password input is empty', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Register {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitForAsync();

    userEvent.type(screen.getByTestId('emailInput'), formData.email);
    userEvent.click(screen.getByTestId('registerBtn'));

    expect(toast.error).toHaveBeenCalledWith('Please enter valid details.');
  });

  it('Expect toast.error to be called if first name input is empty', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Register {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitForAsync();

    userEvent.type(screen.getByTestId('passwordInput'), formData.password);
    userEvent.type(screen.getByTestId('emailInput'), formData.email);
    userEvent.click(screen.getByTestId('registerBtn'));

    expect(toast.error).toHaveBeenCalledWith('Please enter valid details.');
  });

  it('Expect toast.error to be called if last name input is empty', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Register {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitForAsync();

    userEvent.type(screen.getByTestId('passwordInput'), formData.password);
    userEvent.type(screen.getByTestId('emailInput'), formData.email);
    userEvent.type(screen.getByTestId('firstNameInput'), formData.firstName);
    userEvent.click(screen.getByTestId('registerBtn'));

    expect(toast.error).toHaveBeenCalledWith('Please enter valid details.');
  });

  it("Expect toast.error to be called if confirmPassword doesn't match with password", async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Register {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitForAsync();

    userEvent.type(screen.getByTestId('passwordInput'), formData.password);
    userEvent.type(screen.getByTestId('emailInput'), formData.email);
    userEvent.type(screen.getByTestId('firstNameInput'), formData.firstName);
    userEvent.type(screen.getByTestId('lastNameInput'), formData.lastName);
    userEvent.click(screen.getByTestId('registerBtn'));

    expect(toast.error).toHaveBeenCalledWith(
      "Password doesn't match. Confirm Password and try again.",
    );
  });

  it('Expect toast.success to be called if valid credentials are entered.', async () => {
    render(
      <MockedProvider addTypename={false} link={link}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Register {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitForAsync();

    userEvent.type(screen.getByTestId('passwordInput'), formData.password);
    userEvent.type(
      screen.getByTestId('confirmPasswordInput'),
      formData.confirmPassword,
    );
    userEvent.type(screen.getByTestId('emailInput'), formData.email);
    userEvent.type(screen.getByTestId('firstNameInput'), formData.firstName);
    userEvent.type(screen.getByTestId('lastNameInput'), formData.lastName);
    userEvent.click(screen.getByTestId('registerBtn'));

    await waitForAsync();

    expect(toast.success).toHaveBeenCalledWith(
      'Successfully registered. Please wait for admin to approve your request.',
    );
  });

  // Error Test Case
  it('Expect toast.error to be called if GraphQL mutation fails', async () => {
    render(
      <MockedProvider addTypename={false} mocks={ERROR_MOCKS}>
        <BrowserRouter>
          <Provider store={store}>
            <I18nextProvider i18n={i18nForTest}>
              <Register {...props} />
            </I18nextProvider>
          </Provider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitForAsync();

    // Fill out the form with error-triggering values
    userEvent.type(screen.getByTestId('passwordInput'), 'password');
    userEvent.type(screen.getByTestId('confirmPasswordInput'), 'password');
    userEvent.type(screen.getByTestId('emailInput'), 'error@test.com');
    userEvent.type(screen.getByTestId('firstNameInput'), 'Error');
    userEvent.type(screen.getByTestId('lastNameInput'), 'Test');
    userEvent.click(screen.getByTestId('registerBtn'));

    await waitForAsync();

    // Assert that toast.error is called with the error message
    expect(toast.error).toHaveBeenCalledWith('GraphQL error occurred');
  });
});
